import { useEffect, useState } from 'react'
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { MealAPI } from '../../services/mealAPI'
import { useDebounce } from '../../hooks/useDebounce'
import { searchStyles } from '../../assets/styles/search.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import RecipeCard from '../../components/RecipeCard'

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)


    const debouncedSearchQuery = useDebounce(searchQuery, 300)


    const performSearch = async (query) => {
        // if nothing written in search box random meals are fetched and showed
        if (!query.trim()) {
            const randomMeals = await MealAPI.getRandomMeals(12);
            return randomMeals.map(meal => MealAPI.transformMealData(meal))
                .filter(meal => meal !== null)
        }

        // search by name first,then by ingredients if no results
        const nameResults = await MealAPI.searchMealsByName(query)
        let results = nameResults

        if (results.length === 0) {
            const ingredientResults = await MealAPI.filterByIngredient(query)
            results = ingredientResults
        }

        //12 results taken 
        return results
            .slice(0, 12)
            .map((meal) => MealAPI.transformMealData(meal))
            .filter((meal) => (meal !== null))
    }

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const results = await performSearch("")
                setRecipes(results)
            } catch (error) {
                console.log("Error loading initial data: ", error);
            } finally {
                setInitialLoading(false)
            }
        }
        loadInitialData()
    }, [])

    // whenever the query changes  
    useEffect(() => {
        if (initialLoading) return;

        const handleSearch = async () => {
            setLoading(true)

            try {
                const results = await performSearch(debouncedSearchQuery)
                setRecipes(results)
            } catch (error) {
                console.error("Error Searching", error);
                setRecipes([])
            } finally {
                setLoading(false)
            }
        }

        handleSearch()

    }, [debouncedSearchQuery, initialLoading])

    // if (initialLoading) return <Text>Leading some Data...</Text>

    return (
        <View style={searchStyles.container}>

            {/* Search box  */}
            <View style={searchStyles.searchSection}>
                <View style={searchStyles.searchContainer}>
                    <Ionicons
                        name='search'
                        size={20}
                        color={COLORS.textLight}
                        style={searchStyles.searchIcon}
                    />
                    <TextInput
                        style={searchStyles.searchInput}
                        placeholder='Search recipes, ingredients...'
                        placeholderTextColor={COLORS.textLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType='search'
                    />
                    {/* search box clearing button */}
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery("")}
                            style={searchStyles.clearButton}
                        >
                            <Ionicons name='close-circle' size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    )}

                </View>
            </View>

            <View style={searchStyles.resultsSection}>
                <View style={searchStyles.resultsHeader}>
                    <Text style={searchStyles.resultsTitle}>
                        {searchQuery ? `Results for ${searchQuery}` : `Popular Recipes`}
                    </Text>
                    <Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
                </View>

                {loading ? (
                    <View style={searchStyles.loadingContainer}>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={recipes}
                        renderItem={({ item }) => <RecipeCard recipe={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={searchStyles.row}
                        contentContainerStyle={searchStyles.recipesGrid}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={searchStyles.emptyState}>
                                <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
                                <Text style={searchStyles.emptyTitle}>No recipes found</Text>
                                <Text style={searchStyles.emptyDescription}>
                                    Try adjusting your search or try different keywords
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

        </View>
    )
}

export default SearchScreen

