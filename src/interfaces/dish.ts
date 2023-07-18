import { IngredientType } from "./ingredient";

export interface DishType {
    name: string,
    cuisine: string,
    ingredients: IngredientType[],
    nutrition: string,
    preferredMeal: "Lunch" | "Breakfast" | "Dinner",
}