# Cardápio Digital — Lanchonete e Sorveteria do Gordo

Cardápio digital premium, mobile-first, construído em HTML/CSS/JS puro (sem
build step, sem dependências) para a **Lanchonete e Sorveteria do Gordo**.

## Como abrir

É um site estático simples. Para rodar localmente:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

Ou publique a pasta inteira em qualquer hospedagem estática (GitHub Pages,
Netlify, Vercel, cPanel, etc.) — não há backend.

## Estrutura

```
index.html        Estrutura da página (header, busca, categorias, modais)
css/style.css      Todo o visual (tema madeira/laranja/dourado + açaí roxo/verde)
js/data.js         Dados do cardápio: categorias, produtos, preços, adicionais
js/app.js          Renderização, busca, carrinho e checkout via WhatsApp
```

## Atualizar preços e produtos

Edite **apenas `js/data.js`**. Cada categoria tem uma lista `products`
(nome, descrição/ingredientes, preço) e, quando aplicável, uma lista
`addons` (adicionais pagos com preço). A categoria de Açaí usa uma
estrutura própria (`sizes`, `adicionais`, `coberturas`, `frutas`) porque é
um item "monte do seu jeito".

Todos os valores foram transcritos das artes de cardápio reais enviadas
pelo estabelecimento (Pastéis, Hot Dog, Lanches, Combos/Porções e Açaí).
Nada foi inventado.

## Pendências (dados reais que faltam confirmar)

- **Endereço em texto** (rua, número, bairro, cidade): ainda não enviado.
  Enquanto isso, a seção "Onde estamos" exibe "a confirmar" e usa apenas
  o mapa incorporado com as coordenadas reais fornecidas
  (`STORE.mapsEmbedSrc` / `STORE.mapsLink` em `js/data.js`).
  Assim que tiver o endereço, defina `PENDING_ADDRESS` no topo de
  `js/data.js` com o texto completo.
- **Milkshakes**: as fotos enviadas não têm cardápio com sabores e preços,
  então essa seção foi deixada de fora por decisão do cliente. Para
  adicionar depois, crie uma nova categoria em `js/data.js` seguindo o
  mesmo padrão das demais.
- **Bebidas**: a categoria "Bebidas" é uma lista de referência com itens
  comuns de lanchonete (refrigerantes, suco, água), a pedido do cliente,
  **sem preço confirmado** — por isso os cards não têm botão de adicionar
  ao carrinho, só um selo "Sob consulta". Para ativar a compra, edite cada
  produto em `js/data.js` (categoria `bebidas`) adicionando `price: <valor>`
  e removendo `priceless: true` da categoria quando todos os preços reais
  estiverem confirmados.
- **Segundo link do Google Maps**: o link `maps.app.goo.gl/jzkR7PGxbswr1zkt6`
  não pôde ser resolvido (encurtadores do Google Maps são bloqueados no
  ambiente onde este site foi gerado). O mapa incorporado atualmente ainda
  usa as coordenadas do primeiro link enviado. Para trocar, peça ao Google
  Maps o código de "Incorporar mapa" (Compartilhar → Incorporar um mapa)
  do local correto e atualize `mapsEmbedSrc`/`mapsLink` em `js/data.js`.
- **Horário de funcionamento exato**: só se sabe que Pastéis, Hot Dog,
  Combos e Porções são servidos "somente finais de semana" (texto
  presente nas artes originais). Não há horário de abertura/fechamento
  confirmado.
- **Formas de pagamento**: não constam nas artes de cardápio; o rodapé
  do site orienta o cliente a combinar isso pelo WhatsApp.

## WhatsApp

O número usado no botão de contato e no checkout é `+55 65 9912-3282`,
confirmado pelo estabelecimento. Ele está centralizado em `STORE.whatsapp`
(`js/data.js`) — se mudar, atualize só ali.

Ao finalizar o pedido, o site monta automaticamente uma mensagem com
todos os itens, variações, adicionais, observações, modalidade
(entrega/retirada) e o total, e abre o WhatsApp com o texto já pronto.
