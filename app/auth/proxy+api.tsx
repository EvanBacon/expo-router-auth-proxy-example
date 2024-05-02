// Redirect to native app with the code
export function GET(req: Request): Response {
  // Ensure this matches the scheme in your native app. Remember, scheme's aren't secure as other apps could
  // register the same scheme and intercept the access token.
  // A more thorough implementation would involve a state parameter to prevent CSRF attacks.
  // Even better would be an Expo webpage which the native auth session points to, this performs auth and code exchange, then redirects back with the access token.
  const redirectUri =
    `twitch-auth-demo://?` + new URL(req.url, "http://a").searchParams;

  console.log("Redirect to app:", redirectUri);

  return Response.redirect(redirectUri, 302);
}
