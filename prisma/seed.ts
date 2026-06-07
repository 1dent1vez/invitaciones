import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Clean existing records
  await prisma.visita.deleteMany();
  await prisma.rSVP.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.lead.deleteMany();

  // Create a default client
  const client = await prisma.cliente.create({
    data: {
      nombre: "María Pérez",
      telefono: "5512345678",
      email: "maria@example.com",
      fuente: "instagram",
      notas: "Cliente preferente de bodas",
    },
  });

  // Create a default order
  const order = await prisma.pedido.create({
    data: {
      clienteId: client.id,
      tipoEvento: "boda",
      fechaEvento: new Date("2026-12-18T18:00:00Z"),
      template: "boda-elegante",
      precio: 1500.00,
      estado: "cotizado",
      notas: "Primera cotización para boda",
      slug: "maria-y-jose-2026",
      urlPublica: "http://localhost:3000/i/maria-y-jose-2026",
      qrUrl: "https://res.cloudinary.com/demo/image/upload/test.jpg",
      datosJson: {
        nombres: "María & José",
        fecha: "2026-12-18",
        ubicacion: "Hacienda del Sol",
        mensaje: "Acompáñanos a celebrar nuestro amor.",
      },
    },
  });

  console.log(`Seeding completed. Created client: ${client.nombre} and order slug: ${order.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
