import { Product } from '../types';

const BASE_URL = '/api'; // Using a proxy, or replace with http://localhost:3001/api for local dev

const AUTH_TOKEN_KEY = 'champ_auth_token';

// --- Auth Token Helpers ---
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// --- Generic API Fetch Helper ---
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  headers.append('Content-Type', 'application/json');

  const token = getAuthToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};


// --- AUTHENTICATION ---
export const loginUser = async (email: string, password: string): Promise<boolean> => {
  const { token } = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};

export const logoutUser = () => {
  removeAuthToken();
  // In a real app, you might also want to call a /auth/logout endpoint to invalidate the token on the server
  return Promise.resolve();
};

export const checkAuthStatus = (): boolean => {
  return !!getAuthToken();
};

// --- IMAGE STORAGE ---
export const uploadImage = async (base64String: string): Promise<string> => {
    const { url } = await apiFetch('/upload', {
        method: 'POST',
        body: JSON.stringify({ image: base64String })
    });
    return url;
};

// --- PRODUCTS ---
export const getProducts = (): Promise<Product[]> => {
  return apiFetch('/products');
};

export const createProduct = (productData: Omit<Product, 'id'>): Promise<Product> => {
  return apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = (product: Product): Promise<Product> => {
  const { id, ...productData } = product;
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = (id: string): Promise<void> => {
  return apiFetch(`/products/${id}`, {
    method: 'DELETE',
  });
};

// --- SETTINGS ---
export const getSettings = (): Promise<{ heroImage: string; whatsappNumber: string }> => {
  return apiFetch('/settings');
};

export const updateHeroImage = async (image: string): Promise<string> => {
    // This function now handles both upload and settings update
    const imageUrl = await uploadImage(image);
    await apiFetch('/settings', {
      method: 'PUT',
      body: JSON.stringify({ heroImage: imageUrl }),
    });
    return imageUrl;
};

export const updateWhatsappNumber = async (number: string): Promise<string> => {
  const { whatsappNumber } = await apiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify({ whatsappNumber: number }),
  });
  return whatsappNumber;
};
