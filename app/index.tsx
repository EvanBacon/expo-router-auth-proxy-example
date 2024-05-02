import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, TokenResponse } from "expo-auth-session";
import { Button, Platform, Text, View } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";

/* @info <strong>Web only:</strong> This method should be invoked on the page that the auth popup gets redirected to on web, it'll ensure that authentication is completed properly. On native this does nothing. */
WebBrowser.maybeCompleteAuthSession();
/* @end */

// Endpoint
const discovery = {
  authorizationEndpoint: "https://id.twitch.tv/oauth2/authorize",
  tokenEndpoint: "https://id.twitch.tv/oauth2/token",
  revocationEndpoint: "https://id.twitch.tv/oauth2/revoke",
};

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const serverOrigin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081/"
    : // TODO: Set this as your production dev server location. You can also configure this using an environment variable for preview deployments.
      "https://.../";

const proxyUrl = new URL(
  // This changes because we have a naive proxy that hardcodes the redirect URL.
  Platform.select({
    native: isExpoGo ? "/auth/proxy-expo-go" : "/auth/proxy",
    // This can basically be any web URL.
    default: "/auth/pending",
  }),
  serverOrigin
).toString();

export default function App() {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);

  if (accessToken) {
    return (
      <View>
        <Text>Access Token:</Text>
        <Text>{accessToken}</Text>
      </View>
    );
  }

  return (
    <View>
      <TwitchAuthButton onAuth={(auth) => setAccessToken(auth.accessToken)} />
    </View>
  );
}
function TwitchAuthButton({
  onAuth,
}: {
  onAuth: (auth: TokenResponse) => void;
}) {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_TWITCH_CLIENT_ID!,
      scopes: ["user:read:email", "analytics:read:games"],

      // Use implicit flow to avoid code exchange.
      responseType: "token",
      redirectUri: proxyUrl,
      // Enable PKCE (Proof Key for Code Exchange) to prevent another app from intercepting the redirect request.
      usePKCE: true,
    },
    discovery
  );
  console.log("Redirect", request);

  React.useEffect(() => {
    if (request && response?.type === "success" && response.authentication) {
      console.log("Access Token:", response.authentication?.accessToken);
      onAuth(response.authentication);
    }
  }, [response, onAuth]);

  return (
    <Button
      /* @info Disable the button until the request is loaded asynchronously. */
      disabled={!request}
      /* @end */
      title="Login"
      onPress={() => {
        /* @info Prompt the user to authenticate in a user interaction or web browsers will block it. */
        promptAsync();
        /* @end */
      }}
    />
  );
}
