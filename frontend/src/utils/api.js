import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Send chat message to backend
export const sendMessage = async (message, mode, sessionId, language) => {
  const res = await api.post('/api/chat', {
    message,
    mode,
    session_id: sessionId || null,
    language: language || 'python'
  })
  return res.data
}

// Send image for vision analysis
export const analyzeImage = async (imageFile, question, mode) => {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('question', question)
  formData.append('mode', mode)
  const res = await axios.post(`${BASE_URL}/api/analyze-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

// Get all sessions for sidebar
export const getSessions = async () => {
  const res = await api.get('/api/sessions')
  return res.data
}

// Get all messages for a session
export const getMessages = async (sessionId) => {
  const res = await api.get(`/api/sessions/${sessionId}/messages`)
  return res.data
}

// Delete a session
export const deleteSession = async (sessionId) => {
  const res = await api.delete(`/api/sessions/${sessionId}`)
  return res.data
}