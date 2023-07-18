import { IngredientType } from "./ingredient";

export interface DishType {
    _id: string,
    name: string,
    cuisine: string,
    ingredients: IngredientType[],
    nutrition: string,
    preferredMeal: "Lunch" | "Breakfast" | "Dinner" | '',
}