import connectDB from "@/lib/db";
import Event from "@/modals/Event";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password");
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    await connectDB();

    const domain = req.nextUrl.searchParams.get("domain");
    const matchFilter = domain ? { domain } : {};

    const pageViews = await Event.aggregate([
      { $match: { ...matchFilter, eventType: "page_view" } },
      { $group: { _id: "$url", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const clicks = await Event.aggregate([
      { $match: { ...matchFilter, eventType: "click" } },
      { $group: { _id: "$element", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const durations = await Event.aggregate([
      { $match: { ...matchFilter, eventType: "duration" } },
      { $group: { _id: "$url", avgDuration: { $avg: "$duration" } } },
      { $sort: { avgDuration: -1 } },
    ]);

    return NextResponse.json({ pageViews, clicks, durations });
  } catch (error: any) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
