export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard", "/vendas", "/clientes", "/produtos", "/relatorios", "/funcionarios", "/definicoes"],
}
