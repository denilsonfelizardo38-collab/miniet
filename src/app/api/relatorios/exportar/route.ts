import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as XLSX from "xlsx"

export async function GET() {
  const [vendas, clientes, produtos] = await Promise.all([
    prisma.venda.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        user: true,
        items: { include: { product: true } },
      },
    }),
    prisma.customer.findMany({
      orderBy: { name: "asc" },
      include: { sales: { select: { total: true } } },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { category: true },
    }),
  ])

  const colWidth = [{ wch: 17.38 }]

  const wb = XLSX.utils.book_new()

  const vendasData = vendas.map((v) => ({
    Data: new Date(v.createdAt).toLocaleDateString("pt-PT"),
    "Nº Fatura": v.id.slice(0, 8).toUpperCase(),
    Cliente: v.customer?.name || "—",
    Funcionário: v.user.name,
    "Método Pagamento": v.paymentMethod || "—",
    "Valor Total": Number(v.total),
  }))
  const wsVendas = XLSX.utils.json_to_sheet(vendasData)
  wsVendas["!cols"] = vendasData.length > 0 ? vendasData[0] && Array.from({ length: Object.keys(vendasData[0]).length }, () => ({ wch: 17.38 })) : []
  XLSX.utils.book_append_sheet(wb, wsVendas, "Vendas")

  const clientesData = clientes.map((c) => ({
    Nome: c.name,
    Telefone: c.phone,
    Email: c.email || "—",
    NIF: c.nif || "—",
    "Pontos Fidelidade": c.points,
    "Total Gasto": c.sales.reduce((acc, s) => acc + Number(s.total), 0),
  }))
  const wsClientes = XLSX.utils.json_to_sheet(clientesData)
  wsClientes["!cols"] = clientesData.length > 0 ? Array.from({ length: Object.keys(clientesData[0]).length }, () => ({ wch: 17.38 })) : []
  XLSX.utils.book_append_sheet(wb, wsClientes, "Clientes")

  const produtosData = produtos.map((p) => ({
    Nome: p.name,
    Categoria: p.category?.name || "—",
    "Preço Venda": Number(p.price),
    "Preço Custo": p.costPrice ? Number(p.costPrice) : "—",
    Stock: p.stock,
    "Stock Mínimo": p.minStock,
  }))
  const wsProdutos = XLSX.utils.json_to_sheet(produtosData)
  wsProdutos["!cols"] = produtosData.length > 0 ? Array.from({ length: Object.keys(produtosData[0]).length }, () => ({ wch: 17.38 })) : []
  XLSX.utils.book_append_sheet(wb, wsProdutos, "Produtos")

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="minigest-relatorio-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  })
}
