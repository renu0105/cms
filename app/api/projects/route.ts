import prisma from "@/hooks/prisma";
// import { verifySession } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const project = await prisma.project.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          techStacks: true,
        },
      });
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(project, { status: 200 });
    } else {
      const projects = await prisma.project.findMany({
        include: { techStacks: true },
      });
      return NextResponse.json(projects, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // const auth = await verifySession(req);
    // const userRole =
    //   auth.user?.metadata &&
    //   typeof auth.user.metadata === "object" &&
    //   "role" in auth.user.metadata
    //     ? (auth.user.metadata as { role?: string }).role
    //     : undefined;
    // if (!auth.authorized || userRole !== "admin") {
    //   return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    // }

    const data = await req.json();
    console.log("project received data", data);
    const { title, description, image, url, color } = data?.project;
    if (!title || !description || !image || !url) {
      return NextResponse.json(
        {
          error: "All fields (title, description, img, url) are required",
        },
        { status: 400 }
      );
    }

    // You must provide the admin relation; here we assume adminId is sent in the request body
    // const { adminId } = data;
    // if (!adminId) {
    //   return NextResponse.json(
    //     { error: "Admin ID is required" },
    //     { status: 400 }
    //   );
    // }

    // You must provide the admin relation; here we assume adminId is sent in the request body
    // const { adminId } = data;
    // if (!adminId) {
    //   return NextResponse.json(
    //     { error: "Admin ID is required" },
    //     { status: 400 }
    //   );
    // }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        img: image,
        url,
        color,
        // admin: { connect: { id: adminId } },
        // techStacks: {
        //   create: techStacks.map((name: string) => ({ name })),
        // },
      },
    });

    const { id } = newProject;
    console.log("id", id);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "failed to create" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // const auth = await verifySession(req);
    // const userRole =
    //   auth.user?.metadata &&
    //   typeof auth.user.metadata === "object" &&
    //   "role" in auth.user.metadata
    //     ? (auth.user.metadata as { role?: string }).role
    //     : undefined;
    // if (!auth.authorized || userRole !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const { searchParams } = new URL(req.url);
    // const id = searchParams.get("id");
    const data = await req.json();
    const { id, title, description, image, url, color } = data;
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const update = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        img: image,
        url,
        color,
      },
    });

    return NextResponse.json(update, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
