/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The Firebase write functions for the Events collection
*/

import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

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

export async function updateEventNew (id, updatedEvent) {
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

/*
Adds a new event to the DB
Also returns the ID of the newly added event
*/
export async function addEvent(newEvent) {
    try {
        const collectionRef = collection(db, "events");

        const docRef = await addDoc(collectionRef, {
          //id: newEvent.id,
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
