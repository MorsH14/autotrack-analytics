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
      element = "",
      text = "",
      duration = 0,
    } = data;

    if (!eventType || !url || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    if (!["page_view", "click", "duration"].includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid event type." },
        { status: 400 },
      );
    }

    if (!["desktop", "mobile", "tablet"].includes(device)) {
      return NextResponse.json(
        { error: "Invalid device type." },
        { status: 400 },
      );
    }

    const userAgent = req.headers.get("user-agent") || "unknown";

    const event = await Event.create({
      eventType,
      url,
      sessionId,
      referrer,
      device,
      userAgent,
      element,
      text,
      duration,
    });

    return NextResponse.json({
      status: true,
      message: "Event created successfully.",
      event,
    });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 },
    );
  }
}
