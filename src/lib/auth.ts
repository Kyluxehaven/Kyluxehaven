"use client";

import { auth } from './firebase';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    type User
} from 'firebase/auth';

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        // Firebase provides descriptive error messages that are safe to show to the user.
        // e.g., "auth/user-not-found", "auth/wrong-password"
        throw new Error(error.message || "An unknown authentication error occurred.");
    }
};

export const signUpWithEmail = async (email: string, password: string, fullName: string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Update the user's profile with their full name
        await updateProfile(user, {
          displayName: fullName
        });
        return user;
    } catch (error: any) {
        throw new Error(error.message || "An unknown error occurred during sign-up.");
    }
};

export const signOutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error(error.message || "Failed to sign out.");
    }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};
