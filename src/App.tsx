import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Sidebar } from './components/layout/Sidebar'
import { DashboardView } from './components/dashboard/DashboardView'
import { TicketsView } from './components/tickets/TicketsView'
import { KnowledgeBaseView } from './components/knowledge/KnowledgeBaseView'
import { Toaster } from './components/ui/toaster'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HelpDesk Pro...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">HelpDesk Pro</h1>
          <p className="text-gray-600 mb-8">Please sign in to access the support system</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />
      case 'tickets':
        return <TicketsView />
      case 'knowledge':
        return <KnowledgeBaseView userRole="admin" />
      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Coming soon...</p>
          </div>
        )
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Coming soon...</p>
          </div>
        )
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
      <Toaster />
    </div>
  )
}

export default App