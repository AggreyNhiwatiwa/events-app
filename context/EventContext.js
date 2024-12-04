/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The React Context API is used to provide global access to variables declared here (all are stateful)
This avoids excessive prop-drilling down component levels
*/

import { createContext } from "react";

export const EventContext = createContext({
  events: [],
  setEvents: () => {},
  currentEvent: {},
  setCurrentEvent: () => {},
  myEvents: [],
  setMyEvents: () => {},
  favouritedEvents: [],
  setFavouritedEvents: () => {},
  inFavouriteMode: false,
  setInFavouriteMode: () => {},
  inEditingMode: false,
  setInEditingMode: () => {},
});
