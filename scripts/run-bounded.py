#!/usr/bin/env python3
"""Resource bound build/package commands using the same external test watchdog."""
import argparse
import importlib.util
import os
import pathlib
import sys

spec = importlib.util.spec_from_file_location("react_test_guard", pathlib.Path(__file__).with_name("run-react-tests.py"))
guard = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = guard
spec.loader.exec_module(guard)
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--seconds',type=float,default=90)
parser.add_argument('command',nargs=argparse.REMAINDER)
args=parser.parse_args()
command=args.command[1:] if args.command[:1]==['--'] else args.command
if not command or not 0<args.seconds<=300: parser.error('Pass a command and a deadline in 0..300 seconds')
env=dict(os.environ)
env['NODE_OPTIONS']=(env.get('NODE_OPTIONS','')+' --max-old-space-size=512').strip()
env['DEBUG_PRINT_LIMIT']='2000'
result=guard.run(command,memory_mib=1024,timeout_seconds=args.seconds,env=env)
print(f'Command guard: {result.reason}; sampled process-tree RSS peak {result.peak_mib:.1f} MiB; {result.elapsed:.1f}s',flush=True)
sys.exit(result.returncode)
