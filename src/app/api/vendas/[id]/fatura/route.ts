import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const venda = await prisma.venda.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      user: true,
      items: { include: { product: true } },
    },
  })

  if (!venda) {
    return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 })
  }

  const data = new Date(venda.createdAt).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const itemsHTML = venda.items
    .map(
      (item) => `
    <tr>
      <td>${item.product.name}</td>
      <td class="center">${item.quantity}</td>
      <td class="right">MT ${Number(item.unitPrice).toFixed(2)}</td>
      <td class="right">MT ${Number(item.subtotal).toFixed(2)}</td>
    </tr>`,
    )
    .join("")

  const faturaHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Fatura #${venda.id.slice(0, 8).toUpperCase()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; padding: 40px; font-size: 14px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .header h1 { font-size: 28px; color: #0284c7; text-transform: uppercase; letter-spacing: 2px; }
    .header .meta { text-align: right; font-size: 13px; color: #6b7280; }
    .cliente { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
    .cliente h3 { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .cliente p { font-size: 15px; color: #1f2937; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
    th { background: #f3f4f6; padding: 12px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .right { text-align: right; }
    .center { text-align: center; }
    .total td { border-bottom: none; font-size: 16px; font-weight: bold; }
    .total td:last-child { font-size: 22px; color: #0284c7; }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div style="text-align:right;margin-bottom:20px" class="no-print">
    <button onclick="window.print()" style="padding:10px 20px;background:#0284c7;color:white;border:none;border-radius:6px;font-size:14px;cursor:pointer">Imprimir / Salvar PDF</button>
  </div>

  <div class="header">
    <div>
      <h1>MiniGest</h1>
      <p style="font-size:12px;color:#9ca3af;margin-top:2px">Gestão Simples</p>
    </div>
    <div class="meta">
      <p style="font-weight:bold;font-size:16px;color:#1f2937">Fatura #${venda.id.slice(0, 8).toUpperCase()}</p>
      <p style="margin-top:4px">${data}</p>
    </div>
  </div>

  <div style="margin-bottom:20px">
    <h3 style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Emitido por</h3>
    <p style="font-size:14px">${venda.user.name}</p>
    <p style="font-size:13px;color:#6b7280">${venda.user.email}</p>
  </div>

  ${
    venda.customer
      ? `<div class="cliente">
          <h3>Cliente</h3>
          <p>${venda.customer.name}</p>
          <p>${venda.customer.phone}${venda.customer.nif ? ` | NIF: ${venda.customer.nif}` : ""}</p>
        </div>`
      : ""
  }

  <table>
    <thead>
      <tr>
        <th>Produto</th>
        <th class="center">Qtd</th>
        <th class="right">Preço Unit.</th>
        <th class="right">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
      <tr class="total">
        <td colspan="3" class="right">Total</td>
        <td class="right">MT ${Number(venda.total).toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  ${
    venda.paymentMethod
      ? `<p style="text-align:right;font-size:13px;color:#6b7280">Método: <strong>${venda.paymentMethod}</strong></p>`
      : ""
  }

  <div class="footer">
    <p>MiniGest — Sistema de Gestão Simples</p>
    <p>Obrigado pela sua preferência!</p>
  </div>
</body>
</html>`

  return new NextResponse(faturaHTML, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
