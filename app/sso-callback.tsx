import { View } from "react-native";

/**
 * Deep-link target for Clerk `useSSO` (expo-auth-session redirect URI path `sso-callback`).
 * `openAuthSessionAsync` usually resolves before this screen matters; this route avoids an unmatched URL in Expo Router.
 */
export default function SsoCallbackScreen() {
  return <View style={{ flex: 1 }} />;
}
