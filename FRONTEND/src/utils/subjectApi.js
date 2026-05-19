import axios from 'axios'
import API_BASE_URL from './api.config'
import { getAuthHeader } from './auth'

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const authHeader = getAuthHeader()
        if (authHeader.Authorization) {
            config.headers.Authorization = authHeader.Authorization
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Subject API endpoints
export const subjectApi = {
    // Get all subjects
    getAllSubjects: () => {
        return apiClient.get('/subjects')
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching subjects:', error.message)
                throw error
            })
    },

    // Get subject by ID
    getSubjectById: (id) => {
        return apiClient.get(`/subjects/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching subject:', error.message)
                throw error
            })
    },

    // Create new subject
    createSubject: (subjectData) => {
        return apiClient.post('/subjects', subjectData)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error creating subject:', error.message)
                throw error
            })
    },

    // Update subject
    updateSubject: (id, subjectData) => {
        return apiClient.put(`/subjects/${id}`, subjectData)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error updating subject:', error.message)
                throw error
            })
    },

    // Delete subject
    deleteSubject: (id) => {
        return apiClient.delete(`/subjects/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error deleting subject:', error.message)
                throw error
            })
    },
}

export default apiClient
