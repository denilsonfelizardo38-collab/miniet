import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const clientes = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    include: { sales: { select: { total: true } } },
  })
  return NextResponse.json(clientes)
}

export async function POST(req: Request) {
  try {
    const { name, phone, email, nif } = await req.json()
    if (!name || !phone) {
      return NextResponse.json({ error: "Nome e telefone são obrigatórios" }, { status: 400 })
    }
    const cliente = await prisma.customer.create({ data: { name, phone, email, nif } })
    return NextResponse.json(cliente)
  } catch {
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
  }
}
