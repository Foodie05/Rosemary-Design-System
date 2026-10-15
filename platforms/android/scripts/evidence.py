#!/usr/bin/env python3
"""Record actual tool, source, artifact and device evidence for this verification run."""
import hashlib,json,os,pathlib,platform,subprocess,sys,xml.etree.ElementTree as ET
repo=pathlib.Path(__file__).resolve().parents[3]
root=pathlib.Path(os.environ.get('ROSEMARY_ARTIFACT_ROOT',repo/'.sdk-artifacts'))/'android'
build=pathlib.Path(os.environ.get('ROSEMARY_BUILD_ROOT',repo/'.sdk-build'))/'android'
mode,result=sys.argv[1:3]
root.mkdir(parents=True,exist_ok=True)
def cmd(args):
 try:return subprocess.check_output(args,cwd=repo,stderr=subprocess.STDOUT,text=True,timeout=30).strip()
 except (OSError,subprocess.SubprocessError) as error:return {'unavailable':str(error).splitlines()[0]}
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
paths=[]
for folder in ['platforms/android','design']:
 for p in sorted((repo/folder).rglob('*')):
  relative=p.relative_to(repo)
  if p.is_file() and not p.is_symlink() and not any(x in {'build','.gradle','artifacts','local.properties'} for x in relative.parts):paths.append({'file':relative.as_posix(),'sha256':digest(p)})
source_digest=hashlib.sha256(json.dumps(paths,sort_keys=True).encode()).hexdigest()
head=cmd(['git','rev-parse','HEAD'])
record=root/'verification.json'
data=json.loads(record.read_text()) if record.exists() else {}
if data.get('head')!=head or data.get('sourceDigest')!=source_digest:data={}
untracked=cmd(['git','ls-files','--others','--exclude-standard','platforms/android','design'])
packages={}
sdk=pathlib.Path(os.environ.get('ANDROID_HOME','/nonexistent'))
for parent in ['platforms','build-tools','platform-tools','emulator','cmdline-tools']:
 folder=sdk/parent
 for props in ([folder/'source.properties'] if (folder/'source.properties').exists() else sorted(folder.glob('*/source.properties'))):
  packages[str(props.parent.relative_to(sdk))]=dict(line.strip().split('=',1) for line in props.read_text().splitlines() if '=' in line and line.startswith(('Pkg.Revision','AndroidVersion.ApiLevel')))
data.update({'version':'0.4.1','head':head,'githubSha':os.environ.get('GITHUB_SHA'),'githubRunId':os.environ.get('GITHUB_RUN_ID'),'githubRunAttempt':os.environ.get('GITHUB_RUN_ATTEMPT'),'dirtyWorkingTree':bool(cmd(['git','status','--porcelain','--untracked-files=no'])) or bool(untracked),'sourceDigest':source_digest,'sourceInputs':paths,'toolchain':{'os':platform.platform(),'java':cmd(['java','-version']),'gradle':cmd([str(repo/'platforms/android/gradlew'),'-p',str(repo/'platforms/android'),'--version']),'adb':cmd(['adb','version']),'emulator':cmd(['emulator','-version']),'sdkPackages':packages}})
phase={'result':result}
if mode=='device':
 devices=cmd(['adb','devices']);serial=os.environ.get('ANDROID_SERIAL')
 if not serial and isinstance(devices,str):serial=next((line.split()[0] for line in devices.splitlines() if line.endswith('\tdevice')),None)
 phase['device']={'serial':serial,'api':cmd(['adb','-s',serial,'shell','getprop','ro.build.version.sdk']) if serial else None,'android':cmd(['adb','-s',serial,'shell','getprop','ro.build.version.release']) if serial else None}
phase['testResults']=[]
for p in sorted(build.rglob('TEST-*.xml')):
 if (mode=='device')!=('androidTest-results' in p.parts):continue
 try:
  xml=ET.parse(p).getroot();phase['testResults'].append({'file':str(p.relative_to(build)),'tests':int(xml.attrib.get('tests',0)),'failures':int(xml.attrib.get('failures',0)),'errors':int(xml.attrib.get('errors',0)),'skipped':int(xml.attrib.get('skipped',0)),'sha256':digest(p)})
 except ET.ParseError:phase['testResults'].append({'file':str(p.relative_to(build)),'invalidXml':True})
data.setdefault('phases',{})[mode]=phase
data['unverified']=['Manual TalkBack/keyboard user audit','Physical API26 device','Final release artifacts require clean integrated HEAD']
files=[p for p in sorted(root.rglob('*')) if p.is_file() and p.name not in {'verification.json','SHA256SUMS','local-verification.json'}]
data['artifacts']=[{'file':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':digest(p)} for p in files]
(root/'SHA256SUMS').write_text(''.join(f'{digest(p)}  {p.relative_to(root)}\n' for p in files))
record.write_text(json.dumps(data,indent=2)+'\n')
