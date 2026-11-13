#!/usr/bin/env python3
"""Run one React test tree with external RSS/time limits and unconditional cleanup."""
import argparse
import dataclasses
import os
import pathlib
import resource
import shutil
import signal
import subprocess
import sys
import time


@dataclasses.dataclass
class Result:
    returncode: int
    reason: str
    peak_mib: float
    elapsed: float


def process_tree(root, tracked=None):
    output = subprocess.check_output(
        ["ps", "-axo", "pid=,ppid=,rss=,pgid="], timeout=3
    ).decode("utf-8", "replace")
    rows = [line.split() for line in output.splitlines()]
    owned = {root}
    while True:
        added = {int(p[0]) for p in rows if len(p) == 4 and int(p[1]) in owned}
        if added <= owned:
            break
        owned |= added
    if tracked is not None:
        tracked.update({int(p[0]): int(p[3]) for p in rows if len(p) == 4 and int(p[0]) in owned})
    return sum(int(p[2]) for p in rows if len(p) == 4 and int(p[0]) in owned) / 1024


def run(command, *, memory_mib=768, timeout_seconds=90, stdout=None, env=None):
    # The watchdog stays outside Node's event loop and its test reporter.
    if os.name != "posix" or not shutil.which("ps"):
        raise RuntimeError("This runner requires a POSIX process-tree watchdog; refusing an unbounded run")
    started = time.monotonic()
    peak = 0.0
    reason = "exited"

    def no_core():
        resource.setrlimit(resource.RLIMIT_CORE, (0, 0))

    child = subprocess.Popen(command, start_new_session=True, preexec_fn=no_core,
                             stdout=stdout, stderr=subprocess.STDOUT, env=env)

    tracked = {}
    try:
        tracked[child.pid] = os.getpgid(child.pid)
    except ProcessLookupError:
        pass
    def stop_group(sig):
        # Kill only this child and observed descendants. Avoid signalling a broad
        # process group, including on hosts that restrict killpg.
        try:
            process_tree(child.pid, tracked)
        except (OSError, subprocess.SubprocessError):
            pass
        for pid, group in reversed(list(tracked.items())):
            try:
                if os.getpgid(pid) == group:
                    os.kill(pid, sig)
            except ProcessLookupError:
                pass

    def interrupted(signum, _frame):
        stop_group(signal.SIGKILL)
        raise KeyboardInterrupt

    previous = {sig: signal.signal(sig, interrupted) for sig in (signal.SIGINT, signal.SIGTERM)}
    try:
        while child.poll() is None:
            rss = process_tree(child.pid, tracked)
            peak = max(peak, rss)
            if rss > memory_mib:
                reason = "memory limit"
                break
            if time.monotonic() - started > timeout_seconds:
                reason = "time limit"
                break
            time.sleep(0.1)
        if reason != "exited":
            stop_group(signal.SIGKILL)
        code = child.wait(timeout=3)
        return Result(code if reason == "exited" else 124, reason, peak, time.monotonic()-started)
    finally:
        # Also collect orphan descendants if a test runner exited first.
        stop_group(signal.SIGKILL)
        if child.poll() is None:
            child.wait(timeout=3)
        for sig, handler in previous.items():
            signal.signal(sig, handler)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--node", default=shutil.which("node"))
    parser.add_argument("--name-pattern")
    parser.add_argument("--test-file", action="append", help="Use explicit independent-consumer test files")
    parser.add_argument("--timeout", type=float, default=90)
    args = parser.parse_args()
    if not args.node:
        parser.error("Node is not available")
    if not 0 < args.timeout <= 90:
        parser.error("Timeout must be in 0..90 seconds")
    package = pathlib.Path(__file__).resolve().parents[1] / "packages/react"
    files = args.test_file or sorted(str(p) for p in (package / "tests").glob("*.test.mjs"))
    command = [args.node, "--max-old-space-size=512", "--test", "--test-concurrency=1",
               "--test-timeout=20000", "--test-reporter=spec"]
    if args.name_pattern:
        command.append("--test-name-pattern=" + args.name_pattern)
    command += files
    env = dict(os.environ)
    env["NODE_OPTIONS"] = (env.get("NODE_OPTIONS", "") + " --max-old-space-size=512").strip()
    env["DEBUG_PRINT_LIMIT"] = "2000"
    result = run(command, timeout_seconds=args.timeout, env=env)
    print(f"React guard: {result.reason}; peak process-tree RSS {result.peak_mib:.1f} MiB; {result.elapsed:.1f}s", flush=True)
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
