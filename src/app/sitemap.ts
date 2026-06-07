import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  // Fetch all published invitation slugs
  const orders = await prisma.pedido.findMany({
    where: {
      slug: {
        not: null,
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const invitationUrls = orders.map((order) => ({
    url: `${host}/i/${order.slug}`,
    lastModified: order.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: host,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${host}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...invitationUrls,
  ];
}
