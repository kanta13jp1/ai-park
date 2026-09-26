"""Antigravity Academy のレッスン動画を作る（スライド＋日本語読み上げ＋字幕）。

使い方:  python scripts/academy-video/build_video.py scripts/academy-video/install.json
出力:    public/videos/academy/<id>.mp4 と <id>.vtt

必要なもの: Python + Pillow、ffmpeg、Windows の日本語音声（Microsoft Haruka など）
"""

import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
IMAGES = ROOT / "public" / "images" / "guide"
OUT_DIR = ROOT / "public" / "videos" / "academy"
W, H = 1280, 720
BG, INK, SUB, ACCENT = (250, 249, 245), (20, 20, 19), (90, 90, 88), (217, 119, 87)
FONT_TITLE = "C:/Windows/Fonts/BIZ-UDMinchoM.ttc"
FONT_BODY = "C:/Windows/Fonts/BIZ-UDGothicR.ttc"
FONT_BOLD = "C:/Windows/Fonts/BIZ-UDGothicB.ttc"


def wrap(draw, text, font, width):
    lines, line = [], ""
    for ch in text:
        if draw.textlength(line + ch, font=font) > width:
            lines.append(line)
            line = ch
        else:
            line += ch
    return lines + ([line] if line else [])


def render_slide(slide, course_title, index, total, path):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    small = ImageFont.truetype(FONT_BODY, 20)
    d.text((56, 36), f"Antigravity Academy ・ {course_title}", fill=SUB, font=small)
    d.text((W - 56, 36), f"{index} / {total}", fill=SUB, font=small, anchor="ra")
    d.rectangle((56, 72, 56 + 64, 76), fill=ACCENT)

    if slide.get("image"):
        title_font = ImageFont.truetype(FONT_TITLE, 40)
        d.text((56, 100), slide["title"], fill=INK, font=title_font)
        pic = Image.open(IMAGES / slide["image"]).convert("RGB")
        box_w, box_h = W - 112, H - 190 - 40
        pic.thumbnail((box_w - 40, box_h - 40))
        frame = Image.new("RGB", (box_w, box_h), (243, 241, 234))
        frame.paste(pic, ((box_w - pic.width) // 2, (box_h - pic.height) // 2))
        im.paste(frame, (56, 170))
    else:
        title_font = ImageFont.truetype(FONT_TITLE, 60)
        d.text((56, 190), slide["title"], fill=INK, font=title_font)
        body = ImageFont.truetype(FONT_BODY, 30)
        y = 300
        for item in slide.get("bullets", []):
            for i, line in enumerate(wrap(d, item, body, W - 180)):
                d.text((96, y), ("・" if i == 0 else "　") + line, fill=INK, font=body)
                y += 46
            y += 10
    im.save(path)


def speak(text, voice, rate, wav_path):
    ps = (
        "Add-Type -AssemblyName System.Speech;"
        "$s=New-Object System.Speech.Synthesis.SpeechSynthesizer;"
        f"$s.SelectVoice('{voice}');$s.Rate={rate};"
        f"$s.SetOutputToWaveFile('{wav_path}');"
        "$s.Speak([Console]::In.ReadToEnd());$s.Dispose()"
    )
    subprocess.run(["powershell", "-NoProfile", "-Command", ps], input=text.encode("utf-8"), check=True)
    with wave.open(str(wav_path)) as w:
        return w.getnframes() / w.getframerate()


def vtt_time(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def main(spec_path):
    spec = json.loads(Path(spec_path).read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    voice = spec.get("voice", "Microsoft Haruka Desktop")
    rate = int(spec.get("rate", 0))  # 読み上げ速度（-10〜10）
    pad = 0.6
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        segments, cues, t = [], [], 0.0
        for i, slide in enumerate(spec["slides"], 1):
            png, wav, mp4 = tmp / f"s{i}.png", tmp / f"s{i}.wav", tmp / f"s{i}.mp4"
            render_slide(slide, spec["course"], i, len(spec["slides"]), png)
            # 読み上げ用テキスト（speak）が無ければ字幕テキストをそのまま読む
            dur = speak(slide.get("speak", slide["say"]), voice, rate, wav) + pad
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(png), "-i", str(wav),
                 "-af", f"apad=pad_dur={pad}", "-t", f"{dur:.3f}", "-c:v", "libx264", "-tune", "stillimage",
                 "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "96k", "-ar", "44100", str(mp4)],
                check=True,
            )
            segments.append(mp4)
            # 字幕は「。」ごとに分け、文字数に応じて表示時間を割り振る
            sentences = [x + "。" for x in slide["say"].split("。") if x.strip()]
            total_chars = sum(len(x) for x in sentences)
            start, span = t, dur - pad / 2
            for sentence in sentences:
                length = span * len(sentence) / total_chars
                cues.append((start, start + length, sentence))
                start += length
            t += dur
        listfile = tmp / "list.txt"
        listfile.write_text("".join(f"file '{p.as_posix()}'\n" for p in segments), encoding="utf-8")
        out = OUT_DIR / f"{spec['id']}.mp4"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(listfile),
                        "-c", "copy", "-movflags", "+faststart", str(out)], check=True)
    vtt = ["WEBVTT", ""]
    for n, (a, b, text) in enumerate(cues, 1):
        vtt += [str(n), f"{vtt_time(a)} --> {vtt_time(b)}", text, ""]
    (OUT_DIR / f"{spec['id']}.vtt").write_text("\n".join(vtt), encoding="utf-8")
    print(f"{out}  {t:.1f}s  {out.stat().st_size / 1e6:.1f}MB")


if __name__ == "__main__":
    main(sys.argv[1])
