import connectDB from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const transaction = await Transaction.create(body);
  return Response.json({ success: true, transaction });
}
