# 🚀 Colocar no ar (de graça) e atualizar depois

O jogo é um site estático, então hospedar é grátis **para sempre** — não tem servidor, não tem banco, não tem limite que dê para estourar numa feira escolar. Vamos usar **Cloudflare Pages**, que além de grátis publica sozinho toda vez que você enviar uma alteração.

**Como vai funcionar no dia a dia:** você mexe em algo na pasta → dá dois cliques em `publicar.bat` → em ~30 segundos o site já está atualizado, e os tablets pegam a novidade sozinhos.

A configuração abaixo é feita **uma vez só** e leva uns 10 minutos.

---

## Passo 1 — Criar a conta no GitHub e enviar a pasta

O Cloudflare precisa ler os arquivos de algum lugar. Esse lugar é o GitHub (também grátis).

1. Crie uma conta em [github.com](https://github.com) (se ainda não tiver).
2. Clique em **New repository** ([github.com/new](https://github.com/new)).
   - **Repository name:** `que-fruto-nascera` (ou o nome que preferir)
   - Deixe **Public**
   - **Não** marque nenhuma das opções de "Initialize with…" (nada de README, .gitignore ou license) — a pasta já tem tudo
   - **Create repository**
3. O GitHub mostra uma tela com comandos. Ignore e use os daqui: abra o **Git Bash** (ou o terminal) **dentro da pasta `JOGO_AGRO`** e rode, trocando `SEU-USUARIO` pelo seu nome de usuário do GitHub:

```bash
git remote add origin https://github.com/SEU-USUARIO/que-fruto-nascera.git
git push -u origin main
```

Na primeira vez ele vai pedir para você entrar na conta do GitHub — abre uma janela do navegador, é só autorizar.

> O `git init` e o primeiro commit **já estão feitos**. Se quiser conferir: `git log --oneline` deve mostrar um commit.

---

## Passo 2 — Ligar o Cloudflare Pages

1. Crie uma conta em [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) (grátis, não pede cartão).
2. No painel, vá em **Compute (Workers & Pages)** → **Create** → aba **Pages** → **Connect to Git**.
3. Autorize o Cloudflare a acessar o GitHub e escolha o repositório `que-fruto-nascera`.
4. Na tela de configuração do build, preencha assim:

| Campo | Valor |
|---|---|
| **Project name** | `que-fruto-nascera` (vira parte do endereço) |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | *deixe vazio* |
| **Build output directory** | `/` |

5. **Save and Deploy**.

Em cerca de 1 minuto o jogo estará em:

```
https://que-fruto-nascera.pages.dev
```

Esse é o endereço que vai virar o **QR Code** da barraca. Dentro do jogo, em **⚙️ Modo feira**, ele aparece grande e tem botão de copiar.

> **Por que `Build command` vazio?** Porque não há nada para compilar: são HTML, CSS, JS e as fotos, prontos para servir. É por isso que nunca vai quebrar num "erro de build".

---

## Passo 3 — Pronto. Como atualizar daqui para frente

Mexeu em qualquer coisa (trocou uma pista, uma foto, um texto)?

**Dois cliques em `publicar.bat`.** Ele pergunta o que mudou, envia, e o Cloudflare publica sozinho.

Se preferir o terminal:

```bash
./publicar.sh "troquei a pista do abacaxi"
```

Ou os comandos crus, que é o que os scripts fazem:

```bash
git add -A
git commit -m "troquei a pista do abacaxi"
git push
```

Acompanhe a publicação em **Workers & Pages → que-fruto-nascera → Deployments**. Cada envio vira um deploy com data e hora.

---

## Coisas boas que vêm de graça junto

- **Volta atrás em 1 clique.** Em *Deployments*, cada versão antiga tem um botão **Rollback**. Se algo sair errado no dia da feira, você volta para a versão anterior em segundos.
- **Pré-visualização antes de publicar.** Se criar um branch (`git checkout -b teste`) e enviar, o Cloudflare gera um endereço separado só para aquele branch, sem mexer no site principal.
- **Sem limite prático.** O plano grátis do Pages dá 500 builds por mês e banda ilimitada. Uma feira inteira não chega perto disso.
- **HTTPS automático**, que é obrigatório para o jogo funcionar como aplicativo instalado.

---

## Perguntas que costumam aparecer

**Os tablets já instalados vão pegar a atualização?**
Sim, sozinhos. O jogo procura a versão nova na internet toda vez que abre e só usa a cópia guardada quando está offline. Se um tablet estiver no modo avião, ele continua jogando a versão antiga e atualiza na próxima vez que pegar internet.

**Preciso trocar alguma versão no código quando eu mudar algo?**
Não. Isso era necessário antes; o `sw.js` foi ajustado justamente para você não ter que lembrar disso.

**E se eu quiser um endereço mais bonito?**
Dá para apontar um domínio próprio (tipo `quefruto.com.br`) em *Custom domains*, mas aí o domínio é pago (uns R$ 40/ano). O `.pages.dev` é grátis e funciona igual para o QR Code.

**Dá para publicar sem GitHub?**
Dá, com um comando só, mas aí não é automático — você roda toda vez:

```bash
npx wrangler pages deploy . --project-name=que-fruto-nascera
```

Funciona bem para um teste rápido, mas para o dia a dia o caminho do GitHub é melhor: fica o histórico e o rollback.

**Cloudflare, Netlify ou GitHub Pages?**
Os três servem e são grátis. Cloudflare Pages tem o rollback mais fácil e a rede mais rápida no Brasil. Se um dia quiser trocar, os arquivos são os mesmos — nada aqui depende do Cloudflare.

---

## O que cada arquivo de configuração faz

- **`_headers`** — instrui o Cloudflare sobre cache: o jogo e o `sw.js` são sempre conferidos na rede (para a atualização chegar na hora), e as fotos ficam guardadas por um ano (para carregar instantâneo e economizar dados do tablet).
- **`.gitignore`** — impede que arquivos temporários das ferramentas de foto sejam enviados.
- **`publicar.bat` / `publicar.sh`** — o atalho de publicar descrito no Passo 3.
