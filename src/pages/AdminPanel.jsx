import React, { useState } from 'react'
import { useTranscript } from '../context/TranscriptContext'
import { Trash2, Download, Calendar, FileText } from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator'

const AdminPanel = () => {
  const { savedTranscripts, loadTranscript, deleteTranscript } = useTranscript()
  const [selectedTranscript, setSelectedTranscript] = useState(null)

  const handleLoad = (transcript) => {
    loadTranscript(transcript.id)
    setSelectedTranscript(transcript)
    alert('Transcript loaded successfully! You can now edit it in the Create Transcript page.')
  }

  const handleDelete = (transcriptId) => {
    if (confirm('Are you sure you want to delete this transcript?')) {
      deleteTranscript(transcriptId)
      if (selectedTranscript?.id === transcriptId) {
        setSelectedTranscript(null)
      }
    }
  }

  const handleGeneratePDF = async (transcript) => {
    try {
      await generatePDF(transcript.data)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
        <p className="text-gray-600">
          Manage saved transcripts, templates, and system settings.
        </p>
      </div>

      {/* Saved Transcripts */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Transcripts</h2>
        
        {savedTranscripts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved transcripts</h3>
            <p className="text-gray-600">Create your first transcript to see it here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savedTranscripts.map((transcript) => (
                  <tr key={transcript.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transcript.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transcript.data.studentName || 'Unnamed Student'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {transcript.data.studentId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(transcript.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleLoad(transcript)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleGeneratePDF(transcript)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transcript.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Transcripts:</span>
              <span className="font-medium">{savedTranscripts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Storage Used:</span>
              <span className="font-medium">
                {(JSON.stringify(savedTranscripts).length / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-secondary text-left">
              Export All Transcripts
            </button>
            <button className="w-full btn-secondary text-left">
              Import Transcripts
            </button>
            <button className="w-full btn-secondary text-left">
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel