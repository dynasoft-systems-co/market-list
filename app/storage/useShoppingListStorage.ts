import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from "../models/types";

const STORAGE_KEY = "shopping_lists";

/**
 * Count shopping lists from AsyncStorage
 */
export const countShoppingLists = async (): Promise<number> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as List[]).length + 1 : 1;
  } catch (error) {
    console.error("Failed to load shopping lists:", error);
    return 0;
  }
};

/**
 * Load shopping list by id from AsyncStorage
 */
export const loadShoppingListById = async (id: string): Promise<List> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const loadedLists = json ? JSON.parse(json) : [];
    return loadedLists.find((l: List) => l.id === id);
  } catch (error) {
    console.error("Failed to load shopping list:", error);
    return {
      id: "",
      name: "",
      items: [],
    };
  }
};

/**
 * Load shopping lists from AsyncStorage
 */
export const loadShoppingLists = async (): Promise<List[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Failed to load shopping lists:", error);
    return [];
  }
};

/**
 * Insert shopping list to AsyncStorage
 */
export const insertShoppingLists = async (newList: List): Promise<void> => {
  try {
    const lists = await loadShoppingLists();
    const updated = [...lists, newList];
    await saveShoppingLists(updated);
  } catch (error) {
    console.error("Failed to save shopping lists:", error);
  }
};

/**
 * Save shopping lists to AsyncStorage
 */
export const saveShoppingLists = async (lists: List[]): Promise<void> => {
  try {
    const json = JSON.stringify(lists);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error("Failed to save shopping lists:", error);
  }
};

/**
 * Clear all stored shopping lists
 */
export const clearShoppingLists = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear shopping lists:", error);
  }
};
