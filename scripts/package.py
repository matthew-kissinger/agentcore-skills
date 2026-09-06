"""Build deterministic skill ZIPs with no external dependencies."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import hashlib
root=Path(__file__).resolve().parents[1]
out=root/'dist'; out.mkdir(exist_ok=True)
checks=[]
for skill in sorted((root/'skills').iterdir()):
    if not (skill/'SKILL.md').is_file(): continue
    target=out/(skill.name+'.zip')
    with ZipFile(target,'w',compression=ZIP_DEFLATED) as z:
        entries=[(f,skill.name+'/'+f.relative_to(skill).as_posix()) for f in sorted(skill.rglob('*')) if f.is_file()]
        entries.append((root/'LICENSE',skill.name+'/LICENSE'))
        for path,name in entries:
            if path.is_symlink(): raise ValueError('Symlinks are not release inputs')
            info=ZipInfo(name,date_time=(2026,1,1,0,0,0)); info.compress_type=ZIP_DEFLATED
            info.external_attr=0o100644 << 16
            data=path.read_bytes()
            if path.suffix in {'.md','.mjs','.py','.json','.yaml','.yml','.ts'} or path.name=='LICENSE':
                data=data.replace(b'\r\n',b'\n')
            z.writestr(info,data)
    checks.append(hashlib.sha256(target.read_bytes()).hexdigest()+'  '+target.name)
(out/'SHA256SUMS').write_text('\n'.join(checks)+'\n',encoding='utf-8')
print('Packaged '+str(len(checks))+' skills')
