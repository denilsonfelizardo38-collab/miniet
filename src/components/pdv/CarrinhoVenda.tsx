"use client"

import { Trash2, Plus, Minus } from "lucide-react"

interface CarrinhoItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
}

interface CarrinhoVendaProps {
  items: CarrinhoItem[]
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemove: (productId: string) => void
}

export function CarrinhoVenda({ items, onUpdateQuantity, onRemove }: CarrinhoVendaProps) {
  const total = items.reduce((acc, item) => acc + item.subtotal, 0)

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-gray-400">Clique nos produtos para adicionar ao carrinho</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">Carrinho</h3>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-500">MT {item.unitPrice.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateQuantity(item.productId, -1)}
                className="rounded p-1 hover:bg-gray-200"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.productId, 1)}
                className="rounded p-1 hover:bg-gray-200"
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                onClick={() => onRemove(item.productId)}
                className="ml-1 rounded p-1 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total</span>
          <span className="text-lg font-bold text-gray-900">MT {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
