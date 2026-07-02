import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CardResumo } from "@/components/dashboard/CardResumo"
import { AlertaStock } from "@/components/dashboard/AlertaStock"
import { GraficoVendas } from "@/components/dashboard/GraficoVendas"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

async function getDashboardData() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [vendasHoje, vendasSemana, vendasMes, totalClientes, totalProdutos, todosProdutos, ultimasVendas, vendas7d] = await Promise.all([
    prisma.venda.findMany({ where: { createdAt: { gte: startOfDay } } }),
    prisma.venda.findMany({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.venda.findMany({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.customer.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { stock: "asc" },
    }),
    prisma.venda.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { customer: true, user: true } }),
    prisma.venda.findMany({
      where: { createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
      select: { total: true, createdAt: true },
    }),
  ])

  const totalHoje = vendasHoje.reduce((acc, v) => acc + Number(v.total), 0)
  const totalSemana = vendasSemana.reduce((acc, v) => acc + Number(v.total), 0)
  const totalMes = vendasMes.reduce((acc, v) => acc + Number(v.total), 0)

  const produtosStockBaixo = todosProdutos.filter((p) => p.stock <= p.minStock)

  const graficoData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString("pt-PT", { weekday: "short" })
    const total = vendas7d
      .filter((v) => new Date(v.createdAt).toDateString() === d.toDateString())
      .reduce((acc, v) => acc + Number(v.total), 0)
    return { label, valor: total }
  })

  return {
    totalHoje,
    totalSemana,
    totalMes,
    totalClientes,
    totalProdutos,
    produtosStockBaixo,
    ultimasVendas,
    graficoData,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Visão geral do seu negócio</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardResumo
          titulo="Vendas Hoje"
          valor={formatCurrency(data.totalHoje)}
          descricao={`${data.ultimasVendas.length} vendas`}
          icone={<DollarSign className="h-5 w-5" />}
        />
        <CardResumo
          titulo="Vendas Esta Semana"
          valor={formatCurrency(data.totalSemana)}
          icone={<TrendingUp className="h-5 w-5" />}
        />
        <CardResumo
          titulo="Vendas Este Mês"
          valor={formatCurrency(data.totalMes)}
          icone={<ShoppingCart className="h-5 w-5" />}
        />
        <CardResumo
          titulo="Clientes"
          valor={data.totalClientes.toString()}
          descricao={`${data.totalProdutos} produtos ativos`}
          icone={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GraficoVendas data={data.graficoData} />
        </div>
        <AlertaStock produtos={data.produtosStockBaixo} />
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">Últimas Vendas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Data</th>
                <th className="pb-2 font-medium">Cliente</th>
                <th className="pb-2 font-medium">Funcionário</th>
                <th className="pb-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.ultimasVendas.map((venda) => (
                <tr key={venda.id} className="border-b last:border-0">
                  <td className="py-2 text-gray-700">{formatDate(venda.createdAt)}</td>
                  <td className="py-2 text-gray-700">{venda.customer?.name || "—"}</td>
                  <td className="py-2 text-gray-700">{venda.user.name}</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(Number(venda.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          <Link href="/vendas" className="text-sm font-medium text-primary-600 hover:underline">
            Ver todas as vendas →
          </Link>
        </div>
      </div>
    </div>
  )
}
