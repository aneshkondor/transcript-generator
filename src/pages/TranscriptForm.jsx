import React, { useState } from 'react'
import StudentInfoForm from '../components/StudentInfoForm'
import CoursesForm from '../components/CoursesForm'
import FilesUpload from '../components/FilesUpload'
import TranscriptPreview from '../components/TranscriptPreview'
import GPASummary from '../components/GPASummary'
import { useTranscript } from '../context/TranscriptContext'
import { Save, Download, Eye, EyeOff, Plus, Calculator, TestTube, Printer } from 'lucide-react'
import { generatePDF, generatePDFViaPrint, testPDFQuality } from '../utils/pdfGenerator'
import { useNavigate } from 'react-router-dom'

const TranscriptForm = () => {
  const { transcriptData, saveTranscript, createNewTranscript, currentTranscriptId, isLoading } = useTranscript()
  const [activeTab, setActiveTab] = useState('student')
  const [showPreview, setShowPreview] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [saveError, setSaveError] = useState('')
  const navigate = useNavigate()

  const tabs = [
    { id: 'student', label: 'Student Info', component: StudentInfoForm },
    { id: 'courses', label: 'Courses & Grades', component: CoursesForm },
    { id: 'gpa', label: 'GPA Summary', component: () => <GPASummary courses={transcriptData.courses} /> },
    { id: 'files', label: 'Files & Assets', component: FilesUpload }
  ]

  const handleSave = async () => {
    setSaveError('')
    const name = prompt('Enter a name for this transcript:')
    if (name) {
      const result = await saveTranscript(name)
      if (result.success) {
        alert('Transcript saved successfully!')
      } else {
        setSaveError(result.error || 'Failed to save transcript')
      }
    }
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      await generatePDF(transcriptData)
      alert('PDF generated successfully! Check your downloads folder.')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`Error generating PDF: ${error.message}\n\nPlease try the alternative print method or contact support.`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGeneratePDFViaPrint = async () => {
    setIsGenerating(true)
    try {
      await generatePDFViaPrint(transcriptData)
      alert('Print dialog opened! Use your browser\'s print function to save as PDF for best quality.')
    } catch (error) {
      console.error('Error generating PDF via print:', error)
      alert(`Error opening print dialog: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTestPDFQuality = async () => {
    try {
      const success = await testPDFQuality()
      if (success) {
        alert('PDF quality test completed! Check the downloaded test file to verify rendering quality.')
      } else {
        alert('PDF quality test failed. Please check the console for errors.')
      }
    } catch (error) {
      console.error('PDF quality test error:', error)
      alert('PDF quality test encountered an error.')
    }
  }

  const handleNewTranscript = () => {
    if (confirm('Are you sure you want to create a new transcript? Any unsaved changes will be lost.')) {
      createNewTranscript()
    }
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentTranscriptId ? 'Edit Transcript' : 'Create Transcript'}
            </h1>
            <p className="text-gray-600">
              Fill out the form below to generate a professional academic transcript with automatic GPA calculations.
            </p>
          </div>
          {currentTranscriptId && (
            <button
              onClick={handleNewTranscript}
              className="btn-secondary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Transcript</span>
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Action Buttons with PDF Quality Options */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="btn-secondary flex items-center space-x-2"
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Saving...' : currentTranscriptId ? 'Update' : 'Save'} Progress</span>
        </button>
        
        {/* Primary PDF Generation Method */}
        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>{isGenerating ? 'Generating...' : 'Generate High-Quality PDF'}</span>
        </button>
        
        {/* Alternative Print Method */}
        <button
          onClick={handleGeneratePDFViaPrint}
          disabled={isGenerating}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          <Printer className="h-4 w-4" />
          <span>Print to PDF</span>
        </button>
        
        {/* PDF Quality Test */}
        <button
          onClick={handleTestPDFQuality}
          className="btn-secondary flex items-center space-x-2"
        >
          <TestTube className="h-4 w-4" />
          <span>Test PDF Quality</span>
        </button>
        
        <button
          onClick={() => navigate('/past-transcripts')}
          className="btn-secondary flex items-center space-x-2"
        >
          <span>View Past Transcripts</span>
        </button>
      </div>

      {/* PDF Generation Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-900 mb-2">PDF Generation Options</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• <strong>High-Quality PDF:</strong> Advanced rendering with crisp text and clean borders (recommended)</p>
          <p>• <strong>Print to PDF:</strong> Uses browser's native print function for maximum compatibility</p>
          <p>• <strong>Test PDF Quality:</strong> Generate a test document to verify rendering quality</p>
          <p>• If you experience issues, try the alternative print method or contact support</p>
        </div>
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
          <p className="text-sm text-red-600">{saveError}</p>
        </div>
      )}

      <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Form Section */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.id === 'gpa' && <Calculator className="h-4 w-4" />}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Active Form Component */}
          <div className="card p-6">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <TranscriptPreview />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranscriptForm