# 🌸 Que Fruto Nascerá Aqui?

Jogo educativo de fruticultura para feira/evento escolar. O aluno vê **a foto de uma flor** e descobre **qual fruta vai nascer dela**.

Roda no navegador do tablet, **instala como aplicativo** e **funciona sem internet**.

---

> **Para colocar no ar:** o passo a passo completo (grátis, com publicação automática a cada alteração) está em **[DEPLOY.md](DEPLOY.md)**.

## Como abrir agora, no PC

Dois cliques em **`index.html`**. Não precisa instalar nada, nem servidor, nem internet.

Para ver como fica no tablet: no Chrome aperte `F12` → ícone de celular (Toggle device toolbar) → escolha "iPad".

Atalhos só para testar rápido: teclas `1`–`4` respondem, `P` pede pista, `Enter` avança.

---

## Como colocar no tablet (3 opções)

### Opção 1 — Hospedar de graça (é o que permite o QR Code)

Use o **Cloudflare Pages**, que além de grátis republica sozinho toda vez que você alterar alguma coisa. O passo a passo está em **[DEPLOY.md](DEPLOY.md)** — são uns 10 minutos, feitos uma vez só.

No fim você recebe um endereço como `https://que-fruto-nascera.pages.dev`. Gere o **QR Code** dele em qualquer gerador gratuito (`qr.io`, `qrcode-monkey.com`) e imprima na placa da barraca. Dentro do jogo, em **⚙️ Modo feira**, o endereço aparece grande e tem botão de copiar.

### Opção 2 — Instalar como aplicativo no tablet (sem loja, sem APK)

Depois de hospedar, abra o endereço no tablet:

- **Android/Chrome:** menu `⋮` → **“Instalar aplicativo”**.
- **iPad/Safari:** botão compartilhar → **“Adicionar à Tela de Início”**.

Ele ganha ícone próprio e abre em tela cheia, sem barra de navegador. É o mesmo efeito de um APK, sem os problemas de um APK.

**Importante para a feira:** entre em **⚙️ Modo feira → Guardar fotos no tablet** e toque no botão uma vez, com internet. Ele baixa as 51 fotos (~4 MB) e a partir daí o jogo funciona até no modo avião. Sem esse passo, o jogo abre offline mas as fotos podem faltar.

### Opção 3 — Sem internet nenhuma

Copie a pasta inteira para o tablet (cabo USB ou pendrive) e abra o `index.html`. Funciona, mas a Opção 2 dá uma experiência bem melhor na feira.

---

## As fotos

As imagens **são fotografias reais**, todas do **Wikimedia Commons** e todas com **licença livre** (Creative Commons ou domínio público) — nada de foto baixada do Google, que traria problema de direito de imagem numa apresentação escolar.

Autor e licença de cada foto ficam registrados em três lugares:

- em **⚙️ Modo feira → Ver créditos das fotos** (tela com miniatura, autor, licença e link para o original);
- embaixo da explicação, ao fim de cada rodada;
- no arquivo `assets/fotos/creditos.json`.

Boa parte vem do acervo botânico de **Forest & Kim Starr**, que fotografa plantas cultivadas identificando espécie e parte da planta — foi o que garantiu que a foto de "flor" fosse realmente a flor.

### Como as fotos foram escolhidas

Buscar "flor de morango" por relevância traz foto de *fruta* de morango. Então o processo foi:

1. `tools/baixar_fotos.py` busca no Commons filtrando pelo **nome do arquivo** (`intitle:flower`, excluindo `fruit`), aceitando só licença livre, e descartando pintura de museu, gravura antiga, prateleira de mercado, foto com pessoa e "habit" (foto da planta inteira, em que o fruto fica invisível).
2. `tools/montagem.py` gera folhas de contato para conferir **uma por uma** se a imagem mostra o que deveria.
3. `tools/candidatos.py` resolve os casos difíceis: baixa vários candidatos, monta uma folha numerada e grava o escolhido.

```bash
python tools/baixar_fotos.py          # baixa o que falta
python tools/montagem.py flor         # folha de contato das flores
python tools/gerar_creditos.py        # regera js/creditos.js
```

Trocar uma foto na mão: substitua o arquivo em `assets/fotos/` (mesmo nome, `<fruta>-flor.jpg` ou `<fruta>-fruto.jpg`), atualize a entrada em `creditos.json` e rode `python tools/gerar_creditos.py`.

---

## O que tem no jogo

**26 frutas**, cada uma com foto da flor, foto do fruto, 3 pistas, explicação, polinizador e curiosidade:

maracujá, morango, laranja, goiaba, pitaya, manga, banana, abacaxi, mamão, cacau, jabuticaba, caju, melancia, uva, abacate, romã, maçã, pêssego, cereja, acerola, pera, figo, melão, coco, açaí e graviola.

As oito frutas que a Elis já havia usado como alternativa nas rodadas (maçã, cereja, acerola, pera, figo, pêssego, melão e coco) entraram como espécies completas — então as listas de alternativas dela funcionam exatamente como escritas.

**O café saiu**: numa pergunta do tipo "que *fruta* vai nascer daqui?", café confunde, porque o que se consome é o grão.

Duas frutas têm tratamento especial:

- **Figo** só aparece no nível 1 e como alternativa, porque ele *não tem flor visível por fora* — o figo é um monte de flores viradas para dentro. Isso está na explicação dele, e é uma das melhores curiosidades do jogo.
- **Maracujá** fica reservado para o desafio final.

### Os 4 níveis

| Nível | Nome | O que acontece |
|---|---|---|
| 1 | 🧺 Reconheça o Fruto | Aquecimento: vê a foto da fruta e diz o nome |
| 2 | 🌸 Da Flor ao Fruto | O coração do jogo: aparece só a flor |
| 3 | 🔍 Detetive da Fruticultura | A flor está coberta por folhas; cada pista derruba duas |
| 4 | ⭐ A Flor Misteriosa | Desafio final com a flor do maracujá aparecendo aos poucos, contra o relógio |

### Pontuação

| Situação | Nível 1 | Nível 2 | Nível 3 |
|---|---|---|---|
| Acertou só olhando | 20 | **30** | 40 |
| Depois da 1ª pista | 14 | **20** | 26 |
| Depois da 2ª pista | 8 | **10** | 14 |
| Depois da 3ª pista | 4 | **5** | 6 |
| Errou | 0 | 0 | 0 |

No **desafio final** começa em 50 pontos e cai 8 a cada pedaço da flor revelado — pelo tempo ou por pedir ajuda, que também revela um pedaço (mínimo 10). Acertos seguidos dão **bônus de sequência** (+5, +10, +15).

### Títulos finais

Calculados em relação ao máximo possível daquela partida, para o título valer igual em partida curta ou longa:

- **🏆 Mestre da Fruticultura** — 85% ou mais
- **🔍 Detetive das Frutas** — 65% a 84%
- **🌱 Aprendiz do Pomar** — 45% a 64%
- **🧭 Explorador das Frutas** — abaixo de 45%

### Linguagem

As **pistas** não usam nenhum termo técnico — são observações concretas, do tipo que o aluno consegue enxergar ("minha planta é baixinha e cresce quase encostada no chão"). A **explicação** que aparece depois da resposta pode usar um termo, mas sempre explicado ali mesmo em palavras simples ("caulifloria, que quer dizer flor no caule"). A **curiosidade** é sempre um fato concreto e surpreendente.

### Além do que foi pedido

- **3 tamanhos de partida:** Rápido (6 rodadas, ~2 min), Feira (10 rodadas, ~3 min) e Completo (16 rodadas, ~6 min).
- **Ranking do tablet** — o aluno digita o nome e disputa o pódio com a turma. Fica salvo mesmo se fechar o jogo.
- **Pomar da partida** — no final aparecem as frutas conquistadas; as que errou ficam cinza.
- **Animação flor → fruto** depois de cada resposta, com confete e som.
- **Modo feira** (⚙️ na tela inicial): liga/desliga som, vibração e cronômetro, guarda as fotos para offline, e tem **retorno automático ao início depois de 45 s** — para o tablet se reiniciar sozinho para o próximo aluno.
- **Sons sintetizados na hora** — nenhum arquivo de áudio.
- **Catálogo imprimível:** abra `preview.html` para ver todas as flores, frutos, pistas, curiosidades e créditos numa folha só. É o roteiro de quem estiver na barraca, e dá para imprimir (`Ctrl+P`).

---

## Detalhes técnicos

- HTML, CSS e JavaScript puros. **Nenhuma dependência**, nenhum passo de build, nenhum `npm install`.
- PWA: `manifest.webmanifest` + `sw.js`. O service worker busca o jogo (HTML/CSS/JS) **na rede primeiro**, usando a cópia guardada só quando está offline — então todo deploy novo entra no ar sozinho, sem ninguém precisar mexer em número de versão. As fotos são o contrário (**cache primeiro**), porque nunca mudam de conteúdo. Ele só é registrado no site publicado, não em `localhost`.
- `js/art.js` desenha flores e frutos em SVG por código. Hoje isso é a **reserva**: se uma foto faltar, entra a ilustração, e o jogo nunca mostra imagem quebrada. A logo da tela inicial também vem daí.

### Arquivos

```
index.html            telas do jogo
preview.html          catálogo das frutas (conferir e imprimir)
css/style.css         identidade visual
js/data.js            conteúdo: frutas, pistas, explicações, curiosidades
js/midia.js           escolhe foto ou ilustração
js/creditos.js        autoria/licença das fotos (gerado)
js/art.js             ilustrações SVG (reserva + logo)
js/audio.js           efeitos sonoros sintetizados
js/app.js             motor do jogo
sw.js                 funcionamento offline
assets/fotos/         as 51 fotografias + creditos.json
tools/                scripts de busca e conferência das fotos
```

### Mexer no conteúdo

Para trocar uma pista, um texto ou acrescentar uma fruta, o arquivo é **`js/data.js`**. Cada fruta é um bloco assim:

```js
{
  id: 'morango', nome: 'Morango', planta: 'Morangueiro', emoji: '🍓', cor: '#E11D48',
  pistas: [ {t:'A planta', d:'...'}, {t:'Por fora', d:'...'}, {t:'O fruto', d:'...'} ],
  explicacao: '...',
  curiosidade: '...',
  polinizador: '...',
  decoys: ['maca','cereja','acerola']   // as alternativas erradas
}
```

Fruta nova também precisa das duas fotos em `assets/fotos/` (`<id>-flor.jpg` e `<id>-fruto.jpg`) — o jeito mais fácil é adicionar a linha dela em `tools/baixar_fotos.py` e rodar o script. Se ela não tiver flor visível, marque `soFruto: true` como no figo.

Mudou algum arquivo depois de publicar? Só publicar: veja **[DEPLOY.md](DEPLOY.md)**. Os tablets já instalados pegam a versão nova sozinhos na próxima vez que abrirem com internet — não precisa mexer em nada no código.
