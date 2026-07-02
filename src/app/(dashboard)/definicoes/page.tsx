"use client"

import { useSession } from "next-auth/react"
import { Building2, Bell, Shield, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface PendingUser {
  id: string
  name: string
  email: string
  notes: string | null
  createdAt: string
}

export default function DefinicoesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const isAdmin = session?.user?.role === "ADMIN"

  const [pendentes, setPendentes] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) fetchPendentes()
    else setLoading(false)
  }, [isAdmin])

  async function fetchPendentes() {
    try {
      const res = await fetch("/api/admin/pendentes")
      if (res.ok) setPendentes(await res.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    const res = await fetch("/api/admin/pendentes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    })
    const data = await res.json()
    if (res.ok) {
      toast.success(data.message)
      fetchPendentes()
      router.refresh()
    } else {
      toast.error(data.error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Definições</h1>
        <p className="text-sm text-gray-500">Configurações do sistema</p>
      </div>

      {isAdmin && !loading && pendentes.length > 0 && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">
              Pedidos de Registo ({pendentes.length})
            </h3>
          </div>
          <div className="space-y-3">
            {pendentes.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border bg-white p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.email}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(p.id, "approve")}
                    className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => handleAction(p.id, "reject")}
                    className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Empresa</h3>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Nome, NIF, morada e contacto do seu negócio
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Notificações</h3>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Alertas de stock baixo e lembretes
          </p>
        </div>

        {isAdmin && (
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Permissões</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Gerir o que cada funcionário pode aceder
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-2 font-semibold text-gray-900">Sobre</h3>
        <p className="text-sm text-gray-500">
          MiniGest v0.1.0 — Sistema de Gestão Simples para pequenos negócios.
        </p>
      </div>
    </div>
  )
}
