export async function POST(request) {
  const body = await request.json();
  console.log("workflow jobs", new Date());

  return Response.json({ message: "ok" });
}
