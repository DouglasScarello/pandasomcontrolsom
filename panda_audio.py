#!/usr/bin/env python3
import os
import sys
import subprocess
import re

# Nome do sink identificado pelo usuário
PANDA_SINK = "alsa_output.pci-0000_03_00.6.analog-stereo"

def get_current_volume():
    """Retorna o volume atual em porcentagem."""
    try:
        output = subprocess.check_output(["pactl", "get-sink-volume", PANDA_SINK]).decode()
        match = re.search(r"(\d+)%", output)
        if match:
            return int(match.group(1))
    except Exception:
        pass
    return 0

def show_notification(volume, muted=False):
    """Envia uma notificação visual (OSD) para o sistema."""
    if muted:
        icon = "audio-volume-muted"
        msg = "Mudo"
    else:
        if volume == 0:
            icon = "audio-volume-muted"
        elif volume < 33:
            icon = "audio-volume-low"
        elif volume < 66:
            icon = "audio-volume-medium"
        else:
            icon = "audio-volume-high"
        msg = f"Volume: {volume}%"
    
    # -h int:value:<N> faz com que muitos sistemas mostrem uma barra de progresso
    subprocess.run([
        "notify-send", 
        "-a", "Panda Speaker", 
        "-h", f"int:value:{volume}", 
        "-h", "string:x-canonical-private-synchronous:volume",
        "-i", icon, 
        "Caixa Panda", 
        msg
    ])

def set_volume(action):
    if action == "sobe":
        # Permite passar de 100% se necessário (overdrive)
        os.system(f"pactl set-sink-volume {PANDA_SINK} +5%")
    elif action == "desce":
        os.system(f"pactl set-sink-volume {PANDA_SINK} -5%")
    elif action == "mudo":
        os.system(f"pactl set-sink-mute {PANDA_SINK} toggle")
    
    # Atualiza informações para a notificação
    new_vol = get_current_volume()
    
    # Verifica mudo
    is_muted = "yes" in subprocess.check_output(["pactl", "get-sink-mute", PANDA_SINK]).decode().lower()
    
    show_notification(new_vol, is_muted)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        set_volume(sys.argv[1].lower())
    else:
        print("Uso: panda_audio.py [sobe|desce|mudo]")
