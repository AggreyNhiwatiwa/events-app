/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The Firebase read functions for the Events collection
Logging the Firebase errors for debugging
*/

import {
    collection,
    getDocs,
    where,
    doc,
    getDoc,
    query,
} from "firebase/firestore";
import { db } from "./config";

/*
Getting ID of a single Event
*/
export async function getEventId(data) {
    let eventId;

    try {
        const dbCollection = collection(db, "events");

        const query = query(dbCollection, where("title", "==", data.title));

        const eventSnapshot = await getDocs(query);
        eventSnapshot.forEach((event) => {
            eventId = event.id;
        });

        return eventId;
    } catch (error) {
        console.log("Error getting the Event ID", error.message);
        return null;
    }
}

/*
In this case gets all the Events from the database
*/
export async function getEventsFromDb() {
    try {
        const data = [];
        const querySnapshot = await getDocs(collection(db, "events"));

        querySnapshot.forEach((doc) => {
            const event = {
                ...doc.data(),
                id: doc.id,
            };
            data.push(event);
        });

        return data;
    } catch (error) {
        console.error(
            "Error fetching events from the database:",
            error.message
        );
        return [];
    }
}

/*
Gets a single Event from its ID
*/
export async function getEventById(id) {
    try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("An event with a matching ID has not been found");
            return null;
        }
    } catch (error) {
        console.log(
            "Error getting the event object with the provided ID" +
                error.message
        );
        return null;
    }
}

/*
Helper function to get the current userId from the authId
Docs itself refereces an array and authId for a given user is 
unique, the first element in the array can be returned.
*/
export async function getUserDocIdByAuthId(authId) {
    try {
        const usersRef = collection(db, "users");
        const idQuery = query(usersRef, where("authId", "==", authId));
        const querySnapshot = await getDocs(idQuery);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].id;
        } else {
            console.error("No user found with the passed authId.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user document ID:", error.message);
        return null;
    }
}

/*
Gets the list of favourites for a given user from their userId.
  The users document is fetched and then the favouriteEvents property 
  (array) is referenced to get the id's of the users favourite events.
 
  Then this id is used to query the events collection according to the id
  (__name__) as its an index from Firestore:
  https://firebase.google.com/docs/firestore/query-data/index-overview

  At the end, the results are mapped to an array that is returned.

  Returning an empty array as a fallback to make handling on the clientside consistent
*/
export async function getFavouritesForUser(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.error("User document not found");
            return [];
        }

        const favoriteEventIds = userDoc.data().favoriteEvents || [];

        const eventsRef = collection(db, "events");
        const eventsQuery = query(
            eventsRef,
            where("__name__", "in", favoriteEventIds)
        );
        const querySnapshot = await getDocs(eventsQuery);

        const favoriteEvents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return favoriteEvents;
    } catch (error) {
        console.error("Error fetching favorites:", error.message);
        return [];
    }
}
