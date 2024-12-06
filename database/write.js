/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The Firebase write functions for the Events collection
*/

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
} from "firebase/firestore";

import { db } from "./config";

/*
Updates the favourite status of the event in the DB
*/
export async function updateEvent(id, isFavourite) {
    try {
        const docRef = doc(db, "events", id);

        await updateDoc(docRef, {
            isFavourite: isFavourite,
        });

        console.log("Successfully updated events in DB");
        return true;
    } catch (e) {
        console.log("Error updating event in DB", e.message);
        return false;
    }
}

export async function updateEventNew(id, updatedEvent) {
    try {
        const docRef = doc(db, "events", id);

        await updateDoc(docRef, {
            title: updatedEvent.title,
            description: updatedEvent.description,
            isFavourite: updatedEvent.isFavourite,
            date: updatedEvent.date,
            time: updatedEvent.time,
        });

        console.log("Successfully updated events in DB");
        return true;
    } catch (e) {
        console.log("Error updating event in DB", e.message);
        return false;
    }
}

export async function deleteEvent(id) {
    try {
        const docRef = doc(db, "events", id);
        await deleteDoc(docRef);

        console.log("Successfully deleted event with ID:", id);
        return true;
    } catch (e) {
        console.error("Error deleting event in DB:", e.message);
        return false;
    }
}

/*
Adds a new event to the DB
Also returns the ID of the newly added event
*/
export async function addEvent(newEvent) {
    try {
        const collectionRef = collection(db, "events");

        const docRef = await addDoc(collectionRef, {
            //id: newEvent.id,
            authorId: newEvent.authorId,
            title: newEvent.title,
            description: newEvent.description,
            isFavourite: newEvent.isFavourite,
            date: newEvent.date,
            time: newEvent.time,
        });

        console.log("New Event successfully added with ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.log("Error adding new Event to DB:", e.message);
        return null;
    }
}

/*
Add new user to the "users" collection in the db
This step also initialises the favourites subcollection for each specific user
When making a subcollection, Firestore needs a document, hence an empty document is created here
If this is also deleted, the whole subcollection will be also
Therefore when getting a users favourites, the backend logic will keep the empty doument there 
without it being involved in the business logic
*/
export async function addUser(fullName, email, authId) {
    try {
        const collectionRef = collection(db, "users");

        const docRef = await addDoc(collectionRef, {
           // id: "",
            authId: authId,
            fullName: fullName,
            email: email,
        });

        //Adding the newly created docs ID as ID
        // const userDocRef = doc(db, `users/${docRef.id}`);
        // await updateDoc(userDocRef, { id: docRef.id });

        //Id here as Id of the actual user document, not the auth id
        const favouritesRef = doc(db, `users/${docRef.id}/favourites/emptyDoc`);
        await setDoc(favouritesRef, {});

        console.log("New User successfully added with ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.log("Error adding new User to DB:", e.message);
        return null;
    }
}

