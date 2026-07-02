import React from "react"
import { renderToStream, Document } from "@react-pdf/renderer"
import { FaturaPage } from "./FaturaPDF"

interface VendaData {
  id: string
  createdAt: Date
  total: number
  paymentMethod?: string | null
  customer?: {
    name: string
    phone: string
    nif?: string | null
  } | null
  user: {
    name: string
    email: string
  }
  items: Array<{
    quantity: number
    unitPrice: number
    subtotal: number
    product: { name: string }
  }>
}

export async function gerarFaturaPDF(venda: VendaData): Promise<Uint8Array> {
  const stream = await renderToStream(
    React.createElement(Document, null,
      React.createElement(FaturaPage, { venda })
    )
  )
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk))
    stream.on("end", () => {
      const totalLength = chunks.reduce((acc, c) => acc + c.length, 0)
      const result = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of chunks) {
        result.set(chunk, offset)
        offset += chunk.length
      }
      resolve(result)
    })
    stream.on("error", reject)
  })
}
