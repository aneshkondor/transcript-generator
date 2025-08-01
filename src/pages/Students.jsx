import React, { useState, useMemo } from 'react'
import { useTranscript } from '../context/TranscriptContext'
import { Link } from 'react-router-dom'
import { Search, User, FileText, Calendar, Eye, SortAsc, SortDesc } from 'lucide-react'

const Students = () => {
  const { savedTranscripts } = useTranscript()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedStudent, setSelectedStudent] = useState(null)

  // Group transcripts by student using SSN as unique identifier
  const studentGroups = useMemo(() => {
    const groups = {}
    
    savedTranscripts.forEach(transcript => {
      const ssn = transcript.data.ssn || 'unknown'
      const studentName = transcript.data.studentName || 'Unnamed Student'
      
      if (!groups[ssn]) {
        groups[ssn] = {
          ssn,
          name: studentName,
          transcripts: []
        }
      }
      
      groups[ssn].transcripts.push(transcript)
      // Update name if current transcript has a name and stored one doesn't
      if (studentName !== 'Unnamed Student' && groups[ssn].name === 'Unnamed Student') {
        groups[ssn].name = studentName
      }
    })
    
    return Object.values(groups)
  }, [savedTranscripts])

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = [...studentGroups]
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(student => 
        student.name.toLowerCase().includes(term) ||
        student.ssn.includes(term)
      )
    }
    
    // Sort alphabetically by name
    result.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      
      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB)
      } else {
        return nameB.localeCompare(nameA)
      }
    })
    
    return result
  }, [studentGroups, searchTerm, sortDirection])

  const handleViewTranscripts = (student) => {
    setSelectedStudent(student)
  }

  const handleBackToStudents = () => {
    setSelectedStudent(null)
  }

  const formatSSNDisplay = (ssn) => {
    if (!ssn || ssn === 'unknown') return 'N/A'
    if (ssn.length < 4) return '****'
    return '****' + ssn.slice(-4)
  }

  // If a student is selected, show their transcripts
  if (selectedStudent) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Transcripts for {selectedStudent.name}
              </h1>
              <p className="text-gray-600">
                SSN: {formatSSNDisplay(selectedStudent.ssn)} • {selectedStudent.transcripts.length} transcript(s)
              </p>
            </div>
            <button
              onClick={handleBackToStudents}
              className="btn-secondary"
            >
              ← Back to Students
            </button>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedStudent.transcripts.map((transcript) => (
                  <tr key={transcript.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(transcript.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transcript.data.studentNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transcript.data.cumulativeGPA || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transcript.data.totalCredits || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to="/past-transcripts"
                        className="text-primary-600 hover:text-primary-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span>View Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Main students list view
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Students</h1>
          <Link to="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
        <p className="text-gray-600">
          View all students and their transcript records. Students are grouped by their unique identifiers.
        </p>
      </div>

      {/* Search and Sort Bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by student name..."
            />
          </div>
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="btn-secondary flex items-center space-x-2"
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
            <span>Sort A-Z</span>
          </button>
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <div className="grid gap-4">
          {filteredStudents.map((student) => (
            <div key={student.ssn} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      SSN: {formatSSNDisplay(student.ssn)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>{student.transcripts.length} transcript(s)</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(Math.max(...student.transcripts.map(t => new Date(t.createdAt)))).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewTranscripts(student)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Transcripts</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'No students match your search criteria. Try adjusting your search term.'
              : 'No students have transcripts yet. Create your first transcript to see students here.'}
          </p>
          <Link to="/create" className="btn-primary">
            Create New Transcript
          </Link>
        </div>
      )}
    </div>
  )
}

export default Students