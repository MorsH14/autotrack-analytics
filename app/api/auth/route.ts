import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD not configured on server." },
        { status: 500 },
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { valid: false, error: "Wrong password." },
        { status: 401 },
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, error: error.message || "Internal server error." },
      { status: 500 },
    );
  }
}
