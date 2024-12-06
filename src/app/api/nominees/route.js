import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await connectToDatabase();
  const db = client.db();

  try {
    const nominees = await db.collection("nominees").find().toArray();

    if (nominees.length === 0) {
      return NextResponse.json({ message: "No nominees found" });
    }

    return NextResponse.json(nominees);
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  } finally {
    client.close();
  }
}

export async function POST(req) {
  const client = await connectToDatabase();
  const db = client.db();

  const data = await req.json();

  for (const key in data) {
    if (data[key] === "") {
      delete data[key];
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ message: "All fields are empty. Please fill at least one field." }, { status: 400 });
  }

  const { userId } = data;

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const existingNominee = await db.collection("nominees").findOne({ userId });

    if (existingNominee) {
      return NextResponse.json({ message: "User has already submitted a nomination" }, { status: 400 });
    }

    const res = await db.collection("nominees").insertOne(data);

    if (!res.insertedId) {
      return NextResponse.json({ message: "Failed to save nomination" }, { status: 500 });
    }

    return NextResponse.json({ message: "Nomination saved successfully", nominee: res }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: err.errorResponse?.errmsg || err.message,
      },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
