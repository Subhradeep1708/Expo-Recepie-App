const BASE_URL = "https://www.themealdb.com/api/json/v1/1"

export const MealAPI = {
    // search meals by name
    searchMealsByName: async (query) => {
        try {
            const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error("Error searching meals by name:", error);
            return [];
        }
    },

    getMealById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error("Error getting meal by id:", error);
            return null;
        }
    },

    // get a random meal 

    getRandomMeal: async () => {
        try {
            const response = await fetch(`${BASE_URL}/random.php`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error("Error getting random meal:", error);
            return null;
        }
    },

    // get muiltiple random meals
    getRandomMeals: async (count = 6) => {
        try {
            const promises = Array(count)
                .fill()
                .map(() => MealAPI.getRandomMeal());
            const meals = await Promise.all(promises);
            return meals.filter((meal) => meal !== null);
        } catch (error) {
            console.error("Error getting random meals:", error);
            return [];
        }
    },
    // getRandomMeals: async (count = 6) => {
    //     const meals = [];
    //     for (let i = 0; i < count; i++) {
    //         const meal = await MealAPI.getRandomMeal();
    //         if (meal) meals.push(meal);
    //     }
    //     return meals;
    // },

    // listing all meal categories
    getCategories: async () => {
        try {
            const response = await fetch(`${BASE_URL}/categories.php`);
            const data = await response.json();
            return data.categories || [];
        } catch (error) {
            console.error("Error getting categories:", error);
            return [];
        }
    },


    // filtering by main ingredients
    filterByIngredient: async (ingredient) => {
        try {
            const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`)
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error("Error filtering by ingredients:", error);
            return [];
        }
    },

    // filtering by category
    filterByCategory: async (category) => {
        try {
            const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error("Error filtering by category:", error);
            return [];
        }
    },

    // transform TheMealDB meal data to our app format
    transformMealData: (meal) => {
        if (!meal) return null;

        // extract ingredients from the meal object
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                const measureText = measure && measure.trim() ? `${measure.trim()} ` : "";
                ingredients.push(`${measureText}${ingredient.trim()}`);
            }
        }

        // extract instructions
        const instructions = meal.strInstructions
            ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
            : [];

        return {
            id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions
                ? meal.strInstructions.trim().substring(0, 120) + "..."
                : "Delicious meal from TheMealDB",
            image: meal.strMealThumb,
            cookTime: "30 minutes",
            servings: 4,
            category: meal.strCategory || "Main Course",
            area: meal.strArea,
            ingredients,
            instructions,
            originalData: meal,
        };
    },
}