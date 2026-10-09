const defaultApiUrl = 'https://localhost:7019';

export const apiUrl = (process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl).replace(/\/$/, '');
