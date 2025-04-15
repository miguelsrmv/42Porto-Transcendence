let token: string | null = null;

export function setToken(newToken: string) {
	token = newToken;
}

export function getToken(): string | null {
	return token;
}

export function clearToken() {
	token = null;
}
