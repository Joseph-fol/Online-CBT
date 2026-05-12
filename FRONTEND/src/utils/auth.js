// Store token in localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token)
}

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem('token')
}

// Remove token from localStorage (logout)
export const removeToken = () => {
    localStorage.removeItem('token')
}

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('token')
}

// Get auth header for API requests
export const getAuthHeader = () => {
    const token = getToken()
    return token ? { 'Authorization': `Bearer ${token}` } : {}
}
