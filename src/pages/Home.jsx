import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Shield, Clock, Lock, CheckCircle, Award } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: FileText,
      title: 'Professional Format',
      description: 'Generate official-looking academic transcripts that maintain academic standards and formatting.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'All sensitive information like SSN is protected with only the last 4 digits visible on transcripts.'
    },
    {
      icon: Clock,
      title: 'Save & Resume',
      description: 'Save your progress and return to edit transcripts later with our admin dashboard.'
    },
    {
      icon: CheckCircle,
      title: 'Accurate Records',
      description: 'Maintain precise academic records with GPA calculation and credit tracking.'
    },
    {
      icon: Award,
      title: 'College Ready',
      description: 'Create transcripts that meet college and university submission requirements.'
    },
    {
      icon: Lock,
      title: 'Admin Access Only',
      description: 'Secure admin-only access ensures transcript integrity and prevents unauthorized changes.'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16 pt-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Transcript Preparatory
          <span className="text-primary-600"> System</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create official academic transcripts with ease. Fill out forms, preview in real-time, 
          and generate professional PDF documents with photos and digital signatures.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
              <Link to="/create" className="btn-secondary text-lg px-8 py-3">
                Create Transcript
              </Link>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-lg px-8 py-3">
              Admin Login
            </Link>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
            <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="card p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Admin Login</h3>
            <p className="text-gray-600 text-sm">Secure access for authorized administrators only</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fill Information</h3>
            <p className="text-gray-600 text-sm">Enter student details, courses, and academic records</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Preview</h3>
            <p className="text-gray-600 text-sm">Review the transcript in real-time preview</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Generate PDF</h3>
            <p className="text-gray-600 text-sm">Download professional PDF transcript</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-primary-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Create Transcripts?
        </h2>
        <p className="text-gray-600 mb-6">
          Access the system to start building professional academic transcripts.
        </p>
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
            Go to Dashboard
          </Link>
        ) : (
          <Link to="/login" className="btn-primary text-lg px-8 py-3">
            Admin Login
          </Link>
        )}
      </div>
    </div>
  )
}

export default Home