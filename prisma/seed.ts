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

  // Create Cumpleaños Esencial Demo (Sofía Hernández)
  const cumpleEsencial = await prisma.pedido.create({
    data: {
      clienteId: client.id,
      tipoEvento: "cumpleanos",
      paquete: "esencial",
      template: "cumpleanos-esencial",
      fechaEvento: new Date("2026-11-05T20:00:00.000Z"),
      precio: 350.00,
      estado: "completado",
      notas: "Demo Cumpleaños Esencial Sofía",
      slug: "sofia-esencial",
      urlPublica: "http://localhost:3000/i/sofia-esencial",
      qrUrl: "https://res.cloudinary.com/demo/image/upload/test.jpg",
      datosInvitacion: {
        nombre: "Sofía Hernández",
        edad: 30,
        fecha: "2026-11-05T20:00:00.000Z",
        hora: "20:00",
        lugar: "Terraza La Vista",
        direccion: "Av. Insurgentes 123, Condesa, CDMX",
        tipoCelebracion: "Adultos",
        fotoPortada: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop",
        mensaje: "¡Vamos a celebrar 30 años de risas y buenos amigos!",
        musica: "Fiesta",
        whatsapp: "5512345678",
        colorPrimario: "#f59e0b",
        colorSecundario: "#1f2937",
      },
    },
  });

  // Create Cumpleaños Completa Demo (Sofía Completa)
  const cumpleCompleta = await prisma.pedido.create({
    data: {
      clienteId: client.id,
      tipoEvento: "cumpleanos",
      paquete: "completa",
      template: "cumpleanos-completa",
      fechaEvento: new Date("2026-11-05T20:00:00.000Z"),
      precio: 550.00,
      estado: "completado",
      notas: "Demo Cumpleaños Completa Sofía",
      slug: "sofia-completa",
      urlPublica: "http://localhost:3000/i/sofia-completa",
      qrUrl: "https://res.cloudinary.com/demo/image/upload/test.jpg",
      datosInvitacion: {
        nombre: "Sofía Hernández",
        edad: 30,
        fecha: "2026-11-05T20:00:00.000Z",
        hora: "20:00",
        lugar: "Terraza La Vista",
        direccion: "Av. Insurgentes 123, Condesa, CDMX",
        tipoCelebracion: "Adultos",
        fotoPortada: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop",
        mensaje: "¡Vamos a celebrar 30 años de risas y buenos amigos!",
        musica: "Fiesta",
        whatsapp: "5512345678",
        colorPrimario: "#f59e0b",
        colorSecundario: "#1f2937",
        fotosGaleria: [
          "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400&auto=format&fit=crop"
        ],
        dressCode: "Casual",
        dressCodeDesc: "Vengan cómodos, habrá mucho baile y bebidas.",
        mensajeFestejo: "¡Gracias por ser parte de mi vida y celebrar conmigo!",
        itinerario: "20:00 Bienvenida & Cócteles\n21:30 Cena\n23:00 Brindis & Pastel\n23:30 Abre Pista de Baile",
        datosRegalo: "Si deseas hacerme un regalo, puedes realizar una transferencia al banco Santander CLABE: 01234567890 a nombre de Sofía Hernández.",
        mesaRegalos: false,
      },
    },
  });

  // Create Cumpleaños Premium Demo (Sofía Premium)
  const cumplePremium = await prisma.pedido.create({
    data: {
      clienteId: client.id,
      tipoEvento: "cumpleanos",
      paquete: "premium",
      template: "cumpleanos-premium",
      fechaEvento: new Date("2026-11-05T20:00:00.000Z"),
      precio: 850.00,
      estado: "completado",
      notas: "Demo Cumpleaños Premium Sofía",
      slug: "sofia-premium",
      urlPublica: "http://localhost:3000/i/sofia-premium",
      qrUrl: "https://res.cloudinary.com/demo/image/upload/test.jpg",
      datosInvitacion: {
        nombre: "Sofía Hernández",
        edad: 30,
        fecha: "2026-11-05T20:00:00.000Z",
        hora: "20:00",
        lugar: "Terraza La Vista",
        direccion: "Av. Insurgentes 123, Condesa, CDMX",
        tipoCelebracion: "Adultos",
        fotoPortada: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop",
        mensaje: "¡Vamos a celebrar 30 años de risas y buenos amigos!",
        musica: "Fiesta",
        whatsapp: "5512345678",
        colorPrimario: "#f59e0b",
        colorSecundario: "#1f2937",
        fotosGaleria: [
          "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400&auto=format&fit=crop"
        ],
        dressCode: "Elegante",
        dressCodeDesc: "Vestimenta Cocktail / Formal.",
        mensajeFestejo: "¡Gracias por ser parte de mi vida y celebrar conmigo!",
        itinerario: "20:00 Bienvenida & Cócteles\n21:30 Cena\n23:00 Brindis & Pastel\n23:30 Abre Pista de Baile",
        datosRegalo: "Si deseas hacerme un regalo, puedes realizar una transferencia al banco Santander CLABE: 01234567890 a nombre de Sofía Hernández.",
        mesaRegalos: false,
        historiaEdad: "Llegar a los 30 años representa un nuevo comienzo, una etapa de madurez y de apreciar a quienes realmente importan.",
        historiaSeresQueridos: "A mi familia y amigos: gracias por sosterme en cada paso de este viaje. Su amor es mi mejor regalo.",
        historiaRecuerdo: "Mi viaje favorito a Japón el año pasado, donde aprendí que la vida se vive paso a paso.",
        fotosExtra: [
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop"
        ],
        buzonDeseos: true,
        pases: true,
        numPases: 2,
        tematica: "Elegante",
        videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        colorAcento: "Dorado"
      },
    },
  });

  // Create mock RSVPs for birthday demos
  await prisma.rSVP.createMany({
    data: [
      { pedidoId: cumplePremium.id, nombre: "Juan Gómez", asiste: true, pax: 2, telefono: "5511223344", mensaje: "¡Felicidades Sofi! Ahí estaremos" },
      { pedidoId: cumplePremium.id, nombre: "Sofía Martínez", asiste: true, pax: 1, telefono: "5522334455", mensaje: "¡Qué gran fiesta se viene!" },
      { pedidoId: cumplePremium.id, nombre: "Eduardo López", asiste: false, pax: 0, telefono: "5533445566", mensaje: "Lo siento, ando fuera de la ciudad" }
    ]
  });

  // Create 2 contact leads as a demo too
  await prisma.lead.createMany({
    data: [
      {
        nombre: "Roberto Sánchez",
        evento: "cumpleanos",
        fecha: new Date("2026-09-12T00:00:00Z"),
        telefono: "5566778899",
        mensaje: "Me interesa el paquete Premium para mi cumpleaños número 40."
      },
      {
        nombre: "Gabriela Montes",
        evento: "cumpleanos",
        fecha: new Date("2026-11-20T00:00:00Z"),
        telefono: "5577889900",
        mensaje: "Quisiera información sobre el diseño de Cumpleaños Completa."
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
