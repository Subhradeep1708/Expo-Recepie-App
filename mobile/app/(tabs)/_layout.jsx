import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'

const TabsLayout = () => {
    const { isSignedIn, isLoaded } = useAuth()

    if (!isLoaded) return null // Wait for auth state to load


    if (!isSignedIn) return <Redirect href={'/(auth)/sign-up'} />

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarPressColor: 'transparent',
            // tabBarInactiveTintColor: COLORS.textLight,
            tabBarStyle: {
                backgroundColor: COLORS.white,
                borderTopColor: COLORS.border,
                borderTopWidth: 1,
                paddingBottom: 8,
                paddingTop: 8,
                height: 80,

            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "600",
            }

        }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: "Recipes",
                    tabBarIcon: ({ color, size }) => <Ionicons name='fast-food' size={size} color={color} />
                }}

            />
            <Tabs.Screen
                name='search'
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size }) => <Ionicons name='search' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='favourites'
                options={{
                    title: "Favourites",
                    tabBarIcon: ({ color, size }) => <Ionicons name='heart' size={size} color={color} />
                }}
            />
        </Tabs>
    )
}

export default TabsLayout