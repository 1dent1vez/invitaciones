import { prisma } from "@/lib/prisma";
import { LeadsClient } from "./leads-client";

export const revalidate = 0; // Disable layout caching to guarantee actual DB entries are loaded

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <LeadsClient initialLeads={leads} />;
}
