import { get, set } from 'idb-keyval';
import { UserProfile, FormEntry } from '../types';

const PROFILE_KEY = 'agent_profile';
const FORMS_KEY = 'agent_forms';

export const storageService = {
    async saveProfile(profile: UserProfile): Promise<void> {
        try {
            await set(PROFILE_KEY, profile);
        } catch (error) {
            console.error("Failed to save profile to storage:", error);
        }
    },

    async getProfile(): Promise<UserProfile | undefined> {
        try {
            return await get(PROFILE_KEY);
        } catch (error) {
            console.error("Failed to get profile from storage:", error);
            return undefined;
        }
    },

    async saveForms(forms: FormEntry[]): Promise<void> {
        try {
            await set(FORMS_KEY, forms);
        } catch (error) {
            console.error("Failed to save forms to storage:", error);
        }
    },

    async getForms(): Promise<FormEntry[] | undefined> {
        try {
            return await get(FORMS_KEY);
        } catch (error) {
            console.error("Failed to get forms from storage:", error);
            return undefined;
        }
    }
};
