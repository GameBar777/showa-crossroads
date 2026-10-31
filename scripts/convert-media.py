#!/usr/bin/env python3
"""raw画像 → webp / avif 変換。ICCプロファイル・EXIF等は必ず除去する。
使い方: python3 scripts/convert-media.py <raw画像> <出力ベース名(拡張子なし)>
1) Pillow で sRGB の RGB 画素だけを取り出し、icc_profile/exif を付けずに PNG へ保存
2) ffmpeg で webp / avif（-map_metadata -1）に変換
3) 出力に ICC（'iCCP'/'colr' prof/'ICCP'）が残っていないか検査し、残っていれば失敗させる"""
import subprocess, sys, tempfile, os
from PIL import Image, ImageOps
src, out = sys.argv[1], sys.argv[2]
im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
im.thumbnail((1280, 1280))
tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False).name
im.save(tmp, 'PNG')  # icc_profile/exif を渡さない＝除去
ff = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-map_metadata', '-1']
subprocess.run(ff + ['-c:v', 'libwebp', '-quality', '78', out + '.webp'], check=True)
subprocess.run(ff + ['-c:v', 'libaom-av1', '-still-picture', '1', '-crf', '32', '-pix_fmt', 'yuv420p', out + '.avif'], check=True)
os.unlink(tmp)
for f in (out + '.webp', out + '.avif'):
    b = open(f, 'rb').read()
    if b'ICCP' in b or b'iCCP' in b or b'colrprof' in b or b'colrrICC' in b:
        sys.exit(f'ICC profile remains in {f}')
print('ok', out)
