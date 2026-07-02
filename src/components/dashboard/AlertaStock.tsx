import { Package } from "lucide-react"

interface AlertaStockProps {
  produtos: { name: string; stock: number; minStock: number }[]
}

export function AlertaStock({ produtos }: AlertaStockProps) {
  if (produtos.length === 0) return null

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Package className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold text-gray-900">Stock Baixo</h3>
      </div>
      <div className="space-y-2">
        {produtos.slice(0, 5).map((p) => (
          <div key={p.name} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">{p.name}</span>
            <span className="font-medium text-red-600">{p.stock} unidades</span>
          </div>
        ))}
      </div>
    </div>
  )
}
