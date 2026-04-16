from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import re
import os

app = FastAPI(title="Panda Audio API")

# Permitir requisições do frontend (Vite costuma usar a porta 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PANDA_SINK = "alsa_output.pci-0000_03_00.6.analog-stereo"

def get_vol():
    try:
        output = subprocess.check_output(["pactl", "get-sink-volume", PANDA_SINK]).decode()
        match = re.search(r"(\d+)%", output)
        if match:
            return int(match.group(1))
    except:
        return 0
    return 0

def is_muted():
    try:
        output = subprocess.check_output(["pactl", "get-sink-mute", PANDA_SINK]).decode().lower()
        return "yes" in output
    except:
        return False

@app.get("/status")
def get_status():
    return {
        "volume": get_vol(),
        "muted": is_muted(),
        "device": PANDA_SINK
    }

@app.post("/volume/up")
def volume_up():
    subprocess.run(["pactl", "set-sink-volume", PANDA_SINK, "+5%"])
    return get_status()

@app.post("/volume/down")
def volume_down():
    subprocess.run(["pactl", "set-sink-volume", PANDA_SINK, "-5%"])
    return get_status()

@app.post("/volume/mute")
def toggle_mute():
    subprocess.run(["pactl", "set-sink-mute", PANDA_SINK, "toggle"])
    return get_status()

@app.post("/volume/set/{level}")
def set_volume_level(level: int):
    if not (0 <= level <= 150): # Permitindo overdrive até 150%
        raise HTTPException(status_code=400, detail="Volume deve ser entre 0 e 150")
    subprocess.run(["pactl", "set-sink-volume", PANDA_SINK, f"{level}%"])
    return get_status()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
