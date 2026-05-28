// ✅ Fix Bug 3: Persist token in sessionStorage so page refresh doesn't wipe it
const TOKEN_KEY = "access_token";

export function setToken(val: string) {
    sessionStorage.setItem(TOKEN_KEY, val);
}

export function getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY) ?? "";
}

export function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
}