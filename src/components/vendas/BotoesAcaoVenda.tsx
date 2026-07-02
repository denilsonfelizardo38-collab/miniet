"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Download, Share2, Trash2 } from "lucide-react"

interface BotoesAcaoVendaProps {
  vendaId: string
  faturaUrl: string
  whatsappUrl: string | null
  isAdmin: boolean
}

export function BotoesAcaoVenda({ vendaId, faturaUrl, whatsappUrl, isAdmin }: BotoesAcaoVendaProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Tem a certeza? Esta ação não pode ser desfeita.")) return
    setDeleting(true)

    const res = await fetch(`/api/vendas/${vendaId}`, { method: "DELETE" })

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || "Erro ao eliminar venda")
      setDeleting(false)
      return
    }

    toast.success("Venda eliminada com sucesso!")
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <a
        href={faturaUrl}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        <Download className="h-3 w-3" />
        PDF
      </a>
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50"
        >
          <Share2 className="h-3 w-3" />
          WhatsApp
        </a>
      )}
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-3 w-3" />
          {deleting ? "..." : "Eliminar"}
        </button>
      )}
    </div>
  )
}
