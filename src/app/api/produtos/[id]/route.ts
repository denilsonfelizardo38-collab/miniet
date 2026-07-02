import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const produto = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true, stockMovements: { orderBy: { createdAt: "desc" }, take: 20 } },
  })

  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
  }

  return NextResponse.json(produto)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { name, description, price, costPrice, stock, minStock, categoryId } = await req.json()

    const produto = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        costPrice: costPrice || null,
        stock: stock ?? undefined,
        minStock,
        categoryId: categoryId || null,
      },
    })

    return NextResponse.json(produto)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const sales = await prisma.saleItem.count({ where: { productId: params.id } })
    if (sales > 0) {
      return NextResponse.json(
        { error: `Produto tem ${sales} venda(s) associada(s). Desative-o em vez de eliminar.` },
        { status: 400 },
      )
    }
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro ao eliminar produto" }, { status: 500 })
  }
}
