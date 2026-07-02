import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Plus, Package } from "lucide-react"

export default async function ProdutosPage() {
  const produtos = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true },
  })

  const categories = await prisma.category.findMany()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500">{produtos.length} produtos registados</p>
        </div>
        <Link
          href="/produtos/novo"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Link href="/produtos" className="rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/produtos?categoria=${cat.slug}`}
            className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-200"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((produto) => (
          <Link
            key={produto.id}
            href={`/produtos/${produto.id}`}
            className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">{produto.name}</h3>
                  {produto.category && (
                    <span className="text-xs text-gray-400">{produto.category.name}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(Number(produto.price))}
              </span>
              <span
                className={`text-sm font-medium ${
                  produto.stock <= produto.minStock ? "text-red-600" : "text-gray-600"
                }`}
              >
                {produto.stock} em stock
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
