import React from 'react';
import { Text } from 'react-native';

import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const SettingsScreen = () => {
  return (
    <SafeAreaView className='flex-1 bg-background px-6'>
      <Text className='text-2xl font-bold text-center'>SettingsScreen</Text>
    </SafeAreaView>
  )
}

export default SettingsScreen