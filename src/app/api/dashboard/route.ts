import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [vendasHoje, vendasMes, totalClientes, totalProdutos, topProdutos, produtosStockBaixo] =
    await Promise.all([
      prisma.venda.findMany({ where: { createdAt: { gte: startOfDay } } }),
      prisma.venda.findMany({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.customer.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.saleItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.product.findMany({
        where: { stock: { lte: prisma.product.fields.minStock } },
        orderBy: { stock: "asc" },
      }),
    ])

  const totalHoje = vendasHoje.reduce((acc, v) => acc + Number(v.total), 0)
  const totalMes = vendasMes.reduce((acc, v) => acc + Number(v.total), 0)

  const produtosTop = await Promise.all(
    topProdutos.map(async (item) => {
      const produto = await prisma.product.findUnique({ where: { id: item.productId } })
      return { name: produto?.name || "—", vendas: item._sum.quantity || 0 }
    }),
  )

  return NextResponse.json({
    totalHoje,
    totalMes,
    totalClientes,
    totalProdutos,
    topProdutos: produtosTop,
    stockBaixo: produtosStockBaixo.map((p) => ({ name: p.name, stock: p.stock, minStock: p.minStock })),
  })
}
