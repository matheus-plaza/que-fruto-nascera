# -*- coding: utf-8 -*-
"""Converte assets/fotos/creditos.json em js/creditos.js, para o jogo
funcionar tambem aberto direto do arquivo (file://), sem servidor."""
import io, json, re

cred = json.load(io.open('assets/fotos/creditos.json', encoding='utf-8'))
saida = {}
for chave, v in sorted(cred.items()):
    autor = re.sub(r'\s+', ' ', v.get('autor') or '').strip() or 'Wikimedia Commons'
    saida[chave] = {
        'autor': autor,
        'licenca': v.get('licenca') or '',
        'titulo': (v.get('titulo') or '').replace('File:', ''),
        'pagina': v.get('pagina') or '',
    }
js = ('/* Gerado por tools/gerar_creditos.py - nao editar a mao.\n'
      '   Autoria e licenca de cada foto (todas do Wikimedia Commons). */\n'
      'window.CREDITOS = ' + json.dumps(saida, ensure_ascii=False, indent=1, sort_keys=True) + ';\n')
io.open('js/creditos.js', 'w', encoding='utf-8').write(js)
print('js/creditos.js:', len(saida), 'fotos')
