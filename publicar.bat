@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  === Publicar o jogo ===
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo  ERRO: esta pasta ainda nao e um repositorio git.
  echo  Siga o passo 1 do arquivo DEPLOY.md antes.
  echo.
  pause
  exit /b 1
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo  ERRO: falta conectar o repositorio do GitHub.
  echo  Siga o passo 2 do arquivo DEPLOY.md antes.
  echo.
  pause
  exit /b 1
)

git diff --quiet && git diff --cached --quiet
if not errorlevel 1 (
  echo  Nada mudou desde a ultima publicacao.
  echo.
  pause
  exit /b 0
)

echo  O que mudou:
git status --short
echo.

set "MSG=%~1"
if "%MSG%"=="" set /p MSG=  Descreva a mudanca (enter para "atualizacao"): 
if "%MSG%"=="" set "MSG=atualizacao"

git add -A
git commit -m "%MSG%"
if errorlevel 1 (
  echo  ERRO ao salvar a alteracao.
  pause
  exit /b 1
)

echo.
echo  Enviando...
git push
if errorlevel 1 (
  echo.
  echo  ERRO ao enviar. Confira a internet e o login do GitHub.
  pause
  exit /b 1
)

echo.
echo  Pronto! O Cloudflare esta publicando.
echo  Em cerca de 30 segundos o site ja esta com a novidade.
echo.
pause
