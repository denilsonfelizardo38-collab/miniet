import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Plus } from "lucide-react"
import { BotoesAcaoVenda } from "@/components/vendas/BotoesAcaoVenda"

export default async function VendasPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "ADMIN"

  const vendas = await prisma.venda.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, user: true, items: { include: { product: true } } },
  })

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Vendas</h1>
          <p className="text-sm text-gray-500">Histórico de vendas realizadas</p>
        </div>
        <Link
          href="/vendas/nova"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Nova Venda
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Funcionário</th>
              <th className="px-4 py-3 font-medium">Itens</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Método</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => {
              const faturaUrl = `${baseUrl}/api/vendas/${venda.id}/fatura`
              const whatsappMsg = encodeURIComponent(
                `Olá! Aqui está a sua fatura no valor de ${formatCurrency(Number(venda.total))}.\n${faturaUrl}`,
              )
              const whatsappUrl = venda.customer?.phone
                ? `https://wa.me/${venda.customer.phone.replace(/[^0-9]/g, "")}?text=${whatsappMsg}`
                : null

              return (
                <tr key={venda.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{formatDateTime(venda.createdAt)}</td>
                  <td className="px-4 py-3 text-gray-700">{venda.customer?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{venda.user.name}</td>
                  <td className="px-4 py-3 text-gray-700">{venda.items.length}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(Number(venda.total))}</td>
                  <td className="px-4 py-3 text-gray-700 capitalize">{venda.paymentMethod || "—"}</td>
                  <td className="px-4 py-3">
                    <BotoesAcaoVenda
                      vendaId={venda.id}
                      faturaUrl={faturaUrl}
                      whatsappUrl={whatsappUrl}
                      isAdmin={isAdmin}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
