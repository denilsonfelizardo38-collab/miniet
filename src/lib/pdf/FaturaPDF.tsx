import React from "react"
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0284c7",
  },
  subtitle: {
    fontSize: 9,
    color: "#9ca3af",
    marginTop: 2,
  },
  meta: {
    textAlign: "right",
    fontSize: 9,
    color: "#6b7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  clienteBox: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  clienteNome: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
  },
  clienteInfo: {
    fontSize: 9,
    color: "#6b7280",
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: "8 12",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableHeaderText: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: "8 12",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableCell: {
    fontSize: 9,
    color: "#1f2937",
  },
  colProduto: { width: "50%" },
  colQtd: { width: "15%", textAlign: "center" },
  colPreco: { width: "17%", textAlign: "right" },
  colSubtotal: { width: "18%", textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: "8 12",
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 20,
  },
  totalValor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0284c7",
  },
  metodo: {
    textAlign: "right",
    fontSize: 9,
    color: "#6b7280",
    marginTop: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 15,
  },
})

interface FaturaPDFProps {
  venda: {
    id: string
    createdAt: Date
    total: number
    paymentMethod?: string | null
    customer?: { name: string; phone: string; nif?: string | null } | null
    user: { name: string; email: string }
    items: Array<{
      quantity: number
      unitPrice: number
      subtotal: number
      product: { name: string }
    }>
  }
}

export function FaturaPage({ venda }: FaturaPDFProps) {
  const data = new Date(venda.createdAt).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>MiniGest</Text>
          <Text style={styles.subtitle}>Gestão Simples</Text>
        </View>
        <View style={styles.meta}>
          <Text>Fatura #{venda.id.slice(0, 8).toUpperCase()}</Text>
          <Text>{data}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emitido por</Text>
        <Text style={{ fontSize: 10 }}>{venda.user.name}</Text>
        <Text style={{ fontSize: 9, color: "#6b7280" }}>{venda.user.email}</Text>
      </View>

      {venda.customer && (
        <View style={styles.clienteBox}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Text style={styles.clienteNome}>{venda.customer.name}</Text>
          <Text style={styles.clienteInfo}>
            {venda.customer.phone}
            {venda.customer.nif ? `  |  NIF: ${venda.customer.nif}` : ""}
          </Text>
        </View>
      )}

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colProduto]}>Produto</Text>
          <Text style={[styles.tableHeaderText, styles.colQtd]}>Qtd</Text>
          <Text style={[styles.tableHeaderText, styles.colPreco]}>Preço Unit.</Text>
          <Text style={[styles.tableHeaderText, styles.colSubtotal]}>Subtotal</Text>
        </View>

        {venda.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colProduto]}>{item.product.name}</Text>
            <Text style={[styles.tableCell, styles.colQtd]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, styles.colPreco]}>
              MT {Number(item.unitPrice).toFixed(2)}
            </Text>
            <Text style={[styles.tableCell, styles.colSubtotal]}>
              MT {Number(item.subtotal).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>MT {Number(venda.total).toFixed(2)}</Text>
        </View>
      </View>

      {venda.paymentMethod && (
        <Text style={styles.metodo}>
          Método de Pagamento: <Text style={{ fontWeight: "bold" }}>{venda.paymentMethod}</Text>
        </Text>
      )}

      <View style={styles.footer}>
        <Text>MiniGest — Sistema de Gestão Simples</Text>
        <Text>Obrigado pela sua preferência!</Text>
      </View>
    </Page>
  )
}
