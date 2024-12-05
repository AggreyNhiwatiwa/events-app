/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The React Context API is used to provide global access to variables declared here (all are stateful)
This avoids excessive prop-drilling down component levels
Creating a context here so that firebase doesn't have to be queried to get the current users auth details whenever
we validate.
*/

import { createContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  authId: [],
  setAuthId: () => {},
});
