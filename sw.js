/* =========================================================
   Service worker - faz o jogo funcionar sem internet.

   Estrategia, pensada para atualizar sozinho:

   - Paginas, JS, CSS e manifest: REDE PRIMEIRO, cache como reserva.
     Assim, todo deploy novo entra no ar assim que o tablet tem internet,
     sem ninguem precisar lembrar de trocar numero de versao aqui.
     Sem internet, o jogo abre com a ultima versao guardada.

   - Fotos e icones: CACHE PRIMEIRO. Elas nunca mudam de conteudo, entao
     carregam na hora e nao gastam dados. Nao entram no precache de
     proposito (sao ~4 MB): vao sendo guardadas conforme aparecem, e o
     botao "Guardar fotos no tablet" (Modo feira) baixa todas de uma vez.
   ========================================================= */

var CACHE = 'que-fruto-v4';

var SHELL = [
  './',
  './index.html',
  './css/style.css',
  './js/art.js',
  './js/creditos.js',
  './js/midia.js',
  './js/data.js',
  './js/audio.js',
  './js/app.js',
  './assets/icone.svg',
  './assets/icone-mascara.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function guardar(req, res) {
  if (res && res.ok && res.type === 'basic') {
    var copia = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copia); }).catch(function () {});
  }
  return res;
}

function redePrimeiro(req, reserva) {
  return fetch(req)
    .then(function (res) { return guardar(req, res); })
    .catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || (reserva ? caches.match(reserva) : Response.error());
      });
    });
}

function cachePrimeiro(req) {
  return caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (res) { return guardar(req, res); });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  /* fontes do Google e qualquer outro dominio: deixa passar direto.
     Sem internet elas falham e o jogo usa a fonte do sistema. */
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(redePrimeiro(req, './index.html'));
    return;
  }

  if (/\.(?:js|css|html|webmanifest|json)$/.test(url.pathname)) {
    e.respondWith(redePrimeiro(req));
    return;
  }

  e.respondWith(cachePrimeiro(req));
});
