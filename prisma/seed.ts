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

  // Create Boda Demo (Ana & Carlos)
  const boda = await prisma.pedido.create({
    data: {
      clienteId: client.id,
      tipoEvento: "boda",
      fechaEvento: new Date("2026-08-15T18:00:00Z"),
      template: "boda-elegante",
      precio: 1499.00,
      estado: "completado",
      notas: "Demo Boda Ana & Carlos",
      slug: "ana-y-carlos",
      urlPublica: "http://localhost:3000/i/ana-y-carlos",
      qrUrl: "https://res.cloudinary.com/demo/image/upload/test.jpg",
      datosJson: {
        nombres: "Ana & Carlos",
        fecha: "2026-08-15",
        ubicacion: "Club de Playa Coral, Playa del Carmen",
        mapaUrl: "https://maps.app.goo.gl/abcdefg",
        mensaje: "Nuestra boda en el paraíso. Acompáñanos a celebrar nuestro amor frente al mar.",
        dressCode: "Formal Guayabera / Playa",
        padres: "Sofía & Roberto, Teresa & Manuel",
        padrinos: "Lucía & Fernando",
        colorPrincipal: "#d4af37",
        colorSecundario: "#2e4a62",
      },
    },
  });

  // Create XV Demo (María Fernanda)
  const xv = await prisma.pedido.create({
    data: {
      clienteId: client.id,
      tipoEvento: "xv",
      fechaEvento: new Date("2026-09-20T19:00:00Z"),
      template: "xv-moderno",
      precio: 1499.00,
      estado: "completado",
      notas: "Demo XV María Fernanda",
      slug: "xv-maria-fernanda",
      urlPublica: "http://localhost:3000/i/xv-maria-fernanda",
      qrUrl: "https://res.cloudinary.com/demo/image/upload/test.jpg",
      datosJson: {
        nombres: "María Fernanda",
        fecha: "2026-09-20",
        ubicacion: "Salón Las Palmas, Av. Reforma 450",
        mapaUrl: "https://maps.app.goo.gl/hijklmn",
        mensaje: "Hoy empiezo una nueva etapa llena de ilusiones y momentos mágicos.",
        dressCode: "Formal / Cóctel",
        musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        portadaUrl: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop",
      },
    },
  });

  // Create Baby Shower Demo (Bebé Mateo)
  const baby = await prisma.pedido.create({
    data: {
      clienteId: client.id,
      tipoEvento: "baby_shower",
      fechaEvento: new Date("2026-10-10T16:00:00Z"),
      template: "baby-shower",
      precio: 1200.00,
      estado: "completado",
      notas: "Demo Baby Shower Bebé Mateo",
      slug: "baby-mateo",
      urlPublica: "http://localhost:3000/i/baby-mateo",
      qrUrl: "https://res.cloudinary.com/demo/image/upload/test.jpg",
      datosJson: {
        nombres: "Laura & Carlos",
        nombreBebe: "Mateo",
        fecha: "2026-10-10",
        ubicacion: "Casa de los Abuelos, Calle Naranjos #42",
        mapaUrl: "https://maps.app.goo.gl/opqrst",
        mensaje: "Estamos muy felices de esperar la llegada de nuestro amado Mateo.",
        regalosDatos: "Mesa de regalos en Liverpool (Evento 987654) o pañales etapa 1 y 2.",
      },
    },
  });

  // Create Cumpleaños Demo (Santiago)
  const cumple = await prisma.pedido.create({
    data: {
      clienteId: client.id,
      tipoEvento: "cumpleanos",
      fechaEvento: new Date("2026-11-05T15:00:00Z"),
      template: "cumpleanos-fiesta",
      precio: 799.00,
      estado: "completado",
      notas: "Demo Cumpleaños Santiago",
      slug: "santiago-cumple",
      urlPublica: "http://localhost:3000/i/santiago-cumple",
      qrUrl: "https://res.cloudinary.com/demo/image/upload/test.jpg",
      datosJson: {
        nombres: "Santiago",
        fecha: "2026-11-05",
        ubicacion: "Alberca Club Campestre, Carretera Nacional Km 5",
        mapaUrl: "https://maps.app.goo.gl/uvwxyz",
        mensaje: "¡Vamos a celebrar mis 30 años con música, alberca y buenos amigos!",
        regalosDatos: "Lluvia de sobres en efectivo.",
      },
    },
  });

  // Generate mock RSVPs
  await prisma.rSVP.createMany({
    data: [
      { pedidoId: boda.id, nombre: "Juan Gómez", asiste: true, pax: 2, telefono: "5511223344", mensaje: "¡Felicidades, nos vemos ahí!" },
      { pedidoId: boda.id, nombre: "Sofía Martínez", asiste: true, pax: 1, telefono: "5522334455", mensaje: "¡Qué emoción!" },
      { pedidoId: boda.id, nombre: "Eduardo López", asiste: false, pax: 0, telefono: "5533445566", mensaje: "Lo siento, no podré asistir" },
      { pedidoId: xv.id, nombre: "Tía Patricia", asiste: true, pax: 4, telefono: "5544556677", mensaje: "Ahí estaremos toda la familia" },
      { pedidoId: baby.id, nombre: "Lorena Flores", asiste: true, pax: 1, telefono: "5555667788", mensaje: "¡Llevaré pañales!" }
    ]
  });

  // Generate mock Visits spread across the last 7 days
  const today = new Date();
  const generateDate = (daysAgo: number, hours: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, 0, 0, 0);
    return d;
  };

  await prisma.visita.createMany({
    data: [
      // Boda visits
      { pedidoId: boda.id, ip: "192.168.1.1", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(0, 10) },
      { pedidoId: boda.id, ip: "192.168.1.2", userAgent: "Mozilla/5.0 Safari", fecha: generateDate(0, 14) },
      { pedidoId: boda.id, ip: "192.168.1.3", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(1, 9) },
      { pedidoId: boda.id, ip: "192.168.1.4", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(1, 15) },
      { pedidoId: boda.id, ip: "192.168.1.5", userAgent: "Mozilla/5.0 Firefox", fecha: generateDate(2, 11) },
      { pedidoId: boda.id, ip: "192.168.1.6", userAgent: "Mozilla/5.0 Safari", fecha: generateDate(3, 18) },
      { pedidoId: boda.id, ip: "192.168.1.7", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(4, 20) },
      { pedidoId: boda.id, ip: "192.168.1.8", userAgent: "Mozilla/5.0 Safari", fecha: generateDate(5, 8) },
      { pedidoId: boda.id, ip: "192.168.1.9", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(6, 12) },

      // XV visits
      { pedidoId: xv.id, ip: "192.168.2.1", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(0, 11) },
      { pedidoId: xv.id, ip: "192.168.2.2", userAgent: "Mozilla/5.0 Safari", fecha: generateDate(1, 13) },
      { pedidoId: xv.id, ip: "192.168.2.3", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(2, 16) },
      { pedidoId: xv.id, ip: "192.168.2.4", userAgent: "Mozilla/5.0 Firefox", fecha: generateDate(3, 17) },
      { pedidoId: xv.id, ip: "192.168.2.5", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(4, 10) },

      // Baby Shower visits
      { pedidoId: baby.id, ip: "192.168.3.1", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(0, 12) },
      { pedidoId: baby.id, ip: "192.168.3.2", userAgent: "Mozilla/5.0 Safari", fecha: generateDate(1, 14) },
      { pedidoId: baby.id, ip: "192.168.3.3", userAgent: "Mozilla/5.0 Chrome", fecha: generateDate(2, 15) }
    ]
  });

  // Create 2 contact leads as a demo too
  await prisma.lead.createMany({
    data: [
      {
        nombre: "Roberto Sánchez",
        evento: "boda",
        fecha: new Date("2026-09-12T00:00:00Z"),
        telefono: "5566778899",
        mensaje: "Me interesa el paquete Premium para mi boda en Cuernavaca."
      },
      {
        nombre: "Gabriela Montes",
        evento: "xv",
        fecha: new Date("2026-11-20T00:00:00Z"),
        telefono: "5577889900",
        mensaje: "Quisiera información sobre el diseño de XV Años Deluxe."
      }
    ]
  });

  console.log(`Seeding completed successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
