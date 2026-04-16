#!/bin/bash

# Cores para o terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Iniciando o ecossistema Panda Audio...${NC}"

# Iniciar o Backend em segundo plano
echo -e "${GREEN}[1/2] Iniciando API Backend (FastAPI)...${NC}"
python3 panda_api.py > /dev/null 2>&1 &
BACKEND_PID=$!

# Iniciar o Frontend Vite em segundo plano
echo -e "${GREEN}[2/2] Iniciando Interface Web (Vite)...${NC}"
cd frontend
npm run dev -- --host > /dev/null 2>&1 &
FRONTEND_PID=$!

echo -e "\n${BLUE}✨ Tudo pronto!${NC}"
echo -e "➜  API rodando em: http://localhost:8000"
echo -e "➜  Interface rodando em: http://localhost:5173"
echo -e "\nPressione Ctrl+C para encerrar."

# Função para limpar os processos ao sair
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
