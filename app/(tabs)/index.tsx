import { Link, router } from "expo-router";
import { Button, Pressable, Text, View } from "react-native";

import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <View className="w-full max-w-md">
        <Text className="text-3xl font-extrabold tracking-tight text-success">
          Selamat datang, Rizky.
        </Text>
        <Text className="mt-3 text-base leading-6 text-slate-600">
          Ini titik awalmu untuk membangun pengalaman yang cepat, rapi, dan enak
          dipakai. Mulai kecil, iterasi cepat, hasilnya terasa “pro”.
        </Text>

        <View className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Text className="text-sm font-semibold text-success">
            Langkah berikutnya
          </Text>
          <Text className="mt-2 text-sm leading-5 text-slate-600">
            Ubah file{" "}
            <Text className="font-semibold text-success">app/index.tsx</Text>{" "}
            untuk mengkustom layar ini—coba ganti judul, warna, atau tambahkan
            tombol pertamamu.
          </Text>
          <Link href="/onboarding" asChild>
            <Pressable
              className="mt-4 items-center justify-center rounded-xl bg-[#22c55e] py-3 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Lanjutkan"
            >
              <Text className="text-base font-semibold text-white">Lanjutkan</Text>
            </Pressable>
          </Link>
        </View>

        <View className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Button
            title="Lihat Subscriptions Spotify"
            color="#22c55e"
            onPress={() => router.push("/subscriptions/spotify")}
            accessibilityLabel="Lihat Subscriptions Spotify"
          />
        </View>

        <Link href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }}>
          <Text className="mt-2 text-sm leading-5 text-slate-600">
            Lihat Subscriptions Claude
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
