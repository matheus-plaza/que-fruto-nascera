# 🚀 Colocar no ar (de graça) e atualizar depois

O jogo é um site estático, então hospedar é grátis **para sempre** — não tem servidor, não tem banco, não tem limite que dê para estourar numa feira escolar. Vamos usar **Cloudflare Pages**, que além de grátis publica sozinho toda vez que você enviar uma alteração.

**Como vai funcionar no dia a dia:** você mexe em algo na pasta → dá dois cliques em `publicar.bat` → em ~30 segundos o site já está atualizado, e os tablets pegam a novidade sozinhos.

A configuração abaixo é feita **uma vez só** e leva uns 10 minutos.

---

## ✅ Passo 1 — GitHub (já está feito)

O código já está enviado para:

**https://github.com/matheus-plaza/que-fruto-nascera**

Não precisa fazer nada aqui. A partir de agora, publicar alteração é o Passo 3.

<details>
<summary>Se um dia precisar refazer isso em outro computador</summary>

```bash
git clone https://github.com/matheus-plaza/que-fruto-nascera.git
cd que-fruto-nascera
```

E se for criar um repositório novo do zero, lembre de trocar `SEU-USUARIO` pelo seu nome de usuário de verdade (foi o tropeço da primeira vez):

```bash
git remote add origin https://github.com/SEU-USUARIO/nome-do-repositorio.git
git push -u origin main
```

Se o `origin` já existir e você quiser trocar o endereço, use `set-url` em vez de `add`:

```bash
git remote set-url origin https://github.com/SEU-USUARIO/nome-do-repositorio.git
```
</details>

---

## 👉 Passo 2 — Ligar o Cloudflare Pages (é o que falta)

1. Crie uma conta em [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) (grátis, não pede cartão).
2. No painel, vá em **Compute (Workers & Pages)** → **Create** → aba **Pages** → **Connect to Git**.
3. Autorize o Cloudflare a acessar o GitHub e escolha o repositório `matheus-plaza/que-fruto-nascera`.
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
