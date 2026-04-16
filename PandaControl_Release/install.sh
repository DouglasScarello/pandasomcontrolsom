#!/bin/bash

# PandaControl Installer (Standalone Version)
# Criado para ser distribuído em uma pasta ZIP

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${BLUE}   🐼 PandaControl - Instalador Rápido  ${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# 1. Pastas
mkdir -p "$HOME/.local/share/pandacontrol"
mkdir -p "$HOME/.local/share/applications"

# 2. Copiar
echo -e "${BLUE}[1/2]${NC} Instalando arquivos..."
cp "PandaControl-1.0.0.AppImage" "$HOME/.local/share/pandacontrol/PandaControl.AppImage"
cp "icon.png" "$HOME/.local/share/pandacontrol/icon.png"
chmod +x "$HOME/.local/share/pandacontrol/PandaControl.AppImage"

# 3. Atalho
echo -e "${BLUE}[2/2]${NC} Criando atalho no menu..."
cat <<EOF > "$HOME/.local/share/applications/pandacontrol.desktop"
[Desktop Entry]
Name=PandaControl
Comment=Controle de volume premium Panda
Exec="$HOME/.local/share/pandacontrol/PandaControl.AppImage" --no-sandbox
Icon=$HOME/.local/share/pandacontrol/icon.png
Terminal=false
Type=Application
Categories=AudioVideo;Audio;
Path=$HOME/.local/share/pandacontrol/
EOF

update-desktop-database "$HOME/.local/share/applications/"

echo -e "\n${GREEN}✨ PRONTO! Procure por 'PandaControl' no seu menu de apps.${NC}"
echo -e "----------------------------------------\n"
