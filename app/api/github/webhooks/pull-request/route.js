export async function POST(request) {
  const body = await request.json();
  console.log("PR", new Date());

  return Response.json({ message: "ok" });
}
