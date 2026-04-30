import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Button, Text, View } from 'react-native'

const SubscriptionDetailScreen = () => {
  const { id } = useLocalSearchParams()
  return (
    <View className='flex-1 items-center justify-center bg-background px-6'>
        <Text className='text-2xl font-bold text-center'>SubscriptionDetailScreen {id}</Text>
        <Link href="/">
            <Button title="Kembali" color="#22c55e" />
        </Link>
    </View>
  )
}

export default SubscriptionDetailScreen