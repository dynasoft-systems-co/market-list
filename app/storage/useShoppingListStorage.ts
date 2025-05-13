import AsyncStorage from '@react-native-async-storage/async-storage';
import { List } from '../models/types';

const STORAGE_KEY = 'shopping_lists';

/**
 * Load shopping lists from AsyncStorage
 */
export const loadShoppingLists = async (): Promise<List[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to load shopping lists:', error);
    return [];
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
    console.error('Failed to save shopping lists:', error);
  }
};

/**
 * Clear all stored shopping lists
 */
export const clearShoppingLists = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear shopping lists:', error);
  }
};
