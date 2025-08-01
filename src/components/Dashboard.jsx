import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, History, Plus, Users } from 'lucide-react'
import { useTranscript } from '../context/TranscriptContext'

const Dashboard = () => {
  const { savedTranscripts } = useTranscript()

  // Calculate unique students based on SSN
  const uniqueStudents = new Set()
  savedTranscripts.forEach(transcript => {
    const ssn = transcript.data.ssn || 'unknown'
    uniqueStudents.add(ssn)
  })

  const stats = [
    {
      name: 'Total Transcripts',
      value: savedTranscripts.length,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'This Month',
      value: savedTranscripts.filter(t => {
        const created = new Date(t.createdAt)
        const now = new Date()
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
      }).length,
      icon: History,
      color: 'bg-green-500'
    },
    {
      name: 'Students',
      value: uniqueStudents.size,
      icon: Users,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the Transcript Management System. Create new transcripts or manage existing ones.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/create" className="card p-8 hover:shadow-lg transition-shadow group">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary-600 p-4 rounded-full group-hover:bg-primary-700 transition-colors">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Create New Transcript
          </h3>
          <p className="text-gray-600 text-center">
            Generate a new official transcript for a student with all required information and formatting.
          </p>
        </Link>

        <Link to="/past-transcripts" className="card p-8 hover:shadow-lg transition-shadow group">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-4 rounded-full group-hover:bg-green-700 transition-colors">
              <History className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            View Past Transcripts
          </h3>
          <p className="text-gray-600 text-center">
            Browse, search, and manage all previously created transcripts with advanced filtering options.
          </p>
        </Link>

        <Link to="/students" className="card p-8 hover:shadow-lg transition-shadow group">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-600 p-4 rounded-full group-hover:bg-purple-700 transition-colors">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Manage Students
          </h3>
          <p className="text-gray-600 text-center">
            View all students and their transcript records organized by student profiles.
          </p>
        </Link>
      </div>

      {/* Recent Transcripts */}
      {savedTranscripts.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transcripts</h2>
            <Link to="/past-transcripts" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GPA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedTranscripts.slice(0, 5).map((transcript) => (
                    <tr key={transcript.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transcript.data.studentName || 'Unnamed Student'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transcript.data.studentNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(transcript.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transcript.data.cumulativeGPA || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard