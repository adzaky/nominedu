import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await connectToDatabase();
  const db = client.db();

  try {
    const nominees = await db.collection("nominees").find().toArray();

    if (nominees.length === 0) {
      return NextResponse.json({ message: "Data nominasi tidak ditemukan" });
    }

    return NextResponse.json(nominees);
  } catch (err) {
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
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
    return NextResponse.json(
      { message: "Semua kolom kosong. Harap isi setidaknya satu kolom." },
      { status: 400 }
    );
  }

  const { userId } = data;

  if (!userId) {
    return NextResponse.json(
      { message: "ID Pengguna diperlukan" },
      { status: 400 }
    );
  }

  try {
    const existingNominee = await db.collection("nominees").findOne({ userId });

    if (existingNominee) {
      return NextResponse.json(
        { message: "Pengguna sudah mengirimkan nominasi" },
        { status: 400 }
      );
    }

    const res = await db.collection("nominees").insertOne(data);

    if (!res.insertedId) {
      return NextResponse.json(
        { message: "Gagal menyimpan nominasi" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Nominasi berhasil disimpan", nominee: res },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Terjadi kesalahan",
        error: err.errorResponse?.errmsg || err.message,
      },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
