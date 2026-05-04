import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: { from: string; to: string };
};

const SLIDES: Slide[] = [
  {
    key: "fast",
    eyebrow: "Cepat & rapi",
    title: "Bangun UI cantik dengan className",
    description:
      "Gunakan NativeWind untuk styling yang konsisten di iOS, Android, dan Web—tanpa ribet.",
    accent: { from: "#22c55e", to: "#10b981" },
  },
  {
    key: "delight",
    eyebrow: "UX yang enak",
    title: "Animasi halus, interaksi terasa premium",
    description:
      "Swipe untuk berpindah langkah, indikator responsif, dan transisi warna yang lembut.",
    accent: { from: "#3b82f6", to: "#6366f1" },
  },
  {
    key: "ship",
    eyebrow: "Siap produksi",
    title: "Komponen reusable, mudah di-scale",
    description:
      "Mulai dari fondasi yang bagus: layout, spacing, dan pola navigasi yang jelas.",
    accent: { from: "#f97316", to: "#ef4444" },
  },
];

function clampIndex(value: number) {
  return Math.max(0, Math.min(SLIDES.length - 1, value));
}

export default function OnboardingScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const pageWidth = Math.max(1, windowWidth);

  const scrollRef = useRef<Animated.ScrollView>(null);
  const x = useSharedValue(0);
  const [index, setIndex] = useState(0);

  const setIndexSafe = useCallback((next: number) => {
    setIndex(clampIndex(next));
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      x.value = e.contentOffset.x;
    },
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const input = SLIDES.map((_, i) => i * pageWidth);
    const from = SLIDES.map((s) => s.accent.from);
    const to = SLIDES.map((s) => s.accent.to);

    const base = interpolateColor(x.value, input, from);
    const glow = interpolateColor(x.value, input, to);

    return {
      backgroundColor: base,
      shadowColor: glow,
    };
  });

  const goTo = useCallback(
    (to: number) => {
      const next = clampIndex(to);
      scrollRef.current?.scrollTo({ x: next * pageWidth, y: 0, animated: true });
      setIndex(next);
    },
    [pageWidth]
  );

  const onSkip = useCallback(() => {
    router.replace("/");
  }, []);

  const onNext = useCallback(() => {
    if (index >= SLIDES.length - 1) {
      router.replace("/");
      return;
    }
    goTo(index + 1);
  }, [goTo, index]);

  const ctaLabel = useMemo(
    () => (index >= SLIDES.length - 1 ? "Mulai" : "Lanjut"),
    [index]
  );

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <Animated.View className="absolute inset-0" style={backgroundStyle} />

      {/* subtle overlay for readability */}
      <View className="absolute inset-0 bg-black/20" />

      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-3">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 rounded-2xl bg-white/15" />
            <Text className="text-sm font-semibold tracking-wide text-white/90">
              learnreactnative
            </Text>
          </View>

          <Pressable
            onPress={onSkip}
            className="rounded-full bg-white/15 px-4 py-2 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Lewati onboarding"
          >
            <Text className="text-sm font-semibold text-white/95">Lewati</Text>
          </Pressable>
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          onMomentumScrollEnd={(e) => {
            const nextIndex = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
            setIndexSafe(nextIndex);
          }}
          className="flex-1"
        >
          {SLIDES.map((slide, i) => (
            <SlidePage key={slide.key} slide={slide} i={i} x={x} pageWidth={pageWidth} />
          ))}
        </Animated.ScrollView>

        <View className="px-6 pb-6">
          <Dots x={x} pageWidth={pageWidth} />

          <View className="mt-5 flex-row items-center justify-between">
            <Pressable
              onPress={() => goTo(index - 1)}
              disabled={index === 0}
              className={[
                "rounded-2xl border border-white/25 px-5 py-3",
                index === 0 ? "opacity-40" : "active:opacity-80",
              ].join(" ")}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
            >
              <Text className="text-sm font-semibold text-white/95">Kembali</Text>
            </Pressable>

            <Pressable
              onPress={onNext}
              className="rounded-2xl bg-white px-6 py-3 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel={ctaLabel}
            >
              <Text className="text-sm font-extrabold tracking-wide text-black">
                {ctaLabel}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push("/")}
            className="mt-4 items-center py-2 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Lihat halaman utama"
          >
            <Text className="text-xs font-semibold text-white/80">
              Lihat halaman utama dulu
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SlidePage({
  slide,
  i,
  x,
  pageWidth,
}: {
  slide: Slide;
  i: number;
  x: SharedValue<number>;
  pageWidth: number;
}) {
  const pageStyle = useAnimatedStyle(() => {
    const center = i * pageWidth;
    const distance = Math.abs(x.value - center);
    const progress = Math.min(distance / pageWidth, 1);
    const translateY = interpolate(progress, [0, 1], [0, 16], Extrapolation.CLAMP);
    const opacity = interpolate(progress, [0, 1], [1, 0.65], Extrapolation.CLAMP);
    return { transform: [{ translateY }], opacity };
  });

  const artStyle = useAnimatedStyle(() => {
    const center = i * pageWidth;
    const progress = (x.value - center) / pageWidth;
    const translateX = interpolate(progress, [-1, 0, 1], [-18, 0, 18], Extrapolation.CLAMP);
    const scale = interpolate(
      Math.abs(progress),
      [0, 1],
      [1, 0.94],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateX }, { scale }] };
  });

  return (
    <View style={{ width: pageWidth }} className="flex-1 px-6 pt-6">
      <Animated.View style={pageStyle} className="flex-1">
        <View className="mt-6">
          <Text className="text-xs font-bold uppercase tracking-widest text-white/85">
            {slide.eyebrow}
          </Text>
          <Text className="mt-2 text-4xl font-extrabold tracking-tight text-white">
            {slide.title}
          </Text>
          <Text className="mt-4 text-base leading-6 text-white/85">
            {slide.description}
          </Text>
        </View>

        <Animated.View style={artStyle} className="mt-10 flex-1">
          <View className="overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-5">
            <View className="flex-row items-center justify-between">
              <View className="h-10 w-10 rounded-2xl bg-white/20" />
              <View className="h-7 w-20 rounded-full bg-white/15" />
            </View>

            <View className="mt-5 gap-3">
              <CardLine widthClass="w-10/12" />
              <CardLine widthClass="w-9/12" />
              <CardLine widthClass="w-7/12" />
            </View>

            <View className="mt-6 flex-row items-center justify-between">
              <View className="h-10 flex-1 rounded-2xl bg-white/15" />
              <View className="ml-3 h-10 w-16 rounded-2xl bg-white" />
            </View>
          </View>

          <View className="mt-5 flex-row gap-3">
            <View className="h-20 flex-1 rounded-[24px] bg-black/10" />
            <View className="h-20 flex-1 rounded-[24px] bg-black/10" />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function CardLine({ widthClass }: { widthClass: string }) {
  return <View className={["h-3 rounded-full bg-white/20", widthClass].join(" ")} />;
}

function Dots({ x, pageWidth }: { x: SharedValue<number>; pageWidth: number }) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {SLIDES.map((s, i) => (
        <Dot key={s.key} i={i} x={x} pageWidth={pageWidth} />
      ))}
    </View>
  );
}

function Dot({
  i,
  x,
  pageWidth,
}: {
  i: number;
  x: SharedValue<number>;
  pageWidth: number;
}) {
  const style = useAnimatedStyle(() => {
    const center = i * pageWidth;
    const distance = Math.abs(x.value - center);
    const t = Math.min(distance / pageWidth, 1);
    const width = interpolate(t, [0, 1], [28, 10], Extrapolation.CLAMP);
    const opacity = interpolate(t, [0, 1], [1, 0.45], Extrapolation.CLAMP);
    return { width, opacity };
  });

  return (
    <Animated.View
      style={style}
      className="h-2 rounded-full bg-white"
      accessibilityLabel={`Onboarding langkah ${i + 1}`}
    />
  );
}
