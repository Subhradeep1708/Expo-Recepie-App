import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { useEffect, useState } from 'react'
import { API_URL } from '../../constants/api'
import { favoritesStyles } from '../../assets/styles/favourites.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import RecipeCard from '../../components/RecipeCard'
import NoFavouritesFound from '../../components/NoFavouritesFound'
import LoadingSpinner from '../../components/LoadingSpinner'
const FavouritesScreen = () => {
    const { signOut } = useClerk()
    const { user } = useUser()
    const [favouriteRecipes, setFavouriteRecipes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadFavourites = async () => {
            try {
                const response = await fetch(`${API_URL}/favourites/${user.id}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch favourites")
                }
                const favourites = await response.json()

                const transformedFavourite = favourites.map((favourite) => ({
                    ...favourite,
                    id: favourite.recipeId
                }))
                console.log("favourites", favourites);
                console.log("transformedFavourite", transformedFavourite);
                setFavouriteRecipes(transformedFavourite)
            } catch (error) {
                console.log("Error loading favourites", error);
                Alert.alert("Error", "Failed to load favourites")
            } finally {
                setLoading(false)
            }
        };

        loadFavourites()

    }, [user.id])


    const handleSignOut = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: signOut },
        ])
    }


    if (loading) return <LoadingSpinner message='Loading your favourite recipes...' />

    return (
        <View style={favoritesStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={favoritesStyles.header}>
                    <Text style={favoritesStyles.title}>Favourites</Text>
                    <TouchableOpacity
                        style={[favoritesStyles.logoutButton]}
                        onPress={handleSignOut}
                    >
                        <Text style={{ color: 'red', fontWeight: 600 }}>Logout</Text>
                        <Ionicons name='log-out-outline' size={22} color={COLORS.text} />

                    </TouchableOpacity>
                </View>

                <View style={favoritesStyles.recipesSection}>
                    <FlatList
                        data={favouriteRecipes}
                        renderItem={({ item }) => <RecipeCard recipe={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={favoritesStyles.row}
                        contentContainerStyle={favoritesStyles.recipesGrid}
                        scrollEnabled={false}
                        ListEmptyComponent={<NoFavouritesFound />}
                    />
                </View>


            </ScrollView >
        </View >
    )
}

export default FavouritesScreen