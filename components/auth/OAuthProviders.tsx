import { useSSO } from "@clerk/expo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Props = {
  /** Label prefix for buttons (Clerk OAuth treats sign-in/sign-up the same) */
  verb?: "in" | "up";
};

export function OAuthProviders({ verb = "in" }: Props) {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [busy, setBusy] = useState<"google" | "github" | null>(null);

  const finishAndGoHome = useCallback(
    async (sessionId: string, setActive?: (p: { session: string }) => Promise<unknown>) => {
      if (!setActive) return;
      await setActive({ session: sessionId });
      router.replace("/(tabs)" as Href);
    },
    [router]
  );

  const onPress = useCallback(
    async (strategy: "oauth_google" | "oauth_github") => {
      try {
        setBusy(strategy === "oauth_google" ? "google" : "github");
        const { createdSessionId, setActive, authSessionResult } = await startSSOFlow({
          strategy,
        });

        if (authSessionResult && authSessionResult.type !== "success") {
          return;
        }

        if (createdSessionId && setActive) {
          await finishAndGoHome(createdSessionId, setActive);
        }
      } catch (e) {
        console.error("[OAuthProviders]", e);
      } finally {
        setBusy(null);
      }
    },
    [finishAndGoHome, startSSOFlow]
  );

  const verbLabel = verb === "up" ? "Sign up" : "Sign in";

  return (
    <View className="mb-4 w-full gap-3">
      <Pressable
        className={`auth-secondary-button flex-row items-center justify-center gap-2 ${busy ? "opacity-50" : ""}`}
        disabled={busy !== null}
        onPress={() => onPress("oauth_google")}
        android_ripple={{ color: "rgba(234, 122, 83, 0.15)" }}
      >
        {busy === "google" ? (
          <ActivityIndicator color="#081126" />
        ) : (
          <MaterialCommunityIcons name="google" size={22} color="#081126" />
        )}
        <Text className="auth-secondary-button-text">{verbLabel} with Google</Text>
      </Pressable>

      <Pressable
        className={`auth-secondary-button mt-2 flex-row items-center justify-center gap-2 ${busy ? "opacity-50" : ""}`}
        disabled={busy !== null}
        onPress={() => onPress("oauth_github")}
        android_ripple={{ color: "rgba(234, 122, 83, 0.15)" }}
      >
        {busy === "github" ? (
          <ActivityIndicator color="#081126" />
        ) : (
          <MaterialCommunityIcons name="github" size={22} color="#081126" />
        )}
        <Text className="auth-secondary-button-text">{verbLabel} with GitHub</Text>
      </Pressable>

      <View className="auth-divider-row mt-1">
        <View className="auth-divider-line" />
        <Text className="auth-divider-text">or continue with email</Text>
        <View className="auth-divider-line" />
      </View>
    </View>
  );
}
