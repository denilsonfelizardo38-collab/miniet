"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface GraficoVendasProps {
  data: { label: string; valor: number }[]
}

export function GraficoVendas({ data }: GraficoVendasProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Vendas (últimos 7 dias)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="valor" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
