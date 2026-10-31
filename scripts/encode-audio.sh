#!/usr/bin/env bash
# Encode audio for the web: Ogg/Opus (primary) + MP3 (Safari/old fallback). Strips all metadata.
# usage: scripts/encode-audio.sh SRC_WAV_OR_OGG OUT_BASENAME [start] [dur] [kind=sfx|bgm]
set -euo pipefail
in=$1; out=$2; ss=${3:-0}; dur=${4:-0}; kind=${5:-sfx}
mkdir -p "$(dirname "$out")"
t=(); [ "$dur" != 0 ] && t=(-t "$dur")
if [ "$kind" = bgm ]; then I=-20; ch=2; ob=56k; mb=80k; else I=-18; ch=1; ob=40k; mb=64k; fi
af="loudnorm=I=$I:TP=-1.5:LRA=11,afade=t=in:d=0.02"
[ "$dur" != 0 ] && af="$af,afade=t=out:st=$(python3 -c "print(max(0,$dur-0.6))"):d=0.6"
ffmpeg -nostdin -loglevel error -y -ss "$ss" "${t[@]}" -i "$in" -map 0:a:0 -map_metadata -1 -ac $ch -af "$af" -c:a libopus -b:a $ob -ar 48000 "$out.ogg"
ffmpeg -nostdin -loglevel error -y -ss "$ss" "${t[@]}" -i "$in" -map 0:a:0 -map_metadata -1 -ac $ch -af "$af" -ar 44100 -c:a libmp3lame -b:a $mb -id3v2_version 0 -write_xing 1 "$out.mp3"
