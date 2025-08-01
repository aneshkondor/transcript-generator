import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  saveTranscript as saveTranscriptToSupabase, 
  getTranscripts, 
  updateTranscript, 
  deleteTranscript as deleteTranscriptFromSupabase,
  getTranscriptsBySSN 
} from '../lib/api'

const TranscriptContext = createContext()

export const useTranscript = () => {
  const context = useContext(TranscriptContext)
  if (!context) {
    throw new Error('useTranscript must be used within a TranscriptProvider')
  }
  return context
}

const TranscriptProvider = ({ children }) => {
  const [transcriptData, setTranscriptData] = useState({
    // Institution Information
    institutionName: '',
    institutionAddress: '',
    institutionPhone: '',
    institutionEmail: '',
    ceebCode: '',
    
    // Student Information
    studentName: '',
    studentNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    guardian: '',
    ssn: '', // Full SSN stored here
    
    // Academic Information
    cumulativeGPA: '',
    totalCredits: '',
    
    // Principal Information
    principalName: '',
    dateSigned: '',
    
    // Comments
    comments: '',
    
    // Enrollment Summary (Block 1)
    enrollmentSummary: [
      { startEndDate: '', grade: '', school: '' },
      { startEndDate: '', grade: '', school: '' },
      { startEndDate: '', grade: '', school: '' }
    ],
    
    // Credit Transfer (Block 2) - NEW
    creditTransfer: [
      { school: '', credits: 0 }
    ],
    
    // Credit Summary
    creditSummary: [
      { subject: 'History/Social Science', earned: 0, required: 0 },
      { subject: 'English', earned: 0, required: 0 },
      { subject: 'Mathematics', earned: 0, required: 0 },
      { subject: 'Laboratory Science', earned: 0, required: 0 },
      { subject: 'Foreign Language', earned: 0, required: 0 },
      { subject: 'Arts', earned: 0, required: 0 },
      { subject: 'Elective', earned: 0, required: 0 },
      { subject: 'Physical Education', earned: 0, required: 0 }
    ],
    
    // Courses
    courses: [],
    
    // Files (removed photo)
    digitalStamp: null,
    signature: null
  })

  const [savedTranscripts, setSavedTranscripts] = useState([])
  const [currentTranscriptId, setCurrentTranscriptId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load transcripts from Supabase on component mount
  useEffect(() => {
    loadTranscripts()
  }, [])

  const loadTranscripts = async () => {
    setIsLoading(true)
    try {
      const result = await getTranscripts()
      if (result.success) {
        // Transform Supabase data to match existing format
        const transformedTranscripts = result.transcripts.map(transcript => ({
          id: transcript.id,
          name: transcript.name,
          data: transcript.data,
          createdAt: transcript.created_at,
          createdBy: transcript.admin_users?.name || 'Unknown'
        }))
        setSavedTranscripts(transformedTranscripts)
      }
    } catch (error) {
      console.error('Error loading transcripts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateTranscriptData = (newData) => {
    setTranscriptData(prev => ({ ...prev, ...newData }))
  }

  // Helper function to format SSN for display (show only last 4 digits)
  const formatSSNForDisplay = (ssn) => {
    if (!ssn) return '********'
    if (ssn.length < 4) return '********'
    return '****' + ssn.slice(-4)
  }

  // Helper function to validate SSN format
  const validateSSN = (ssn) => {
    // Remove any non-digit characters
    const cleanSSN = ssn.replace(/\D/g, '')
    return cleanSSN.length === 9
  }

  // Helper function to format SSN input (XXX-XX-XXXX)
  const formatSSNInput = (ssn) => {
    const cleanSSN = ssn.replace(/\D/g, '')
    if (cleanSSN.length <= 3) return cleanSSN
    if (cleanSSN.length <= 5) return `${cleanSSN.slice(0, 3)}-${cleanSSN.slice(3)}`
    return `${cleanSSN.slice(0, 3)}-${cleanSSN.slice(3, 5)}-${cleanSSN.slice(5, 9)}`
  }

  const addCourse = (course) => {
    setTranscriptData(prev => ({
      ...prev,
      courses: [...prev.courses, { ...course, id: Date.now() }]
    }))
  }

  const updateCourse = (courseId, updatedCourse) => {
    setTranscriptData(prev => ({
      ...prev,
      courses: prev.courses.map(course => 
        course.id === courseId ? { ...course, ...updatedCourse } : course
      )
    }))
  }

  const deleteCourse = (courseId) => {
    setTranscriptData(prev => ({
      ...prev,
      courses: prev.courses.filter(course => course.id !== courseId)
    }))
  }

  const saveTranscript = async (name) => {
    try {
      setIsLoading(true)
      
      if (currentTranscriptId) {
        // Update existing transcript
        const result = await updateTranscript(currentTranscriptId, transcriptData, name)
        if (result.success) {
          await loadTranscripts() // Reload transcripts
          return { success: true, transcript: result.transcript }
        }
        return { success: false, error: result.error }
      } else {
        // Create new transcript
        const result = await saveTranscriptToSupabase(transcriptData, name)
        if (result.success) {
          await loadTranscripts() // Reload transcripts
          setCurrentTranscriptId(result.transcript.id)
          return { success: true, transcript: result.transcript }
        }
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error saving transcript:', error)
      return { success: false, error: 'Failed to save transcript' }
    } finally {
      setIsLoading(false)
    }
  }

  const loadTranscript = (transcriptId) => {
    const transcript = savedTranscripts.find(t => t.id === transcriptId)
    if (transcript) {
      setTranscriptData(transcript.data)
      setCurrentTranscriptId(transcriptId)
    }
  }

  const deleteTranscript = async (transcriptId) => {
    try {
      setIsLoading(true)
      const result = await deleteTranscriptFromSupabase(transcriptId)
      if (result.success) {
        await loadTranscripts() // Reload transcripts
        // If we're currently editing this transcript, reset the form
        if (currentTranscriptId === transcriptId) {
          setCurrentTranscriptId(null)
          // Optionally reset form data
        }
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error deleting transcript:', error)
      return { success: false, error: 'Failed to delete transcript' }
    } finally {
      setIsLoading(false)
    }
  }

  const createNewTranscript = () => {
    setCurrentTranscriptId(null)
    setTranscriptData({
      // Reset to default values
      institutionName: '',
      institutionAddress: '',
      institutionPhone: '',
      institutionEmail: '',
      ceebCode: '',
      studentName: '',
      studentNumber: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      guardian: '',
      ssn: '',
      cumulativeGPA: '',
      totalCredits: '',
      principalName: '',
      dateSigned: '',
      comments: '',
      enrollmentSummary: [
        { startEndDate: '', grade: '', school: '' },
        { startEndDate: '', grade: '', school: '' },
        { startEndDate: '', grade: '', school: '' }
      ],
      creditTransfer: [
        { school: '', credits: 0 }
      ],
      creditSummary: [
        { subject: 'History/Social Science', earned: 0, required: 0 },
        { subject: 'English', earned: 0, required: 0 },
        { subject: 'Mathematics', earned: 0, required: 0 },
        { subject: 'Laboratory Science', earned: 0, required: 0 },
        { subject: 'Foreign Language', earned: 0, required: 0 },
        { subject: 'Arts', earned: 0, required: 0 },
        { subject: 'Elective', earned: 0, required: 0 },
        { subject: 'Physical Education', earned: 0, required: 0 }
      ],
      courses: [],
      digitalStamp: null,
      signature: null
    })
  }

  const getStudentTranscripts = async (ssn) => {
    try {
      const result = await getTranscriptsBySSN(ssn)
      if (result.success) {
        return result.transcripts.map(transcript => ({
          id: transcript.id,
          name: transcript.name,
          data: transcript.data,
          createdAt: transcript.created_at,
          createdBy: transcript.admin_users?.name || 'Unknown'
        }))
      }
      return []
    } catch (error) {
      console.error('Error getting student transcripts:', error)
      return []
    }
  }

  const value = {
    transcriptData,
    updateTranscriptData,
    addCourse,
    updateCourse,
    deleteCourse,
    savedTranscripts,
    saveTranscript,
    loadTranscript,
    deleteTranscript,
    createNewTranscript,
    getStudentTranscripts,
    formatSSNForDisplay,
    validateSSN,
    formatSSNInput,
    currentTranscriptId,
    isLoading,
    loadTranscripts
  }

  return (
    <TranscriptContext.Provider value={value}>
      {children}
    </TranscriptContext.Provider>
  )
}

export default TranscriptProvider