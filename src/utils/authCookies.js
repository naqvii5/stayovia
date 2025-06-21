
/**
 * Sets the auth token in a cookie named "auth_token".
 * We mark it Secure, SameSite=Strict, and Path=/ to reduce CSRF risk.
 *
 * Important: because we set the cookie from JavaScript, it CANNOT be HttpOnly.
 * If your backend can set an HttpOnly cookie instead, that is strictly preferable:
 *   • Move token‐setting logic to server‐side Set‐Cookie with HttpOnly,
 *     and do NOT expose the token to JavaScript.
 */

const TOKEN_COOKIE_NAME = "auth_token";

export function setAuthToken(token, expiresInDays = 7) {
    // Build an expiration date `expiresInDays` days from now
    const date = new Date();
    date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();

    // secure; SameSite=Strict; Path=/
    document.cookie =
        `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; \
Expires=${expires}; \
Path=/; \
Secure; \
SameSite=Strict`;
}

/**
 * Reads the "auth_token" cookie, or returns null if not present.
 */
export function getAuthToken() {
    const allCookies = document.cookie.split(";").map((c) => c.trim());
    for (let cookiePair of allCookies) {
        if (cookiePair.startsWith(`${TOKEN_COOKIE_NAME}=`)) {
            const value = cookiePair.substring(TOKEN_COOKIE_NAME.length + 1);
            return decodeURIComponent(value);
        }
    }
    return null;
}

/**
 * Deletes the auth_token cookie by setting it to expire in the past.
 */
export function clearAuthToken() {
    document.cookie =
        `${TOKEN_COOKIE_NAME}=; \
Expires=Thu, 01 Jan 1970 00:00:00 GMT; \
Path=/; \
Secure; \
SameSite=Strict`;
}
