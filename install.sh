#!/bin/bash

# PandaControl Installer
# Design Premium para o Usuário Final

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${BLUE}   🐼 PandaControl - Instalador Linux   ${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# 1. Preparar pastas
echo -e "\n${BLUE}[1/4]${NC} Preparando diretórios..."
mkdir -p "$HOME/.local/share/pandacontrol"
mkdir -p "$HOME/.local/share/icons"
mkdir -p "$HOME/.local/share/applications"

# 2. Copiar AppImage
echo -e "${BLUE}[2/4]${NC} Copiando executável..."
cp "frontend/dist_electron/PandaControl-1.0.0.AppImage" "$HOME/.local/share/pandacontrol/PandaControl.AppImage"
chmod +x "$HOME/.local/share/pandacontrol/PandaControl.AppImage"

# 3. Copiar Ícone
echo -e "${BLUE}[3/4]${NC} Instalando ícones..."
cp "$HOME/.local/share/icons/pandacontrol.png" "$HOME/.local/share/pandacontrol/icon.png" 2>/dev/null || \
cp "/home/douglasdsr/.local/share/icons/pandacontrol.png" "$HOME/.local/share/pandacontrol/icon.png"

# 4. Criar Atalho de Menu
echo -e "${BLUE}[4/4]${NC} Registrando no menu de aplicativos..."
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

echo -e "\n${GREEN}✨ INSTALAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo -e "Você já pode encontrar o ${BLUE}PandaControl${NC} no seu menu de aplicativos."
echo -e "----------------------------------------\n"
