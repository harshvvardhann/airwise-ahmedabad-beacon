import axios from 'axios';
import { AirQualityData, AirQualityHistorical, LocationData, Pollutant } from '@/types/air-quality';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Configure axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

// Function to fetch current air quality data
export async function fetchCurrentAirQuality(): Promise<AirQualityData[]> {
    try {
        const response = await apiClient.get('/measurements/current');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching current air quality:', error);
        throw new Error('Failed to fetch current air quality data');
    }
}

// Function to fetch historical data
export async function fetchHistoricalData(
    locationId: string | null,
    pollutant: Pollutant | null,
    dateFrom: Date | null,
    dateTo: Date | null
): Promise<AirQualityHistorical[]> {
    try {
        const params: any = {};
        if (locationId) params.locationId = locationId;
        if (pollutant) {
            // Map pollutant code to pollutantId if needed
            // For now, we'll pass it as is and let backend handle it
        }
        if (dateFrom) params.dateFrom = dateFrom.toISOString().split('T')[0];
        if (dateTo) params.dateTo = dateTo.toISOString().split('T')[0];

        const response = await apiClient.get('/measurements/historical', { params });
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw new Error('Failed to fetch historical air quality data');
    }
}

// Function to fetch available locations
export async function fetchLocations(): Promise<LocationData[]> {
    try {
        const response = await apiClient.get('/locations');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw new Error('Failed to fetch location data');
    }
}

// Function to fetch predictions
export async function fetchPredictions(locationId?: string, days: number = 7): Promise<any[]> {
    try {
        const params: any = { days };
        if (locationId) params.locationId = locationId;

        const response = await apiClient.get('/predictions', { params });
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching predictions:', error);
        throw new Error('Failed to fetch predictions');
    }
}

// Function to fetch notifications/alerts
export async function fetchNotifications(read?: boolean, limit: number = 50): Promise<any[]> {
    try {
        const params: any = { limit };
        if (read !== undefined) params.read = read.toString();

        const response = await apiClient.get('/notifications', { params });
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new Error('Failed to fetch notifications');
    }
}

// Function to mark notification as read
export async function markNotificationAsRead(notificationId: number): Promise<void> {
    try {
        await apiClient.put(`/notification/${notificationId}/read`);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw new Error('Failed to mark notification as read');
    }
}

// Function to get notification preferences
export async function getNotificationPreferences(): Promise<{ emailNotifications: boolean; pushNotifications: boolean }> {
    try {
        const response = await apiClient.get('/auth/notification-preferences');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching notification preferences:', error);
        throw new Error('Failed to fetch notification preferences');
    }
}

// Function to update notification preferences
export async function updateNotificationPreferences(preferences: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
}): Promise<{ emailNotifications: boolean; pushNotifications: boolean }> {
    try {
        const response = await apiClient.put('/auth/notification-preferences', preferences);
        return response.data.data;
    } catch (error) {
        console.error('Error updating notification preferences:', error);
        throw new Error('Failed to update notification preferences');
    }
}
