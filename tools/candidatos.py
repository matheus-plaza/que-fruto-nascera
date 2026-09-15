# -*- coding: utf-8 -*-
"""
Para os slots em que a busca automatica nao acerta: baixa varios candidatos,
monta uma folha numerada para olhar, e depois grava o escolhido.

  python tools/candidatos.py buscar  coco-flor "Cocos nucifera intitle:inflorescence" "coconut intitle:flowers"
  python tools/candidatos.py escolher coco-flor 3
"""
import io, json, os, shutil, sys
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import baixar_fotos as B

TMP = os.path.join('tools', '_cand')
CEL = 300
COLS = 3


def buscar(chave, consultas):
    pasta = os.path.join(TMP, chave)
    shutil.rmtree(pasta, ignore_errors=True)
    os.makedirs(pasta, exist_ok=True)
    vistos, itens = set(), []
    for q in consultas:
        for c in B.buscar(q, quantos=10):
            if c['titulo'] in vistos:
                continue
            vistos.add(c['titulo'])
            t = c['titulo'].lower()
            if any(x in t for x in B.LIXO):
                continue
            i = len(itens)
            arq = os.path.join(pasta, '%02d.jpg' % i)
            try:
                B.baixar(c['url'], arq)
            except Exception:
                continue
            c['indice'] = i
            itens.append(c)
            if len(itens) >= 6:
                break
        if len(itens) >= 6:
            break
    io.open(os.path.join(pasta, 'lista.json'), 'w', encoding='utf-8').write(
        json.dumps(itens, ensure_ascii=False, indent=1))

    linhas = (len(itens) + COLS - 1) // COLS
    folha = Image.new('RGB', (COLS * CEL, max(1, linhas) * (CEL + 24)), (18, 18, 18))
    d = ImageDraw.Draw(folha)
    for c in itens:
        i = c['indice']
        cx, cy = (i % COLS) * CEL, (i // COLS) * (CEL + 24)
        im = Image.open(os.path.join(pasta, '%02d.jpg' % i)).convert('RGB')
        l = min(im.size)
        im = im.crop(((im.width - l) // 2, (im.height - l) // 2,
                      (im.width + l) // 2, (im.height + l) // 2))
        folha.paste(im.resize((CEL, CEL), Image.LANCZOS), (cx, cy))
        d.text((cx + 8, cy + CEL + 5), '[%d] %s' % (i, c['titulo'][5:44]), fill=(255, 235, 150))
    saida = os.path.join(TMP, chave + '.jpg')
    folha.save(saida, quality=86)
    print(saida, '->', len(itens), 'candidatos')
    for c in itens:
        print('  [%d] %s | %s' % (c['indice'], c['titulo'][5:70], c['licenca']))


def escolher(chave, indice):
    pasta = os.path.join(TMP, chave)
    itens = json.load(io.open(os.path.join(pasta, 'lista.json'), encoding='utf-8'))
    c = [x for x in itens if x['indice'] == int(indice)][0]
    shutil.copyfile(os.path.join(pasta, '%02d.jpg' % int(indice)),
                    os.path.join(B.DEST, chave + '.jpg'))
    cred = json.load(io.open(B.MANIFESTO, encoding='utf-8'))
    cred[chave] = {'arquivo': chave + '.jpg', 'titulo': c['titulo'], 'autor': c['autor'],
                   'licenca': c['licenca'], 'pagina': c['pagina'], 'escolhido': 'manual'}
    io.open(B.MANIFESTO, 'w', encoding='utf-8').write(json.dumps(cred, ensure_ascii=False, indent=1))
    print('gravado', chave, '<-', c['titulo'][5:70])


if __name__ == '__main__':
    if sys.argv[1] == 'buscar':
        buscar(sys.argv[2], sys.argv[3:])
    else:
        escolher(sys.argv[2], sys.argv[3])
