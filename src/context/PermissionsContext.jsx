// src/context/PermissionsContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Each permission object in your payload looks like:
 *   { name: "booking.view", title: "Booking View" }
 *
 * We will store an array of these objects in React state, and
 * expose two things:
 *   1. `permissions` array itself
 *   2. a helper `hasPermission(name: string): boolean`
 *   3. a function `setPermissions([...])` so that, after login,
 *      you can propagate the newly‐fetched permissions into context.
 *
 * Because we keep this in memory (React state), it never lands
 * in localStorage/sessionStorage, and cannot be read by other tabs
 * or code that inspects window storage directly. As soon as the user
 * refreshes the page, you must rehydrate these permissions from either:
 *   • decoding a JWT (if your token is a JWT that includes permissions), or
 *   • calling an API endpoint like `/me/permissions` (passing the cookie/JWT).
 *
 * No unencrypted data leaves the React Context.
 */

const PermissionsContext = createContext({
    permissions: [],
    setPermissions: () => { },
    hasPermission: (permName) => false,
});

export const PermissionsProvider = ({ children }) => {
    // In‐memory state for the array of permissions
    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
        const permissionsFromCookie = JSON.parse(localStorage.getItem('permissions'));
        // console.log('permissionsFromCookie', permissionsFromCookie)
        setPermissions(permissionsFromCookie)
    }, [])

    // Helper to check if a given permission string is present
    const hasPermission = (permName) =>
        Array.isArray(permissions) &&
        permissions.some((perm) => perm.name === permName);

    // (Optional) If you want to auto-rehydrate permissions from a JWT cookie on mount:
    // useEffect(() => {
    //   // e.g. parse JWT from cookie, decode permissions array, then setPermissions(...)
    //   // ---
    //   // const jwt = getAuthToken(); // see cookie util below
    //   // if (jwt) {
    //   //   const decoded = decodeJwt(jwt);
    //   //   if (decoded?.permissions) {
    //   //     setPermissions(decoded.permissions);
    //   //   }
    //   // }
    // }, []);

    return (
        <PermissionsContext.Provider value={{ permissions, setPermissions, hasPermission }}>
            {children}
        </PermissionsContext.Provider>
    );
};

/**
 * Custom hook to access permissions anywhere:
 *
 *   const { permissions, setPermissions, hasPermission } = usePermissions();
 */
export const usePermissions = () => useContext(PermissionsContext);
