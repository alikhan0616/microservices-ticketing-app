"use client";

import { useCurrentUser } from "../context/current-user-context";

export default function Home() {
  const currentUser = useCurrentUser();

  return (
    <div className="container mt-5 p-2">
      <h1>Welcome to the Ticketing App</h1>
      {currentUser ? (
        <h1>Logged in as: {currentUser.email}</h1>
      ) : (
        <h1>You are not logged in.</h1>
      )}
    </div>
  );
}
