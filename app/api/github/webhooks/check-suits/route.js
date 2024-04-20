export async function POST(request) {
  const body = await request.json();
  console.log(body, new Date());

  return Response.json({ message: "ok" });
}
