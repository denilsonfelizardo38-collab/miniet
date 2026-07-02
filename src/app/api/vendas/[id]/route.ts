import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores podem eliminar vendas" }, { status: 403 })
  }

  try {
    await prisma.saleItem.deleteMany({ where: { vendaId: params.id } })
    await prisma.venda.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro ao eliminar venda" }, { status: 500 })
  }
}
