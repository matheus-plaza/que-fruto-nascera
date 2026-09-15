/* =========================================================
   art.js - Ilustracoes botanicas procedurais em SVG.
   Tudo desenhado por codigo: nada de imagens externas.
   Cada especie tem uma flor (a pergunta) e um fruto (a resposta).
   ========================================================= */
window.Art = (function () {
  'use strict';

  var uid = 0;
  function nid(p) { uid += 1; return (p || 'g') + uid; }
  function rad(d) { return (d * Math.PI) / 180; }

  function wrap(inner, extra) {
    return '<svg class="art-svg ' + (extra || '') + '" viewBox="0 0 400 400" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">' +
      inner + '</svg>';
  }

  /* ---------- gradientes ---------- */
  function linGrad(id, c1, c2, angle) {
    var a = rad(angle == null ? 90 : angle);
    var x1 = 0.5 - Math.cos(a) * 0.5, y1 = 0.5 - Math.sin(a) * 0.5;
    var x2 = 0.5 + Math.cos(a) * 0.5, y2 = 0.5 + Math.sin(a) * 0.5;
    return '<linearGradient id="' + id + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' +
      '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>';
  }
  function radGrad(id, c1, c2, fx, fy) {
    return '<radialGradient id="' + id + '" cx="' + (fx == null ? 0.38 : fx) + '" cy="' + (fy == null ? 0.32 : fy) + '" r="0.78">' +
      '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></radialGradient>';
  }

  /* ---------- petalas ---------- */
  function petalPath(L, W, shape) {
    var w = W / 2;
    switch (shape) {
      case 'pointed':
        return 'M0 0 C ' + w + ' ' + (-L * .22) + ', ' + (w * .9) + ' ' + (-L * .7) + ', 0 ' + (-L) +
          ' C ' + (-w * .9) + ' ' + (-L * .7) + ', ' + (-w) + ' ' + (-L * .22) + ', 0 0 Z';
      case 'strap':
        return 'M0 0 C ' + (w * .9) + ' ' + (-L * .3) + ', ' + (w * .75) + ' ' + (-L * .92) + ', 0 ' + (-L) +
          ' C ' + (-w * .75) + ' ' + (-L * .92) + ', ' + (-w * .9) + ' ' + (-L * .3) + ', 0 0 Z';
      case 'notch':
        return 'M0 0 C ' + (w * 1.2) + ' ' + (-L * .28) + ', ' + (w * 1.05) + ' ' + (-L * .92) + ', ' + (w * .3) + ' ' + (-L) +
          ' L 0 ' + (-L * .84) + ' L ' + (-w * .3) + ' ' + (-L) +
          ' C ' + (-w * 1.05) + ' ' + (-L * .92) + ', ' + (-w * 1.2) + ' ' + (-L * .28) + ', 0 0 Z';
      case 'spoon':
        return 'M0 0 C ' + (w * .55) + ' ' + (-L * .2) + ', ' + (w * 1.25) + ' ' + (-L * .58) + ', 0 ' + (-L) +
          ' C ' + (-w * 1.25) + ' ' + (-L * .58) + ', ' + (-w * .55) + ' ' + (-L * .2) + ', 0 0 Z';
      default:
        return 'M0 0 C ' + (w * 1.32) + ' ' + (-L * .2) + ', ' + (w * 1.16) + ' ' + (-L * .86) + ', 0 ' + (-L) +
          ' C ' + (-w * 1.16) + ' ' + (-L * .86) + ', ' + (-w * 1.32) + ' ' + (-L * .2) + ', 0 0 Z';
    }
  }

  /* sombra suave: sem ela as petalas brancas desaparecem no fundo claro */
  function sombraDef(id) {
    return '<filter id="' + id + '" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#5E7358" flood-opacity="0.28"/></filter>';
  }

  function corolla(o) {
    var cx = o.cx, cy = o.cy, n = o.n, L = o.L, W = o.W;
    var id = nid('p'), defs = linGrad(id, o.c1, o.c2, 90);
    var out = '', i, a, d = petalPath(L, W, o.shape);
    for (i = 0; i < n; i++) {
      a = (360 / n) * i + (o.rot || 0);
      out += '<g transform="translate(' + cx + ',' + cy + ') rotate(' + a + ')">' +
        '<path d="' + d + '" fill="url(#' + id + ')" stroke="' + (o.stroke || 'rgba(0,0,0,.10)') + '" stroke-width="' + (o.sw || 1.6) + '"/>' +
        (o.vein ? '<path d="M0 ' + (-L * .12) + ' L0 ' + (-L * .8) + '" stroke="' + o.vein + '" stroke-width="2" stroke-linecap="round" opacity=".55"/>' : '') +
        '</g>';
    }
    if (o.sombra) {
      var fid = nid('sh');
      defs += sombraDef(fid);
      out = '<g filter="url(#' + fid + ')">' + out + '</g>';
    }
    return { defs: defs, body: out };
  }

  /* calice: sepalas verdes pontudas atras das petalas */
  function calice(cx, cy, n, len, w, c1, c2, rot) {
    var out = '', i, d = petalPath(len, w, 'pointed');
    var id = nid('sp');
    out += '<defs>' + linGrad(id, c1, c2, 70) + '</defs>';
    for (i = 0; i < n; i++) {
      out += '<g transform="translate(' + cx + ',' + cy + ') rotate(' + ((360 / n) * i + (rot || 0)) + ')">' +
        '<path d="' + d + '" fill="url(#' + id + ')" stroke="rgba(0,0,0,.08)" stroke-width="1.2"/></g>';
    }
    return out;
  }

  function stamens(cx, cy, n, len, col, tip) {
    var out = '', i, a, r2, x, y;
    for (i = 0; i < n; i++) {
      a = rad((360 / n) * i - 90);
      r2 = len * (0.72 + ((i * 37) % 100) / 340);
      x = cx + Math.cos(a) * r2; y = cy + Math.sin(a) * r2 * 0.98;
      out += '<path d="M' + cx + ' ' + cy + ' Q ' + (cx + Math.cos(a) * r2 * .5).toFixed(1) + ' ' + (cy + Math.sin(a) * r2 * .42).toFixed(1) +
        ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + '" stroke="' + col + '" stroke-width="2.1" fill="none" stroke-linecap="round"/>' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.1" fill="' + tip + '"/>';
    }
    return out;
  }

  function core(cx, cy, r, c1, c2) {
    var id = nid('c');
    return '<defs>' + radGrad(id, c1, c2) + '</defs>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#' + id + ')"/>';
  }

  function leaf(x, y, len, w, angle, c1, c2) {
    var id = nid('l');
    var d = 'M0 0 C ' + w + ' ' + (-len * .3) + ', ' + (w * .7) + ' ' + (-len * .85) + ', 0 ' + (-len) +
      ' C ' + (-w * .7) + ' ' + (-len * .85) + ', ' + (-w) + ' ' + (-len * .3) + ', 0 0 Z';
    return '<defs>' + linGrad(id, c1, c2, 60) + '</defs>' +
      '<g transform="translate(' + x + ',' + y + ') rotate(' + angle + ')">' +
      '<path d="' + d + '" fill="url(#' + id + ')" stroke="rgba(0,0,0,.10)" stroke-width="1.4"/>' +
      '<path d="M0 0 L0 ' + (-len * .92) + '" stroke="rgba(255,255,255,.42)" stroke-width="2"/>' +
      '</g>';
  }

  function stem(d, col, w) {
    return '<path d="' + d + '" stroke="' + (col || '#3F8F4F') + '" stroke-width="' + (w || 9) + '" fill="none" stroke-linecap="round"/>';
  }

  function tendril(x, y, scale, col, flip) {
    var p = '', i, t, r, a, sx, sy, first = true;
    for (i = 0; i <= 46; i++) {
      t = i / 46; a = t * Math.PI * 4.4; r = 6 + t * 26;
      sx = x + (flip ? -1 : 1) * (Math.cos(a) * r * scale + t * 26 * scale);
      sy = y + Math.sin(a) * r * scale * .72 - t * 12 * scale;
      p += (first ? 'M' : 'L') + sx.toFixed(1) + ' ' + sy.toFixed(1); first = false;
    }
    return '<path d="' + p + '" stroke="' + (col || '#4CA35E') + '" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".95"/>';
  }

  function backdrop(a, b) {
    var id = nid('bd');
    return '<defs>' + radGrad(id, a || '#FFFFFF', b || '#EAF6E9', .5, .42) + '</defs>' +
      '<circle cx="200" cy="200" r="186" fill="url(#' + id + ')"/>';
  }

  /* Panicula parametrizada. Manga, caju e abacate sao todos paniculas,
     entao cada um recebe silhueta, cor de raque e detalhe proprios. */
  function panicle(o) {
    var s = backdrop('#FFFFFF', o.bg);
    var levels = o.levels, base = o.spread, step = o.step, flores = o.flores || 4;
    var yBase = o.yBase || 330, i, j, k;

    /* folhagem: forma diferente por especie */
    s += leaf(o.folhaX || 118, 366, o.folhaL || 96, o.folhaW || 34, -(o.folhaA || 40), o.folha1 || '#4E9A58', o.folha2 || '#2E7440');
    s += leaf(400 - (o.folhaX || 118), 372, (o.folhaL || 96) * .92, (o.folhaW || 34) * .94, (o.folhaA || 40), o.folha1 || '#57A660', o.folha2 || '#347C46');

    s += '<path d="M200 400 L200 ' + yBase + '" stroke="' + o.raque + '" stroke-width="12" stroke-linecap="round"/>';

    for (i = 0; i < levels; i++) {
      var y = yBase - i * step;
      var spread = base * (1 - i / (levels + 1.05));
      s += '<path d="M200 ' + (y + step) + ' L200 ' + y + '" stroke="' + o.raque + '" stroke-width="' + (8 - i * (5 / levels)) + '" stroke-linecap="round"/>';
      for (j = -1; j <= 1; j += 2) {
        var ex = 200 + j * spread, ey = y - step * .5;
        s += '<path d="M200 ' + y + ' Q ' + (200 + j * spread * .55).toFixed(1) + ' ' + (y - step * .12).toFixed(1) +
          ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" stroke="' + o.raque + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
        for (k = 0; k < flores; k++) {
          var t = .26 + k * (.74 / flores);
          var bx = 200 + j * spread * t, by = y - t * step * .5;
          var rr = (o.tam || 7.4) - k * .4;
          s += '<g transform="translate(' + bx.toFixed(1) + ',' + by.toFixed(1) + ')">';
          var p = corolla({ cx: 0, cy: 0, n: o.petalas || 5, L: rr * 2.1, W: rr * 1.5, shape: o.forma || 'strap', c1: o.petala1, c2: o.petala2, rot: (i * 17 + k * 29), sw: 1 });
          s += '<defs>' + p.defs + '</defs>' + p.body;
          /* caju: um estame comprido saindo da flor */
          if (o.estameLongo) {
            s += '<path d="M0 0 Q ' + (j * 8) + ' ' + (-rr * 2.2) + ' ' + (j * 15) + ' ' + (-rr * 3.1) + '" stroke="#C9607F" stroke-width="1.6" fill="none"/>' +
              '<circle cx="' + (j * 15) + '" cy="' + (-rr * 3.1) + '" r="2.2" fill="#E4A02A"/>';
          }
          s += '<circle cx="0" cy="0" r="' + (rr * .46) + '" fill="' + o.miolo1 + '" stroke="' + o.miolo2 + '" stroke-width="1"/></g>';
        }
      }
    }
    return wrap(s);
  }

  /* cauliforia: flores nascendo direto no tronco (cacau, jabuticaba) */
  function cauliflory(kind) {
    var s = backdrop('#FFFFFF', kind === 'cacau' ? '#F7EDE6' : '#F1F0E8');
    var id = nid('tr');
    s += '<defs>' + linGrad(id, '#9C7A55', '#6B4E33', 0) + '</defs>';
    s += '<path d="M148 400 C 152 300, 144 200, 152 40 L 250 40 C 258 200, 250 300, 254 400 Z" fill="url(#' + id + ')"/>';
    s += '<path d="M170 60 C 176 180, 168 300, 172 400" stroke="rgba(255,255,255,.16)" stroke-width="7" fill="none"/>';
    s += '<path d="M228 60 C 222 180, 232 300, 228 400" stroke="rgba(0,0,0,.16)" stroke-width="9" fill="none"/>';
    s += leaf(120, 150, 96, 36, -74, '#4E9A58', '#2E7440');
    s += leaf(282, 190, 92, 34, 76, '#57A660', '#347C46');

    if (kind === 'cacau') {
      /* poucas flores, pequenas e rosadas, com pedicelo visivel */
      var pos = [[150, 118, 1], [252, 158, .94], [146, 212, .9], [254, 262, .96], [154, 302, .86], [250, 348, .82], [200, 82, .74]];
      for (var i = 0; i < pos.length; i++) {
        var x = pos[i][0], y = pos[i][1], sc = pos[i][2];
        var lado = x < 200 ? -1 : 1;
        s += '<path d="M' + (x - lado * 14) + ' ' + y + ' L' + x + ' ' + y + '" stroke="#B8845C" stroke-width="3"/>';
        s += '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">';
        var p = corolla({ cx: 0, cy: 0, n: 5, L: 30, W: 17, shape: 'strap', c1: '#FBE4EC', c2: '#D98BA6', rot: (i * 31), sw: 1 });
        s += '<defs>' + p.defs + '</defs>' + p.body;
        s += stamens(0, 0, 5, 14, '#E39CB4', '#C76B8D');
        s += '<circle cx="0" cy="0" r="6" fill="#FFF1F5" stroke="#DCA3B8" stroke-width="1.3"/></g>';
      }
    } else {
      /* jabuticabeira: o tronco fica coberto de flores brancas felpudas */
      var linhas = 11;
      for (var r = 0; r < linhas; r++) {
        var qtd = r % 2 ? 3 : 4;
        for (var c = 0; c < qtd; c++) {
          var jx = 158 + c * (84 / (qtd - 1)) + (r % 2 ? 14 : 0);
          var jy = 52 + r * 32 + ((c * 11) % 9);
          var js = .52 + ((r * 7 + c * 13) % 30) / 100;
          s += '<g transform="translate(' + jx.toFixed(0) + ',' + jy.toFixed(0) + ') scale(' + js.toFixed(2) + ')">';
          s += stamens(0, 0, 20, 27, '#FFFFFF', '#F6EDC6');
          s += '<circle cx="0" cy="0" r="8" fill="#FFFFFF" stroke="#E6DFC9" stroke-width="1.4"/></g>';
        }
      }
    }
    return wrap(s);
  }

  /* ============================================================
     FLORES
     ============================================================ */
  var FLOWERS = {

    maracuja: function () {
      var s = backdrop('#FFFFFF', '#EFE7FB');
      s += stem('M200 400 C 190 330, 205 300, 200 268', '#4E9E5C', 9);
      s += leaf(150, 330, 74, 34, -34, '#63B96F', '#3E8C4C');
      s += tendril(246, 318, 1.05, '#5FB56D');
      var pet = corolla({ cx: 200, cy: 200, n: 10, L: 132, W: 66, shape: 'round', c1: '#FFFFFF', c2: '#E4D8F4', rot: 18, stroke: '#D8CDEA', sw: 2, sombra: true });
      s += '<defs>' + pet.defs + '</defs>' + pet.body;
      var rings = [[112, '#5B21B6', '#FFFFFF', 60], [86, '#7C3AED', '#EFE4FF', 52], [60, '#A78BFA', '#FFFFFF', 44]];
      for (var r = 0; r < rings.length; r++) {
        var R = rings[r][0], ca = rings[r][1], cb = rings[r][2], n = rings[r][3];
        for (var i = 0; i < n; i++) {
          var a = rad((360 / n) * i + r * 4);
          var x1 = 200 + Math.cos(a) * 26, y1 = 200 + Math.sin(a) * 26;
          var x2 = 200 + Math.cos(a) * R, y2 = 200 + Math.sin(a) * R;
          var mx = 200 + Math.cos(a) * R * .58, my = 200 + Math.sin(a) * R * .58;
          s += '<path d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + mx.toFixed(1) + ' ' + my.toFixed(1) + '" stroke="' + ca + '" stroke-width="2.6" stroke-linecap="round"/>';
          s += '<path d="M' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" stroke="' + cb + '" stroke-width="2.6" stroke-linecap="round"/>';
        }
      }
      s += '<circle cx="200" cy="200" r="27" fill="#F7F3E4" stroke="#CDBBA0" stroke-width="2"/>';
      for (var k = 0; k < 5; k++) {
        var aa = rad(72 * k + 90);
        var ax = 200 + Math.cos(aa) * 40, ay = 200 + Math.sin(aa) * 40;
        s += '<path d="M200 200 L' + ax.toFixed(1) + ' ' + ay.toFixed(1) + '" stroke="#B9D46B" stroke-width="4" stroke-linecap="round"/>' +
          '<ellipse cx="' + ax.toFixed(1) + '" cy="' + ay.toFixed(1) + '" rx="12" ry="6.5" transform="rotate(' + (72 * k + 90) + ' ' + ax.toFixed(1) + ' ' + ay.toFixed(1) + ')" fill="#E8C765" stroke="#C7A345" stroke-width="1.4"/>';
      }
      for (var t = 0; t < 3; t++) {
        var ta = rad(120 * t - 90);
        var tx = 200 + Math.cos(ta) * 26, ty = 200 + Math.sin(ta) * 26 - 8;
        s += '<path d="M200 196 Q ' + (200 + Math.cos(ta) * 14).toFixed(1) + ' ' + (188 + Math.sin(ta) * 10).toFixed(1) + ' ' + tx.toFixed(1) + ' ' + (ty - 10).toFixed(1) + '" stroke="#8FBF5A" stroke-width="4.6" fill="none" stroke-linecap="round"/>' +
          '<circle cx="' + tx.toFixed(1) + '" cy="' + (ty - 12).toFixed(1) + '" r="7" fill="#7FAE4B"/>';
      }
      s += '<circle cx="200" cy="192" r="13" fill="#9BC46A" stroke="#7FA84F" stroke-width="2"/>';
      return wrap(s);
    },

    morango: function () {
      var s = backdrop('#FFFFFF', '#F3F8EC');
      s += stem('M200 400 C 196 340, 210 300, 200 250', '#59A85F', 9);
      s += leaf(140, 340, 78, 40, -40, '#6FC177', '#3F8F4C');
      s += leaf(262, 348, 70, 36, 42, '#79CB80', '#489A55');
      /* calice verde bem visivel: e o que diferencia a flor do morangueiro */
      s += calice(200, 205, 10, 118, 34, '#77C47E', '#3E8C4C', 18);
      var p = corolla({ cx: 200, cy: 205, n: 5, L: 100, W: 96, shape: 'round', c1: '#FFFFFF', c2: '#EFEFE0', rot: -12, vein: '#E6DFCC', stroke: '#DDD5BE', sombra: true });
      s += '<defs>' + p.defs + '</defs>' + p.body;
      s += stamens(200, 205, 26, 44, '#EFD98A', '#F2C744');
      s += core(200, 205, 26, '#FFE27A', '#E8B93F');
      return wrap(s);
    },

    laranja: function () {
      var s = backdrop('#FFFFFF', '#FFF3DF');
      s += stem('M200 400 C 205 340, 190 300, 200 252', '#4E9151', 10);
      s += leaf(136, 322, 88, 40, -52, '#4FA45C', '#2F7440');
      s += leaf(268, 336, 80, 36, 50, '#5CB268', '#357C46');
      /* azahar: 5 petalas grossas e carnudas, bem separadas */
      var p = corolla({ cx: 200, cy: 200, n: 5, L: 112, W: 74, shape: 'round', c1: '#FFFFFF', c2: '#F3EEDC', rot: 18, stroke: '#E0D8C0', sw: 2, sombra: true });
      s += '<defs>' + p.defs + '</defs>' + p.body;
      s += stamens(200, 200, 26, 44, '#F4E4A6', '#F0BE31');
      s += core(200, 200, 20, '#F6E39A', '#D9A72E');
      s += '<circle cx="200" cy="200" r="9" fill="#B5D06A"/>';
      s += '<circle cx="112" cy="268" r="15" fill="#FFFDF4" stroke="#E4DCC4" stroke-width="2"/>';
      s += '<circle cx="292" cy="262" r="12" fill="#FFFDF4" stroke="#E4DCC4" stroke-width="2"/>';
      return wrap(s);
    },

    goiaba: function () {
      var s = backdrop('#FFFFFF', '#EFF7E6');
      s += stem('M200 400 C 198 340, 206 300, 200 246', '#4E9151', 9);
      s += leaf(132, 330, 86, 36, -48, '#57AA5F', '#31763C');
      s += leaf(272, 338, 80, 34, 46, '#63B96C', '#3A8747');
      /* petalas grandes atras + o chumaco de estames que e a marca da goiabeira */
      var p = corolla({ cx: 200, cy: 200, n: 5, L: 122, W: 104, shape: 'round', c1: '#FFFFFF', c2: '#EEEDDC', rot: 36, stroke: '#DFD9C2', sw: 2, sombra: true });
      s += '<defs>' + p.defs + '</defs>' + p.body;
      s += stamens(200, 200, 60, 66, '#FFFFFF', '#F5CE4A');
      s += stamens(200, 200, 32, 42, '#FBF6E6', '#EFC23C');
      s += core(200, 200, 15, '#F7F0D2', '#D9C77E');
      return wrap(s);
    },

    pitaya: function () {
      var s = backdrop('#FFF9FB', '#F6E6EF');
      s += '<path d="M92 400 C 96 320, 120 286, 150 268 L 168 288 C 140 306, 124 336, 122 400 Z" fill="#3E8B54"/>';
      s += '<path d="M104 400 C 108 330, 128 300, 154 282" stroke="#68B879" stroke-width="4" fill="none" opacity=".8"/>';
      var p1 = corolla({ cx: 200, cy: 198, n: 12, L: 148, W: 40, shape: 'pointed', c1: '#F2E4A9', c2: '#C9DE93', rot: 15 });
      s += '<defs>' + p1.defs + '</defs>' + p1.body;
      var p2 = corolla({ cx: 200, cy: 198, n: 14, L: 122, W: 54, shape: 'pointed', c1: '#FFFFFF', c2: '#F2EDDC', rot: 0, stroke: '#E2DCC6', sombra: true });
      s += '<defs>' + p2.defs + '</defs>' + p2.body;
      var p3 = corolla({ cx: 200, cy: 198, n: 9, L: 88, W: 46, shape: 'pointed', c1: '#FFFFFF', c2: '#FBF7EC', rot: 20 });
      s += '<defs>' + p3.defs + '</defs>' + p3.body;
      s += stamens(200, 198, 40, 58, '#F7EFC9', '#EFD469');
      s += '<path d="M200 198 L200 138" stroke="#E8DCA8" stroke-width="5"/>';
      for (var i = 0; i < 9; i++) {
        var a = rad(-90 + (i - 4) * 11);
        s += '<path d="M200 150 Q ' + (200 + Math.cos(a) * 16).toFixed(1) + ' ' + (198 + Math.sin(a) * 30).toFixed(1) + ' ' + (200 + Math.cos(a) * 34).toFixed(1) + ' ' + (150 + Math.sin(a) * 22).toFixed(1) + '" stroke="#DCCB84" stroke-width="3" fill="none" stroke-linecap="round"/>';
      }
      s += core(200, 198, 20, '#FBF3D8', '#DDCD8C');
      s += '<g opacity=".55" fill="#C9A7D6"><circle cx="330" cy="86" r="3"/><circle cx="358" cy="140" r="2.2"/><circle cx="70" cy="110" r="2.6"/><circle cx="44" cy="172" r="2"/></g>';
      return wrap(s);
    },

    /* mangueira: panicula alta e estreita, raque avermelhada, flores creme */
    manga: function () {
      return panicle({
        bg: '#F8F6E4', levels: 8, spread: 118, step: 30, flores: 4, tam: 6.6,
        raque: '#B0603F', petala1: '#FFFDF0', petala2: '#EFDFA8', miolo1: '#E8CE72', miolo2: '#C2A445',
        folhaX: 116, folhaL: 112, folhaW: 26, folhaA: 34, folha1: '#4E9A58', folha2: '#26663A'
      });
    },
    /* cajueiro: panicula baixa e larga, flores rosadas com um estame comprido */
    caju: function () {
      return panicle({
        bg: '#FBEFEC', levels: 5, spread: 142, step: 46, flores: 3, tam: 9.5,
        raque: '#8FB86A', petala1: '#FFF6F6', petala2: '#EEA9B4', miolo1: '#F7DDE0', miolo2: '#D98B9C',
        estameLongo: true, forma: 'strap', folhaX: 108, folhaL: 84, folhaW: 52, folhaA: 46,
        folha1: '#6BAE63', folha2: '#3B7C41'
      });
    },
    /* abacateiro: panicula aberta e rala, flores maiores verde-amareladas de 6 tepalas */
    abacate: function () {
      return panicle({
        bg: '#F1F5DE', levels: 4, spread: 150, step: 58, flores: 3, tam: 13,
        raque: '#7FA455', petala1: '#FBFDE0', petala2: '#CBD97E', miolo1: '#E7EFA8', miolo2: '#A9BB5F',
        petalas: 6, forma: 'pointed', folhaX: 104, folhaL: 96, folhaW: 58, folhaA: 52,
        folha1: '#3F7F49', folha2: '#20522C'
      });
    },
    cacau: function () { return cauliflory('cacau'); },
    jabuticaba: function () { return cauliflory('jabuticaba'); },

    /* videira: inflorescencia miuda e solta, com florzinhas abrindo
       (bem diferente do cacho de uvas maduro) */
    uva: function () {
      var s = backdrop('#FFFFFF', '#EFF3E4');
      s += '<path d="M330 96 C 300 108, 250 112, 216 118" stroke="#8A6A3A" stroke-width="11" fill="none" stroke-linecap="round"/>';
      s += tendril(322, 132, 1.15, '#8FB56A');
      s += leaf(112, 372, 128, 76, -26, '#7FB061', '#43722F');
      s += '<path d="M216 118 C 212 160, 208 210, 204 250" stroke="#9CBB6E" stroke-width="6" fill="none"/>';

      /* eixos laterais da inflorescencia */
      var eixos = [[146, 208, -46], [258, 214, 42], [166, 268, -34], [246, 276, 30], [206, 314, 4], [176, 160, -30], [242, 166, 26]];
      for (var a = 0; a < eixos.length; a++) {
        s += '<path d="M' + (204 + (eixos[a][1] - 250) * .08).toFixed(0) + ' ' + (eixos[a][1] - 34) +
          ' Q ' + ((200 + eixos[a][0]) / 2).toFixed(0) + ' ' + (eixos[a][1] - 18) + ' ' + eixos[a][0] + ' ' + eixos[a][1] +
          '" stroke="#A6C377" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
      }

      /* botoes fechados (a maioria) + algumas flores abertas com estames */
      var pontos = [];
      var linhas = [[152, 5], [178, 7], [206, 8], [234, 8], [262, 7], [290, 6], [316, 4]];
      for (var r = 0; r < linhas.length; r++) {
        var y = linhas[r][0], n = linhas[r][1];
        for (var i = 0; i < n; i++) {
          var esp = 15 + r * 1.4;
          var x = 202 + (i - (n - 1) / 2) * esp + (((i * 31 + r * 17) % 7) - 3);
          pontos.push([x, y + ((i * 13) % 6), (i + r) % 4 === 0]);
        }
      }
      for (var k = 0; k < pontos.length; k++) {
        var px = pontos[k][0], py = pontos[k][1], aberta = pontos[k][2];
        if (aberta) {
          s += stamens(px, py, 5, 11, '#DDE9AE', '#EFD873');
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4.4" fill="#EAF3CB" stroke="#B3C97F" stroke-width="1.2"/>';
        } else {
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="6.2" fill="#BFD388" stroke="#94AE62" stroke-width="1.4"/>';
          s += '<circle cx="' + (px - 1.8).toFixed(1) + '" cy="' + (py - 1.8).toFixed(1) + '" r="1.8" fill="#E4EEC0"/>';
        }
      }
      return wrap(s);
    },

    banana: function () {
      var s = backdrop('#FFFFFF', '#F6EFE0');
      s += '<path d="M196 40 C 200 120, 202 180, 200 230" stroke="#5C8F4A" stroke-width="16" fill="none" stroke-linecap="round"/>';
      for (var k = 0; k < 2; k++) {
        var yy = 118 + k * 40;
        for (var i = 0; i < 6; i++) {
          var x = 152 + i * 16;
          s += '<path d="M' + x + ' ' + yy + ' q 10 -20 26 -16" stroke="#CFE07A" stroke-width="9" fill="none" stroke-linecap="round"/>';
        }
      }
      s += '<path d="M200 226 C 130 232, 108 268, 132 296 C 156 322, 196 300, 204 262 Z" fill="#8E2C4E" opacity=".95"/>';
      s += '<path d="M200 226 C 270 232, 292 268, 268 296 C 244 322, 204 300, 196 262 Z" fill="#A63A5E"/>';
      for (var f = 0; f < 7; f++) {
        var fx = 166 + f * 12, fy = 258 + ((f % 3) * 5);
        s += '<path d="M' + fx + ' ' + fy + ' q 8 -14 20 -10" stroke="#F7E9BE" stroke-width="7" fill="none" stroke-linecap="round"/>';
      }
      var id = nid('bn');
      s += '<defs>' + linGrad(id, '#B8446A', '#6E1F3C', 70) + '</defs>';
      s += '<path d="M200 268 C 258 276, 282 330, 248 372 C 224 400, 176 400, 152 372 C 118 330, 142 276, 200 268 Z" fill="url(#' + id + ')"/>';
      s += '<path d="M200 276 C 214 314, 214 352, 200 382" stroke="rgba(255,255,255,.25)" stroke-width="4" fill="none"/>';
      s += '<path d="M200 276 C 186 314, 186 352, 200 382" stroke="rgba(0,0,0,.18)" stroke-width="4" fill="none"/>';
      return wrap(s);
    },

    abacaxi: function () {
      var s = backdrop('#FFFFFF', '#F2F6E4');
      var i, a, r, c;
      for (i = 0; i < 14; i++) {
        a = -90 + (i - 6.5) * 26;
        s += '<g transform="translate(200,320) rotate(' + a + ')"><path d="M0 0 C 16 -60, 12 -130, 0 -178 C -12 -130, -16 -60, 0 0 Z" fill="' + (i % 2 ? '#4E9A56' : '#5FAE66') + '" stroke="rgba(0,0,0,.08)" stroke-width="1.4"/></g>';
      }
      var id = nid('ab');
      s += '<defs>' + linGrad(id, '#8FBF52', '#5E8F36', 80) + '</defs>';
      s += '<ellipse cx="200" cy="228" rx="62" ry="76" fill="url(#' + id + ')"/>';
      for (r = 0; r < 5; r++) {
        for (c = 0; c < 5; c++) {
          var x = 152 + c * 24 + (r % 2 ? 12 : 0), y = 172 + r * 26;
          if (Math.abs(x - 200) > 52) continue;
          s += '<path d="M' + x + ' ' + (y - 11) + ' L' + (x + 12) + ' ' + y + ' L' + x + ' ' + (y + 11) + ' L' + (x - 12) + ' ' + y + ' Z" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.8"/>';
          if (r < 3) s += '<path d="M' + x + ' ' + y + ' q 6 -8 14 -6" stroke="#9B6FD1" stroke-width="6" fill="none" stroke-linecap="round"/>';
        }
      }
      for (i = 0; i < 9; i++) {
        a = -90 + (i - 4) * 17;
        s += '<g transform="translate(200,156) rotate(' + a + ')"><path d="M0 0 C 9 -30, 7 -58, 0 -76 C -7 -58, -9 -30, 0 0 Z" fill="#63B36B"/></g>';
      }
      return wrap(s);
    },

    mamao: function () {
      var s = backdrop('#FFFFFF', '#FFF4E2');
      s += '<path d="M172 400 L172 60 L214 60 L214 400 Z" fill="#8A9E74"/>';
      s += '<path d="M172 400 L172 60 L188 60 L188 400 Z" fill="#9DB185"/>';
      for (var m = 0; m < 5; m++) s += '<path d="M172 ' + (110 + m * 62) + ' q 21 8 42 0" stroke="rgba(0,0,0,.12)" stroke-width="3" fill="none"/>';
      s += leaf(150, 120, 96, 54, -62, '#54A05C', '#2F7440');
      s += leaf(236, 108, 96, 54, 62, '#5CAC64', '#357C46');
      var pos = [[128, 210, 1], [268, 236, .92], [248, 168, .78], [136, 288, .8]];
      for (var i = 0; i < pos.length; i++) {
        var x = pos[i][0], y = pos[i][1], sc = pos[i][2];
        s += '<path d="M' + (x < 200 ? 176 : 210) + ' ' + (y - 18) + ' Q ' + ((x + 200) / 2) + ' ' + (y - 26) + ' ' + x + ' ' + y + '" stroke="#7FA867" stroke-width="4" fill="none"/>';
        s += '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">';
        var p = corolla({ cx: 0, cy: 0, n: 5, L: 40, W: 22, shape: 'strap', c1: '#FFFBE9', c2: '#EFE2B2', rot: 12, stroke: '#DFD5B0', sombra: true });
        s += '<defs>' + p.defs + '</defs>' + p.body;
        s += '<circle cx="0" cy="0" r="9" fill="#F6E9A8" stroke="#DCC97E" stroke-width="1.6"/></g>';
      }
      return wrap(s);
    },

    cafe: function () {
      var s = backdrop('#FFFFFF', '#F1F6EA');
      s += '<path d="M200 400 L200 70" stroke="#6E8F55" stroke-width="12" stroke-linecap="round"/>';
      s += '<path d="M200 250 L108 214 M200 250 L292 214 M200 320 L120 296 M200 320 L280 296" stroke="#7BA05F" stroke-width="8" stroke-linecap="round"/>';
      s += leaf(96, 226, 72, 34, -78, '#4E9A58', '#2E7440');
      s += leaf(304, 226, 72, 34, 78, '#57A660', '#347C46');
      s += leaf(110, 306, 62, 30, -80, '#54A25C', '#2F7A42');
      s += leaf(290, 306, 62, 30, 80, '#5CAC64', '#357C46');
      var spots = [[200, 176, 1], [156, 216, .8], [246, 214, .82], [200, 250, .74], [160, 300, .7], [244, 300, .72]];
      for (var i = 0; i < spots.length; i++) {
        var x = spots[i][0], y = spots[i][1], sc = spots[i][2];
        s += '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">';
        var p = corolla({ cx: 0, cy: 0, n: 5, L: 46, W: 26, shape: 'strap', c1: '#FFFFFF', c2: '#F0EEDE', rot: (i * 23), stroke: '#E1DCC7', sombra: true });
        s += '<defs>' + p.defs + '</defs>' + p.body;
        s += stamens(0, 0, 5, 20, '#EFE7C8', '#E9D98E');
        s += '<circle cx="0" cy="0" r="8" fill="#FBF6DF" stroke="#DED3AC" stroke-width="1.4"/></g>';
      }
      return wrap(s);
    },

    melancia: function () {
      var s = backdrop('#FFFFFF', '#F0F7E8');
      s += stem('M40 392 C 120 372, 176 330, 200 264', '#5DA85F', 9);
      s += tendril(120, 336, 1.1, '#63B06B');
      s += leaf(96, 356, 84, 52, -30, '#5FB169', '#38834A');
      s += leaf(300, 342, 76, 48, 34, '#6ABD73', '#3F8F51');
      s += '<ellipse cx="200" cy="288" rx="30" ry="24" fill="#8FC15F" stroke="#6EA345" stroke-width="2"/>';
      var p = corolla({ cx: 200, cy: 196, n: 5, L: 104, W: 100, shape: 'round', c1: '#FFE071', c2: '#F0B72F', rot: -8, vein: '#E4A92A' });
      s += '<defs>' + p.defs + '</defs>' + p.body;
      s += core(200, 196, 30, '#FFD65E', '#D98F16');
      s += stamens(200, 196, 12, 26, '#E8A81F', '#C97F0E');
      return wrap(s);
    },

    roma: function () {
      var s = backdrop('#FFFFFF', '#FBEDE7');
      s += stem('M200 400 C 194 340, 210 306, 200 268', '#5B8F4E', 9);
      s += leaf(128, 322, 74, 28, -56, '#5EA85F', '#377A42');
      s += leaf(276, 330, 68, 26, 54, '#69B46A', '#3F8748');
      var id = nid('rm');
      s += '<defs>' + linGrad(id, '#E4623F', '#B33322', 70) + '</defs>';
      s += '<path d="M200 300 C 168 296, 158 258, 172 232 L 228 232 C 242 258, 232 296, 200 300 Z" fill="url(#' + id + ')"/>';
      for (var i = 0; i < 6; i++) {
        var a = -90 + (i - 2.5) * 24;
        s += '<g transform="translate(200,232) rotate(' + a + ')"><path d="M0 0 L10 -34 L-10 -34 Z" fill="#C43A24"/></g>';
      }
      var p = corolla({ cx: 200, cy: 214, n: 6, L: 92, W: 62, shape: 'notch', c1: '#FF7A55', c2: '#D0341F', rot: 10, vein: '#B92D1B' });
      s += '<defs>' + p.defs + '</defs>' + p.body;
      s += stamens(200, 214, 30, 44, '#F6C9B0', '#F2D06A');
      s += core(200, 214, 16, '#F5B49A', '#C7472C');
      return wrap(s);
    }
  };

  /* ============================================================
     FRUTOS
     ============================================================ */
  function shine(cx, cy, rx, ry, rot) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + (rot || -25) + ' ' + cx + ' ' + cy + ')" fill="rgba(255,255,255,.42)"/>';
  }
  function ball(cx, cy, r, c1, c2) {
    var id = nid('f');
    return '<defs>' + radGrad(id, c1, c2) + '</defs><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#' + id + ')"/>' +
      shine(cx - r * .34, cy - r * .38, r * .26, r * .16);
  }

  var FRUITS = {
    maracuja: function () {
      var s = backdrop('#FFFFFF', '#F4EFE0');
      s += ball(196, 216, 116, '#F5D65C', '#C98E22');
      s += '<g opacity=".22" fill="#8A5F14"><circle cx="150" cy="180" r="4"/><circle cx="238" cy="164" r="3.4"/><circle cx="266" cy="248" r="4.2"/><circle cx="152" cy="286" r="3.6"/><circle cx="206" cy="300" r="3"/></g>';
      s += '<path d="M196 100 C 200 82, 214 70, 236 68" stroke="#5C9B4E" stroke-width="8" fill="none" stroke-linecap="round"/>';
      s += tendril(258, 74, .8, '#6BB05C');
      return wrap(s);
    },
    morango: function () {
      var s = backdrop('#FFFFFF', '#FBEAEA');
      var id = nid('mg');
      s += '<defs>' + linGrad(id, '#F0424C', '#B0121F', 70) + '</defs>';
      s += '<path d="M200 130 C 292 130, 312 216, 268 286 C 244 324, 214 348, 200 358 C 186 348, 156 324, 132 286 C 88 216, 108 130, 200 130 Z" fill="url(#' + id + ')"/>';
      for (var r = 0; r < 7; r++) for (var c = 0; c < 6; c++) {
        var x = 148 + c * 21 + (r % 2 ? 10 : 0), y = 158 + r * 27;
        if (Math.abs(x - 200) / (96 - r * 9) > 1) continue;
        s += '<ellipse cx="' + x + '" cy="' + y + '" rx="4.6" ry="6.4" fill="#FBE49A" stroke="#C79A2E" stroke-width="1"/>';
      }
      s += shine(158, 178, 22, 12, -40);
      for (var i = 0; i < 7; i++) {
        var a = -90 + (i - 3) * 27;
        s += '<g transform="translate(200,136) rotate(' + a + ')"><path d="M0 0 C 12 -26, 8 -48, 0 -58 C -8 -48, -12 -26, 0 0 Z" fill="#3F9450"/></g>';
      }
      s += '<path d="M200 120 L200 78" stroke="#4E9A58" stroke-width="8" stroke-linecap="round"/>';
      return wrap(s);
    },
    laranja: function () {
      var s = backdrop('#FFFFFF', '#FFEFD6');
      s += ball(200, 224, 118, '#FFB13C', '#E0740E');
      s += '<g opacity=".18" fill="#8A3E00">';
      for (var i = 0; i < 40; i++) {
        var a = rad(i * 47), r = 24 + ((i * 29) % 92);
        s += '<circle cx="' + (200 + Math.cos(a) * r).toFixed(1) + '" cy="' + (224 + Math.sin(a) * r).toFixed(1) + '" r="2.6"/>';
      }
      s += '</g>';
      s += '<circle cx="200" cy="112" r="9" fill="#8C6239"/>';
      s += leaf(226, 108, 66, 28, 44, '#4E9A58', '#2E7440');
      return wrap(s);
    },
    goiaba: function () {
      var s = backdrop('#FFFFFF', '#EFF6E4');
      var id = nid('gv');
      s += '<defs>' + radGrad(id, '#D8E86A', '#9BB53A') + '</defs>';
      s += '<ellipse cx="164" cy="228" rx="98" ry="112" fill="url(#' + id + ')"/>';
      s += shine(126, 176, 24, 13, -35);
      s += '<path d="M164 118 L164 84" stroke="#6E8F45" stroke-width="7" stroke-linecap="round"/>';
      for (var i = 0; i < 5; i++) {
        var a = -90 + (i - 2) * 30;
        s += '<g transform="translate(164,120) rotate(' + a + ')"><path d="M0 0 L9 -22 L-9 -22 Z" fill="#7FA24E"/></g>';
      }
      s += '<path d="M300 130 A 104 104 0 0 1 300 330 Z" fill="#F3EBD2"/>';
      s += '<path d="M300 152 A 84 84 0 0 1 300 308 Z" fill="#F09A9A"/>';
      s += '<g fill="#E0C98A">';
      for (var k = 0; k < 12; k++) {
        var aa = rad(-70 + k * 12), rr = 30 + ((k * 17) % 34);
        s += '<circle cx="' + (302 + Math.cos(aa) * rr * .55).toFixed(1) + '" cy="' + (230 + Math.sin(aa) * rr).toFixed(1) + '" r="5"/>';
      }
      s += '</g>';
      return wrap(s);
    },
    pitaya: function () {
      var s = backdrop('#FFFFFF', '#FBE9F1');
      var id = nid('pt');
      s += '<defs>' + linGrad(id, '#F45C9B', '#C01F63', 70) + '</defs>';
      s += '<ellipse cx="200" cy="228" rx="94" ry="112" fill="url(#' + id + ')"/>';
      var br = [[112, 168, -52], [288, 176, 52], [122, 262, -104], [280, 268, 104], [200, 122, 0], [166, 336, -152], [238, 338, 152]];
      for (var i = 0; i < br.length; i++) {
        s += '<g transform="translate(' + br[i][0] + ',' + br[i][1] + ') rotate(' + br[i][2] + ')"><path d="M0 0 C 22 -18, 34 -44, 26 -66 C 8 -52, -10 -28, 0 0 Z" fill="#7DC26A" stroke="#5AA24C" stroke-width="2"/></g>';
      }
      s += shine(164, 176, 22, 12, -35);
      return wrap(s);
    },
    manga: function () {
      var s = backdrop('#FFFFFF', '#FFF3DE');
      var id = nid('mn');
      s += '<defs>' + linGrad(id, '#F6C534', '#E2452C', 40) + '</defs>';
      s += '<path d="M262 116 C 322 156, 330 262, 268 318 C 208 372, 118 344, 100 274 C 84 208, 140 130, 208 112 C 228 106, 246 106, 262 116 Z" fill="url(#' + id + ')"/>';
      s += shine(160, 178, 30, 15, -30);
      s += '<path d="M258 116 L268 78" stroke="#6E8F45" stroke-width="8" stroke-linecap="round"/>';
      s += leaf(292, 84, 66, 26, 52, '#4E9A58', '#2E7440');
      return wrap(s);
    },
    banana: function () {
      var s = backdrop('#FFFFFF', '#FFF8DE');
      var id = nid('bnf');
      s += '<defs>' + linGrad(id, '#FFE066', '#E8A81C', 80) + '</defs>';
      var bands = [[0, 0, 1], [-14, 34, .96], [-24, 68, .92]];
      for (var i = 0; i < bands.length; i++) {
        var dx = bands[i][0], dy = bands[i][1], sc = bands[i][2];
        s += '<g transform="translate(' + (200 + dx) + ',' + (170 + dy) + ') scale(' + sc + ')">' +
          '<path d="M-118 -40 C -60 60, 60 84, 118 6 L 108 -18 C 56 44, -44 26, -100 -54 Z" fill="url(#' + id + ')" stroke="#C98F14" stroke-width="2.4"/>' +
          '<path d="M-112 -46 C -56 46, 48 66, 106 -14" stroke="rgba(255,255,255,.5)" stroke-width="5" fill="none"/>' +
          '<path d="M118 6 l 14 -6" stroke="#7A5A22" stroke-width="8" stroke-linecap="round"/></g>';
      }
      s += '<path d="M84 116 q -18 -10 -26 -30" stroke="#7A5A22" stroke-width="12" fill="none" stroke-linecap="round"/>';
      return wrap(s);
    },
    abacaxi: function () {
      var s = backdrop('#FFFFFF', '#FBF3D9');
      var i, a, r, c;
      for (i = 0; i < 11; i++) {
        a = -90 + (i - 5) * 15;
        s += '<g transform="translate(200,190) rotate(' + a + ')"><path d="M0 0 C 12 -46, 9 -92, 0 -118 C -9 -92, -12 -46, 0 0 Z" fill="' + (i % 2 ? '#4E9A56' : '#63B36B') + '"/></g>';
      }
      var id = nid('abf');
      s += '<defs>' + linGrad(id, '#F5CE4F', '#B8801A', 80) + '</defs>';
      s += '<ellipse cx="200" cy="268" rx="86" ry="104" fill="url(#' + id + ')"/>';
      for (r = 0; r < 7; r++) for (c = 0; c < 7; c++) {
        var x = 134 + c * 22 + (r % 2 ? 11 : 0), y = 184 + r * 28;
        if (Math.pow((x - 200) / 84, 2) + Math.pow((y - 268) / 100, 2) > .92) continue;
        s += '<path d="M' + x + ' ' + (y - 12) + ' L' + (x + 12) + ' ' + y + ' L' + x + ' ' + (y + 12) + ' L' + (x - 12) + ' ' + y + ' Z" fill="none" stroke="rgba(120,72,0,.42)" stroke-width="2"/>';
        s += '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="rgba(120,72,0,.35)"/>';
      }
      return wrap(s);
    },
    mamao: function () {
      var s = backdrop('#FFFFFF', '#FFF0E0');
      var id = nid('mm');
      s += '<defs>' + linGrad(id, '#FFD770', '#E9902A', 70) + '</defs>';
      s += '<path d="M148 96 C 208 84, 244 136, 244 214 C 244 300, 210 356, 168 356 C 126 356, 96 300, 96 214 C 96 146, 118 102, 148 96 Z" fill="url(#' + id + ')"/>';
      s += shine(128, 154, 20, 11, -30);
      s += '<path d="M162 92 L168 62" stroke="#6E8F45" stroke-width="7" stroke-linecap="round"/>';
      s += '<path d="M296 128 C 336 152, 348 232, 320 300 C 306 334, 288 348, 276 342 L 276 134 Z" fill="#F07A2E"/>';
      s += '<ellipse cx="312" cy="236" rx="26" ry="66" fill="#F7C39A"/>';
      s += '<g fill="#3B2A22">';
      for (var k = 0; k < 12; k++) {
        s += '<circle cx="' + (312 + ((k % 3) - 1) * 12) + '" cy="' + (180 + k * 9.5) + '" r="4.6"/>';
      }
      s += '</g>';
      return wrap(s);
    },
    cafe: function () {
      var s = backdrop('#FFFFFF', '#F6EFE4');
      s += '<path d="M200 380 L200 150" stroke="#6E8F55" stroke-width="11" stroke-linecap="round"/>';
      s += leaf(112, 200, 84, 38, -74, '#4E9A58', '#2E7440');
      s += leaf(290, 236, 80, 36, 76, '#57A660', '#347C46');
      var pos = [[168, 178], [232, 196], [160, 246], [242, 262], [176, 306], [236, 326], [202, 150]];
      for (var i = 0; i < pos.length; i++) {
        s += ball(pos[i][0], pos[i][1], 27, '#EF5A4A', '#A81A1C');
        s += '<path d="M' + pos[i][0] + ' ' + (pos[i][1] - 4) + ' l 0 8" stroke="rgba(0,0,0,.25)" stroke-width="2"/>';
      }
      return wrap(s);
    },
    cacau: function () {
      var s = backdrop('#FFFFFF', '#F7EBE0');
      var id = nid('cc');
      s += '<defs>' + linGrad(id, '#F0A93C', '#B24A1E', 60) + '</defs>';
      s += '<path d="M176 76 C 250 92, 288 190, 268 280 C 252 348, 208 372, 176 356 C 132 334, 112 236, 128 158 C 138 106, 156 72, 176 76 Z" fill="url(#' + id + ')"/>';
      for (var i = -2; i <= 2; i++) {
        s += '<path d="M' + (196 + i * 26) + ' 92 C ' + (206 + i * 30) + ' 190, ' + (200 + i * 28) + ' 300, ' + (186 + i * 22) + ' 352" stroke="rgba(120,50,10,.35)" stroke-width="4" fill="none"/>';
      }
      s += '<path d="M176 74 L184 44" stroke="#7A5A2A" stroke-width="8" stroke-linecap="round"/>';
      s += '<path d="M292 150 C 330 186, 336 268, 306 316 C 292 338, 280 340, 276 326 L 280 160 Z" fill="#F6EAD2"/>';
      for (var k = 0; k < 5; k++) {
        s += '<ellipse cx="' + (302 + ((k % 2) * 10)) + '" cy="' + (186 + k * 28) + '" rx="12" ry="15" fill="#EBD9B4" stroke="#C7AE7E" stroke-width="1.6"/>';
      }
      return wrap(s);
    },
    jabuticaba: function () {
      var s = backdrop('#FFFFFF', '#F0EEE8');
      var id = nid('jb');
      s += '<defs>' + linGrad(id, '#9C7A55', '#6B4E33', 0) + '</defs>';
      s += '<path d="M150 400 C 154 300, 146 200, 154 40 L 248 40 C 256 200, 248 300, 252 400 Z" fill="url(#' + id + ')"/>';
      s += leaf(120, 140, 84, 32, -74, '#4E9A58', '#2E7440');
      s += leaf(280, 190, 80, 30, 76, '#57A660', '#347C46');
      var pos = [[152, 110, 26], [250, 152, 24], [146, 200, 27], [254, 250, 25], [154, 288, 23], [248, 336, 26], [200, 70, 20], [200, 372, 22]];
      for (var i = 0; i < pos.length; i++) {
        s += ball(pos[i][0], pos[i][1], pos[i][2], '#6B3B7A', '#241028');
      }
      return wrap(s);
    },
    caju: function () {
      var s = backdrop('#FFFFFF', '#FFF1E2');
      var id = nid('cj');
      s += '<defs>' + linGrad(id, '#FFC93C', '#EF5F22', 70) + '</defs>';
      s += '<path d="M200 96 C 268 96, 296 156, 288 216 C 280 282, 244 322, 200 322 C 156 322, 120 282, 112 216 C 104 156, 132 96, 200 96 Z" fill="url(#' + id + ')"/>';
      s += shine(160, 150, 24, 13, -32);
      s += '<path d="M200 92 L200 62" stroke="#6E8F45" stroke-width="7" stroke-linecap="round"/>';
      s += '<path d="M200 318 C 246 318, 274 344, 262 372 C 250 396, 202 396, 178 380 C 158 366, 164 322, 200 318 Z" fill="#7E8B5E" stroke="#5F6B45" stroke-width="2.4"/>';
      return wrap(s);
    },
    melancia: function () {
      var s = backdrop('#FFFFFF', '#EDF6E6');
      var id = nid('ml');
      s += '<defs>' + radGrad(id, '#5FBF5C', '#1F6B36') + '</defs>';
      s += '<ellipse cx="196" cy="230" rx="126" ry="106" fill="url(#' + id + ')"/>';
      for (var i = -3; i <= 3; i++) {
        var h = Math.sqrt(Math.max(0, 1 - Math.pow(i * 34 / 126, 2))) * 106;
        s += '<path d="M' + (196 + i * 34) + ' ' + (230 - h).toFixed(1) + ' Q ' + (196 + i * 46) + ' 230 ' + (196 + i * 34) + ' ' + (230 + h).toFixed(1) +
          '" stroke="rgba(12,60,26,.55)" stroke-width="13" fill="none" stroke-linecap="round"/>';
      }
      s += shine(148, 176, 28, 14, -30);
      s += '<path d="M196 124 q 16 -26 44 -30" stroke="#5C8F3E" stroke-width="8" fill="none" stroke-linecap="round"/>';
      return wrap(s);
    },
    uva: function () {
      var s = backdrop('#FFFFFF', '#F1EBF6');
      s += '<path d="M200 96 L200 132" stroke="#7A5A2A" stroke-width="9" stroke-linecap="round"/>';
      s += leaf(140, 120, 78, 46, -50, '#5FA85F', '#37773F');
      var rows = [[150, 4], [188, 5], [226, 4], [262, 3], [296, 2], [326, 1]];
      for (var r = 0; r < rows.length; r++) {
        var y = rows[r][0], n = rows[r][1];
        for (var i = 0; i < n; i++) {
          s += ball(200 + (i - (n - 1) / 2) * 42, y, 24, '#8E6BC4', '#3D2160');
        }
      }
      return wrap(s);
    },
    roma: function () {
      var s = backdrop('#FFFFFF', '#FBEBE6');
      for (var i = 0; i < 6; i++) {
        var a = -90 + (i - 2.5) * 22;
        s += '<g transform="translate(190,126) rotate(' + a + ')"><path d="M0 0 L11 -38 L-11 -38 Z" fill="#B33322"/></g>';
      }
      s += ball(190, 234, 112, '#E85A3A', '#9E1D18');
      s += '<path d="M296 152 A 104 104 0 0 1 296 316 Z" fill="#F7E7D6"/>';
      s += '<g fill="#D31F3A">';
      for (var k = 0; k < 16; k++) {
        var aa = rad(-64 + k * 8.4), rr = 30 + ((k * 23) % 40);
        s += '<circle cx="' + (300 + Math.cos(aa) * rr * .5).toFixed(1) + '" cy="' + (234 + Math.sin(aa) * rr).toFixed(1) + '" r="7"/>';
      }
      s += '</g>';
      return wrap(s);
    },
    abacate: function () {
      var s = backdrop('#FFFFFF', '#EFF4E0');
      var id = nid('av');
      s += '<defs>' + linGrad(id, '#7FB23F', '#3C6B22', 70) + '</defs>';
      s += '<path d="M176 84 C 214 84, 232 128, 228 168 C 224 208, 268 232, 268 286 C 268 340, 226 372, 178 372 C 130 372, 90 340, 90 286 C 90 232, 130 208, 126 168 C 122 128, 138 84, 176 84 Z" fill="url(#' + id + ')"/>';
      s += shine(140, 148, 18, 10, -30);
      s += '<path d="M300 160 C 340 196, 344 322, 300 352 C 280 366, 268 352, 268 300 L 272 176 Z" fill="#E8EFA8"/>';
      s += ball(304, 268, 42, '#B98A50', '#7A5326');
      return wrap(s);
    }
  };

  return {
    flower: function (id) { return (FLOWERS[id] || FLOWERS.morango)(); },
    fruit: function (id) { return (FRUITS[id] || FRUITS.morango)(); },
    hasFlower: function (id) { return !!FLOWERS[id]; },
    hasFruit: function (id) { return !!FRUITS[id]; },
    listFlowers: function () { return Object.keys(FLOWERS); },
    listFruits: function () { return Object.keys(FRUITS); }
  };
})();
