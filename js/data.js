/**
 * Dados do cardápio — Lanchonete e Sorveteria do Gordo
 * -----------------------------------------------------
 * Todos os nomes, ingredientes, preços e observações abaixo foram
 * transcritos fielmente das artes de cardápio fornecidas pelo
 * estabelecimento (fotos de Pastéis, Hot Dog, Lanches, Combos/Porções
 * e Açaí). Nada aqui foi inventado — para atualizar preços ou
 * itens, edite apenas este arquivo.
 *
 * Campos que ainda não foram confirmados pelo estabelecimento estão
 * marcados explicitamente com PENDING_* em vez de um valor inventado.
 */

const PENDING_ADDRESS = "Av. Tancredo Neves, 2511 - Cáceres - MT";

const STORE = {
  name: "Lanchonete e Sorveteria do Gordo",
  tagline: "Lanches, pastéis, hot dogs e açaí",
  whatsapp: "556599123282", // formato internacional só dígitos, a partir de "+55 65 9912-3282"
  whatsappDisplay: "+55 65 9912-3282",
  // Embed oficial do Google Maps para o local "Lanchonete do gordo"
  // (nome confirmado dentro do próprio link de incorporação enviado).
  mapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2920.6832801573955!2d-57.65824232621158!3d-16.048204629253384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x939a550068e16ac7%3A0x229e9516b0611621!2sLanchonete%20do%20gordo!5e1!3m2!1spt-PT!2sus!4v1787602055364!5m2!1spt-PT!2sus",
  // Link direto por coordenadas (mais confiável que tentar montar uma URL
  // a partir do par de hex "!1s..." do embed, que não é o Place ID padrão).
  mapsLink: "https://www.google.com/maps?q=-16.048204629253384,-57.65824232621158",
  address: PENDING_ADDRESS, // exibir como "a confirmar" enquanto for null
  deliveryNotice: "Fazemos entregas", // texto presente no cardápio de Pastéis
  weekendNotice: "Somente finais de semana", // presente nos cardápios de Pastéis, Hot Dog e Combos/Porções
  ingredientsNotice: "Não substituímos ingredientes", // presente no Menu de Lanches
  // Horário de funcionamento da loja: mesmo horário todos os dias da
  // semana (segunda a domingo), conforme informado pelo estabelecimento.
  hoursLabel: "Todos os dias, das 15h30 às 23h00",
  hours: [
    { day: "Segunda-feira", time: "15:30 - 23:00" },
    { day: "Terça-feira", time: "15:30 - 23:00" },
    { day: "Quarta-feira", time: "15:30 - 23:00" },
    { day: "Quinta-feira", time: "15:30 - 23:00" },
    { day: "Sexta-feira", time: "15:30 - 23:00" },
    { day: "Sábado", time: "15:30 - 23:00" },
    { day: "Domingo", time: "15:30 - 23:00" },
  ],
  paymentMethods: ["Débito", "Crédito", "Pix"], // informado pelo estabelecimento
};

// Formata número em Real brasileiro: 12.5 -> "R$ 12,50"
function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const MENU = [
  {
    id: "lanches",
    name: "Lanches",
    shortName: "Lanches",
    icon: "burger",
    notice: STORE.ingredientsNotice,
    weekendOnly: false,
    addons: [
      { name: "Catupiry", price: 5.0 },
      { name: "Bacon", price: 5.0 },
      { name: "Presunto e queijo", price: 5.0 },
      { name: "Milho", price: 3.0 },
      { name: "Hambúrguer", price: 12.0 },
      { name: "Batata palha", price: 3.0 },
      { name: "Ovo", price: 3.0 },
      { name: "Filé mignon", price: 12.0 },
      { name: "Filé de frango", price: 8.0 },
    ],
    products: [
      {
        id: "bauru",
        name: "Bauru",
        description: "Pão, tomate, presunto e queijo",
        price: 10.0,
      },
      {
        id: "baguncinha",
        name: "Baguncinha",
        description:
          "Pão, alface, tomate, ovo, hambúrguer, salsicha, calabresa, presunto e queijo",
        price: 13.0,
      },
      {
        id: "x-salada",
        name: "X-Salada",
        description:
          "Pão, alface, tomate, hambúrguer, milho, presunto e queijo",
        price: 12.0,
      },
      {
        id: "especial",
        name: "Especial",
        description:
          "Pão, alface, tomate, hambúrguer, ovo, milho, bacon, salsicha, calabresa, presunto e queijo",
        price: 16.0,
      },
      {
        id: "x-salsicha",
        name: "X-Salsicha",
        description:
          "Pão, alface, tomate, ovo, salsicha, calabresa, presunto e queijo",
        price: 15.0,
      },
      {
        id: "x-calabresa",
        name: "X-Calabresa",
        description:
          "Pão, alface, tomate, ovo, salsicha, calabresa, presunto e queijo",
        price: 19.0,
      },
      {
        id: "x-queijo",
        name: "X-Queijo",
        description:
          "Pão, alface, tomate, ovo, hambúrguer, salsicha, calabresa, presunto e queijo",
        price: 20.0,
      },
      {
        id: "x-bagunca",
        name: "X-Bagunça",
        description:
          "Pão, alface, tomate, milho, ovo, 2 hambúrgueres, salsicha, calabresa, presunto e queijo",
        price: 17.0,
      },
      {
        id: "x-file",
        name: "X-Filé",
        description:
          "Pão, alface, tomate, filé mignon, ovo, salsicha, calabresa, milho, presunto e queijo",
        price: 28.0,
      },
      {
        id: "x-frango",
        name: "X-Frango",
        description:
          "Pão, alface, tomate, filé de frango, ovo, salsicha, calabresa, milho, presunto e queijo",
        price: 20.0,
      },
      {
        id: "duplex",
        name: "Duplex",
        description:
          "Pão, alface, tomate, 2 hambúrgueres, salsicha, calabresa, batata palha, presunto e queijo",
        price: 20.0,
      },
      {
        id: "x-bacon",
        name: "X-Bacon",
        description:
          "Pão, alface, tomate, ovo, bacon, hambúrguer, salsicha, calabresa, batata palha, milho e batata",
        price: 25.0,
      },
      {
        id: "x-tropical",
        name: "X-Tropical",
        description:
          "Pão, alface, tomate, filé de frango, filé mignon, ovo, salsicha, calabresa, presunto e queijo, milho e batata palha",
        price: 30.0,
      },
      {
        id: "x-tropical-especial",
        name: "X-Tropical Especial",
        description:
          "Pão, alface, tomate, filé de frango, filé mignon, ovo, salsicha, calabresa, bacon, catupiry, presunto e queijo, milho e batata palha",
        price: 37.0,
        featured: true,
      },
    ],
  },
  {
    id: "combos",
    name: "Combos",
    shortName: "Combos",
    icon: "combo",
    weekendOnly: true,
    products: [
      {
        id: "combo-kids",
        name: "Combo Kids",
        description: "2 Bauru, 1 porção P de batata frita e 1 Coca-Cola lata",
        price: 40.0,
      },
      {
        id: "combo-solteiro",
        name: "Combo Solteiro",
        description:
          "1 Baguncinha, 1 porção P de batata frita e 1 Coca-Cola lata",
        price: 32.0,
      },
      {
        id: "combo-casal",
        name: "Combo Casal",
        description:
          "2 Baguncinha, 1 porção M de batata frita e 1 refrigerante 1,5L (Fanta ou Kuat)",
        price: 55.0,
      },
      {
        id: "combo-especial",
        name: "Combo Especial",
        description:
          "3 lanches Especial, 1 porção G de batata frita e 1 refrigerante 1,5L (Fanta ou Kuat)",
        price: 79.0,
      },
      {
        id: "combo-duplo",
        name: "Combo Duplo",
        description:
          "2 Duplex, 1 porção G de batata frita e 1 Coca-Cola 1,5L",
        price: 73.0,
      },
      {
        id: "combo-amigos",
        name: "Combo Amigos",
        description:
          "4 X-Bagunça, 1 porção G de batata frita e 1 refrigerante 1,5L (Fanta ou Kuat)",
        price: 100.0,
      },
      {
        id: "combo-familia",
        name: "Combo Família",
        description:
          "6 Baguncinha, 1 porção G de batata frita e 1 Coca-Cola 1,5L",
        price: 103.0,
        featured: true,
      },
    ],
  },
  {
    id: "porcoes",
    name: "Porções",
    shortName: "Porções",
    icon: "fries",
    weekendOnly: true,
    addons: [
      { name: "Queijo", price: 6.0 },
      { name: "Bacon", price: 6.0 },
      { name: "Calabresa", price: 6.0 },
    ],
    products: [
      {
        id: "batata-p",
        name: "Batata Frita P",
        description: "Porção pequena de batata frita",
        price: 17.0,
      },
      {
        id: "batata-m",
        name: "Batata Frita M",
        description: "Porção média de batata frita",
        price: 22.0,
      },
      {
        id: "batata-g",
        name: "Batata Frita G",
        description: "Porção grande de batata frita",
        price: 26.0,
      },
    ],
  },
  {
    id: "hotdog",
    name: "Hot Dog",
    shortName: "Hot Dog",
    icon: "hotdog",
    weekendOnly: true,
    addons: [
      { name: "Bacon", price: 2.0 },
      { name: "Calabresa", price: 2.0 },
      { name: "Salsicha", price: 2.0 },
      { name: "Queijo", price: 3.0 },
      { name: "Milho", price: 1.5 },
      { name: "Batata palha", price: 2.0 },
      { name: "Frango ou carne", price: 3.0 },
      { name: "Catupiry", price: 3.0 },
    ],
    products: [
      {
        id: "hotdog-simples",
        name: "Hotdog Simples",
        description: "Pão, molho, 1 salsicha, milho e batata palha",
        price: 10.0,
      },
      {
        id: "hotdog-duplo",
        name: "Hotdog Duplo",
        description:
          "Pão, molho, 2 salsichas, queijo, milho, catupiry e batata palha",
        price: 13.0,
      },
      {
        id: "hotdog-especial",
        name: "Hotdog Especial",
        description:
          "Pão, molho, 2 salsichas, queijo, milho, catupiry, frango ou carne e batata palha",
        price: 15.0,
        featured: true,
      },
    ],
  },
  {
    id: "pasteis",
    name: "Pastéis",
    shortName: "Pastéis",
    icon: "pastel",
    weekendOnly: true,
    addons: [
      { name: "Queijo", price: 3.0 },
      { name: "Calabresa", price: 2.0 },
      { name: "Catupiry", price: 3.0 },
      { name: "Milho", price: 2.0 },
      { name: "Bacon", price: 3.0 },
      { name: "Carne ou frango", price: 3.0 },
    ],
    products: [
      { id: "pastel-carne", name: "Pastel de Carne", description: "Carne", price: 7.0 },
      {
        id: "pastel-carne-queijo",
        name: "Pastel de Carne e Queijo",
        description: "Carne e queijo",
        price: 8.0,
      },
      {
        id: "pastel-carne-catupiry",
        name: "Pastel de Carne e Catupiry",
        description: "Carne e catupiry",
        price: 9.0,
      },
      { id: "pastel-frango", name: "Pastel de Frango", description: "Frango", price: 7.0 },
      {
        id: "pastel-frango-queijo",
        name: "Pastel de Frango e Queijo",
        description: "Frango e queijo",
        price: 8.0,
      },
      {
        id: "pastel-frango-catupiry",
        name: "Pastel de Frango e Catupiry",
        description: "Frango e catupiry",
        price: 9.0,
      },
      {
        id: "pastel-queijo-oregano",
        name: "Pastel de Queijo com Orégano",
        description: "Queijo com orégano",
        price: 9.0,
      },
      { id: "pastel-pizza", name: "Pastel Pizza", description: "Sabor pizza", price: 9.0 },
      {
        id: "pastel-x-tudo",
        name: "Pastel X-Tudo",
        description: "Recheio completo",
        price: 11.0,
        featured: true,
      },
    ],
  },
  {
    id: "acai",
    name: "Açaí",
    shortName: "Açaí",
    icon: "acai",
    weekendOnly: false,
    type: "buildable",
    sizes: [
      { id: "250ml", label: "250ml", price: 13.0, includedExtras: 3 },
      { id: "300ml", label: "300ml", price: 14.0, includedExtras: 4 },
      { id: "400ml", label: "400ml", price: 17.0, includedExtras: 5 },
      { id: "500ml", label: "500ml", price: 20.0, includedExtras: 5 },
      { id: "700ml", label: "700ml", price: 25.0, includedExtras: 6 },
    ],
    adicionais: [
      "Leite em pó",
      "Ovomaltine",
      "Paçoca",
      "Gotas de chocolate",
      "Confetes",
      "Bis",
    ],
    coberturas: ["Chocolate", "Morango", "Caramelo", "Leite condensado", "Açaí", "Abacaxi"],
    frutas: ["Banana", "Maçã"],
  },
  {
    // Catálogo de referência com bebidas comuns de lanchonete. Não veio nas
    // artes de cardápio enviadas pelo cliente, por isso NÃO tem preço —
    // é só uma lista informativa para o cliente ver o que costuma ter.
    // Assim que o preço real de cada uma for confirmado, edite os itens
    // abaixo adicionando "price: <valor>" para que passem a poder ser
    // adicionados ao carrinho normalmente (como as demais categorias).
    id: "bebidas",
    name: "Bebidas",
    shortName: "Bebidas",
    icon: "drink",
    weekendOnly: false,
    priceless: true,
    notice:
      "Itens comuns em lanchonetes — sabores, marcas e disponibilidade podem variar. Preços a confirmar com o atendente ou pelo WhatsApp.",
    products: [
      { id: "coca-lata", name: "Coca-Cola lata", description: "350ml" },
      { id: "coca-zero-lata", name: "Coca-Cola Zero lata", description: "350ml" },
      { id: "guarana-lata", name: "Guaraná Antarctica lata", description: "350ml" },
      { id: "fanta-laranja-lata", name: "Fanta Laranja lata", description: "350ml" },
      { id: "fanta-uva-lata", name: "Fanta Uva lata", description: "350ml" },
      { id: "sprite-lata", name: "Sprite lata", description: "350ml" },
      { id: "refri-1-5l", name: "Refrigerante 1,5L", description: "Coca-Cola, Fanta ou Guaraná" },
      { id: "suco-caixinha", name: "Suco de caixinha", description: "Vários sabores" },
      { id: "agua-mineral", name: "Água mineral", description: "Sem gás" },
      { id: "agua-com-gas", name: "Água com gás", description: "" },
    ],
  },
];
