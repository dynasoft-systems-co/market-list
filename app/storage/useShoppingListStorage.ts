import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '../models/types';

const STORAGE_KEY = 'shopping_list_groups';

/**
 * Load groups from AsyncStorage
 */
export const loadGroups = async (): Promise<Group[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return [];
  } catch (error) {
    console.error('Failed to load groups:', error);
    return [];
  }
};

/**
 * Save groups to AsyncStorage
 */
export const saveGroups = async (groups: Group[]): Promise<void> => {
  try {
    const json = JSON.stringify(groups);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save groups:', error);
  }
};

/**
 * Clear all stored groups (optional utility)
 */
export const clearGroups = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear groups:', error);
  }
};
