import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const vendas = await prisma.venda.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      user: true,
      items: { include: { product: true } },
    },
  })
  return NextResponse.json(vendas)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const { items, total, customerId, paymentMethod } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    const venda = await prisma.venda.create({
      data: {
        total,
        customerId: customerId || null,
        userId: session.user.id,
        paymentMethod,
        items: {
          create: items.map((item: { productId: string; quantity: number; unitPrice: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { items: { include: { product: true } }, customer: true, user: true },
    })

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })

      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          type: "out",
          quantity: item.quantity,
          notes: `Venda #${venda.id.slice(0, 8)}`,
        },
      })
    }

    if (customerId) {
      const pointsEarned = Math.floor(Number(total))
      await prisma.customer.update({
        where: { id: customerId },
        data: { points: { increment: pointsEarned } },
      })
    }

    return NextResponse.json(venda)
  } catch (error) {
    console.error("Erro detalhado:", error)
    const message = error instanceof Error ? error.message : "Erro ao criar venda"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
