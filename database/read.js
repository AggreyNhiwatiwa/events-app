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
} from "firebase/firestore";
import { db } from "./config";

/*
Getting ID of a single Event
*/
export async function getEventId(data) {
  let eventId;

  try {
    const dbCollection = collection(db, "Events");

    const query = query(dbCollection, where("title", "==", data.title));

    const bookSnapshot = await getDocs(query);
    bookSnapshot.forEach((event) => {
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
  const querySnapshot = await getDocs(collection(db, "Events"));

  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);

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
    const docRef = doc(db, "Events", id);
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
