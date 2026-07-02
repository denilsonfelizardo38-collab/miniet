import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const cliente = await prisma.customer.findUnique({
    where: { id: params.id },
    include: { sales: { include: { items: { include: { product: true } }, user: true } } },
  })

  if (!cliente) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
  }

  return NextResponse.json(cliente)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { name, phone, email, nif, notes } = await req.json()

    const cliente = await prisma.customer.update({
      where: { id: params.id },
      data: { name, phone, email, nif, notes },
    })

    return NextResponse.json(cliente)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const sales = await prisma.venda.count({ where: { customerId: params.id } })
    if (sales > 0) {
      return NextResponse.json(
        { error: `Cliente tem ${sales} venda(s) associada(s). Não é possível eliminar.` },
        { status: 400 },
      )
    }
    await prisma.customer.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro ao eliminar cliente" }, { status: 500 })
  }
}
