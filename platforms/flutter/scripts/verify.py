#!/usr/bin/env python3
"""Package source, extract it, and verify an isolated real package consumer."""
import gzip,hashlib,json,os,pathlib,platform,shutil,signal,subprocess,sys,tarfile,time,zipfile
for stream in (sys.stdout,sys.stderr):
 if hasattr(stream,'reconfigure'):stream.reconfigure(encoding='utf-8',errors='replace')
repo=pathlib.Path(__file__).resolve().parents[3]
base=pathlib.Path(os.environ.get('ROSEMARY_BUILD_ROOT',repo/'.sdk-build'))/'flutter'
artifacts=pathlib.Path(os.environ.get('ROSEMARY_ARTIFACT_ROOT',repo/'.sdk-artifacts'))/'flutter'
package=repo/'platforms/flutter/rosemary_ui'
example=base/'consumer/platforms/flutter/example'
archive=artifacts/'rosemary-ui-0.4.0-source.tar.gz'
mode=sys.argv[1] if len(sys.argv)>1 else 'test'
base.mkdir(parents=True,exist_ok=True);artifacts.mkdir(parents=True,exist_ok=True)
(artifacts/'evidence').mkdir(exist_ok=True)
evidence_key=os.environ.get('ROSEMARY_DEVICE_EVIDENCE_KEY',mode) if mode=='device' else mode
theme_asset_evidence=None
log=(artifacts/'evidence'/f'{evidence_key}.log').open('w',encoding='utf-8')
ignore={'.dart_tool','build','.git','Pods','.symlinks','ephemeral','Flutter-Generated.xcconfig','flutter_export_environment.sh','Generated.xcconfig','local.properties','.flutter-plugins-dependencies','__pycache__'}
def included(path):return not any(part in ignore for part in path.parts) and not path.is_symlink()
def pack():
 with archive.open('wb') as raw, gzip.GzipFile(fileobj=raw,mode='wb',mtime=0,filename='') as compressed, tarfile.open(fileobj=compressed,mode='w') as out:
  for path in sorted(package.rglob('*')):
   if path.is_file() and included(path.relative_to(package)):
    info=out.gettarinfo(str(path),arcname='rosemary_ui/'+path.relative_to(package).as_posix())
    info.mtime=0;info.uid=info.gid=0;info.uname=info.gname='';info.mode=0o644
    with path.open('rb') as source:out.addfile(info,source)
def run(*args,cwd=example):
 executable=shutil.which(args[0]) or args[0]
 log.write('$ '+' '.join(args)+'\n');log.flush()
 process=subprocess.Popen([executable,*args[1:]],cwd=cwd,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,encoding='utf-8',errors='replace')
 for line in process.stdout:print(line,end='',flush=True);log.write(line);log.flush()
 if process.wait()!=0:raise subprocess.CalledProcessError(process.returncode,args)
def command(*args):
 try:return subprocess.check_output([shutil.which(args[0]) or args[0],*args[1:]],cwd=repo,stderr=subprocess.STDOUT,text=True,encoding='utf-8',errors='replace',timeout=40).strip()
 except (OSError,subprocess.SubprocessError) as error:return {'unavailable':str(error).splitlines()[0]}
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def prepare():
 pack();root=base/'consumer';root.mkdir(exist_ok=True)
 vendor=root/'platforms/flutter';vendor.mkdir(parents=True,exist_ok=True)
 if (vendor/'rosemary_ui').exists():shutil.rmtree(vendor/'rosemary_ui')
 with tarfile.open(archive) as source:
  for member in source.getmembers():
   name=pathlib.PurePosixPath(member.name)
   if name.is_absolute() or '..' in name.parts or not (member.isfile() or member.isdir()):raise ValueError('Unsafe archive member')
  source.extractall(vendor)
 shutil.copytree(repo/'platforms/flutter/example',example,dirs_exist_ok=True,ignore=lambda folder,names:[name for name in names if name in ignore or pathlib.Path(folder,name).is_symlink()])
 themes=root/'design/themes';themes.mkdir(parents=True,exist_ok=True);shutil.copy2(repo/'design/themes/vigilo.json',themes/'vigilo.json')
 assets=example/'assets';assets.mkdir(parents=True,exist_ok=True);shutil.copy2(repo/'design/themes/vigilo.json',assets/'vigilo.json')
 run('flutter','pub','get')
def evidence(result):
 head=command('git','rev-parse','HEAD')
 dirty=bool(command('git','status','--porcelain','--untracked-files=no')) or bool(command('git','ls-files','--others','--exclude-standard','platforms/flutter','design'))
 inputs=[]
 for folder in [package,repo/'platforms/flutter/example',repo/'platforms/flutter/scripts',repo/'design']:
  for path in sorted(folder.rglob('*')):
   if path.is_file() and included(path.relative_to(folder)):inputs.append({'file':path.relative_to(repo).as_posix(),'sha256':sha(path)})
 source_digest=hashlib.sha256(json.dumps(inputs,sort_keys=True).encode()).hexdigest()
 record=artifacts/'verification.json'
 data=json.loads(record.read_text()) if record.exists() else {}
 if data.get('head')!=head or data.get('sourceDigest')!=source_digest:data={}
 flutter=command('flutter','--version','--machine')
 if isinstance(flutter,str):
  try:flutter=json.loads(flutter)
  except json.JSONDecodeError:pass
 data.update({'version':'0.4.0','head':head,'githubSha':os.environ.get('GITHUB_SHA'),'githubRunId':os.environ.get('GITHUB_RUN_ID'),'githubRunAttempt':os.environ.get('GITHUB_RUN_ATTEMPT'),'dirtyWorkingTree':dirty,'sourceDigest':source_digest,'sourceInputs':inputs,'sourceArchiveSha256':sha(archive) if archive.exists() else None,'toolchain':{'os':platform.platform(),'flutter':flutter,'java':command('java','-version'),'xcode':command('xcodebuild','-version') if sys.platform=='darwin' else None},'consumer':'deterministic source archive extracted to isolated path dependency'})
 phase={'result':result,'device':os.environ.get('ROSEMARY_FLUTTER_DEVICE','emulator-5554') if mode=='device' else None,'log':'evidence/'+evidence_key+'.log'}
 if theme_asset_evidence:phase['packagedThemeAsset']=theme_asset_evidence
 if mode=='device':phase['availableDevices']=command('flutter','devices','--machine')
 data.setdefault('phases',{})[os.environ.get('ROSEMARY_DEVICE_EVIDENCE_KEY',mode) if mode=='device' else mode]=phase
 data['unverified']=['Manual screen reader audit across six platforms','Signed iOS physical-device distribution','Final release requires clean integrated HEAD and all CI target phases passed']
 files=[p for p in sorted(artifacts.rglob('*')) if p.is_file() and p.name not in {'verification.json','SHA256SUMS'}]
 data['artifacts']=[{'file':p.relative_to(artifacts).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)} for p in files]
 (artifacts/'SHA256SUMS').write_text(''.join(f'{sha(p)}  {p.relative_to(artifacts).as_posix()}\n' for p in files))
 record.write_text(json.dumps(data,indent=2)+'\n')
def zip_output(source,name):
 target=artifacts/name
 if sys.platform=='darwin':
  if target.exists():target.unlink()
  run('ditto','-c','-k','--sequesterRsrc','--keepParent',str(source),str(target),cwd=repo)
 else:
  with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as out:
   for p in source.rglob('*'):
    if p.is_file():out.write(p,p.relative_to(source.parent))
def verify_theme_asset(target):
 global theme_asset_evidence
 expected=(repo/'design/themes/vigilo.json').read_bytes()
 if target.name.endswith('.tar.gz'):
  with tarfile.open(target) as bundle:
   entries=[member for member in bundle.getmembers() if member.isfile() and member.name.endswith('/assets/vigilo.json')]
   if len(entries)!=1:raise RuntimeError('Expected one bundled Vigilo asset in '+str(target))
   entry=entries[0].name;actual=bundle.extractfile(entries[0]).read()
 else:
  with zipfile.ZipFile(target) as bundle:
   entries=[name for name in bundle.namelist() if name.endswith('/assets/vigilo.json')]
   if len(entries)!=1:raise RuntimeError('Expected one bundled Vigilo asset in '+str(target))
   entry=entries[0];actual=bundle.read(entry)
 if actual!=expected:raise RuntimeError('Bundled Vigilo asset differs from canonical theme')
 theme_asset_evidence={'archive':target.name,'entry':entry,'sha256':hashlib.sha256(actual).hexdigest(),'canonical':'design/themes/vigilo.json'}
 log.write('Packaged Vigilo theme matches canonical bytes: '+entry+'\n');log.flush()
def smoke(target):
 installed=base/'installed'/mode
 if installed.exists():shutil.rmtree(installed)
 installed.mkdir(parents=True)
 if sys.platform=='darwin':run('ditto','-x','-k',str(target),str(installed),cwd=repo)
 elif mode=='windows':
  with zipfile.ZipFile(target) as source:source.extractall(installed)
 else:
  with tarfile.open(target) as source:source.extractall(installed)
 if mode=='macos':binary=next(installed.rglob('rosemary_gallery.app'))/'Contents/MacOS/rosemary_gallery'
 elif mode=='windows':binary=next(installed.rglob('rosemary_gallery.exe'))
 else:binary=installed/'rosemary_gallery/rosemary_gallery'
 args=[str(binary)]
 if mode=='linux':args=['xvfb-run','-a',*args]
 launch_log=artifacts/'evidence'/f'{mode}-installed-launch.log'
 with launch_log.open('w',encoding='utf-8',errors='replace') as output:
  process=subprocess.Popen(args,cwd=binary.parent,stdout=output,stderr=subprocess.STDOUT,start_new_session=sys.platform!='win32')
  try:
   time.sleep(5)
   if process.poll() is not None:raise RuntimeError(f'Installed archive exited early: {process.returncode}')
  finally:
   if process.poll() is None:
    if sys.platform=='win32':process.terminate()
    else:os.killpg(process.pid,signal.SIGTERM)
    process.wait(timeout=15)
 startup=launch_log.read_text(encoding='utf-8',errors='replace')
 if any(marker in startup for marker in ['Unhandled Exception','Unable to load asset','EXCEPTION CAUGHT BY','ERROR:flutter/runtime/dart_vm_initializer']):raise RuntimeError('Installed archive reported a Flutter startup exception; inspect '+str(launch_log))
 log.write('Installed archive launch survived without reported Flutter startup exceptions; actual main/asset/theme/native interactions are verified by the separate device phase.\n')
outcome='failed'
try:
 if mode=='pack':pack()
 elif mode=='prepare':prepare()
 elif mode=='test':
  run('flutter','pub','get',cwd=package);run('flutter','analyze',cwd=package);run('flutter','test','--reporter','expanded',cwd=package)
  prepare();run('flutter','pub','get',cwd=example.parent/'rosemary_ui');run('flutter','test','test/review_regressions_test.dart','--reporter','expanded',cwd=example.parent/'rosemary_ui');run('flutter','analyze');run('flutter','test','--reporter','expanded')
 elif mode=='android':
  prepare();run('flutter','build','apk','--debug');shutil.copy2(example/'build/app/outputs/flutter-apk/app-debug.apk',artifacts/'rosemary-flutter-0.4.0-android.apk')
 elif mode=='web':prepare();run('flutter','build','web');zip_output(example/'build/web','rosemary-flutter-0.4.0-web.zip')
 elif mode=='macos':prepare();run('flutter','build','macos','--debug');zip_output(example/'build/macos/Build/Products/Debug/rosemary_gallery.app','rosemary-flutter-0.4.0-macos.zip');smoke(artifacts/'rosemary-flutter-0.4.0-macos.zip')
 elif mode=='ios':prepare();run('flutter','build','ios','--simulator','--debug');zip_output(example/'build/ios/iphonesimulator/Runner.app','rosemary-flutter-0.4.0-ios-simulator.zip')
 elif mode=='windows':prepare();run('flutter','build','windows','--release');zip_output(example/'build/windows/x64/runner/Release','rosemary-flutter-0.4.0-windows.zip');smoke(artifacts/'rosemary-flutter-0.4.0-windows.zip')
 elif mode=='linux':
  prepare();run('flutter','build','linux','--release')
  with tarfile.open(artifacts/'rosemary-flutter-0.4.0-linux.tar.gz','w:gz') as out:out.add(example/'build/linux/x64/release/bundle',arcname='rosemary_gallery')
  smoke(artifacts/'rosemary-flutter-0.4.0-linux.tar.gz')
 elif mode=='device':prepare();run('flutter','test','integration_test/gallery_test.dart','-d',os.environ.get('ROSEMARY_FLUTTER_DEVICE','emulator-5554'))
 else:raise SystemExit('Expected pack|prepare|test|android|web|macos|ios|windows|linux|device')
 outputs={'android':'android.apk','web':'web.zip','macos':'macos.zip','ios':'ios-simulator.zip','windows':'windows.zip','linux':'linux.tar.gz'}
 if mode in outputs:verify_theme_asset(artifacts/('rosemary-flutter-0.4.0-'+outputs[mode]))
 outcome='passed'
finally:
 log.close();evidence(outcome)
