# -*- coding: utf-8 -*-
"""Monta folhas de contato das fotos, para conferir se cada imagem mostra
mesmo o que deveria. Gera tools/_revisao-<tipo>-<n>.jpg

Uso: python tools/montagem.py flor
     python tools/montagem.py fruto
"""
import os, sys
from PIL import Image, ImageDraw

DEST = os.path.join('assets', 'fotos')
IDS = ['maracuja', 'morango', 'laranja', 'goiaba', 'pitaya', 'manga', 'banana',
       'abacaxi', 'mamao', 'cacau', 'jabuticaba', 'caju', 'melancia', 'uva',
       'abacate', 'roma', 'maca', 'pessego', 'cereja', 'acerola', 'pera',
       'figo', 'melao', 'coco', 'acai', 'graviola']

CEL = 300          # lado da celula
COLS = 3
POR_FOLHA = 9


def montar(tipo, ids, saida):
    linhas = (len(ids) + COLS - 1) // COLS
    folha = Image.new('RGB', (COLS * CEL, linhas * (CEL + 26)), (18, 18, 18))
    d = ImageDraw.Draw(folha)
    for i, eid in enumerate(ids):
        cx, cy = (i % COLS) * CEL, (i // COLS) * (CEL + 26)
        caminho = os.path.join(DEST, '%s-%s.jpg' % (eid, tipo))
        if os.path.exists(caminho):
            im = Image.open(caminho).convert('RGB')
            # recorte quadrado central, como o jogo mostra (object-fit: cover)
            l = min(im.size)
            im = im.crop(((im.width - l) // 2, (im.height - l) // 2,
                          (im.width + l) // 2, (im.height + l) // 2))
            folha.paste(im.resize((CEL, CEL), Image.LANCZOS), (cx, cy))
        else:
            d.rectangle([cx, cy, cx + CEL, cy + CEL], fill=(60, 30, 30))
            d.text((cx + 10, cy + CEL // 2), 'SEM FOTO', fill=(255, 160, 160))
        d.text((cx + 8, cy + CEL + 6), '%s  %s' % (eid.upper(), tipo), fill=(255, 235, 150))
    folha.save(saida, quality=88)
    print(saida, folha.size)


if __name__ == '__main__':
    tipo = sys.argv[1] if len(sys.argv) > 1 else 'flor'
    for n in range(0, len(IDS), POR_FOLHA):
        montar(tipo, IDS[n:n + POR_FOLHA],
               os.path.join('tools', '_revisao-%s-%d.jpg' % (tipo, n // POR_FOLHA)))
