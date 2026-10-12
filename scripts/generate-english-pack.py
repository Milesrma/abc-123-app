#!/usr/bin/env python3
"""Generates the PLACEHOLDER art + audio and the manifest for the English letters pack.

Placeholder only (spec section 10): robotic espeak-ng voice and plain coloured pictures.
Final art/voice replace the files in assets/ with the same names; nothing else changes.
Needs: python3, pillow, espeak-ng, ffmpeg. Run from the repo root.
"""
import json, os, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

LETTERS = [("A","Apple"),("B","Ball"),("C","Cat"),("D","Dog"),("E","Elephant"),("F","Fish"),
 ("G","Grapes"),("H","Hat"),("I","Ice cream"),("J","Juice"),("K","Kite"),("L","Lion"),
 ("M","Moon"),("N","Nest"),("O","Orange"),("P","Pig"),("Q","Queen"),("R","Rainbow"),
 ("S","Sun"),("T","Tree"),("U","Umbrella"),("V","Van"),("W","Whale"),("X","Xylophone"),
 ("Y","Yo-yo"),("Z","Zebra")]
SPOKEN = {"A":"ay","B":"bee","C":"see","D":"dee","E":"ee","F":"eff","G":"gee","H":"aitch","I":"eye",
 "J":"jay","K":"kay","L":"el","M":"em","N":"en","O":"oh","P":"pee","Q":"queue","R":"are","S":"ess",
 "T":"tee","U":"you","V":"vee","W":"double you","X":"ex","Y":"why","Z":"zee"}
COLORS = ["#3BA7F5","#FF7A59","#FFC93C","#4CC38A","#B07CE8","#F58BB0"]
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def slug(w): return w.lower().replace(" ", "-")

def speak(text, out):
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, "t.wav")
        subprocess.run(["espeak-ng","-v","en-us","-s","110","-p","60","-w",wav,text], check=True)
        subprocess.run(["ffmpeg","-y","-loglevel","error","-i",wav,"-ac","1","-ar","22050",
                        "-c:a","libvorbis","-q:a","3",out], check=True)

def picture(word, color, out):
    s = 512
    im = Image.new("RGBA", (s, s), (0,0,0,0))
    d = ImageDraw.Draw(im)
    d.ellipse((16,16,s-16,s-16), fill=color)
    d.ellipse((16,16,s-16,s-16), outline="#1F2A44", width=10)
    size = 120
    f = ImageFont.truetype(FONT, size)
    while d.textlength(word, font=f) > s - 90 and size > 20:
        size -= 6; f = ImageFont.truetype(FONT, size)
    d.text((s/2, s/2), word, font=f, fill="#1F2A44", anchor="mm")
    im.save(out, optimize=True)

items = []
for i, (ch, word) in enumerate(LETTERS):
    lo = ch.lower(); w = slug(word)
    paths = {"name": f"audio/en/letters/{lo}.ogg", "word": f"audio/en/words/{w}.ogg", "img": f"images/en/{lo}.png"}
    for p in paths.values(): os.makedirs(os.path.dirname("assets/"+p), exist_ok=True)
    speak(SPOKEN[ch], "assets/"+paths["name"])
    speak(word, "assets/"+paths["word"])
    picture(word, COLORS[i % len(COLORS)], "assets/"+paths["img"])
    items.append({"id": f"en-{lo}", "glyph": ch, "word": {"en": word},
        "audio": {"en": {"name": paths["name"], "word": paths["word"]}},
        "image": paths["img"], "tracing": None, "free": True})

os.makedirs("assets/audio/ui", exist_ok=True)
speak("Hello!", "assets/audio/ui/hello.ogg")

pack = {"id": "english-letters", "version": 1, "language": "en", "theme": "primary",
        "title": {"en": "ABC"}, "activities": ["learn"], "items": items}
os.makedirs("src/content/packs", exist_ok=True)
json.dump(pack, open("src/content/packs/english-letters.json","w"), indent=2, ensure_ascii=False)
print("ok", len(items), "items")
