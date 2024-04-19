export async function POST(request) {
  const body = RequestBody.parse(await request.json());
  console.log(body);

  return Response.json({ message: "ok" });
}
