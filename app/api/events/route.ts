import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

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
        { status: 400, headers: corsHeaders },
      );
    }

    if (!["page_view", "click", "duration"].includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid event type." },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!["desktop", "mobile", "tablet"].includes(device)) {
      return NextResponse.json(
        { error: "Invalid device type." },
        { status: 400, headers: corsHeaders },
      );
    }

    // Auto-extract domain from the page URL
    let domain = "";
    try {
      domain = new URL(url).hostname;
    } catch {
      domain = url;
    }

    const userAgent = req.headers.get("user-agent") || "unknown";

    const event = await Event.create({
      domain,
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

    return NextResponse.json(
      { status: true, message: "Event created successfully.", event },
      { headers: corsHeaders },
    );
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500, headers: corsHeaders },
    );
  }
}
