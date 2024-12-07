/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/* Centralised location for exporting database functions */

export { getEventId, getEventsFromDb, getFavouritesForUser, getUserDocIdByAuthId, getEventById } from "./read";
export { addEvent, deleteEvent, updateEventNew, addUser, addFavouriteForUser, removeFavouriteForUser} from "./write";