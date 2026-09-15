/* =========================================================
   data.js - Conteudo educativo do jogo.

   26 frutas. Para cada uma: 3 pistas, uma explicacao e uma curiosidade.

   Linguagem: as PISTAS nao usam termo tecnico nenhum - sao observacoes
   concretas, do tipo que o aluno consegue enxergar. A EXPLICACAO pode usar
   um termo, mas sempre explicado ali mesmo, em palavras simples.
   ========================================================= */
window.DB = (function () {
  'use strict';

  var ESPECIES = [
    {
      id: 'maracuja', nome: 'Maracujá', planta: 'Maracujazeiro', emoji: '🟡', cor: '#7C3AED',
      pistas: [
        { t: 'A planta', d: 'Não sou uma árvore: sou uma trepadeira, que sobe na cerca se enrolando com uns fiozinhos.' },
        { t: 'Quem me visita', d: 'Uma abelha bem grande e preta, a mamangava, é a única forte o bastante para abrir minha flor.' },
        { t: 'O fruto', d: 'Por dentro sou cheio de sementinhas dentro de um suco meio azedinho. Meu suco é famoso por acalmar.' }
      ],
      explicacao: 'A flor do maracujazeiro é uma das mais bonitas que existem: tem uma coroa de fiozinhos coloridos no meio. Depois que o pólen chega até ela, a partezinha central da flor engorda e vira o maracujá.',
      curiosidade: 'A mamangava é tão importante que produtor de maracujá não passa veneno na época da floração — sem ela, quase nenhuma flor vira fruta. Onde não tem mamangava, alguém precisa polinizar as flores à mão, uma por uma.',
      polinizador: 'Mamangava (aquela abelha grande e preta)',
      decoys: ['uva', 'goiaba', 'pitaya']
    },
    {
      id: 'morango', nome: 'Morango', planta: 'Morangueiro', emoji: '🍓', cor: '#E11D48',
      pistas: [
        { t: 'A planta', d: 'Sou uma plantinha pequena, baixinha, que cresce quase encostada no chão.' },
        { t: 'Por fora', d: 'Minhas sementinhas ficam do lado de fora, grudadas na casca. Quase nenhuma fruta é assim.' },
        { t: 'O fruto', d: 'Sou vermelho, em forma de coração, e todo mundo me põe em cima do bolo.' }
      ],
      explicacao: 'A flor do morangueiro é branca, com cinco pétalas e o meio amarelo. Depois da visita das abelhas, esse meio amarelo é que cresce, fica vermelho e doce — é a parte que a gente come.',
      curiosidade: 'Aqueles pontinhos do morango são as frutinhas de verdade, e um morango tem cerca de 200 deles. Se as abelhas não visitarem a flor inteira, o morango cresce torto.',
      polinizador: 'Abelhas',
      decoys: ['maca', 'cereja', 'acerola']
    },
    {
      id: 'laranja', nome: 'Laranja', planta: 'Laranjeira', emoji: '🍊', cor: '#F97316',
      pistas: [
        { t: 'A flor', d: 'Minha flor é branca e tem um perfume tão forte que dá para sentir de longe.' },
        { t: 'A família', d: 'Sou da turma das frutas cítricas, a mesma do limão e da tangerina.' },
        { t: 'O fruto', d: 'Se você apertar minha casca perto do nariz, sai um cheirinho. Por dentro sou dividido em gomos.' }
      ],
      explicacao: 'A flor da laranjeira se chama flor-de-laranjeira. Quando o pólen chega nela, a base da flor cresce e vira a laranja; cada pedacinho de dentro se enche de suco e forma um gomo.',
      curiosidade: 'O Brasil é o maior produtor de laranja do mundo. E uma mesma laranjeira consegue estar florida e cheia de frutas maduras ao mesmo tempo.',
      polinizador: 'Abelhas (o mel de laranjeira vem daí)',
      decoys: ['manga', 'banana', 'abacaxi']
    },
    {
      id: 'goiaba', nome: 'Goiaba', planta: 'Goiabeira', emoji: '🟢', cor: '#65A30D',
      pistas: [
        { t: 'A flor', d: 'Minha flor parece ter um chumaço de fiozinhos brancos no meio, tipo um pompom.' },
        { t: 'Por dentro', d: 'Posso ser branca, rosada ou bem vermelha por dentro, e tenho um montão de sementes duras.' },
        { t: 'O fruto', d: 'Sou verde por fora e tenho mais vitamina C que a laranja. Viro doce em pasta e suco.' }
      ],
      explicacao: 'Aquele pompom de fiozinhos brancos da flor é o que guarda o pólen. Depois da polinização, as pétalas caem e a base da flor cresce até virar a goiaba — dá para ver a marquinha da flor na pontinha da fruta.',
      curiosidade: 'A goiaba vermelha tem cerca de cinco vezes mais vitamina C do que a laranja, se você comparar o mesmo peso das duas.',
      polinizador: 'Abelhas e mamangavas',
      decoys: ['pera', 'uva', 'mamao']
    },
    {
      id: 'pitaya', nome: 'Pitaya', planta: 'Pitaieira', emoji: '🌵', cor: '#EC4899',
      pistas: [
        { t: 'A flor', d: 'Minha flor é enorme, branca, e só abre de noite. De manhã ela já murchou.' },
        { t: 'A planta', d: 'Não tenho folhas: cresço num cacto, com uns caules verdes de três quinas.' },
        { t: 'O fruto', d: 'Sou rosa-choque por fora, com umas abas verdes, e branco com pontinhos preto por dentro.' }
      ],
      explicacao: 'A flor da pitaya vive uma única noite: abre no fim da tarde e fecha ao amanhecer. Quem leva o pólen de uma flor para outra são morcegos e mariposas grandes, atraídos pelo perfume no escuro.',
      curiosidade: 'Ela é chamada de "flor da lua". Em plantação grande, muita gente precisa acordar de madrugada para polinizar as flores com um pincel, antes de elas fecharem.',
      polinizador: 'Morcegos e mariposas da noite',
      decoys: ['maracuja', 'figo', 'melancia']
    },
    {
      id: 'manga', nome: 'Manga', planta: 'Mangueira', emoji: '🥭', cor: '#F59E0B',
      pistas: [
        { t: 'A flor', d: 'Minhas flores são pequenininhas e vêm aos milhares juntas, em cachos grandes na ponta dos galhos.' },
        { t: 'O clima', d: 'Sou fruta de lugar quente. Minha árvore é grandona e faz uma sombra ótima.' },
        { t: 'O fruto', d: 'Tenho um caroço só, grande e achatado no meio, e sujo a mão toda de amarelo.' }
      ],
      explicacao: 'Um cacho de flores da mangueira pode ter mais de mil flores, mas só umas poucas viram fruta. Cada flor que recebe pólen forma uma manga; as outras secam e caem.',
      curiosidade: 'Quem poliniza a mangueira são principalmente moscas e besouros, não abelhas. Por isso a flor dela tem um cheiro bem diferente do cheiro das outras flores.',
      polinizador: 'Moscas, besouros e abelhas',
      decoys: ['pessego', 'mamao', 'abacate']
    },
    {
      id: 'banana', nome: 'Banana', planta: 'Bananeira', emoji: '🍌', cor: '#EAB308',
      pistas: [
        { t: 'A planta', d: 'Minhas flores ficam dentro daquela peça roxa e pontuda que o povo chama de "coração".' },
        { t: 'Como cresço', d: 'Nunca apareço sozinha: nasço grudada com as minhas irmãs, formando pencas.' },
        { t: 'O fruto', d: 'Sou amarela, você me descasca com a mão e quase não tenho semente nenhuma.' }
      ],
      explicacao: 'O "coração" da bananeira é um monte de flores embrulhadas. Debaixo de cada folha roxa existe uma fileira de flores: as de cima são as que viram bananas, e as de baixo não dão fruta.',
      curiosidade: 'A banana que você compra cresce sem precisar de polinização — é por isso que ela não tem semente. E como não tem semente, a bananeira só se multiplica por muda: todas as bananeiras de um tipo são cópias da mesma planta.',
      polinizador: 'Morcegos e aves (nas bananas selvagens, que têm semente)',
      decoys: ['mamao', 'abacaxi', 'coco']
    },
    {
      id: 'abacaxi', nome: 'Abacaxi', planta: 'Abacaxizeiro', emoji: '🍍', cor: '#CA8A04',
      pistas: [
        { t: 'A flor', d: 'Não vim de uma flor só: dezenas de florzinhas lilás se juntaram para me formar.' },
        { t: 'A planta', d: 'Minha planta é baixa, com folhas compridas e espinhentas abertas em roda, saindo do chão.' },
        { t: 'O fruto', d: 'Tenho uma coroa de folhas na cabeça e uns "olhinhos" desenhados em toda a casca.' }
      ],
      explicacao: 'Cada "olhinho" da casca do abacaxi foi uma flor. As flores abrem em espiral, de baixo para cima, e as frutinhas que nascem delas se juntam e grudam umas nas outras, formando um único abacaxi.',
      curiosidade: 'A coroa do abacaxi é uma muda: se você plantar, nasce uma planta nova. Mas tenha paciência — ela leva mais de um ano para dar o primeiro abacaxi.',
      polinizador: 'Beija-flores (nos abacaxis com semente)',
      decoys: ['laranja', 'melancia', 'caju']
    },
    {
      id: 'mamao', nome: 'Mamão', planta: 'Mamoeiro', emoji: '🟠', cor: '#FB923C',
      pistas: [
        { t: 'A planta', d: 'Meu tronco é um só, fininho e sem galho nenhum, com as folhas todas lá no alto.' },
        { t: 'A flor', d: 'Minhas flores são branquinhas e nascem coladas no tronco, não na ponta de galhos.' },
        { t: 'O fruto', d: 'Sou alaranjado por dentro, com um monte de sementinhas preta no meio, e muito usado no café da manhã.' }
      ],
      explicacao: 'O mamoeiro tem pés diferentes: alguns só dão flor que não vira fruta, outros dão flor que vira. Quem planta precisa saber diferenciar as duas, senão a planta cresce bonita e nunca dá mamão.',
      curiosidade: 'O mamoeiro pode "trocar de sexo": em calor muito forte, uma planta que estava dando frutas passa a dar só flores que não frutificam, e fica uma safra inteira sem produzir.',
      polinizador: 'Mariposas da noite e abelhas',
      decoys: ['manga', 'melao', 'goiaba']
    },
    {
      id: 'cacau', nome: 'Cacau', planta: 'Cacaueiro', emoji: '🍫', cor: '#92400E',
      pistas: [
        { t: 'A flor', d: 'Minhas flores são miudinhas e nascem grudadas no tronco, direto na madeira.' },
        { t: 'Quem me visita', d: 'Quem me poliniza é um mosquitinho minúsculo, que mora na terra úmida embaixo das árvores.' },
        { t: 'O fruto', d: 'De dentro de mim sai a matéria-prima do chocolate.' }
      ],
      explicacao: 'Flor nascendo no tronco, e não nos galhos, é uma coisa rara — a gente chama isso de caulifloria, que quer dizer "flor no caule". As flores do cacaueiro são tão pequenas que só um bichinho bem miúdo consegue entrar nelas.',
      curiosidade: 'O polinizador do cacau é um mosquitinho de 1 a 3 milímetros, menor que a cabeça de um alfinete. Menos de 5 em cada 100 flores viram fruta. Sem esse mosquitinho, não existiria chocolate.',
      polinizador: 'Um mosquitinho chamado maruim',
      decoys: ['mamao', 'graviola', 'abacate']
    },
    {
      id: 'jabuticaba', nome: 'Jabuticaba', planta: 'Jabuticabeira', emoji: '⚫', cor: '#581C87',
      pistas: [
        { t: 'A flor', d: 'Meu tronco fica coberto de flores brancas e felpudas, de cima a baixo, como se tivesse nevado.' },
        { t: 'De onde vim', d: 'Sou brasileira de nascimento, e é comum me encontrar em quintal de casa.' },
        { t: 'O fruto', d: 'Sou pretinha e brilhante, do tamanho de uma bolinha de gude, e a polpa branca dentro é doce.' }
      ],
      explicacao: 'A jabuticabeira também dá flor no tronco, igual ao cacaueiro. E é rapidíssima: mais ou menos 30 dias depois da florada, as jabuticabas já estão pretas e prontas para colher.',
      curiosidade: 'Uma jabuticabeira plantada de semente pode levar de 8 a 12 anos para dar as primeiras frutas. Por isso existe o ditado de que quem planta jabuticaba planta para os netos.',
      polinizador: 'Abelhas nativas sem ferrão',
      decoys: ['uva', 'acai', 'cereja']
    },
    {
      id: 'caju', nome: 'Caju', planta: 'Cajueiro', emoji: '🥜', cor: '#EA580C',
      pistas: [
        { t: 'A flor', d: 'Minhas florzinhas são rosadas e perfumadas, todas juntas na ponta dos galhos.' },
        { t: 'Meu formato', d: 'Tenho uma parte grande e suculenta e uma "bolsinha" dura pendurada na ponta.' },
        { t: 'O fruto', d: 'A parte gostosa vira suco no Nordeste, e a bolsinha da ponta é a castanha.' }
      ],
      explicacao: 'No cajueiro acontece algo curioso: o cabinho que segurava a flor é que incha e vira a parte amarela e suculenta. A fruta de verdade é a castanha da ponta — o resto é o cabinho engordado.',
      curiosidade: 'O maior cajueiro do mundo fica em Natal, no Rio Grande do Norte. É uma árvore só, mas seus galhos encostam no chão e criam raízes, então ela cobre uma área do tamanho de umas 70 casas.',
      polinizador: 'Abelhas e vespas',
      decoys: ['manga', 'abacaxi', 'goiaba']
    },
    {
      id: 'melancia', nome: 'Melancia', planta: 'Melancieira', emoji: '🍉', cor: '#16A34A',
      pistas: [
        { t: 'A planta', d: 'Minha planta não sobe: ela se arrasta pelo chão, espalhando ramos para todo lado.' },
        { t: 'A flor', d: 'Minha flor é amarela. Só que tem dois tipos dela na planta, e um tipo só não dá fruta.' },
        { t: 'O fruto', d: 'Sou verde e listrada por fora, vermelha e cheia de água por dentro. Peso mais que qualquer outra fruta da feira.' }
      ],
      explicacao: 'Na melancieira existem dois tipos de flor. Uma delas já tem uma bolinha embaixo das pétalas: essa bolinha é a melancia bebê. Se as abelhas não levarem pólen da outra flor até ela, a bolinha seca e cai.',
      curiosidade: 'Uma flor de melancia precisa de várias visitas de abelha para virar uma fruta redonda. Melancia torta quase sempre é sinal de que faltou abelha.',
      polinizador: 'Abelhas — sem elas não nasce nenhuma melancia',
      decoys: ['abacaxi', 'melao', 'pitaya']
    },
    {
      id: 'uva', nome: 'Uva', planta: 'Videira', emoji: '🍇', cor: '#7E22CE',
      pistas: [
        { t: 'A flor', d: 'Minhas flores são verdinhas e tão pequenas que quase ninguém percebe que elas existem.' },
        { t: 'A planta', d: 'Sou trepadeira: me seguro com fiozinhos enrolados e sou criada em cima de armações.' },
        { t: 'O fruto', d: 'Cresço em cacho e viro suco, passa e vinho.' }
      ],
      explicacao: 'Cada bolinha do cacho de uva foi uma florzinha. A flor da videira nem precisa de bicho: ela solta uma tampinha verde por cima e se poliniza sozinha, com uma ajuda do vento.',
      curiosidade: 'A videira é uma das plantas mais antigas que a humanidade cultiva: existem registros de mais de 6 mil anos. Um cacho só pode ter passado de 100 flores.',
      polinizador: 'Ela mesma, com ajuda do vento',
      decoys: ['jabuticaba', 'acai', 'cereja']
    },
    {
      id: 'abacate', nome: 'Abacate', planta: 'Abacateiro', emoji: '🥑', cor: '#4D7C0F',
      pistas: [
        { t: 'A flor', d: 'Tenho milhares de florzinhas verde-amareladas, bem pequenas, reunidas em cachos.' },
        { t: 'Um truque', d: 'Minha flor abre duas vezes: uma pela manhã e outra na tarde do dia seguinte, cada vez de um jeito.' },
        { t: 'O fruto', d: 'Sou cremoso, tenho um caroço grande e redondo, e muita gente me come com açúcar.' }
      ],
      explicacao: 'O abacateiro tem um jeito esperto de evitar se polinizar sozinho: a mesma flor abre num horário funcionando de um modo e, no dia seguinte, em outro horário, funcionando do modo oposto. Assim o pólen sai de uma árvore e vai para outra.',
      curiosidade: 'Por causa desse revezamento de horários, quem planta abacate mistura dois tipos de árvore no pomar, para que uma polinize a outra e a colheita seja maior.',
      polinizador: 'Abelhas',
      decoys: ['manga', 'pera', 'graviola']
    },
    {
      id: 'roma', nome: 'Romã', planta: 'Romãzeira', emoji: '🔴', cor: '#DC2626',
      pistas: [
        { t: 'A flor', d: 'Minha flor é vermelho-alaranjada e a base dela é gordinha, parecendo um potinho.' },
        { t: 'Por dentro', d: 'Sou dividida em cantinhos cheios de bolinhas vermelhas e brilhantes, cada uma com uma semente.' },
        { t: 'O fruto', d: 'Tem gente que guarda minhas sementes na carteira na virada do ano, para dar sorte.' }
      ],
      explicacao: 'Aquele potinho gordo na base da flor da romãzeira já é a fruta começando. Ele cresce, fica vermelho e endurece, e no topo continuam as pontinhas que sobraram da flor — é a "coroa" da romã.',
      curiosidade: 'Cada bolinha vermelha é uma semente embrulhada em polpa suculenta. Uma romã pode ter mais de 600 delas.',
      polinizador: 'Abelhas e beija-flores',
      decoys: ['goiaba', 'maca', 'acerola']
    },
    {
      id: 'maca', nome: 'Maçã', planta: 'Macieira', emoji: '🍎', cor: '#DC2626',
      pistas: [
        { t: 'A flor', d: 'Minha flor é branca com um tom de rosa, e a árvore inteira floresce de uma vez, virando um buquê.' },
        { t: 'O clima', d: 'Gosto de frio: no Brasil só dou bem no Sul, onde o inverno é de verdade.' },
        { t: 'O fruto', d: 'Sou vermelha ou verde, faço "croc" quando você morde e tenho um talinho no topo.' }
      ],
      explicacao: 'A macieira precisa de abelha para tudo: se a flor não for visitada, ela cai sem virar fruta. A parte que a gente morde é a base da flor, que engorda e fica suculenta em volta das sementes.',
      curiosidade: 'A macieira precisa passar frio no inverno para florir bem. Sem esse frio ela se confunde e quase não dá flor — é por isso que não existe pomar de maçã no Nordeste.',
      polinizador: 'Abelhas (uma flor não visitada não vira maçã)',
      decoys: ['pera', 'pessego', 'roma']
    },
    {
      id: 'pessego', nome: 'Pêssego', planta: 'Pessegueiro', emoji: '🍑', cor: '#F472B6',
      pistas: [
        { t: 'A flor', d: 'Minha flor é rosa-choque e aparece antes das folhas: a árvore fica só de flor, sem nenhuma folha.' },
        { t: 'Minha casca', d: 'Minha casca é fininha e coberta de uma penugem que faz cosquinha na mão.' },
        { t: 'O fruto', d: 'Sou alaranjado por dentro e tenho um caroço só, bem duro e enrugado.' }
      ],
      explicacao: 'No pessegueiro as flores abrem antes das folhas, ainda no fim do inverno. Depois de polinizada, a flor cai e a base dela cresce em volta do caroço, formando a parte macia que a gente come.',
      curiosidade: 'A nectarina é um pêssego sem penugem: mesma espécie, mudou só um detalhe da casca. E aquele caroço duro protege a semente, que é a amêndoa lá dentro.',
      polinizador: 'Abelhas',
      decoys: ['maca', 'cereja', 'manga']
    },
    {
      id: 'cereja', nome: 'Cereja', planta: 'Cerejeira', emoji: '🍒', cor: '#BE123C',
      pistas: [
        { t: 'A flor', d: 'Minhas flores são branquinhas e nascem em montes, cobrindo o galho inteiro. Viram até ponto turístico.' },
        { t: 'Como cresço', d: 'Fico pendurada num cabinho comprido e fino, geralmente em dupla.' },
        { t: 'O fruto', d: 'Sou pequena, vermelho-escura e enfeito o topo do sundae.' }
      ],
      explicacao: 'A florada da cerejeira dura poucos dias. Cada flor polinizada vira uma cereja: a parte carnuda se forma em volta de um caroço único, que guarda a semente.',
      curiosidade: 'A cerejeira do Japão que fica famosa nas fotos, a sakura, é parente da nossa, mas foi selecionada só pela beleza da flor — ela quase não dá fruta.',
      polinizador: 'Abelhas',
      decoys: ['morango', 'acerola', 'jabuticaba']
    },
    {
      id: 'acerola', nome: 'Acerola', planta: 'Aceroleira', emoji: '🟥', cor: '#E11D48',
      pistas: [
        { t: 'A flor', d: 'Minha flor é rosa e tem as pétalas com um cabinho, parecendo um leque pequeno.' },
        { t: 'A planta', d: 'Sou um arbusto que dá fruta várias vezes por ano, e você me acha em quintal no Nordeste.' },
        { t: 'O fruto', d: 'Sou pequena, vermelha, meio azedinha, e campeã de vitamina C.' }
      ],
      explicacao: 'A aceroleira floresce e dá fruta várias vezes ao ano. Cada flor rosa que recebe pólen vira uma acerola em cerca de três semanas — é uma das frutas mais rápidas do pomar.',
      curiosidade: 'A acerola tem entre 30 e 50 vezes mais vitamina C que a laranja. Um punhado dela já passa do que uma pessoa precisa no dia inteiro.',
      polinizador: 'Abelhas que coletam óleo da flor',
      decoys: ['cereja', 'morango', 'roma']
    },
    {
      id: 'pera', nome: 'Pera', planta: 'Pereira', emoji: '🍐', cor: '#84CC16',
      pistas: [
        { t: 'A flor', d: 'Minha flor é branca, com o meio escuro, e nasce em grupinhos de cinco ou seis.' },
        { t: 'Meu formato', d: 'Sou mais larga embaixo e mais estreita em cima, como uma gotinha.' },
        { t: 'O fruto', d: 'Sou docinha, bem suculenta, e por dentro tenho uns pontinhos que dão uma textura de areia fina.' }
      ],
      explicacao: 'A pereira é prima da macieira e funciona igual: a base da flor é que engorda e vira a fruta, com as sementes no meio. Sem visita de abelha, a flor cai.',
      curiosidade: 'Aquela textura levemente arenosa da pera vem de células duras de verdade, espalhadas na polpa. Elas ajudam a proteger as sementes.',
      polinizador: 'Abelhas',
      decoys: ['maca', 'goiaba', 'abacate']
    },
    {
      id: 'figo', nome: 'Figo', planta: 'Figueira', emoji: '🟣', cor: '#7C3AED',
      soFruto: true,
      pistas: [
        { t: 'Uma pegadinha', d: 'Ninguém nunca viu minha flor por fora: ela fica escondida dentro de mim.' },
        { t: 'A planta', d: 'Minhas folhas são grandes e recortadas, com três ou cinco pontas, e todo mundo reconhece.' },
        { t: 'O fruto', d: 'Sou roxinho ou esverdeado, meio mole, e por dentro pareço cheio de fiozinhos.' }
      ],
      explicacao: 'O figo é o caso mais estranho do pomar: ele não nasce de uma flor — ele É um monte de flores, viradas para dentro. Aqueles fiozinhos rosados que você vê quando abre um figo são as flores dele.',
      curiosidade: 'Nas figueiras selvagens, uma vespinha minúscula entra por um buraco na ponta do figo para polinizar as flores lá dentro. As figueiras que a gente planta já dão figo sem precisar dela.',
      polinizador: 'Uma vespinha que entra dentro do figo',
      decoys: ['jabuticaba', 'uva', 'pitaya']
    },
    {
      id: 'melao', nome: 'Melão', planta: 'Meloeiro', emoji: '🍈', cor: '#FBBF24',
      pistas: [
        { t: 'A planta', d: 'Minha planta se arrasta pelo chão e é parente próxima da melancia.' },
        { t: 'Minha casca', d: 'Minha casca é amarela ou tem um desenho de rede, como se fosse rendada.' },
        { t: 'O fruto', d: 'Sou docinho, com a polpa clara e as sementes todas juntas num vão no meio.' }
      ],
      explicacao: 'O meloeiro tem flor amarela e, como a melancieira, precisa que a abelha leve o pólen de uma flor até a outra. A bolinha embaixo da flor é que cresce e vira o melão.',
      curiosidade: 'O Rio Grande do Norte e o Ceará exportam melão para a Europa no meio do inverno de lá. Muitas dessas plantações contratam colmeias de abelha só para garantir a polinização.',
      polinizador: 'Abelhas',
      decoys: ['melancia', 'mamao', 'abacaxi']
    },
    {
      id: 'coco', nome: 'Coco', planta: 'Coqueiro', emoji: '🥥', cor: '#A16207',
      pistas: [
        { t: 'A flor', d: 'Minhas flores são amarelinhas e saem de dentro de uma bainha, no meio das folhas lá no alto.' },
        { t: 'A planta', d: 'Sou de uma palmeira alta, que combina com praia e resiste ao vento salgado.' },
        { t: 'O fruto', d: 'Sou verde e cheio de água por dentro, e me bebem com canudinho.' }
      ],
      explicacao: 'No coqueiro, o mesmo cacho tem dois tipos de flor: umas pequenas, que só soltam pólen, e outras maiores e redondinhas, que são os cocos bebês. Quando o pólen chega nelas, elas crescem até virar coco.',
      curiosidade: 'O coco flutua e aguenta meses no mar sem estragar. Foi assim, boiando de ilha em ilha, que o coqueiro se espalhou por quase todas as praias do mundo.',
      polinizador: 'Abelhas, vespas e o vento',
      decoys: ['banana', 'abacate', 'acai']
    },
    {
      id: 'acai', nome: 'Açaí', planta: 'Açaizeiro', emoji: '🫐', cor: '#4C1D95',
      pistas: [
        { t: 'A flor', d: 'Minhas florzinhas ficam num cacho ramificado, que parece uma vassourinha saindo do tronco.' },
        { t: 'A planta', d: 'Sou de uma palmeira fina e altíssima da Amazônia, que cresce em touceira perto do rio.' },
        { t: 'O fruto', d: 'Sou uma bolinha roxa quase preta, e no Norte me comem na tigela com farinha e peixe.' }
      ],
      explicacao: 'O açaizeiro dá um cacho com milhares de florzinhas. Depois de polinizadas, elas viram bolinhas roxas — e é só a casquinha fina de fora que a gente aproveita, porque quase todo o caroço é semente.',
      curiosidade: 'Cada açaí é quase todo semente: só cerca de 15% do peso da fruta é a polpa roxa. É por isso que precisa de tanto açaí para fazer uma tigela.',
      polinizador: 'Abelhas, besouros e moscas',
      decoys: ['jabuticaba', 'uva', 'coco']
    },
    {
      id: 'graviola', nome: 'Graviola', planta: 'Gravioleira', emoji: '🟩', cor: '#15803D',
      pistas: [
        { t: 'A flor', d: 'Minha flor é grossa, meio amarelada, e mais parece uma peça de madeira do que uma flor.' },
        { t: 'Quem me visita', d: 'Quem me poliniza são besouros, que entram na flor ainda meio fechada.' },
        { t: 'O fruto', d: 'Sou grande, verde, coberta de espinhos moles, e branquinha e azedinha por dentro.' }
      ],
      explicacao: 'A flor da gravioleira quase não abre, e por isso é difícil o pólen sair de uma e chegar na outra. Quem faz esse serviço são besouros pequenos que se enfiam ali dentro.',
      curiosidade: 'Como os besouros não dão conta de tudo, em plantação de graviola é comum o produtor polinizar as flores à mão, com pincel, uma por uma — e aí quase todas viram fruta.',
      polinizador: 'Besouros pequenos',
      decoys: ['cacau', 'abacate', 'mamao']
    }
  ];

  var MAPA = {};
  ESPECIES.forEach(function (e) { MAPA[e.id] = e; });

  /* Pontos por nivel, conforme o numero de pistas usadas (0,1,2,3) */
  var PONTOS = {
    1: [20, 14, 8, 4],
    2: [30, 20, 10, 5],
    3: [40, 26, 14, 6]
  };
  var DESAFIO = { inicial: 50, passo: 8, minimo: 10 };
  var BONUS_SEQUENCIA = 5;
  var BONUS_MAX = 15;

  var NIVEIS = [
    {
      n: 1, chave: 'fruto', titulo: 'Reconheça o Fruto', lema: 'Aquecimento no pomar',
      desc: 'Olhe a foto da fruta e diga o nome dela. Fácil, fácil!',
      pergunta: 'Qual é esta fruta?', icone: '🧺'
    },
    {
      n: 2, chave: 'flor', titulo: 'Da Flor ao Fruto', lema: 'O coração do jogo',
      desc: 'Agora aparece só a flor. Que fruta vai nascer dela?',
      pergunta: 'Que fruto nascerá desta flor?', icone: '🌸'
    },
    {
      n: 3, chave: 'detetive', titulo: 'Detetive da Fruticultura', lema: 'Modo difícil',
      desc: 'A flor está escondida atrás das folhas. Cada pista derruba duas folhas.',
      pergunta: 'Que fruto se esconde aqui?', icone: '🔍'
    },
    {
      n: 4, chave: 'desafio', titulo: 'A Flor Misteriosa', lema: 'Desafio final',
      desc: 'A flor vai aparecendo aos poucos. Quanto antes você acertar, mais pontos ganha!',
      pergunta: 'Rápido! Que fruta nasce desta flor?', icone: '⭐'
    }
  ];

  /* Titulo final, por percentual do maximo possivel da partida */
  var TITULOS = [
    { min: 0.85, nome: 'Mestre da Fruticultura', emoji: '🏆', cor: '#B45309', msg: 'Você enxerga o fruto antes dele existir!' },
    { min: 0.65, nome: 'Detetive das Frutas', emoji: '🔍', cor: '#6D28D9', msg: 'Poucas flores conseguem te enganar.' },
    { min: 0.45, nome: 'Aprendiz do Pomar', emoji: '🌱', cor: '#15803D', msg: 'Você já sabe ler bem um pomar.' },
    { min: 0.00, nome: 'Explorador das Frutas', emoji: '🧭', cor: '#0E7490', msg: 'Toda grande colheita começa com a primeira visita.' }
  ];

  var MODOS = [
    { id: 'rapido', nome: 'Rápido', desc: '6 rodadas · ~2 min', rodadas: [2, 2, 1, 1], icone: '⚡' },
    { id: 'feira', nome: 'Feira', desc: '10 rodadas · ~3 min', rodadas: [3, 4, 2, 1], icone: '🎪' },
    { id: 'completo', nome: 'Completo', desc: '16 rodadas · ~6 min', rodadas: [5, 6, 4, 1], icone: '🌳' }
  ];

  return {
    especies: ESPECIES,
    por: function (id) { return MAPA[id]; },
    ids: function () { return ESPECIES.map(function (e) { return e.id; }); },
    /* especies que podem ser usadas nos niveis de flor (o figo nao tem flor visivel) */
    idsComFlor: function () {
      return ESPECIES.filter(function (e) { return !e.soFruto; }).map(function (e) { return e.id; });
    },
    PONTOS: PONTOS, DESAFIO: DESAFIO,
    BONUS_SEQUENCIA: BONUS_SEQUENCIA, BONUS_MAX: BONUS_MAX,
    NIVEIS: NIVEIS, TITULOS: TITULOS, MODOS: MODOS
  };
})();
