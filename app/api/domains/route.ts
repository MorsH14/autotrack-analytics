import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password");
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const domains = await Event.aggregate([
      {
        $group: {
          _id: "$domain",
          eventCount: { $sum: 1 },
          lastEvent: { $max: "$timestamp" },
        },
      },
      { $sort: { lastEvent: -1 } },
    ]);

    return NextResponse.json({ domains });
  } catch (error: any) {
    console.error("Domains API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 },
    );
  }
}
