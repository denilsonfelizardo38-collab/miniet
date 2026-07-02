import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Phone, Mail, Star, FileText, Pencil } from "lucide-react"
import Link from "next/link"

export default async function ClienteDetailPage({ params }: { params: { id: string } }) {
  const cliente = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      sales: {
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } }, user: true },
      },
    },
  })

  if (!cliente) notFound()

  const totalGasto = cliente.sales.reduce((acc, v) => acc + Number(v.total), 0)
  const totalCompras = cliente.sales.length

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{cliente.name}</h1>
              <Link
                href={`/clientes/${cliente.id}/editar`}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-2 space-y-1 text-sm text-gray-500">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {cliente.phone}
              </p>
              {cliente.email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {cliente.email}
                </p>
              )}
              {cliente.nif && <p>NIF: {cliente.nif}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2">
            <Star className="h-5 w-5 fill-amber-500 text-amber-600" />
            <span className="font-bold text-amber-700">{cliente.points} pts</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
          <div>
            <p className="text-xs text-gray-500">Total Gasto</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalGasto)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Compras</p>
            <p className="text-lg font-bold text-gray-900">{totalCompras}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Cliente desde</p>
            <p className="text-lg font-bold text-gray-900">{formatDate(cliente.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
          <FileText className="h-5 w-5" />
          Histórico de Compras
        </h2>

        {cliente.sales.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma compra registada</p>
        ) : (
          <div className="space-y-3">
            {cliente.sales.map((venda) => (
              <div key={venda.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{formatDate(venda.createdAt)}</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(Number(venda.total))}</span>
                </div>
                <div className="mt-2">
                  {venda.items.map((item) => (
                    <span key={item.id} className="mr-2 text-xs text-gray-500">
                      {item.product.name} x{item.quantity}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
