"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import toast from "react-hot-toast"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditarClientePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    nif: "",
    notes: "",
  })

  useEffect(() => {
    fetch(`/api/clientes/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name,
          phone: data.phone,
          email: data.email || "",
          nif: data.nif || "",
          notes: data.notes || "",
        })
      })
      .catch(() => toast.error("Erro ao carregar cliente"))
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/clientes/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || "Erro ao atualizar")
      setLoading(false)
      return
    }

    toast.success("Cliente atualizado com sucesso!")
    router.push(`/clientes/${params.id}`)
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm("Tem a certeza que deseja eliminar este cliente?")) return
    setDeleting(true)

    const res = await fetch(`/api/clientes/${params.id}`, { method: "DELETE" })

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || "Erro ao eliminar")
      setDeleting(false)
      return
    }

    toast.success("Cliente eliminado com sucesso!")
    router.push("/clientes")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/clientes/${params.id}`} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Editar Cliente</h1>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? "A eliminar..." : "Eliminar"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">NIF</label>
          <input
            type="text"
            value={form.nif}
            onChange={(e) => setForm({ ...form, nif: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notas</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-3">
          <Link
            href={`/clientes/${params.id}`}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "A salvar..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  )
}
