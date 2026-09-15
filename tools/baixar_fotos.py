# -*- coding: utf-8 -*-
"""
Baixa fotos de flores e frutos do Wikimedia Commons.

Aceita apenas licencas livres (dominio publico, CC0, CC BY, CC BY-SA) e grava
assets/fotos/creditos.json com autor/licenca/link para dar credito no jogo.

A busca por relevancia sozinha erra muito (devolve foto de fruto quando pedimos
flor). Por isso filtramos pelo TITULO do arquivo, que no Commons e descritivo:
  flor  ->  intitle:flower  -intitle:fruit
  fruto ->  intitle:fruit   -intitle:flower
Se nao achar nada com o filtro estrito, cai para a busca solta.

Uso:  python tools/baixar_fotos.py                 (baixa o que falta)
      python tools/baixar_fotos.py --forcar         (rebaixa tudo)
      python tools/baixar_fotos.py --so morango,uva (so essas especies)
"""
import io, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request

UA = 'JogoFruticulturaEscolar/1.0 (jogo educativo escolar)'
DEST = os.path.join('assets', 'fotos')
MANIFESTO = os.path.join(DEST, 'creditos.json')
LARGURA = 900

LICENCAS_OK = ('cc0', 'public domain', 'pd-', 'cc by', 'cc-by', 'attribution')
LICENCAS_NAO = ('nc', 'nd', 'fair use', 'non-free')

# id -> (nome cientifico, palavra extra para o fruto)
ESPECIES = [
    ('maracuja',   'Passiflora edulis',    'passionfruit'),
    ('morango',    'Fragaria',             'strawberry'),
    ('laranja',    'Citrus sinensis',      'orange'),
    ('goiaba',     'Psidium guajava',      'guava'),
    ('pitaya',     'Hylocereus',           'pitaya'),
    ('manga',      'Mangifera indica',     'mango'),
    ('banana',     'Musa',                 'banana'),
    ('abacaxi',    'Ananas comosus',       'pineapple'),
    ('mamao',      'Carica papaya',        'papaya'),
    ('cacau',      'Theobroma cacao',      'cacao pod'),
    ('jabuticaba', 'Plinia cauliflora',    'jabuticaba'),
    ('caju',       'Anacardium occidentale', 'cashew'),
    ('melancia',   'Citrullus lanatus',    'watermelon'),
    ('uva',        'Vitis vinifera',       'grapes'),
    ('abacate',    'Persea americana',     'avocado'),
    ('roma',       'Punica granatum',      'pomegranate'),
    ('maca',       'Malus domestica',      'apple'),
    ('pessego',    'Prunus persica',       'peach'),
    ('cereja',     'Prunus avium',         'cherry'),
    ('acerola',    'Malpighia',            'acerola'),
    ('pera',       'Pyrus communis',       'pear'),
    ('figo',       'Ficus carica',         'fig'),
    ('melao',      'Cucumis melo',         'melon'),
    ('coco',       'Cocos nucifera',       'coconut'),
    ('acai',       'Euterpe oleracea',     'fruit'),
    ('graviola',   'Annona muricata',      'soursop'),
]


def api(params, tentativas=5):
    """O Commons devolve 429 se pedirmos rapido demais: espera e tenta de novo."""
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    espera = 4
    for t in range(tentativas):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and t < tentativas - 1:
                print('   . %d, esperando %ds' % (e.code, espera))
                time.sleep(espera)
                espera *= 2
                continue
            raise
    raise IOError('sem resposta')


def licenca_livre(lic):
    l = (lic or '').lower()
    if any(x in l for x in LICENCAS_NAO):
        return False
    return any(x in l for x in LICENCAS_OK)


def limpar_html(t):
    t = re.sub(r'<[^>]+>', '', t or '')
    return t.replace('&amp;', '&').replace('&quot;', '"').strip()


# Titulos que NAO servem: pinturas, gravuras antigas, prateleira de mercado etc.
LIXO = (
    'still life', 'wellcome', 'painting', 'peeters', 'engraving', 'lithograph',
    'illustration', 'drawing', 'herbarium', 'museum', ' met ', 'aps', 'plate',
    'department store', 'supermarket', 'market', 'stall', 'bucket', 'pot of',
    'boil', 'jam', 'juice', 'cake', 'salad', 'ice cream', 'logo', 'stamp',
    'coin', 'banknote', 'map', 'diagram', 'chart', 'sign', 'label', 'bottle',
    'fotg', 'koeh', 'sturm', 'thome', 'flora von', 'atlas',
    # "habit" em botanica = foto da planta inteira: o fruto fica minusculo
    'habit', 'hand', 'holding', 'bitten', 'boy', 'girl', 'woman', ' man ',
    'people', 'selfie', 'street', 'road', 'seedling', 'sapling', 'bark',
    'leaves and', 'and leaves', 'trunk of', 'wood', 'damage', 'disease', 'pest',
)

# Consultas sob medida para os casos em que a busca automatica erra.
ESPECIAIS = {
    'morango-flor':   ['"Fragaria" intitle:"strawberry flower"', 'strawberry intitle:blossom'],
    'uva-flor':       ['"Vitis vinifera" intitle:inflorescence', 'grapevine intitle:flowering'],
    'coco-flor':      ['"Cocos nucifera" intitle:inflorescence', 'coconut intitle:inflorescence'],
    'cacau-flor':     ['"Theobroma cacao" intitle:flowers', 'cacao intitle:flower'],
    'roma-flor':      ['"Punica granatum" intitle:flower', 'pomegranate intitle:flower'],
    'acai-flor':      ['"Euterpe" intitle:inflorescence', 'acai intitle:inflorescence'],
    'banana-flor':    ['"Musa acuminata" intitle:inflorescence', 'banana intitle:inflorescence',
                       'banana intitle:"flower"'],
    'banana-fruto':   ['banana intitle:bunch -intitle:flower', '"Musa acuminata" intitle:fruit'],
    'goiaba-fruto':   ['"Psidium guajava" intitle:fruits', 'guava intitle:fruit -intitle:tree'],
    'manga-fruto':    ['mango intitle:fruit -intitle:tree', '"Mangifera indica" intitle:fruits'],
    'melancia-fruto': ['watermelon intitle:fruit -intitle:field', '"Citrullus lanatus" intitle:fruits'],
    'roma-fruto':     ['"Punica granatum" intitle:fruit -intitle:tree', 'pomegranate intitle:fruit'],
    'pessego-fruto':  ['peach intitle:fruit -intitle:tree', '"Prunus persica" intitle:fruits'],
    'graviola-fruto': ['soursop intitle:fruit', '"Annona muricata" intitle:fruit -intitle:tree'],
    'laranja-fruto':  ['"Citrus sinensis" intitle:oranges', 'orange intitle:fruit -intitle:tree'],
    'jabuticaba-fruto': ['"Plinia cauliflora" intitle:fruits', 'jabuticaba intitle:fruit'],
    'caju-fruto':     ['cashew intitle:apple -intitle:nut', '"Anacardium occidentale" intitle:fruits'],
    'abacaxi-fruto':  ['"Ananas comosus" intitle:fruits', 'pineapple intitle:fruit -intitle:field'],
}


def titulo_serve(titulo, sci, extra, tipo):
    t = titulo.lower()
    if any(x in t for x in LIXO):
        return False
    # tem que citar o genero, a especie ou o nome popular
    partes = [p.lower() for p in sci.split()] + [extra.split()[0].lower()]
    if not any(p in t for p in partes if len(p) > 3):
        return False
    if tipo == 'flor' and ('bud' in t and 'flower' not in t):
        return False
    return True


def buscar(consulta, quantos=10):
    try:
        r = api({
            'action': 'query', 'format': 'json',
            'generator': 'search', 'gsrsearch': 'filetype:bitmap ' + consulta,
            'gsrnamespace': '6', 'gsrlimit': str(quantos),
            'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata',
            'iiurlwidth': str(LARGURA),
        })
    except Exception as e:
        print('   ! busca falhou:', e)
        return []
    paginas = (r.get('query') or {}).get('pages') or {}
    ordem = sorted(paginas.values(), key=lambda p: p.get('index', 99))
    saida = []
    for p in ordem:
        ii = (p.get('imageinfo') or [{}])[0]
        em = ii.get('extmetadata') or {}
        lic = (em.get('LicenseShortName') or {}).get('value')
        if not licenca_livre(lic) or ii.get('width', 0) < 700:
            continue
        saida.append({
            'titulo': p['title'], 'url': ii.get('thumburl') or ii.get('url'),
            'licenca': lic,
            'autor': limpar_html((em.get('Artist') or {}).get('value'))[:90] or 'Wikimedia Commons',
            'pagina': ii.get('descriptionurl', ''),
        })
    return saida


def consultas(sci, extra, tipo):
    """Da mais estrito para mais solto.

    As fotos "Starr-*" (Forest & Kim Starr) vem primeiro de proposito: sao um
    acervo botanico com identificacao confiavel e o nome do arquivo diz qual
    parte da planta esta na foto.
    """
    pop = extra.split()[0]
    if tipo == 'flor':
        return [
            'Starr "%s" intitle:flowers' % sci,
            'Starr "%s" intitle:flower' % sci,
            '"%s" intitle:flower -intitle:fruit -intitle:bud' % sci,
            '"%s" intitle:flowers -intitle:fruit' % sci,
            '"%s" intitle:blossom -intitle:fruit' % sci,
            '"%s" intitle:inflorescence' % sci,
            '%s intitle:flower' % pop,
        ]
    return [
        'Starr "%s" intitle:fruit' % sci,
        '"%s" intitle:fruit -intitle:flower' % sci,
        '"%s" intitle:fruits -intitle:flower' % sci,
        '"%s" intitle:%s -intitle:flower' % (sci, pop),
        '%s intitle:fruit -intitle:flower' % pop,
    ]


def baixar(url, destino):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        dados = r.read()
    if len(dados) < 4000:
        raise IOError('arquivo pequeno demais')
    with open(destino, 'wb') as f:
        f.write(dados)
    return len(dados)


def main():
    forcar = '--forcar' in sys.argv
    so = None
    for a in sys.argv:
        if a.startswith('--so'):
            so = set((sys.argv[sys.argv.index(a) + 1]).split(','))
    os.makedirs(DEST, exist_ok=True)
    creditos = {}
    if os.path.exists(MANIFESTO):
        creditos = json.load(io.open(MANIFESTO, encoding='utf-8'))

    total = 0
    for eid, sci, extra in ESPECIES:
        if so and eid not in so:
            continue
        for tipo in ('flor', 'fruto'):
            chave = eid + '-' + tipo
            arq = os.path.join(DEST, chave + '.jpg')
            if os.path.exists(arq) and chave in creditos and not forcar:
                continue
            gravou = False
            for q in ESPECIAIS.get(chave, []) + consultas(sci, extra, tipo):
                cands = [c for c in buscar(q) if titulo_serve(c['titulo'], sci, extra, tipo)]
                for c in cands:
                    try:
                        n = baixar(c['url'], arq)
                    except Exception:
                        continue
                    creditos[chave] = {
                        'arquivo': chave + '.jpg', 'titulo': c['titulo'],
                        'autor': c['autor'], 'licenca': c['licenca'], 'pagina': c['pagina'],
                        'consulta': q,
                        'alternativas': [a['titulo'] for a in cands[1:6]],
                    }
                    print('%-12s %-6s %5.0fKB %-14s %s' % (eid, tipo, n / 1024, c['licenca'], c['titulo'][5:70]))
                    total += n
                    gravou = True
                    break
                if gravou:
                    break
                time.sleep(1.2)
            if not gravou:
                print('%-12s %-6s SEM FOTO LIVRE' % (eid, tipo))
            time.sleep(1.2)

    with io.open(MANIFESTO, 'w', encoding='utf-8') as f:
        f.write(json.dumps(creditos, ensure_ascii=False, indent=1))
    print('\nbaixados: %.1f MB | manifesto: %d imagens' % (total / 1048576.0, len(creditos)))


if __name__ == '__main__':
    main()
