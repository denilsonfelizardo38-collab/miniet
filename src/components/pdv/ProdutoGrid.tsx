"use client"

import { Search } from "lucide-react"
import { useState } from "react"

interface Produto {
  id: string
  name: string
  price: number
  stock: number
}

interface ProdutoGridProps {
  produtos: Produto[]
  onAdd: (produto: Produto) => void
}

export function ProdutoGrid({ produtos, onAdd }: ProdutoGridProps) {
  const [search, setSearch] = useState("")

  const filtrados = produtos.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar produtos..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
          {filtrados.map((produto) => (
            <button
              key={produto.id}
              onClick={() => onAdd(produto)}
              disabled={produto.stock <= 0}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-100 p-4 transition-all hover:border-primary-300 hover:bg-primary-50 disabled:opacity-40"
            >
              <span className="text-sm font-semibold text-gray-900">{produto.name}</span>
              <span className="mt-1 text-lg font-bold text-primary-600">
                MT {Number(produto.price).toFixed(2)}
              </span>
              {produto.stock < 10 && (
                <span className="mt-1 text-xs text-amber-600">{produto.stock} em stock</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
