// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import {
    getAuthToken as readTokenFromCookie,
    setAuthToken as writeTokenToCookie,
    clearAuthToken as clearTokenCookie
} from "../utils/authCookies";
import { useContext } from "react";

// 1) Create the context with defaults
export const AuthContext = createContext({
    token: null,
    setToken: (_newToken) => { },
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    useEffect(() => {
        setTokenState(readTokenFromCookie());
    }, [])

    // 2) Initialize `token` state from the cookie (or localStorage)
    const [token, setTokenState] = useState(() => {
        // This function runs once on mount:
        // Read the token from cookie (or localStorage) to hydrate initial state.
        const existing = readTokenFromCookie();
        return existing || null;
    });

    // 3) Keep cookie in sync whenever `token` state changes
    useEffect(() => {
        if (token) {
            // Write cookie (or localStorage) whenever we have a token
            writeTokenToCookie(token, /* optional: expiryDays */ 1);
        } else {
            // If token becomes null, remove the cookie
            clearTokenCookie();
        }
    }, [token]);

    // 4) Provide a way to setToken (wrapper around setTokenState)
    //    If newToken is `null`, that effectively logs out.
    const setToken = (newToken) => {
        // console.log('here', newToken)
        setTokenState(newToken);
    };

    const logout = () => {
        setTokenState(null);
    };

    return (
        <AuthContext.Provider value={{ token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
