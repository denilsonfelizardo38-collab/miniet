"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Search, Trash2, Plus, Minus, User } from "lucide-react"

interface Produto {
  id: string
  name: string
  price: number
  stock: number
  active?: boolean
  category?: { name: string }
}

interface Cliente {
  id: string
  name: string
  phone: string
}

interface CarrinhoItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export default function NovaVendaPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [search, setSearch] = useState("")
  const [clienteSearch, setClienteSearch] = useState("")
  const [clienteSelected, setClienteSelected] = useState<Cliente | null>(null)
  const [showClientes, setShowClientes] = useState(false)
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("dinheiro")

  useEffect(() => {
    fetch("/api/produtos").then((r) => r.json()).then(setProdutos)
    fetch("/api/clientes").then((r) => r.json()).then(setClientes)
  }, [])

  const produtosFiltrados = produtos.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) && p.active !== false,
  )

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.name.toLowerCase().includes(clienteSearch.toLowerCase()) ||
      c.phone.includes(clienteSearch),
  )

  function addAoCarrinho(produto: Produto) {
    setCarrinho((prev) => {
      const existente = prev.find((item) => item.productId === produto.id)
      if (existente) {
        return prev.map((item) =>
          item.productId === produto.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.unitPrice,
              }
            : item,
        )
      }
      return [
        ...prev,
        {
          productId: produto.id,
          name: produto.name,
          quantity: 1,
          unitPrice: Number(produto.price),
          subtotal: Number(produto.price),
        },
      ]
    })
  }

  function updateQuantity(productId: string, delta: number) {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + delta),
                subtotal: Math.max(1, item.quantity + delta) * item.unitPrice,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removerItem(productId: string) {
    setCarrinho((prev) => prev.filter((item) => item.productId !== productId))
  }

  const total = carrinho.reduce((acc, item) => acc + item.subtotal, 0)

  async function finalizarVenda() {
    if (carrinho.length === 0) {
      toast.error("Adicione produtos ao carrinho")
      return
    }

    const res = await fetch("/api/vendas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: carrinho.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        total,
        customerId: clienteSelected?.id || null,
        paymentMethod,
        userId: session?.user?.id,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || "Erro ao finalizar venda")
      return
    }

    toast.success("Venda registada com sucesso!")
    router.push("/vendas")
    router.refresh()
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 lg:flex-row">
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
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
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {produtosFiltrados.map((produto) => (
              <button
                key={produto.id}
                onClick={() => addAoCarrinho(produto)}
                disabled={produto.stock <= 0}
                className="flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-colors hover:border-primary-400 hover:bg-primary-50 disabled:opacity-40"
              >
                <span className="text-sm font-medium text-gray-900">{produto.name}</span>
                <span className="mt-1 text-xs text-gray-500">
                  MT {Number(produto.price).toFixed(2)}
                </span>
                {produto.stock < 10 && (
                  <span className="mt-1 text-[10px] text-amber-600">{produto.stock} em stock</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col rounded-xl border bg-white shadow-sm lg:w-96">
        <div className="border-b p-3">
          <button
            onClick={() => setShowClientes(!showClientes)}
            className="flex w-full items-center gap-2 rounded-lg border p-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <User className="h-4 w-4" />
            {clienteSelected ? clienteSelected.name : "Selecionar cliente"}
          </button>

          {showClientes && (
            <div className="mt-2">
              <input
                type="text"
                value={clienteSearch}
                onChange={(e) => setClienteSearch(e.target.value)}
                placeholder="Pesquisar cliente..."
                className="mb-2 w-full rounded border p-1.5 text-sm"
              />
              <div className="max-h-32 overflow-y-auto">
                <button
                  onClick={() => { setClienteSelected(null); setShowClientes(false) }}
                  className="w-full rounded p-1.5 text-left text-sm text-gray-500 hover:bg-gray-100"
                >
                  Sem cliente
                </button>
                {clientesFiltrados.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setClienteSelected(c); setShowClientes(false) }}
                    className="w-full rounded p-1.5 text-left text-sm hover:bg-gray-100"
                  >
                    {c.name} - {c.phone}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Carrinho</h3>
          {carrinho.length === 0 ? (
            <p className="text-sm text-gray-400">Clique nos produtos para adicionar</p>
          ) : (
            <div className="space-y-2">
              {carrinho.map((item) => (
                <div key={item.productId} className="flex items-center justify-between rounded-lg bg-gray-50 p-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">MT {item.unitPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="rounded p-1 hover:bg-gray-200"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="rounded p-1 hover:bg-gray-200"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removerItem(item.productId)}
                      className="ml-1 rounded p-1 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-3">
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600">Método de Pagamento</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 text-sm"
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="multibanco">Multibanco</option>
              <option value="mbway">MB Way</option>
              <option value="referencia">Referência</option>
            </select>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-lg font-bold text-gray-900">MT {total.toFixed(2)}</span>
          </div>

          <button
            onClick={finalizarVenda}
            disabled={carrinho.length === 0}
            className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  )
}
