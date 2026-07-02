import { cn } from "@/lib/utils"

interface CardResumoProps {
  titulo: string
  valor: string
  descricao?: string
  icone: React.ReactNode
  className?: string
}

export function CardResumo({ titulo, valor, descricao, icone, className }: CardResumoProps) {
  return (
    <div className={cn("rounded-xl border bg-white p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{titulo}</p>
        <div className="rounded-lg bg-primary-50 p-2 text-primary-600">{icone}</div>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{valor}</p>
      {descricao && <p className="mt-1 text-xs text-gray-500">{descricao}</p>}
    </div>
  )
}
