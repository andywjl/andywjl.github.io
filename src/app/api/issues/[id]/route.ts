import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const issue = await prisma.issue.findUnique({
    where: { id },
    include: { campus: true, project: true },
  });
  if (!issue) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(issue);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const issue = await prisma.issue.update({ where: { id }, data: body });
  return NextResponse.json(issue);
}
