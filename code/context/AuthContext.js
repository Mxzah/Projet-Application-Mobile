import React, { createContext, useContext, useMemo, useState } from 'react';
import { signUp as marthaSignUp, logIn as marthaLogIn } from '../services/martha/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  async function signUp(payload) {
    const response = await marthaSignUp(payload);
    if (response?.success) {
      setCurrentUser({
        id: response.lastInsertId,
        username: payload.courriel,
        nom: payload.nom,
        prenom: payload.prenom,
      });
      return true;
    }
    return false;
  }

  async function logIn({ courriel, mot_de_passe }) {
    const response = await marthaLogIn({ courriel, mot_de_passe });
    if (response?.success && Array.isArray(response.data) && response.data.length === 1) {
      const user = response.data[0];
      setCurrentUser({
        id: user.id_utilisateur,
        username: user.courriel,
        nom: user.nom,
        prenom: user.prenom,
      });
      return true;
    }
    setCurrentUser(null);
    return false;
  }

  function logOut() {
    setCurrentUser(null);
  }

  const value = useMemo(
    () => ({ currentUser, signUp, logIn, logOut }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
