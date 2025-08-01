const API_URL = import.meta.env.VITE_API_URL || ''

// Admin authentication
export const authenticateAdmin = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    localStorage.setItem('admin_user', JSON.stringify(data.user))
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: error.message }
  }
}

export const createAdminUser = async (email, password, name) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Registration failed')
    return { success: true, userId: data.userId }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: error.message }
  }
}

export const getCurrentAdmin = () => {
  try {
    const adminUser = localStorage.getItem('admin_user')
    return adminUser ? JSON.parse(adminUser) : null
  } catch (error) {
    console.error('Error getting current admin:', error)
    return null
  }
}

export const logoutAdmin = () => {
  localStorage.removeItem('admin_user')
}

// Transcripts API
export const saveTranscript = async (transcriptData, name) => {
  try {
    const currentAdmin = getCurrentAdmin()
    if (!currentAdmin) throw new Error('No authenticated admin user')
    const res = await fetch(`${API_URL}/api/transcripts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcriptData, name, userId: currentAdmin.user_id })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Save failed')
    return { success: true, transcript: data.transcript }
  } catch (error) {
    console.error('Save transcript error:', error)
    return { success: false, error: error.message }
  }
}

export const getTranscripts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/transcripts`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Fetch failed')
    return { success: true, transcripts: data.transcripts }
  } catch (error) {
    console.error('Get transcripts error:', error)
    return { success: false, error: error.message }
  }
}

export const updateTranscript = async (id, transcriptData, name) => {
  try {
    const res = await fetch(`${API_URL}/api/transcripts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcriptData, name })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Update failed')
    return { success: true, transcript: data.transcript }
  } catch (error) {
    console.error('Update transcript error:', error)
    return { success: false, error: error.message }
  }
}

export const deleteTranscript = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/transcripts/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Delete failed')
    return { success: true }
  } catch (error) {
    console.error('Delete transcript error:', error)
    return { success: false, error: error.message }
  }
}

export const getTranscriptsBySSN = async (ssn) => {
  try {
    const res = await fetch(`${API_URL}/api/transcripts/ssn/${ssn}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Fetch by SSN failed')
    return { success: true, transcripts: data.transcripts }
  } catch (error) {
    console.error('Get transcripts by SSN error:', error)
    return { success: false, error: error.message }
  }
}
