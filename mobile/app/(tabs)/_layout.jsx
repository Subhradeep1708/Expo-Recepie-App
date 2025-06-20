import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

const TabsLayout = () => {
    const { isSignedIn } = useAuth()
    if (!isSignedIn) return <Redirect href={'/(auth)/sign-up'} />
    return (
        <Stack screenOptions={{ headerShown: false }} />
    )
}

export default TabsLayout


