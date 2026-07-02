import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const produtos = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true },
  })
  return NextResponse.json(produtos)
}

export async function POST(req: Request) {
  try {
    const { name, price, costPrice, stock, minStock, categoryId, description } = await req.json()
    if (!name || !price) {
      return NextResponse.json({ error: "Nome e preço são obrigatórios" }, { status: 400 })
    }
    const produto = await prisma.product.create({
      data: { name, price, costPrice, stock, minStock, categoryId, description },
    })
    return NextResponse.json(produto)
  } catch {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}
