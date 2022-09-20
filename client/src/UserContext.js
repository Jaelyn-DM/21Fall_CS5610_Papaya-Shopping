import React, { useContext, useState, useEffect } from "react";

const UserContext = React.createContext();

function UserProvider({ children }) {
  const [userLocal, setUserLocal] = useState(null);
  const value = { userLocal, setUserLocal };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

const useUser = () => useContext(UserContext);

export { useUser, UserProvider };