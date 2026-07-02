"use client"

import { useState } from "react"
import { User } from "lucide-react"

interface Cliente {
  id: string
  name: string
  phone: string
}

interface ClienteSelectProps {
  clientes: Cliente[]
  selected: Cliente | null
  onSelect: (cliente: Cliente | null) => void
}

export function ClienteSelect({ clientes, selected, onSelect }: ClienteSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtrados = clientes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  )

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border p-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        <User className="h-4 w-4" />
        {selected ? selected.name : "Selecionar cliente"}
      </button>

      {open && (
        <div className="mt-2 rounded-lg border bg-white p-2 shadow-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar cliente..."
            className="mb-2 w-full rounded border p-1.5 text-sm"
            autoFocus
          />
          <div className="max-h-40 overflow-y-auto">
            <button
              onClick={() => { onSelect(null); setOpen(false) }}
              className="w-full rounded p-1.5 text-left text-sm text-gray-500 hover:bg-gray-100"
            >
              Sem cliente
            </button>
            {filtrados.map((c) => (
              <button
                key={c.id}
                onClick={() => { onSelect(c); setOpen(false) }}
                className="w-full rounded p-1.5 text-left text-sm hover:bg-gray-100"
              >
                {c.name}
                <span className="ml-2 text-xs text-gray-400">{c.phone}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
