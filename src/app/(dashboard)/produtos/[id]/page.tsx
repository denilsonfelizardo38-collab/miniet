import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Pencil } from "lucide-react"

export default async function ProdutoDetailPage({ params }: { params: { id: string } }) {
  const produto = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true, stockMovements: { orderBy: { createdAt: "desc" }, take: 10 } },
  })

  if (!produto) notFound()

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">{produto.name}</h1>
            {produto.category && (
              <span className="mt-1 inline-block rounded-full bg-primary-50 px-3 py-0.5 text-xs font-medium text-primary-700">
                {produto.category.name}
              </span>
            )}
          </div>
          <Link
            href={`/produtos/${produto.id}/editar`}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Pencil className="h-4 w-4" />
          </Link>
        </div>

        {produto.description && (
          <p className="mt-3 text-sm text-gray-500">{produto.description}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Preço Venda</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(Number(produto.price))}</p>
          </div>
          {produto.costPrice && Number(produto.costPrice) > 0 && (
            <div>
              <p className="text-xs text-gray-500">Preço Custo</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(Number(produto.costPrice))}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500">Stock Atual</p>
            <p className={`text-lg font-bold ${produto.stock <= produto.minStock ? "text-red-600" : "text-gray-900"}`}>
              {produto.stock}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Stock Mínimo</p>
            <p className="text-lg font-bold text-gray-900">{produto.minStock}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">Movimentos de Stock</h2>
        {produto.stockMovements.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum movimento registado</p>
        ) : (
          <div className="space-y-2">
            {produto.stockMovements.map((mov) => (
              <div key={mov.id} className="flex items-center justify-between border-b pb-2 text-sm">
                <span className="capitalize text-gray-600">{mov.type === "in" ? "Entrada" : "Saída"}</span>
                <span className="font-medium text-gray-900">{mov.type === "in" ? "+" : "-"}{mov.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
