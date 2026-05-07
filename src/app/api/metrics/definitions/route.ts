import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const defs = await prisma.metricDefinition.findMany({ orderBy: { goal: "asc" } });
  return NextResponse.json(defs);
}
