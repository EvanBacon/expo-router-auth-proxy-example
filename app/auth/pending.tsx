import * as WebBrowser from "expo-web-browser";
import { Text, View } from "react-native";
/* @info <strong>Web only:</strong> This method should be invoked on the page that the auth popup gets redirected to on web, it'll ensure that authentication is completed properly. On native this does nothing. */
WebBrowser.maybeCompleteAuthSession();
/* @end */

export default function App() {
  return (
    <View>
      <Text>Finishing Authentication on web</Text>
    </View>
  );
}
