#!/usr/bin/env bash
# Publica as alteracoes: salva no git e envia. O Cloudflare Pages
# percebe o envio e coloca a nova versao no ar em ~30 segundos.
set -e
cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERRO: esta pasta ainda nao e um repositorio git (veja DEPLOY.md, passo 1)."
  exit 1
fi
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "ERRO: falta conectar o repositorio do GitHub (veja DEPLOY.md, passo 2)."
  exit 1
fi
if git diff --quiet && git diff --cached --quiet; then
  echo "Nada mudou desde a ultima publicacao."
  exit 0
fi

echo "O que mudou:"
git status --short
echo

msg="${1:-atualizacao}"
git add -A
git commit -m "$msg"
git push

echo
echo "Pronto! Em ~30 segundos o Cloudflare coloca a nova versao no ar."
