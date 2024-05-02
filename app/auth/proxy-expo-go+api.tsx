// Redirect to native app with the code
export function GET(req: Request): Response {
  // This is fragile and won't work in many cases. It's just an example. Physical devices, and android emulators will need the full IP address instead of localhost.
  // This also assumes the dev server is running on port 8081.
  const redirectUri =
    `exp://localhost:8081/--/?` + new URL(req.url, "http://a").searchParams;

  console.log("Redirect to app:", redirectUri);

  return Response.redirect(redirectUri, 302);
}
