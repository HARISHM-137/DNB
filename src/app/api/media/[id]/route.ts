import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
// import { ObjectId } from "mongodb"; // Removed direct import

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await props.params;
    const { id } = params;

    if (!id) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return new NextResponse("Database error", { status: 500 });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db);
    const _id = new mongoose.Types.ObjectId(id);

    const files = await bucket.find({ _id }).toArray();
    if (files.length === 0) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = files[0] as unknown as { contentType?: string; length: number };
    const stream = bucket.openDownloadStream(_id);

    // Cast node stream to web stream compatible type for Next.js response
    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Content-Length": file.length.toString()
      }
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
