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
    arrayUnion,
    arrayRemove
} from "firebase/firestore";
import { db } from "./config";


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
    } catch (error) {
        console.log("Error updating event in DB", error.message);
        return false;
    }
}

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
Adds a new event to the DB
Also returns the ID of the newly added event

If the event author initialises isFavourite to true, the method to
add the event to the users favouriteEvents array is called
*/
export async function addEvent(newEvent, userId) {
    try {
        const collectionRef = collection(db, "events");

        const docRef = await addDoc(collectionRef, {
            //id: newEvent.id,
            authorId: newEvent.authorId,
            title: newEvent.title,
            description: newEvent.description,
            date: newEvent.date,
            time: newEvent.time,
        });

        // Updating the document to include its id in the db itself
        await updateDoc(docRef, { id: docRef.id });

        if(newEvent.isFavourite){

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
            authId: authId,
            fullName: fullName,
            email: email,
        });

        //Id here as Id of the actual user document, not the auth id
        const favouritesRef = doc(db, `users/${docRef.id}/favourites/emptyDoc`);
        await setDoc(favouritesRef, {});

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
  
      console.log(`Event ${eventId} removed from user ${userId}'s favorites.`);
      return true;
    } catch (error) {
      console.error("Error removing favorite event:", error.message);
      return false;
    }
  }