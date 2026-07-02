import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Plus, Phone, Star } from "lucide-react"

export default async function ClientesPage() {
  const clientes = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { sales: { select: { total: true } } },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">{clientes.length} clientes registados</p>
        </div>
        <Link
          href="/clientes/novo"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clientes.map((cliente) => {
          const totalGasto = cliente.sales.reduce((acc, v) => acc + Number(v.total), 0)
          return (
            <Link
              key={cliente.id}
              href={`/clientes/${cliente.id}`}
              className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{cliente.name}</h3>
                {cliente.points > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Star className="h-3 w-3 fill-amber-500" />
                    {cliente.points} pts
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <Phone className="h-3 w-3" />
                {cliente.phone}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Total gasto: <span className="font-medium">{formatCurrency(totalGasto)}</span>
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
