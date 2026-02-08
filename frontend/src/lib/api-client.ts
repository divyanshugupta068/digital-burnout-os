/**
 * Production-grade API client with retry logic, timeout handling, and error management
 */

import toast from "react-hot-toast";

// Read API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Request timeout (30 seconds)
const REQUEST_TIMEOUT = 30000;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface RequestConfig extends RequestInit {
    timeout?: number;
    retries?: number;
    showToast?: boolean;
}

class APIError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public data?: any
    ) {
        super(`API Error: ${status} ${statusText}`);
        this.name = 'APIError';
    }
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = REQUEST_TIMEOUT
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

/**
 * Main API request function with retry logic
 */
async function apiRequest<T = any>(
    endpoint: string,
    config: RequestConfig = {}
): Promise<T> {
    const {
        timeout = REQUEST_TIMEOUT,
        retries = MAX_RETRIES,
        showToast = true,
        ...fetchOptions
    } = config;

    const url = `${API_BASE_URL}${endpoint}`;
    let lastError: Error | null = null;

    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetchWithTimeout(
                url,
                { ...fetchOptions, headers },
                timeout
            );

            // Handle HTTP errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new APIError(response.status, response.statusText, errorData);
            }

            // Parse JSON response
            const data = await response.json();
            return data;

        } catch (error: any) {
            lastError = error;

            // Don't retry on client errors (4xx)
            if (error instanceof APIError && error.status >= 400 && error.status < 500) {
                if (showToast) {
                    toast.error(error.data?.detail || error.data?.message || 'Request failed');
                }
                throw error;
            }

            // Don't retry on abort (user cancelled)
            if (error.name === 'AbortError') {
                if (showToast) {
                    toast.error('Request timeout. Please try again.');
                }
                throw error;
            }

            // Retry on network errors or 5xx errors
            if (attempt < retries) {
                console.warn(`API request failed (attempt ${attempt + 1}/${retries + 1}), retrying...`);
                await sleep(RETRY_DELAY * (attempt + 1)); // Exponential backoff
                continue;
            }

            // Max retries reached
            if (showToast) {
                toast.error('Server error. Please try again later.');
            }
            throw error;
        }
    }

    throw lastError;
}

/**
 * API Client Class
 */
class APIClient {
    /**
     * GET request
     */
    async get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
        return apiRequest<T>(endpoint, {
            method: 'GET',
            ...config,
        });
    }

    /**
     * POST request
     */
    async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
        return apiRequest<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...config,
        });
    }

    /**
     * PUT request
     */
    async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
        return apiRequest<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...config,
        });
    }

    /**
     * PATCH request
     */
    async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
        return apiRequest<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            ...config,
        });
    }

    /**
     * DELETE request
     */
    async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
        return apiRequest<T>(endpoint, {
            method: 'DELETE',
            ...config,
        });
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<{ status: string; environment: string }> {
        try {
            return await this.get('/health', { showToast: false, retries: 1 });
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'unhealthy', environment: 'unknown' };
        }
    }
}

// Export singleton instance
export const api = new APIClient();

// Export types
export type { APIError, RequestConfig };

// Export base URL for direct access if needed
export { API_BASE_URL };
