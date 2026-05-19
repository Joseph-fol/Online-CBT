import axios from 'axios'
import API_BASE_URL from './api.config'
import { getAuthHeader } from './auth'

// Create axios instance with auth interceptor
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

// Question API endpoints
export const questionApi = {
    // Get all questions
    getAllQuestions: () => {
        return apiClient.get('/user/getAllQuestions')
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching questions:', error.message)
                throw error
            })
    },

    // Get question by ID
    getQuestionById: (id) => {
        return apiClient.get(`/user/question/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching question:', error.message)
                throw error
            })
    },

    // Get questions by subject
    getQuestionBySubject: (subject) => {
        return apiClient.get(`/user/subject/${subject}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching questions by subject:', error.message)
                throw error
            })
    },

    // Add new question
    addQuestion: (questionData) => {
        return apiClient.post('/user/addQuestions', questionData)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error adding question:', error.message)
                throw error
            })
    },

    // Update question
    updateQuestion: (id, questionData) => {
        return apiClient.put(`/user/question/${id}`, questionData)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error updating question:', error.message)
                throw error
            })
    },

    // Save exam result
    saveExamResult: (resultData) => {
        return apiClient.post('/user/exam/save-result', resultData)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error saving exam result:', error.message)
                throw error
            })
    },

    // Delete question
    deleteQuestion: (id) => {
        return apiClient.delete(`/user/question/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error deleting question:', error.message)
                throw error
            })
    },

    // Get student exam results
    getStudentExamResults: (studentEmail) => {
        return apiClient.get(`/user/exam/student-results?studentEmail=${studentEmail}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching exam results:', error.message)
                throw error
            })
    },
}
