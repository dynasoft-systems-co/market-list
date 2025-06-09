import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupList } from "../models/types";

const STORAGE_KEY = "group_lists";

/**
 * Count group lists from AsyncStorage
 */
export const countGroupLists = async (): Promise<number> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as GroupList[]).length + 1 : 1;
  } catch (error) {
    console.error("Failed to load group lists:", error);
    return 0;
  }
};

/**
 * Load group list by id from AsyncStorage
 */
export const loadGroupListById = async (id: string): Promise<GroupList> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const loadedLists = json ? JSON.parse(json) : [];
    return loadedLists.find((l: GroupList) => l.id === id);
  } catch (error) {
    console.error("Failed to load group list:", error);
    return {
      id: "",
      name: "",
      groups: [],
    };
  }
};

/**
 * Load group lists from AsyncStorage
 */
export const loadGroupLists = async (): Promise<GroupList[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Failed to load group lists:", error);
    return [];
  }
};

/**
 * Insert group list to AsyncStorage
 */
export const insertGroupLists = async (newList: GroupList): Promise<void> => {
  try {
    const lists = await loadGroupLists();
    const updated = [...lists, newList];
    await saveGroupLists(updated);
  } catch (error) {
    console.error("Failed to save group lists:", error);
  }
};

/**
 * Save group lists to AsyncStorage
 */
export const saveGroupLists = async (lists: GroupList[]): Promise<void> => {
  try {
    const json = JSON.stringify(lists);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error("Failed to save group lists:", error);
  }
};

/**
 * Clear all stored group lists
 */
export const clearGroupLists = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear group lists:", error);
  }
};
