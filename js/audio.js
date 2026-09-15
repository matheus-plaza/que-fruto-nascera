/* =========================================================
   audio.js - Efeitos sonoros sintetizados (Web Audio API).
   Zero arquivos de audio: tudo gerado na hora.
   ========================================================= */
window.Sfx = (function () {
  'use strict';

  var ctx = null, ligado = true, master = null;

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.28;
    master.connect(ctx.destination);
    return ctx;
  }

  /* iOS/Android so liberam audio depois de um toque */
  function destravar() {
    var c = ensure();
    if (c && c.state === 'suspended') c.resume();
  }

  function tom(freq, t0, dur, tipo, vol, slideTo) {
    var c = ensure();
    if (!c || !ligado) return;
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = tipo || 'sine';
    osc.frequency.setValueAtTime(freq, c.currentTime + t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + t0 + dur);
    g.gain.setValueAtTime(0.0001, c.currentTime + t0);
    g.gain.exponentialRampToValueAtTime(vol == null ? 0.5 : vol, c.currentTime + t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + dur);
    osc.connect(g); g.connect(master);
    osc.start(c.currentTime + t0);
    osc.stop(c.currentTime + t0 + dur + 0.05);
  }

  function ruido(t0, dur, vol) {
    var c = ensure();
    if (!c || !ligado) return;
    var n = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, n, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.2);
    var src = c.createBufferSource(); src.buffer = buf;
    var f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 0.8;
    var g = c.createGain(); g.gain.value = vol == null ? 0.25 : vol;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(c.currentTime + t0);
  }

  var API = {
    destravar: destravar,
    set ligado(v) { ligado = !!v; },
    get ligado() { return ligado; },

    toque: function () { tom(520, 0, 0.07, 'sine', 0.25); },

    acerto: function () {
      tom(523.25, 0, 0.16, 'triangle', 0.5);
      tom(659.25, 0.09, 0.16, 'triangle', 0.5);
      tom(783.99, 0.18, 0.30, 'triangle', 0.55);
      tom(1046.5, 0.27, 0.34, 'sine', 0.35);
    },

    erro: function () {
      tom(240, 0, 0.20, 'sawtooth', 0.22, 150);
      tom(180, 0.10, 0.26, 'sine', 0.20, 120);
    },

    pista: function () {
      tom(880, 0, 0.10, 'sine', 0.28);
      tom(1174, 0.07, 0.14, 'sine', 0.22);
      ruido(0, 0.16, 0.10);
    },

    revelar: function () {
      tom(400, 0, 0.14, 'sine', 0.20, 900);
      ruido(0, 0.20, 0.12);
    },

    subirNivel: function () {
      var esc = [392, 493.88, 587.33, 783.99];
      for (var i = 0; i < esc.length; i++) tom(esc[i], i * 0.10, 0.26, 'triangle', 0.45);
    },

    vitoria: function () {
      var m = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
      for (var i = 0; i < m.length; i++) tom(m[i], i * 0.13, 0.42, 'triangle', 0.5);
      ruido(0.9, 0.5, 0.08);
    },

    tique: function () { tom(1200, 0, 0.035, 'square', 0.10); }
  };

  return API;
})();

/* vibracao curta em tablets/celulares */
window.vibrar = function (p) {
  if (navigator.vibrate) { try { navigator.vibrate(p); } catch (e) { } }
};
