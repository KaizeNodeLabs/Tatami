import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const MODELS_JSON_PATH = path.join(process.cwd(), "public/models.json");

export async function GET() {
  try {
    // Return empty models array instead of reading from file
    // This ensures the application starts with no models
    return NextResponse.json({ models: [] });
  } catch (error) {
    console.error("Error reading models.json:", error);
    return NextResponse.json(
      { error: "Error reading models.json" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    fs.writeFileSync(MODELS_JSON_PATH, JSON.stringify(body, null, 2));
    
    return NextResponse.json({ 
      message: "Models updated successfully",
      models: body.models 
    });
  } catch (error) {
    console.error("Error writing to models.json:", error);
    return NextResponse.json(
      { error: "Error writing to models.json" },
      { status: 500 },
    );
  }
}
