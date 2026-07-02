import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, Package, Users, Download } from "lucide-react"
import Link from "next/link"

async function getReportData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const [vendasMes, vendasAno, totalClientes, totalProdutos, topProdutos, topClientes, categorias] =
    await Promise.all([
      prisma.venda.findMany({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.venda.findMany({ where: { createdAt: { gte: startOfYear } } }),
      prisma.customer.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.saleItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true, subtotal: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 10,
      }),
      prisma.customer.findMany({
        orderBy: { points: "desc" },
        take: 5,
        include: { sales: { select: { total: true } } },
      }),
      prisma.category.findMany({
        include: { products: { where: { active: true } } },
      }),
    ])

  const totalMes = vendasMes.reduce((acc, v) => acc + Number(v.total), 0)
  const totalAno = vendasAno.reduce((acc, v) => acc + Number(v.total), 0)

  const produtosTop = await Promise.all(
    topProdutos.map(async (item) => {
      const produto = await prisma.product.findUnique({ where: { id: item.productId } })
      return {
        name: produto?.name || "—",
        vendas: item._sum.quantity || 0,
        receita: Number(item._sum.subtotal || 0),
      }
    }),
  )

  return { totalMes, totalAno, totalClientes, totalProdutos, produtosTop, topClientes, categorias }
}

export default async function RelatoriosPage() {
  const data = await getReportData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-sm text-gray-500">Análise de desempenho do negócio</p>
        </div>
        <a
          href="/api/relatorios/exportar"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Download className="h-4 w-4" />
          Exportar Excel
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Vendas Este Mês</p>
            <TrendingUp className="h-5 w-5 text-primary-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{formatCurrency(data.totalMes)}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Vendas Este Ano</p>
            <TrendingUp className="h-5 w-5 text-primary-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{formatCurrency(data.totalAno)}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Clientes</p>
            <Users className="h-5 w-5 text-primary-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{data.totalClientes}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Produtos</p>
            <Package className="h-5 w-5 text-primary-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{data.totalProdutos}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            Produtos Mais Vendidos
          </h3>
          <div className="space-y-3">
            {data.produtosTop.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{p.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{p.vendas} vendas</span>
                  <span className="ml-3 text-xs text-gray-400">{formatCurrency(p.receita)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <Users className="h-5 w-5 text-primary-600" />
            Top Clientes (Fidelidade)
          </h3>
          <div className="space-y-3">
            {data.topClientes.map((c, i) => {
              const totalGasto = c.sales.reduce((acc, v) => acc + Number(v.total), 0)
              return (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-sm text-gray-700">{c.name}</span>
                      <span className="ml-2 text-xs text-amber-600">{c.points} pts</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(totalGasto)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">Produtos por Categoria</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.categorias.map((cat) => (
            <div key={cat.id} className="rounded-lg border bg-gray-50 p-3">
              <p className="font-medium text-gray-900">{cat.name}</p>
              <p className="text-sm text-gray-500">{cat.products.length} produtos</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
