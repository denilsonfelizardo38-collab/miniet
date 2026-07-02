import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores" }, { status: 403 })
  }

  const pendentes = await prisma.pendingUser.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(pendentes)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores" }, { status: 403 })
  }

  try {
    const { id, action } = await req.json()

    const pending = await prisma.pendingUser.findUnique({ where: { id } })
    if (!pending) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    if (action === "approve") {
      await prisma.user.create({
        data: {
          name: pending.name,
          email: pending.email,
          password: pending.password,
          role: "STAFF",
          active: true,
        },
      })
      await prisma.pendingUser.update({
        where: { id },
        data: { status: "approved" },
      })
      return NextResponse.json({ success: true, message: "Funcionário aprovado com sucesso" })
    }

    if (action === "reject") {
      await prisma.pendingUser.update({
        where: { id },
        data: { status: "rejected" },
      })
      return NextResponse.json({ success: true, message: "Pedido rejeitado" })
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Erro ao processar pedido" }, { status: 500 })
  }
}
