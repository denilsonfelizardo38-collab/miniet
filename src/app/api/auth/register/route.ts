import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password deve ter no mínimo 6 caracteres" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email já registado no sistema" }, { status: 400 })
    }

    const existingPending = await prisma.pendingUser.findUnique({ where: { email } })
    if (existingPending) {
      return NextResponse.json({ error: "Já existe um pedido pendente para este email" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.pendingUser.create({
      data: { name, email, password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: "Pedido de registo enviado. Aguarde a aprovação do administrador.",
    })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
