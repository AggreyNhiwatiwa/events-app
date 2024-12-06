/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The Firebase read functions for the Events collection
*/

import {
  collection,
  getDocs,
  where,
  doc,
  getDoc,
  query
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
    console.log("Error getting the Event ID", error);
    return null;
  }
}

/*
In this case gets all the Events from the database
*/
export async function getEventsFromDb() {
  const data = [];
  const querySnapshot = await getDocs(collection(db, "events"));

  querySnapshot.forEach((doc) => {
    
    const post = {
      ...doc.data(),
      id: doc.id,
    };
    data.push(post);
  });
  return data;
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
    console.log("Error getting the event object with the provided ID" + error);
    return null;
  }
}

/*
Helper function to get the current userId from the authId
*/
export async function getUserDocIdByAuthId(authId) {
  try {
      const usersRef = collection(db, "users");
      const idQuery = query(usersRef, where("authId", "==", authId));
      const querySnapshot = await getDocs(idQuery);

      if (!querySnapshot.empty) {
          // Docs is an array, so as authId is unique just return the first (only) element in the array
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
Gets the list of favourites for a given user
from the favourites subcollection in the users collection
Uses the authId
The emptyDoc placeholder is skipped so that it is not included in the business logic
*/
export async function getFavouritesForUser(userId) {
  try {
    const data = [];
    const favouritesRef = collection(db, `users/${userId}/favourites`);
    const querySnapshot = await getDocs(favouritesRef);

    // Ignoring the placeholder
    querySnapshot.forEach((doc) => {
      if (doc.id === "emptyDoc") {
        return;
      }

      const favourite = {
        ...doc.data(),
        id: doc.id,
      };
      data.push(favourite);
    });

    return data;
  } catch (e) {
    console.error("Error fetching favourites:", e.message);
    return [];
  }
}
