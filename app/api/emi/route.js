export async function POST(req) {
  const { price, downPayment, rate, tenure } = await req.json();

  const loanAmount = price - downPayment;
  const monthlyRate = rate / 12 / 100;
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);

  return Response.json({
    success: true,
    emi: Math.round(emi),
  });
}
