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

    const categories = [
      "mentor_terbaik",
      "terpopulerKing",
      "terpopulerQueen",
      "terkocak",
      "terdiam",
      "terlambat",
      "terngantuk",
      "termodis",
    ];

    const calculateTop3 = (category) => {
      const voteCount = {};

      nominees.forEach((nomination) => {
        const nominee = nomination[category];
        if (nominee) {
          voteCount[nominee] = (voteCount[nominee] || 0) + 1;
        }
      });

      const sortedVotes = Object.entries(voteCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      return sortedVotes.map(([name, count]) => ({ name, count }));
    };

    const top3Results = {};
    categories.forEach((category) => {
      top3Results[category] = calculateTop3(category);
    });

    return NextResponse.json(top3Results);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  } finally {
    client.close();
  }
}
