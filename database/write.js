/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The Firebase write functions for the Events collection
Logging the Firebase errors for developer debugging
*/

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db } from "./config";

/*
Updating a specific event
*/
export async function updateEvent(id, updatedEvent) {
    try {
        const docRef = doc(db, "events", id);

        await updateDoc(docRef, {
            title: updatedEvent.title,
            description: updatedEvent.description,
            date: updatedEvent.date,
            time: updatedEvent.time,
        });

        console.log("Successfully updated events in DB");
        return true;
    } catch (error) {
        console.log("Error updating event in DB", error.message);
        return false;
    }
}

/*
Deleting a specific event
*/
export async function deleteEvent(id) {
    try {
        const docRef = doc(db, "events", id);
        await deleteDoc(docRef);

        console.log("Successfully deleted event with ID:", id);
        return true;
    } catch (error) {
        console.error("Error deleting event in DB:", error.message);
        return false;
    }
}

/*
Adds a new event to the db and returns its id
If the event author initialises isFavourite to true, the method to
add the event to the users favouriteEvents array is called to add
it to the creators favourites list
*/
export async function addEvent(newEvent, userId) {
    try {
        const collectionRef = collection(db, "events");

        const docRef = await addDoc(collectionRef, {
            authorId: newEvent.authorId,
            title: newEvent.title,
            description: newEvent.description,
            date: newEvent.date,
            time: newEvent.time,
        });

        // Updating the document to include its id in the db itself
        await updateDoc(docRef, { id: docRef.id });

        if (newEvent.isFavourite) {
            await addFavouriteForUser(userId, docRef.id);
        }

        console.log("New Event successfully added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.log("Error adding new Event to DB:", error.message);
        return null;
    }
}

/*
Adds a new user to the "users" collection in the db
*/
export async function addUser(email, authId) {
    try {
        const collectionRef = collection(db, "users");

        const docRef = await addDoc(collectionRef, {
            authId: authId,
            email: email,
        });

        console.log("New User successfully added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.log("Error adding new User to DB:", error.message);
        return null;
    }
}

/*
Adding the given event to a given users favourites by adding the eventId to the 
favouriteEvents property of the user.
arrayUnion from Firestore to add unique elements to an array property (which favouriteEvents is).
*/
export async function addFavouriteForUser(userId, eventId) {
    try {
        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
            favoriteEvents: arrayUnion(eventId),
        });

        console.log(`Event ${eventId} added to user ${userId}'s favorites.`);
        return true;
    } catch (error) {
        console.error("Error adding favorite event:", error.message);
        return false;
    }
}

/*
The reverse of the addFavouriteUser function
arrayRemove is the opposite of arrayUnion and allows specified elements to be removed from
an array property, like favouriteEvents.
*/
export async function removeFavouriteForUser(userId, eventId) {
    try {
        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
            favoriteEvents: arrayRemove(eventId),
        });

        console.log(
            `Event ${eventId} removed from user ${userId}'s favorites.`
        );
        return true;
    } catch (error) {
        console.error("Error removing favorite event:", error.message);
        return false;
    }
}
