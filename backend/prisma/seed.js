const prisma = require("../src/lib/prisma");

const produtos = [
  {
    id: 1,
    nome: "Base Líquida Velvet",
    categoria: "Base",
    preco: 129.9,
    descricao:
      "Cobertura delicada e acabamento aveludado para um look natural.",
    imagem:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    nome: "Blush em Creme",
    categoria: "Blush",
    preco: 89.0,
    descricao:
      "Cor vibrante e textura leve para um resultado saudável e fresco.",
    imagem:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    nome: "Máscara de Cílios Volume",
    categoria: "Olhos",
    preco: 74.5,
    descricao:
      "Fórmula que alonga e dá volume sem pesar os fios.",
    imagem:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    nome: "Batom Matte Intenso",
    categoria: "Boca",
    preco: 69.9,
    descricao:
      "Cor intensa e longa duração com acabamento sofisticado.",
    imagem:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
  },
];

async function main() {
  for (const produto of produtos) {
    await prisma.produto.upsert({
      where: {
        id: produto.id,
      },
      update: {
        nome: produto.nome,
        categoria: produto.categoria,
        preco: produto.preco,
        descricao: produto.descricao,
        imagem: produto.imagem,
      },
      create: produto,
    });
  }

  console.log("Produtos cadastrados com sucesso!");

  const produtosCadastrados = await prisma.produto.findMany({
    orderBy: {
      id: "asc",
    },
  });

  console.table(produtosCadastrados);
}

main()
  .catch((error) => {
    console.error("Erro ao cadastrar produtos:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });