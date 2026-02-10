import connectDB from "@/lib/db";
import Event from "@/modals/Event";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();

    const {
      eventType,
      url,
      sessionId,
      referrer = "",
      device = "desktop",
    } = data;

    if (!eventType || !url || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    if (!["desktop", "mobile", "tablet"].includes(device)) {
      return NextResponse.json(
        { error: "Invalid device type" },
        { status: 400 },
      );
    }

    await Event.create({ eventType, url, sessionId, referrer, device });

    return NextResponse.json({
      status: true,
      message: "Successfully created event.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while creating the event." },
      { status: 500 },
    );
  }
}
