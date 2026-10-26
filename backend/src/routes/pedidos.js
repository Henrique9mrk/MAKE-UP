const express = require("express");
const { Prisma } = require("@prisma/client");

const prisma = require("../lib/prisma");
const autenticarToken = require("../middleware/auth");
const validarItensPedido = require("../utils/validarItensPedido");

const router = express.Router();

const VALOR_MAXIMO_PEDIDO = new Prisma.Decimal("99999999.99");

// Seleciona somente os campos de produto necessários na resposta.
const camposProduto = {
  id: true,
  nome: true,
  categoria: true,
  preco: true,
  descricao: true,
  imagem: true,
};

// Criar pedido: exige autenticação.
router.post("/", autenticarToken, async (req, res) => {
  try {
    // O usuário é obtido do token validado.
    const usuarioId = Number(req.usuario.id);
    const { itens } = req.body || {};

    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
      return res.status(401).json({
        mensagem: "Usuário autenticado inválido.",
      });
    }

    // Validar produtos e quantidades recebidos.
    if (!validarItensPedido(itens)) {
      return res.status(400).json({
        mensagem: "Os produtos ou as quantidades são inválidos.",
      });
    }

    // Agrupar produtos repetidos.
    const quantidadesPorProduto = new Map();

    for (const item of itens) {
      const produtoId = item.produtoId;
      const quantidade = item.quantidade;

      const quantidadeAtual =
        quantidadesPorProduto.get(produtoId) || 0;

      const novaQuantidade = quantidadeAtual + quantidade;

      if (!Number.isSafeInteger(novaQuantidade)) {
        return res.status(400).json({
          mensagem: "A quantidade total de um produto é inválida.",
        });
      }

      quantidadesPorProduto.set(produtoId, novaQuantidade);
    }

    const itensAgrupados = Array.from(
      quantidadesPorProduto,
      ([produtoId, quantidade]) => ({
        produtoId,
        quantidade,
      })
    );

    // Buscar os produtos no banco de dados.
    const produtos = await prisma.produto.findMany({
      where: {
        id: {
          in: itensAgrupados.map((item) => item.produtoId),
        },
      },
    });

    // Garantir que todos os produtos solicitados existem.
    if (produtos.length !== itensAgrupados.length) {
      return res.status(400).json({
        mensagem: "Um ou mais produtos não foram encontrados.",
      });
    }

    const produtosPorId = new Map(
      produtos.map((produto) => [produto.id, produto])
    );

    // Calcular o total usando aritmética decimal.
    let total = new Prisma.Decimal(0);

    const itensParaCriar = [];

    for (const item of itensAgrupados) {
      const produto = produtosPorId.get(item.produtoId);

      if (!produto) {
        return res.status(400).json({
          mensagem: "Um ou mais produtos não foram encontrados.",
        });
      }

      const preco = new Prisma.Decimal(produto.preco);

      if (
        !preco.isFinite() ||
        preco.isNegative() ||
        preco.decimalPlaces() > 2
      ) {
        return res.status(400).json({
          mensagem: "Um ou mais produtos possuem preço inválido.",
        });
      }

      // Calcular com precisão decimal, sem usar Number para o preço.
      total = total.plus(preco.mul(item.quantidade));

      // Validar o limite do campo Decimal(10, 2).
      if (
        !total.isFinite() ||
        total.greaterThan(VALOR_MAXIMO_PEDIDO)
      ) {
        return res.status(400).json({
          mensagem: "O total do pedido excede o limite permitido.",
        });
      }

      itensParaCriar.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        preco,
      });
    }

    // Criar o pedido e os itens em uma única operação do Prisma.
    const pedido = await prisma.pedido.create({
      data: {
        usuarioId,
        total,
        itens: {
          create: itensParaCriar,
        },
      },
      include: {
        itens: {
          include: {
            produto: {
              select: camposProduto,
            },
          },
        },
      },
    });

    return res.status(201).json({
      mensagem: "Pedido criado com sucesso!",
      pedido,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);

    return res.status(500).json({
      mensagem: "Erro ao criar pedido.",
    });
  }
});

// Consultar somente os pedidos do usuário autenticado.
router.get(
  "/usuario/:usuarioId",
  autenticarToken,
  async (req, res) => {
    try {
      const usuarioAutenticadoId = Number(req.usuario.id);
      const usuarioSolicitadoId = Number(req.params.usuarioId);

      if (
        !Number.isSafeInteger(usuarioAutenticadoId) ||
        usuarioAutenticadoId <= 0
      ) {
        return res.status(401).json({
          mensagem: "Usuário autenticado inválido.",
        });
      }

      if (
        !Number.isSafeInteger(usuarioSolicitadoId) ||
        usuarioSolicitadoId <= 0
      ) {
        return res.status(400).json({
          mensagem: "ID de usuário inválido.",
        });
      }

      // Impedir acesso aos pedidos de outra conta.
      if (usuarioSolicitadoId !== usuarioAutenticadoId) {
        return res.status(403).json({
          mensagem: "Você não tem permissão para consultar esses pedidos.",
        });
      }

      const pedidos = await prisma.pedido.findMany({
        where: {
          usuarioId: usuarioAutenticadoId,
        },
        include: {
          itens: {
            include: {
              produto: {
                select: camposProduto,
              },
            },
          },
        },
        orderBy: {
          data: "desc",
        },
      });

      return res.json(pedidos);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);

      return res.status(500).json({
        mensagem: "Erro ao buscar pedidos.",
      });
    }
  }
);

module.exports = router;