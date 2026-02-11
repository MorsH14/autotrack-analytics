import connectDB from "@/lib/db";
import Event from "@/modals/Event";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();

    // --- 1. Page views per URL ---
    const pageViews = await Event.aggregate([
      { $match: { eventType: "page_view" } },
      { $group: { _id: "$url", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // --- 2. Clicks per element ---
    const clicks = await Event.aggregate([
      { $match: { eventType: "click" } },
      { $group: { _id: "$element", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // --- 3. Average duration per URL ---
    const durations = await Event.aggregate([
      { $match: { eventType: "duration" } },
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
