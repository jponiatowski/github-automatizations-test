export async function POST(request) {
  const body = await request.json();
  console.log("deploymemt", new Date());

  return Response.json({ message: "ok" });
}
