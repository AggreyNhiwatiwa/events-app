/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The Firebase write functions for the Events collection
*/

import { doc, updateDoc } from "firebase/firestore";

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
