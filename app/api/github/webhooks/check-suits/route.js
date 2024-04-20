export async function POST(request) {
  const body = await request.json();
  console.log("check-suit", new Date());

  return Response.json({ message: "ok" });
}
