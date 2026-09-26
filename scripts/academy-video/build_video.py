"""Antigravity Academy のレッスン動画を作る（スライド＋日本語読み上げ＋字幕）。

使い方:  python scripts/academy-video/build_video.py scripts/academy-video/install.json
出力:    public/videos/academy/<id>.mp4 と <id>.vtt

必要なもの: Python + Pillow、ffmpeg、環境変数 GEMINI_API_KEY（Gemini 3.8 Flash TTS で読み上げ）
確認:    --verify を付けると、各スライドの音声を Gemini で文字起こしして台本と並べて表示する
"""

import base64
import json
import os
import urllib.request
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


def speak_gemini(text, cfg, wav_path):
    """Gemini TTS（既定: gemini-3.8-flash-tts）で読み上げ、WAV（24kHz/mono/16bit）を保存する。
    API キーは環境変数 GEMINI_API_KEY から読む（ファイルやログには出さない）。"""
    body = {
        "model": cfg.get("model", "gemini-3.8-flash-tts"),
        "input": [{"type": "user_input", "content": [{
            "type": "text", "text": text,
            "annotations": [{"type": "speech_metadata", "style": cfg.get("style", "落ち着いた、分かりやすい研修講師の話し方")}],
        }]}],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": cfg.get("voice", "Kore")}]},
    }
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        data=json.dumps(body).encode(),
        headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"},
    )
    res = json.load(urllib.request.urlopen(req, timeout=300))
    audio = next(c["data"] for step in res["steps"] for c in step.get("content", []) if c.get("data"))
    Path(wav_path).write_bytes(base64.b64decode(audio))


def speak_windows(text, cfg, wav_path):
    """Windows の日本語音声で読み上げる（予備）。文字化けを防ぐため台本は UTF-8 ファイルで渡す。"""
    txt = Path(wav_path).with_suffix(".txt")
    txt.write_text(text, encoding="utf-8")
    ps = (
        "Add-Type -AssemblyName System.Speech;"
        "$s=New-Object System.Speech.Synthesis.SpeechSynthesizer;"
        f"$s.SelectVoice('{cfg.get('voice', 'Microsoft Haruka Desktop')}');$s.Rate={int(cfg.get('rate', 0))};"
        f"$s.SetOutputToWaveFile('{wav_path}');"
        f"$s.Speak([IO.File]::ReadAllText('{txt}', [Text.Encoding]::UTF8));$s.Dispose()"
    )
    subprocess.run(["powershell", "-NoProfile", "-Command", ps], check=True)


def speak(text, cfg, wav_path):
    (speak_windows if cfg.get("provider") == "windows" else speak_gemini)(text, cfg, wav_path)
    with wave.open(str(wav_path)) as w:
        return w.getnframes() / w.getframerate()


def transcribe(wav_path):
    """確認用：生成した音声を Gemini で文字起こしする。"""
    data = base64.b64encode(Path(wav_path).read_bytes()).decode()
    body = {"contents": [{"parts": [
        {"inline_data": {"mime_type": "audio/wav", "data": data}},
        {"text": "この音声を日本語でそのまま文字起こししてください。文字起こし結果だけを出力してください。聞き取れない部分は［不明］と書いてください。"},
    ]}]}
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
        data=json.dumps(body).encode(),
        headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"},
    )
    res = json.load(urllib.request.urlopen(req, timeout=300))
    return res["candidates"][0]["content"]["parts"][0]["text"].strip()


def vtt_time(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def main(spec_path, verify=False):
    spec = json.loads(Path(spec_path).read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    tts = spec.get("tts", {})  # provider: gemini（既定）/ windows、model・voice・style など
    pad = 0.6
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        segments, cues, t = [], [], 0.0
        for i, slide in enumerate(spec["slides"], 1):
            png, wav, mp4 = tmp / f"s{i}.png", tmp / f"s{i}.wav", tmp / f"s{i}.mp4"
            render_slide(slide, spec["course"], i, len(spec["slides"]), png)
            # 読み上げ用テキスト（speak）が無ければ字幕テキストをそのまま読む
            dur = speak(slide.get("speak", slide["say"]), tts, wav) + pad
            if verify:
                print(f"--- {i}. {slide['title']}")
                print(f"台本: {slide['say']}")
                print(f"音声: {transcribe(wav)}")
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
    main(sys.argv[1], verify="--verify" in sys.argv)
