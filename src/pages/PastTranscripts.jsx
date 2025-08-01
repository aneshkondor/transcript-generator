import React, { useState, useMemo } from 'react'
import { useTranscript } from '../context/TranscriptContext'
import { generatePDF } from '../utils/pdfGenerator'
import { Search, Filter, Download, Edit, Trash2, Calendar, SortAsc, SortDesc, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

const PastTranscripts = () => {
  const { savedTranscripts, loadTranscript, deleteTranscript } = useTranscript()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filters, setFilters] = useState({
    dateRange: 'all',
    gpaRange: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transcript? This action cannot be undone.')) {
      deleteTranscript(id)
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

  const filteredTranscripts = useMemo(() => {
    let result = [...savedTranscripts]
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(transcript => 
        (transcript.data.studentName && transcript.data.studentName.toLowerCase().includes(term)) ||
        (transcript.data.studentNumber && transcript.data.studentNumber.toLowerCase().includes(term)) ||
        (transcript.name && transcript.name.toLowerCase().includes(term))
      )
    }
    
    // Apply date filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      
      if (filters.dateRange === 'today') {
        cutoff.setHours(0, 0, 0, 0)
      } else if (filters.dateRange === 'week') {
        cutoff.setDate(now.getDate() - 7)
      } else if (filters.dateRange === 'month') {
        cutoff.setMonth(now.getMonth() - 1)
      } else if (filters.dateRange === 'year') {
        cutoff.setFullYear(now.getFullYear() - 1)
      }
      
      result = result.filter(transcript => new Date(transcript.createdAt) >= cutoff)
    }
    
    // Apply GPA filter
    if (filters.gpaRange !== 'all') {
      let min = 0, max = 5
      
      if (filters.gpaRange === '4-5') {
        min = 4; max = 5
      } else if (filters.gpaRange === '3-4') {
        min = 3; max = 4
      } else if (filters.gpaRange === '2-3') {
        min = 2; max = 3
      } else if (filters.gpaRange === '0-2') {
        min = 0; max = 2
      }
      
      result = result.filter(transcript => {
        const gpa = parseFloat(transcript.data.cumulativeGPA || 0)
        return gpa >= min && gpa < max
      })
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB
      
      if (sortField === 'createdAt') {
        valueA = new Date(a.createdAt).getTime()
        valueB = new Date(b.createdAt).getTime()
      } else if (sortField === 'studentName') {
        valueA = a.data.studentName || ''
        valueB = b.data.studentName || ''
      } else if (sortField === 'gpa') {
        valueA = parseFloat(a.data.cumulativeGPA || 0)
        valueB = parseFloat(b.data.cumulativeGPA || 0)
      } else {
        valueA = a[sortField] || ''
        valueB = b[sortField] || ''
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
    
    return result
  }, [savedTranscripts, searchTerm, sortField, sortDirection, filters])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Past Transcripts</h1>
          <Link to="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
        <p className="text-gray-600">
          View, search, and manage all previously created transcripts.
        </p>
      </div>

      {/* Search and Filter Bar */}
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
              placeholder="Search by student name or ID..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={() => handleSort('createdAt')}
            className="btn-secondary flex items-center space-x-2"
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
            <span>Sort</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="input-field"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA Range
              </label>
              <select
                value={filters.gpaRange}
                onChange={(e) => setFilters({ ...filters, gpaRange: e.target.value })}
                className="input-field"
              >
                <option value="all">All GPAs</option>
                <option value="4-5">4.0 - 5.0</option>
                <option value="3-4">3.0 - 3.99</option>
                <option value="2-3">2.0 - 2.99</option>
                <option value="0-2">Below 2.0</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Transcripts List */}
      {filteredTranscripts.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('studentName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Student</span>
                      {sortField === 'studentName' && (
                        sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      {sortField === 'createdAt' && (
                        sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('gpa')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>GPA</span>
                      {sortField === 'gpa' && (
                        sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTranscripts.map((transcript) => (
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
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(transcript.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transcript.data.cumulativeGPA || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to="/create"
                          onClick={() => loadTranscript(transcript.id)}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleGeneratePDF(transcript)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => handleDelete(transcript.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transcripts found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filters.dateRange !== 'all' || filters.gpaRange !== 'all'
              ? 'No transcripts match your search criteria. Try adjusting your filters.'
              : 'Create your first transcript to see it here.'}
          </p>
          <Link to="/create" className="btn-primary">
            Create New Transcript
          </Link>
        </div>
      )}
    </div>
  )
}

export default PastTranscripts