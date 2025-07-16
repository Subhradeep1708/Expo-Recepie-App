import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { MealAPI } from '../../services/mealAPI'
import { homeStyles } from '../../assets/styles/home.styles'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors.js';
import CategoryFilter from '../../components/CategoryFilter.jsx';
import RecipeCard from '../../components/RecipeCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import LogoSvg from '../../components/LogoSvg.js';

const HomeScreen = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [recipes, setRecipes] = useState([])
    const [categories, setCategories] = useState([])
    const [featuredRecipe, setFeaturedRecipe] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // loads the data in fetaured and getting random meals to show 
    const loadData = async () => {
        try {
            setLoading(true)

            //  Promise.all makes all run in parallel
            const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
                MealAPI.getCategories(),
                MealAPI.getRandomMeals(12),
                MealAPI.getRandomMeal()
            ])

            // creating a object from the fetched data from API
            const transformedCategories = apiCategories
                .filter((cat) => cat.strCategory !== "Beef")
                .map((cat, index) => ({
                    id: index + 1, // id starts from 0 to make it non-zero index+1
                    name: cat.strCategory,
                    image: cat.strCategoryThumb,
                    description: cat.strCategoryDescription,
                }))

            setCategories(transformedCategories)

            if (!selectedCategory) {
                setSelectedCategory(transformedCategories[0].name)
            }

            const transformedMeals = randomMeals
                .map((meal) => MealAPI.transformMealData(meal))
                .filter((meal) => meal !== null)

            setRecipes(transformedMeals)

            const transformedFeatured = MealAPI.transformMealData(featuredMeal);
            setFeaturedRecipe(transformedFeatured)

        } catch (error) {
            console.log("Error loading the data", error);
        } finally {
            setLoading(false)
        }
    }

    // whenever clicked on the category it'll show recipe 
    const loadCategoryData = async (category) => {
        try {
            const meals = await MealAPI.filterByCategory(category)
            const transformedMeals = meals
                .map((meal) => MealAPI.transformMealData(meal))
                .filter((meal) => meal !== null);
            setRecipes(transformedMeals)

        } catch (error) {
            console.log("Error loading category data", error);
            setRecipes([])
        }
    }

    const handleCategorySelect = async (category) => {
        setSelectedCategory(category);
        await loadCategoryData(category);
    };


    const onRefresh = async () => {
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    // whenever the app renders first time the data will be loaded
    useEffect(() => {
        loadData()
    }, [])

    if (loading && !refreshing) return <LoadingSpinner message='Hang Tight Recipes Are Coming...' />

    return (
        <View style={homeStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
                contentContainerStyle={homeStyles.scrollContent}
            >

                {/* Animal Icons */}
                <View style={[homeStyles.welcomeSection, { width: '100%', alignItems: 'center', padding: 1 }]}>
                    <LogoSvg width={400} height={90} />
                    {/* <Image
                        source={require("../../assets/images/logo-svg.svg")}
                        style={{
                            width: 700,
                            height: 100
                        }}
                    /> */}
                    {/* <Image
                        source={require("../../assets/images/chicken.png")}
                        style={{
                            width: 100,
                            height: 100
                        }}
                    />
                    <Image
                        source={require("../../assets/images/pork.png")}
                        style={{
                            width: 100,
                            height: 100
                        }}
                    />*/}
                </View>

                {/* Featured Section */}
                {featuredRecipe && <View style={homeStyles.featuredSection}>
                    <TouchableOpacity
                        style={homeStyles.featuredCard}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
                    >
                        <View style={homeStyles.featuredImageContainer}>
                            <Image
                                source={{ uri: featuredRecipe.image }}
                                style={homeStyles.featuredImage}
                                contentFit='cover'
                                transition={500}
                            />
                            <View style={homeStyles.featuredOverlay}>
                                <View style={homeStyles.featuredBadge}>
                                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                                </View>

                                <View style={homeStyles.featuredContent}>
                                    {/* Text */}
                                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                                        {featuredRecipe.title}
                                    </Text>
                                    {/* Meatdata */}
                                    <View style={homeStyles.featuredMeta}>
                                        <View style={homeStyles.metaItem}>
                                            <Ionicons name='time-outline' size={16} color={COLORS.white} />
                                            <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                                        </View>
                                        <View style={homeStyles.metaItem}>
                                            <Ionicons name='people-outline' size={16} color={COLORS.white} />
                                            <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                                        </View>
                                        <View style={homeStyles.metaItem}>
                                            <Ionicons name='location-outline' size={16} color={COLORS.white} />
                                            <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>}


                {/* Catrgory Section */}
                {categories.length > 0 && (
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />)}

                {/* Selected category cards  */}
                <View style={homeStyles.recipesSection}>
                    <View style={homeStyles.sectionHeader}>
                        <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
                    </View>


                    <FlatList
                        data={recipes}
                        renderItem={({ item }) => <RecipeCard recipe={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={homeStyles.row}
                        contentContainerStyle={homeStyles.recipesGrid}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <View style={homeStyles.emptyState}>
                                <Ionicons name='restaurant-outline' size={64} color={COLORS.textLight} />
                                <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                                <Text style={homeStyles.emptyDescription}>Try a different category</Text>
                            </View>
                        }
                    />

                </View>

            </ScrollView>
        </View>
    )
}

export default HomeScreen