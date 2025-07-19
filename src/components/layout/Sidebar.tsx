import { useState } from 'react'
import { 
  LayoutDashboard, 
  Ticket, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'tickets', label: 'Tickets', icon: Ticket, badge: '23' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">HelpDesk Pro</h1>
        <p className="text-sm text-gray-500 mt-1">Support System</p>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Notifications */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">Notifications</span>
          </div>
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            3
          </Badge>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          2 overdue tickets, 1 escalation
        </div>
      </div>
    </div>
  )
}