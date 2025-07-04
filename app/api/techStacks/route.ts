import prisma from "@/hooks/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const techStack = await prisma.techStack.findUnique({
        where: { id: Number(id) },
      });

      if (!techStack) {
        return NextResponse.json(
          { error: "TechStack not found" },
          { status: 502 }
        );
      }
      return NextResponse.json(techStack, { status: 200 });
    } else {
      const techStacks = await prisma.techStack.findMany({
        orderBy: { id: "asc" }, // or createdAt: 'asc'
      });
      return NextResponse.json(techStacks, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json(
      { err: "failed to fetch techStack" },
      { status: 404 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("data ", data);
    const { name, color } = data;
    if (!name || !color) {
      return NextResponse.json(
        {
          error: "Name and color are required",
        },
        { status: 400 }
      );
    }

    const newTechStack = await prisma.techStack.create({
      data: {
        name,
        color,
      },
    });
    const { id } = newTechStack;
    console.log("id", id);
    return NextResponse.json(newTechStack, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { err: "failed to fetch techStack" },
      { status: 404 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, id, color, projectId } = data;

    if (!id) {
      return NextResponse.json(
        { error: "TechStack ID is required" },
        { status: 400 }
      );
    }

    const techStack = await prisma.techStack.update({
      where: { id: Number(id) },
      data: {
        name,
        projectId,
        color,
      },
    });
    return NextResponse.json(techStack, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { err: "failed to fetch techStack" },
      { status: 404 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = await new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ err: "id not found" }, { status: 400 });
    }

    await prisma.techStack.delete({ where: { id: Number(id) } });
    return NextResponse.json(
      { message: "Successfully deleted" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { err: "failed to fetch techStack" },
      { status: 404 }
    );
  }
}
