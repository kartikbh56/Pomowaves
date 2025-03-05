/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../appwrite backend/auth";
import Loader from "../components/Loader";
import { Navigate } from "react-router-dom";

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <Loader />;
  }
  if (!user) {
    return (
      <>
        <Navigate to="/auth" replace />
      </>
    );
  }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
