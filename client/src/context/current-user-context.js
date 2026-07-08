"use client";

import { createContext, useContext } from "react";

const CurrentUserContext = createContext(null);

export function CurrentUserProvider({ currentUser, children }) {
  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
