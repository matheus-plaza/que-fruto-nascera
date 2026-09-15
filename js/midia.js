/* =========================================================
   midia.js - decide o que mostrar no palco.

   Prioridade: foto real (Wikimedia Commons, licenca livre).
   Se a foto faltar, cai na ilustracao em SVG do art.js.
   Assim o jogo nunca mostra imagem quebrada.
   ========================================================= */
window.Midia = (function () {
  'use strict';

  var PASTA = 'assets/fotos/';
  var creditos = window.CREDITOS || {};

  function chave(id, tipo) { return id + '-' + (tipo === 'flor' ? 'flor' : 'fruto'); }

  function temFoto(id, tipo) { return !!creditos[chave(id, tipo)]; }

  function url(id, tipo) { return PASTA + chave(id, tipo) + '.jpg'; }

  function credito(id, tipo) { return creditos[chave(id, tipo)] || null; }

  /* HTML da imagem para o palco. `alt` fica vazio de proposito:
     dizer "flor do maracujazeiro" entregaria a resposta. */
  function palco(id, tipo) {
    if (temFoto(id, tipo)) {
      var c = credito(id, tipo);
      return '<img class="art-foto" src="' + url(id, tipo) + '" alt="" ' +
        'decoding="async" data-credito="' + escapar((c.autor || '') + ' · ' + (c.licenca || '')) + '">';
    }
    if (tipo === 'flor' && window.Art && Art.hasFlower(id)) return Art.flower(id);
    if (tipo === 'fruto' && window.Art && Art.hasFruit(id)) return Art.fruit(id);
    return '<div class="art-vazia">🌿</div>';
  }

  /* miniatura (pomar, galeria) */
  function mini(id, tipo) {
    tipo = tipo || 'fruto';
    if (temFoto(id, tipo)) {
      return '<img class="art-foto" src="' + url(id, tipo) + '" alt="" loading="lazy" decoding="async">';
    }
    if (tipo === 'fruto' && window.Art && Art.hasFruit(id)) return Art.fruit(id);
    if (tipo === 'flor' && window.Art && Art.hasFlower(id)) return Art.flower(id);
    return '<div class="art-vazia">🌿</div>';
  }

  function escapar(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* deixa as fotos das proximas rodadas prontas antes de precisar delas */
  function preparar(ids) {
    ids.forEach(function (par) {
      if (!temFoto(par.id, par.tipo)) return;
      var im = new Image();
      im.decoding = 'async';
      im.src = url(par.id, par.tipo);
    });
  }

  /* lista para a tela de creditos */
  function todos() {
    return Object.keys(creditos).sort().map(function (k) {
      var c = creditos[k];
      return {
        chave: k, arquivo: PASTA + k + '.jpg',
        autor: c.autor, licenca: c.licenca, pagina: c.pagina, titulo: c.titulo
      };
    });
  }

  return {
    palco: palco, mini: mini, url: url, temFoto: temFoto,
    credito: credito, preparar: preparar, todos: todos,
    quantas: function () { return Object.keys(creditos).length; }
  };
})();
