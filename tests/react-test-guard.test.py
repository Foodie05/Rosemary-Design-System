import importlib.util
import pathlib
import subprocess
import sys
import tempfile
import time
import unittest
from unittest import mock

source = pathlib.Path(__file__).resolve().parents[1] / 'scripts/run-react-tests.py'
spec = importlib.util.spec_from_file_location('react_guard', source)
guard = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = guard
spec.loader.exec_module(guard)

class GuardTests(unittest.TestCase):
    def test_success(self):
        result = guard.run([sys.executable, '-c', 'pass'], timeout_seconds=3)
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.reason, 'exited')

    def test_memory_limit(self):
        result = guard.run([sys.executable, '-c', 'import time; allocation=bytearray(48*1024*1024);time.sleep(10)'], memory_mib=32, timeout_seconds=3)
        self.assertEqual(result.reason, 'memory limit')
        self.assertLess(result.elapsed, 3)

    def test_failed_monitor_still_terminates_child(self):
        real_popen = subprocess.Popen
        children = []
        def capture(*args, **kwargs):
            child = real_popen(*args, **kwargs)
            children.append(child)
            return child
        with mock.patch.object(guard, 'process_tree', side_effect=subprocess.TimeoutExpired('ps', 3)), mock.patch.object(guard.subprocess, 'Popen', side_effect=capture):
            with self.assertRaises(subprocess.TimeoutExpired):
                guard.run([sys.executable, '-c', 'import time;time.sleep(30)'])
        self.assertIsNotNone(children[0].poll())

    def test_timeout_cleans_descendant(self):
        with tempfile.TemporaryFile(mode='w+') as output:
            code = 'import subprocess,sys,time; child=subprocess.Popen([sys.executable,"-c","import time;time.sleep(30)"]);print(child.pid,flush=True);time.sleep(30)'
            result = guard.run([sys.executable, '-c', code], timeout_seconds=.5, stdout=output)
            self.assertEqual(result.reason, 'time limit')
            output.seek(0)
            pid = output.read().strip()
            self.assertTrue(pid.isdigit())
            time.sleep(.1)
            status = subprocess.run(['ps','-p',pid,'-o','stat='],text=True,capture_output=True).stdout.strip()
            self.assertTrue(not status or status.startswith('Z'), status)

if __name__ == '__main__':
    unittest.main()
