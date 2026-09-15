/* =========================================================
   app.js - Motor do jogo "Que Fruto Nascerá Aqui?"
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ---------------- estado ---------------- */
  var cfg = {
    som: true, vibra: true, tempo: false, auto: false, nome: '', modo: 'feira'
  };
  var jogo = null;
  var timerRodada = null, timerRevelar = null, timerAuto = null;

  var CHAVE_CFG = 'qfna_cfg_v1';
  var CHAVE_RANK = 'qfna_rank_v1';

  function carregarCfg() {
    try {
      var s = JSON.parse(localStorage.getItem(CHAVE_CFG) || '{}');
      Object.keys(s).forEach(function (k) { if (k in cfg) cfg[k] = s[k]; });
    } catch (e) { }
    Sfx.ligado = cfg.som;
  }
  function salvarCfg() {
    try { localStorage.setItem(CHAVE_CFG, JSON.stringify(cfg)); } catch (e) { }
  }
  function lerRanking() {
    try { return JSON.parse(localStorage.getItem(CHAVE_RANK) || '[]'); } catch (e) { return []; }
  }
  function gravarRanking(lista) {
    try { localStorage.setItem(CHAVE_RANK, JSON.stringify(lista.slice(0, 30))); } catch (e) { }
  }

  function vibrar(p) { if (cfg.vibra) window.vibrar(p); }

  /* ---------------- utilidades ---------------- */
  function baralhar(a) {
    var r = a.slice(), i, j, t;
    for (i = r.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }

  /* ---------------- navegacao ---------------- */
  var telaAtual = 'home';
  function irPara(nome) {
    var alvo = document.getElementById('tela-' + nome);
    if (!alvo) return;
    $$('.tela').forEach(function (t) { t.classList.remove('ativa'); });
    alvo.classList.add('ativa');
    alvo.scrollTop = 0;
    telaAtual = nome;
    if (nome === 'ranking') renderRanking();
    if (nome === 'creditos') renderCreditos();
    if (nome === 'painel') renderPainel();
    if (nome === 'modo') renderModos();
    if (nome !== 'fim') pararAuto();
  }

  /* ---------------- folhas de fundo ---------------- */
  function folhasFundo() {
    var box = $('#folhas-fundo'), html = '';
    for (var i = 0; i < 9; i++) {
      var x = (i * 37 + 7) % 92, y = (i * 53 + 11) % 88, r = (i * 47) % 360, s = 0.6 + ((i * 29) % 90) / 100;
      html += '<i style="left:' + x + '%;top:' + y + '%;transform:rotate(' + r + 'deg) scale(' + s.toFixed(2) + ')"></i>';
    }
    box.innerHTML = html;
  }

  /* ---------------- confete ---------------- */
  function confete(n, cores) {
    var box = $('#confete');
    cores = cores || ['#E9A93C', '#38A169', '#7C3AED', '#E5533D', '#F2C744', '#EC4899'];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var e = document.createElement('i');
      e.style.left = (Math.random() * 100) + '%';
      e.style.background = cores[i % cores.length];
      e.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
      e.style.animationDelay = (Math.random() * 0.5) + 's';
      e.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      if (i % 3 === 0) e.style.borderRadius = '50%';
      frag.appendChild(e);
    }
    box.appendChild(frag);
    setTimeout(function () { box.innerHTML = ''; }, 4200);
  }

  /* ---------------- mascara de folhas ---------------- */
  function montarMascara(n) {
    var el = $('#mascara');
    el.innerHTML = '';
    if (!n) return [];
    var cols = n <= 6 ? 3 : 3, rows = Math.ceil(n / cols);
    var tiles = [], i;
    for (i = 0; i < n; i++) {
      var c = i % cols, r = Math.floor(i / cols);
      var t = document.createElement('div');
      t.className = 'tile';
      t.style.left = (c * (100 / cols) - 3) + '%';
      t.style.top = (r * (100 / rows) - 3) + '%';
      t.style.width = (100 / cols + 6) + '%';
      t.style.height = (100 / rows + 6) + '%';
      t.style.transform = 'rotate(' + (((i * 53) % 24) - 12) + 'deg)';
      t.style.setProperty('--dx', (((i * 41) % 80) - 40) + 'px');
      t.style.setProperty('--dy', (40 + (i * 17) % 60) + 'px');
      t.style.setProperty('--dr', (((i * 67) % 90) - 45) + 'deg');
      el.appendChild(t);
      tiles.push(t);
    }
    return baralhar(tiles);
  }
  function caiFolha(k) {
    if (!jogo || !jogo.tiles || !jogo.tiles.length) return false;
    var caiu = false;
    for (var i = 0; i < (k || 1); i++) {
      var t = jogo.tiles.shift();
      if (t) { t.classList.add('fora'); caiu = true; }
    }
    if (caiu) Sfx.revelar();
    return caiu;
  }

  /* ---------------- cronometro ---------------- */
  function pararTimers() {
    if (timerRodada) { clearInterval(timerRodada); timerRodada = null; }
    if (timerRevelar) { clearInterval(timerRevelar); timerRevelar = null; }
  }
  function iniciarCronometro(segundos, aoFim) {
    var el = $('#cronometro'), arco = $('#cronoArco'), num = $('#cronoNum');
    el.hidden = false;
    el.classList.remove('urgente');
    var resta = segundos;
    num.textContent = resta;
    arco.style.strokeDashoffset = '0';
    timerRodada = setInterval(function () {
      resta--;
      num.textContent = Math.max(0, resta);
      arco.style.strokeDashoffset = (107 * (1 - resta / segundos)).toFixed(1);
      if (resta <= 5 && resta > 0) { el.classList.add('urgente'); Sfx.tique(); }
      if (resta <= 0) { pararTimers(); el.hidden = true; aoFim(); }
    }, 1000);
  }

  /* ---------------- montagem da partida ---------------- */
  function montarRodadas(modoId) {
    var modo = DB.MODOS.filter(function (m) { return m.id === modoId; })[0] || DB.MODOS[1];
    var qtd = modo.rodadas; /* [nivel1, nivel2, nivel3, desafio] */

    /* o maracuja fica reservado para o desafio final */
    var reserva = function (id) { return id !== 'maracuja'; };
    var comFruto = DB.ids().filter(reserva);
    /* o figo nao tem flor visivel, entao so entra no nivel 1 */
    var comFlor = DB.idsComFlor().filter(reserva);

    var usados = {}, rodadas = [], n, i;
    function pegar(lista) {
      var livres = lista.filter(function (id) { return !usados[id]; });
      if (!livres.length) livres = lista.slice();
      var id = livres[Math.floor(Math.random() * livres.length)];
      usados[id] = true;
      return id;
    }

    for (n = 1; n <= 3; n++) {
      for (i = 0; i < qtd[n - 1]; i++) {
        rodadas.push(novaRodada(pegar(n === 1 ? comFruto : comFlor), n));
      }
    }
    for (i = 0; i < qtd[3]; i++) rodadas.push(novaRodada('maracuja', 4));
    return rodadas;
  }

  function novaRodada(id, nivel) {
    var e = DB.por(id);
    var opts = [id];
    var decoys = baralhar((e.decoys || []).filter(function (d) { return DB.por(d); }));
    while (opts.length < 4 && decoys.length) opts.push(decoys.pop());
    if (opts.length < 4) {
      var resto = baralhar(DB.ids().filter(function (x) { return opts.indexOf(x) < 0; }));
      while (opts.length < 4) opts.push(resto.pop());
    }
    return { id: id, nivel: nivel, opcoes: baralhar(opts), pistas: 0, respondida: false, acertou: false, pontos: 0 };
  }

  function comecarPartida() {
    Sfx.destravar();
    cfg.nome = ($('#inpNome').value || '').trim().slice(0, 16);
    salvarCfg();
    jogo = {
      rodadas: montarRodadas(cfg.modo),
      indice: -1,
      pontos: 0,
      sequencia: 0,
      acertos: 0,
      semPista: 0,
      nivelAtual: 0,
      tiles: []
    };
    /* maximo teorico = base de cada rodada + bonus de uma partida perfeita */
    jogo.maximo = jogo.rodadas.reduce(function (s, r, i) {
      var base = r.nivel === 4 ? DB.DESAFIO.inicial : DB.PONTOS[r.nivel][0];
      return s + base + Math.min(DB.BONUS_MAX, DB.BONUS_SEQUENCIA * i);
    }, 0);
    irPara('jogo');
    proximaRodada();
  }

  /* ---------------- intro de nivel ---------------- */
  function mostrarIntroNivel(nivel, depois) {
    var info = DB.NIVEIS[nivel - 1];
    $('#introIcone').textContent = info.icone;
    $('#introLema').textContent = info.lema;
    $('#introTitulo').textContent = info.titulo;
    $('#introDesc').textContent = info.desc;
    var el = $('#introNivel');
    el.hidden = false;
    Sfx.subirNivel();
    vibrar(20);
    setTimeout(function () { el.hidden = true; depois(); }, 1750);
  }

  /* ---------------- ciclo de rodadas ---------------- */
  function proximaRodada() {
    pararTimers();
    jogo.indice++;
    if (jogo.indice >= jogo.rodadas.length) { finalizar(); return; }
    var r = jogo.rodadas[jogo.indice];
    if (r.nivel !== jogo.nivelAtual) {
      jogo.nivelAtual = r.nivel;
      mostrarIntroNivel(r.nivel, function () { renderRodada(); });
    } else {
      renderRodada();
    }
  }

  function renderRodada() {
    var r = jogo.rodadas[jogo.indice];
    var e = DB.por(r.id);
    var nivel = DB.NIVEIS[r.nivel - 1];
    var palco = $('#palco');

    palco.classList.remove('mostrar-fruto', 'acertou', 'errou', 'entrada');
    void palco.offsetWidth;
    palco.classList.add('entrada');

    $('#chipNivel').textContent = window.innerWidth >= 520
      ? 'Nível ' + r.nivel + ' · ' + nivel.titulo
      : 'Nível ' + r.nivel;
    $('#chipRodada').textContent = (jogo.indice + 1) + '/' + jogo.rodadas.length;
    $('#barraProgresso').style.width = ((jogo.indice) / jogo.rodadas.length * 100) + '%';
    $('#pergunta').textContent = nivel.pergunta;

    /* nivel 1 mostra o fruto; os outros, a flor */
    $('#camadaFlor').innerHTML = Midia.palco(r.id, r.nivel === 1 ? 'fruto' : 'flor');
    $('#camadaFruto').innerHTML = Midia.palco(r.id, 'fruto');
    /* adianta o download das duas proximas rodadas */
    var seguintes = [];
    for (var k = 1; k <= 2; k++) {
      var prox = jogo.rodadas[jogo.indice + k];
      if (prox) {
        seguintes.push({ id: prox.id, tipo: prox.nivel === 1 ? 'fruto' : 'flor' });
        seguintes.push({ id: prox.id, tipo: 'fruto' });
      }
    }
    Midia.preparar(seguintes);

    /* mascara */
    if (r.nivel === 3) jogo.tiles = montarMascara(6);
    else if (r.nivel === 4) jogo.tiles = montarMascara(9);
    else jogo.tiles = montarMascara(0);

    /* alternativas */
    var box = $('#alternativas');
    box.classList.remove('travado');
    box.innerHTML = r.opcoes.map(function (id) {
      var o = DB.por(id);
      return '<button class="alt" data-id="' + id + '"><span class="emo">' + o.emoji + '</span>' + o.nome + '</button>';
    }).join('');

    /* pistas */
    $('#listaPistas').innerHTML = '';
    var btnP = $('#btnPista');
    if (r.nivel === 4) {
      btnP.hidden = true;
    } else {
      btnP.hidden = false;
      btnP.disabled = false;
      $('#pistaCont').textContent = '3';
      $('.pista-txt').textContent = 'Pedir uma pista';
    }

    /* cronometro / revelacao */
    $('#cronometro').hidden = true;
    if (r.nivel === 4) {
      r.revelados = 0;
      timerRevelar = setInterval(function () {
        if (!caiFolha(1)) { clearInterval(timerRevelar); timerRevelar = null; return; }
        r.revelados++;
      }, 4000);
      iniciarCronometro(40, function () { responder(null); });
    } else if (cfg.tempo) {
      iniciarCronometro(30, function () { responder(null); });
    }
  }

  /* ---------------- pistas ---------------- */
  function pedirPista() {
    var r = jogo && jogo.rodadas[jogo.indice];
    if (!r || r.respondida || r.pistas >= 3) return;
    var e = DB.por(r.id);
    var p = e.pistas[r.pistas];
    r.pistas++;
    var li = document.createElement('li');
    li.innerHTML = '<b>Pista ' + r.pistas + ' · ' + p.t + '</b>' + p.d;
    $('#listaPistas').appendChild(li);
    Sfx.pista();
    vibrar(12);
    if (r.nivel === 3) caiFolha(2);
    var restam = 3 - r.pistas;
    $('#pistaCont').textContent = restam;
    if (restam === 0) {
      $('#btnPista').disabled = true;
      $('.pista-txt').textContent = 'Sem mais pistas';
    }
    var vale = DB.PONTOS[r.nivel][r.pistas];
    mostrarSelo('vale ' + vale, true);
  }

  function mostrarSelo(txt, discreto) {
    var el = $('#seloPontos');
    el.textContent = txt;
    el.style.fontSize = discreto ? '1.3rem' : '';
    el.style.color = discreto ? 'var(--tinta-suave)' : '';
    el.classList.remove('mostrar');
    void el.offsetWidth;
    el.classList.add('mostrar');
  }

  /* ---------------- resposta ---------------- */
  function responder(escolhaId) {
    var r = jogo && jogo.rodadas[jogo.indice];
    if (!r || r.respondida) return;
    r.respondida = true;
    pararTimers();
    $('#cronometro').hidden = true;

    var acertou = escolhaId === r.id;
    var pontos = 0, bonus = 0;

    if (acertou) {
      pontos = r.nivel === 4
        ? Math.max(DB.DESAFIO.minimo, DB.DESAFIO.inicial - DB.DESAFIO.passo * (r.revelados || 0))
        : DB.PONTOS[r.nivel][r.pistas];
      jogo.sequencia++;
      if (jogo.sequencia >= 2) bonus = Math.min(DB.BONUS_MAX, DB.BONUS_SEQUENCIA * (jogo.sequencia - 1));
      jogo.acertos++;
      if (r.pistas === 0) jogo.semPista++;
    } else {
      jogo.sequencia = 0;
    }

    r.acertou = acertou;
    r.pontos = pontos + bonus;
    r.bonus = bonus;
    r.expirou = escolhaId === null;
    jogo.pontos += r.pontos;

    /* feedback visual nas alternativas */
    var box = $('#alternativas');
    box.classList.add('travado');
    $$('#alternativas .alt').forEach(function (b) {
      var id = b.getAttribute('data-id');
      if (id === r.id) b.classList.add('certa');
      else if (id === escolhaId) b.classList.add('errada');
      else b.classList.add('apagada');
    });

    /* revela tudo e transforma flor em fruto */
    var palco = $('#palco');
    if (jogo.tiles) { jogo.tiles.forEach(function (t) { t.classList.add('fora'); }); jogo.tiles = []; }
    palco.classList.add(acertou ? 'acertou' : 'errou');

    if (acertou) { Sfx.acerto(); vibrar([18, 40, 18]); confete(26); }
    else { Sfx.erro(); vibrar(120); }

    if (r.pontos > 0) mostrarSelo('+' + r.pontos);
    atualizarPlacar();

    /* nivel 1 ja mostra o fruto; nos outros, faz a transformacao */
    setTimeout(function () {
      if (r.nivel !== 1) palco.classList.add('mostrar-fruto');
    }, 520);

    setTimeout(function () { abrirFeedback(r, acertou); }, r.nivel === 1 ? 620 : 1180);
  }

  function atualizarPlacar() {
    var p = $('.placar');
    $('#placarValor').textContent = jogo.pontos;
    p.classList.remove('pulo'); void p.offsetWidth; p.classList.add('pulo');
    $('#barraProgresso').style.width = ((jogo.indice + 1) / jogo.rodadas.length * 100) + '%';
  }

  /* ---------------- feedback ---------------- */
  function abrirFeedback(r, acertou) {
    var e = DB.por(r.id);
    $('#fbEmoji').textContent = acertou ? (r.pistas === 0 ? '🌟' : '🎉') : (r.expirou ? '⏰' : '🌱');
    $('#fbStatus').textContent = acertou
      ? (r.pistas === 0 ? 'Acertou de primeira!' : 'Acertou!')
      : (r.expirou ? 'O tempo acabou' : 'Quase lá — a resposta era');
    $('#fbNome').textContent = e.nome;
    var fp = $('#fbPontos');
    fp.textContent = r.pontos > 0 ? '+' + r.pontos : '0';
    fp.classList.toggle('zero', r.pontos === 0);
    fp.title = r.bonus ? 'inclui +' + r.bonus + ' de sequência' : '';
    $('#fbExplicacao').textContent = e.explicacao;
    /* credito da foto que acabou de ser mostrada */
    var cf = Midia.credito(r.id, r.nivel === 1 ? 'fruto' : 'flor');
    var cr = Midia.credito(r.id, 'fruto');
    var fontes = [];
    [cf, cr].forEach(function (c) {
      if (!c) return;
      var t = c.autor + ' (' + c.licenca + ')';
      if (fontes.indexOf(t) < 0) fontes.push(t);
    });
    $('#fbCredito').textContent = fontes.length
      ? 'Fotos: ' + fontes.join(' · ') + ' — via Wikimedia Commons'
      : '';
    $('#fbPolinizador').textContent = 'Polinizado por: ' + e.polinizador;
    $('#fbCuriosidade').textContent = e.curiosidade;
    $('#folhaFeedback').hidden = false;
  }

  function fecharFeedback() {
    $('#folhaFeedback').hidden = true;
    if (jogo) proximaRodada();
  }

  /* ---------------- fim ---------------- */
  function tituloDe(pct) {
    for (var i = 0; i < DB.TITULOS.length; i++) if (pct >= DB.TITULOS[i].min) return DB.TITULOS[i];
    return DB.TITULOS[DB.TITULOS.length - 1];
  }

  function finalizar() {
    pararTimers();
    var pct = jogo.maximo ? Math.min(1, jogo.pontos / jogo.maximo) : 0;
    var t = tituloDe(pct);

    $('#medalha').textContent = t.emoji;
    $('#fimTitulo').textContent = t.nome;
    $('#fimTitulo').style.color = t.cor;
    $('#fimMsg').textContent = t.msg;
    $('#fimPontos').textContent = jogo.pontos;
    $('#fimAcertos').textContent = jogo.acertos + '/' + jogo.rodadas.length;
    $('#fimSemPista').textContent = jogo.semPista;

    $('#pomar').innerHTML = jogo.rodadas.map(function (r, i) {
      return '<div class="item' + (r.acertou ? '' : ' perdeu') + '" title="' + DB.por(r.id).nome +
        '" style="animation-delay:' + (i * 60) + 'ms">' + Midia.mini(r.id, 'fruto') + '</div>';
    }).join('');

    var lista = lerRanking();
    var entrada = {
      nome: cfg.nome || 'Visitante',
      pontos: jogo.pontos,
      titulo: t.nome,
      quando: Date.now(),
      marca: true
    };
    lista.forEach(function (x) { delete x.marca; });
    lista.push(entrada);
    lista.sort(function (a, b) { return b.pontos - a.pontos; });
    gravarRanking(lista);

    irPara('fim');
    Sfx.vitoria();
    vibrar([20, 60, 20, 60, 40]);
    confete(pct >= 0.65 ? 90 : 40);

    if (cfg.auto) iniciarAuto();
  }

  function iniciarAuto() {
    var resta = 45, el = $('#autoVoltar');
    el.hidden = false;
    el.textContent = 'Voltando ao início em ' + resta + 's…';
    timerAuto = setInterval(function () {
      resta--;
      el.textContent = 'Voltando ao início em ' + resta + 's…';
      if (resta <= 0) { pararAuto(); irPara('home'); }
    }, 1000);
  }
  function pararAuto() {
    if (timerAuto) { clearInterval(timerAuto); timerAuto = null; }
    $('#autoVoltar').hidden = true;
  }

  /* ---------------- ranking ---------------- */
  function renderRanking() {
    var lista = lerRanking();
    var ol = $('#listaRanking');
    $('#rankingVazio').hidden = lista.length > 0;
    ol.innerHTML = lista.slice(0, 12).map(function (x) {
      return '<li class="' + (x.marca ? 'novo' : '') + '">' +
        '<span class="rk-nome">' + escapar(x.nome) + '<span class="rk-tit">' + escapar(x.titulo || '') + '</span></span>' +
        '<span class="rk-pts">' + x.pontos + '</span></li>';
    }).join('');
  }
  function escapar(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------------- telas auxiliares ---------------- */
  function renderModos() {
    var box = $('#listaModos');
    box.innerHTML = DB.MODOS.map(function (m) {
      return '<button class="modo" role="radio" data-modo="' + m.id + '" aria-checked="' + (m.id === cfg.modo) + '">' +
        '<span class="ico">' + m.icone + '</span><span><b>' + m.nome + '</b><span>' + m.desc + '</span></span></button>';
    }).join('');
    $('#inpNome').value = cfg.nome || '';
    atualizarPreview();
  }
  function atualizarPreview() {
    var m = DB.MODOS.filter(function (x) { return x.id === cfg.modo; })[0];
    $('#trilhaPreview').innerHTML = m.rodadas.map(function (q, i) {
      return q ? '<b>' + DB.NIVEIS[i].icone + ' ' + q + '× ' + DB.NIVEIS[i].titulo + '</b>' : '';
    }).join('');
  }

  function renderAjuda() {
    $('#listaNiveisAjuda').innerHTML = DB.NIVEIS.map(function (n) {
      return '<li><span class="ni">' + n.icone + '</span><span><b>Nível ' + n.n + ' — ' + n.titulo + '</b>' +
        '<span>' + n.desc + '</span></span></li>';
    }).join('');
  }

  var galeriaFeita = false;
  function renderPainel() {
    $('#cfgSom').checked = cfg.som;
    $('#cfgVibra').checked = cfg.vibra;
    $('#cfgTempo').checked = cfg.tempo;
    $('#cfgAuto').checked = cfg.auto;
    $('#urlAtual').textContent = location.href.split('#')[0];
    $('#qtdFotos').textContent = Midia.quantas();
    $('#contagemEspecies').textContent = DB.especies.length + ' frutas, ' + Midia.quantas() +
      ' fotos reais. Toque numa foto para ver quem fez.';
    if (!galeriaFeita) {
      $('#galeriaEspecies').innerHTML = DB.especies.map(function (e) {
        return '<figure>' + Midia.mini(e.id, e.soFruto ? 'fruto' : 'flor') +
          '<figcaption>' + e.nome + '</figcaption></figure>';
      }).join('');
      galeriaFeita = true;
    }
  }

  /* ---------------- creditos das fotos ---------------- */
  var creditosFeitos = false;
  function renderCreditos() {
    if (creditosFeitos) return;
    $('#listaCreditos').innerHTML = Midia.todos().map(function (f) {
      var partes = f.chave.split('-');
      var esp = DB.por(partes[0]);
      var rotulo = (esp ? esp.nome : partes[0]) + ' · ' + (partes[1] === 'flor' ? 'flor' : 'fruto');
      return '<li><img src="' + f.arquivo + '" alt="" loading="lazy">' +
        '<div class="cr-txt"><b>' + escapar(rotulo) + '</b>' +
        '<span>' + escapar(f.autor) + ' — ' + escapar(f.licenca) + '</span>' +
        (f.pagina ? '<a href="' + escapar(f.pagina) + '" target="_blank" rel="noopener">ver original</a>' : '') +
        '</div></li>';
    }).join('');
    creditosFeitos = true;
  }

  /* ---------------- guardar fotos para uso offline ---------------- */
  function baixarTudo() {
    var lista = Midia.todos();
    var btn = $('#btnBaixarTudo'), barra = $('#barraBaixa'), st = $('#statusBaixa');
    btn.disabled = true;
    barra.hidden = false;
    var prontas = 0, falhas = 0;

    function passo() {
      var pct = ((prontas + falhas) / lista.length * 100).toFixed(0);
      barra.firstChild.style.width = pct + '%';
      st.textContent = 'Guardando… ' + (prontas + falhas) + ' de ' + lista.length;
      if (prontas + falhas === lista.length) {
        btn.disabled = false;
        st.textContent = falhas
          ? prontas + ' fotos guardadas, ' + falhas + ' falharam. Tente de novo com a internet melhor.'
          : 'Prontinho! As ' + prontas + ' fotos estão no tablet. Já pode ficar sem internet.';
        Sfx.acerto();
      }
    }
    lista.forEach(function (f) {
      var im = new Image();
      im.onload = function () { prontas++; passo(); };
      im.onerror = function () { falhas++; passo(); };
      im.src = f.arquivo;
    });
  }

  /* ---------------- eventos ---------------- */
  function ligarEventos() {
    $$('[data-ir]').forEach(function (b) {
      b.addEventListener('click', function () { Sfx.toque(); irPara(b.getAttribute('data-ir')); });
    });
    $('#btnPainel').addEventListener('click', function () { irPara('painel'); });
    $('#btnBaixarTudo').addEventListener('click', baixarTudo);

    $('#listaModos').addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-modo]');
      if (!b) return;
      cfg.modo = b.getAttribute('data-modo');
      salvarCfg();
      $$('#listaModos .modo').forEach(function (m) {
        m.setAttribute('aria-checked', m.getAttribute('data-modo') === cfg.modo);
      });
      atualizarPreview();
      Sfx.toque();
    });

    $('#btnComecar').addEventListener('click', comecarPartida);
    $('#btnDeNovo').addEventListener('click', function () { pararAuto(); comecarPartida(); });

    $('#alternativas').addEventListener('click', function (ev) {
      var b = ev.target.closest('.alt');
      if (b) responder(b.getAttribute('data-id'));
    });
    $('#btnPista').addEventListener('click', pedirPista);
    $('#btnContinuar').addEventListener('click', fecharFeedback);

    $('#btnSair').addEventListener('click', function () {
      pararTimers();
      $('#folhaFeedback').hidden = true;
      irPara('home');
    });

    $('#btnLimparRanking').addEventListener('click', function () {
      if (confirm('Apagar todo o ranking deste tablet?')) { gravarRanking([]); renderRanking(); }
    });

    $('#cfgSom').addEventListener('change', function () { cfg.som = this.checked; Sfx.ligado = cfg.som; salvarCfg(); if (cfg.som) Sfx.toque(); });
    $('#cfgVibra').addEventListener('change', function () { cfg.vibra = this.checked; salvarCfg(); vibrar(20); });
    $('#cfgTempo').addEventListener('change', function () { cfg.tempo = this.checked; salvarCfg(); });
    $('#cfgAuto').addEventListener('change', function () { cfg.auto = this.checked; salvarCfg(); });

    $('#btnCopiarUrl').addEventListener('click', function () {
      var url = location.href.split('#')[0];
      var btn = this;
      function ok() { btn.textContent = 'Endereço copiado ✓'; setTimeout(function () { btn.textContent = 'Copiar endereço'; }, 1800); }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, function () { });
      else ok();
    });

    /* libera o audio no primeiro toque */
    document.addEventListener('pointerdown', function lib() {
      Sfx.destravar();
      document.removeEventListener('pointerdown', lib);
    });

    /* atalhos de teclado (util para testar no PC) */
    document.addEventListener('keydown', function (ev) {
      if (telaAtual !== 'jogo') return;
      if (!$('#folhaFeedback').hidden) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fecharFeedback(); }
        return;
      }
      var n = parseInt(ev.key, 10);
      var alts = $$('#alternativas .alt');
      if (n >= 1 && n <= alts.length) alts[n - 1].click();
      if (ev.key.toLowerCase() === 'p') $('#btnPista').click();
    });

    /* pausa timers se a aba sair de foco */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pararTimers();
    });
  }

  /* ---------------- inicializacao ---------------- */
  function iniciar() {
    carregarCfg();
    folhasFundo();
    $('#homeArt').innerHTML = Art.flower('maracuja');
    renderAjuda();
    renderModos();
    ligarEventos();

    /* offline: so registra no site publicado (em localhost atrapalha o desenvolvimento) */
    var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0 && !local) {
      navigator.serviceWorker.register('sw.js').catch(function () { });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
