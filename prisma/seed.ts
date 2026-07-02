import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10)
  const staffPassword = await bcrypt.hash("staff123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@minigest.pt" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@minigest.pt",
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: "funcionario@minigest.pt" },
    update: {},
    create: {
      name: "Funcionário",
      email: "funcionario@minigest.pt",
      password: staffPassword,
      role: Role.STAFF,
    },
  })

  const categorias = await Promise.all([
    prisma.category.upsert({
      where: { slug: "bebidas" },
      update: {},
      create: { name: "Bebidas", slug: "bebidas" },
    }),
    prisma.category.upsert({
      where: { slug: "comidas" },
      update: {},
      create: { name: "Comidas", slug: "comidas" },
    }),
    prisma.category.upsert({
      where: { slug: "servicos" },
      update: {},
      create: { name: "Serviços", slug: "servicos" },
    }),
  ])

  await prisma.product.createMany({
    data: [
      { name: "Café Expresso", price: 40, costPrice: 10, stock: 200, minStock: 50, categoryId: categorias[0].id },
      { name: "Café Latte", price: 60, costPrice: 15, stock: 150, minStock: 30, categoryId: categorias[0].id },
      { name: "Coca-Cola 33cl", price: 50, costPrice: 25, stock: 100, minStock: 20, categoryId: categorias[0].id },
      { name: "Água 50cl", price: 40, costPrice: 15, stock: 200, minStock: 40, categoryId: categorias[0].id },
      { name: "Sumo Natural", price: 80, costPrice: 35, stock: 50, minStock: 10, categoryId: categorias[0].id },
      { name: "Torrada Mista", price: 120, costPrice: 45, stock: 30, minStock: 10, categoryId: categorias[1].id },
      { name: "Pastel de Nata", price: 50, costPrice: 15, stock: 40, minStock: 10, categoryId: categorias[1].id },
      { name: "Bola de Berlim", price: 100, costPrice: 35, stock: 20, minStock: 5, categoryId: categorias[1].id },
      { name: "Corte de Cabelo", price: 300, costPrice: 0, stock: 999, minStock: 0, categoryId: categorias[2].id },
      { name: "Manicure", price: 400, costPrice: 80, stock: 50, minStock: 10, categoryId: categorias[2].id },
    ],
    skipDuplicates: true,
  })

  await prisma.customer.createMany({
    data: [
      { name: "Denilson Felizardo Victor", phone: "+258879101185", points: 120 },
      { name: "Victor", phone: "+258844101199", points: 45 },
      { name: "Modesta", phone: "+258874101166", points: 200 },
    ],
    skipDuplicates: true,
  })

  console.log("Base de dados inicializada com sucesso!")
  console.log("Admin: admin@minigest.pt / admin123")
  console.log("Staff: funcionario@minigest.pt / staff123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
