
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background px-6 items-center">
      <Text className="text-foreground font-sans-bold text-2xl">Hello World</Text>
      <Text className="text-foreground font-sans-medium text-2xl">Hello World</Text>
      <Text className="text-foreground font-sans-light text-2xl">Hello World</Text>
      <Text className="text-foreground font-sans-extrabold text-2xl">Hello World</Text>
      <Text className="text-foreground font-sans-semibold text-2xl">Hello World</Text>
      <Text className="text-foreground font-sans text-2xl">Hello World</Text>
    </SafeAreaView>
  );
}
