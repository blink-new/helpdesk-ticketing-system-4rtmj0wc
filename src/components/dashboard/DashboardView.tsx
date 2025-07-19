import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Timer,
  Target
} from 'lucide-react'

export function DashboardView() {
  const stats = [
    {
      title: 'Total Tickets',
      value: '1,234',
      change: '+12%',
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Open Tickets',
      value: '89',
      change: '-5%',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Resolved Today',
      value: '23',
      change: '+18%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Overdue',
      value: '7',
      change: '+2',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  const recentTickets = [
    {
      id: 'TK-001',
      title: 'Login issues with mobile app',
      customer: 'John Doe',
      priority: 'high',
      status: 'open',
      time: '2 hours ago'
    },
    {
      id: 'TK-002',
      title: 'Payment processing error',
      customer: 'Jane Smith',
      priority: 'urgent',
      status: 'in_progress',
      time: '4 hours ago'
    },
    {
      id: 'TK-003',
      title: 'Feature request: Dark mode',
      customer: 'Mike Johnson',
      priority: 'low',
      status: 'pending',
      time: '1 day ago'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your support tickets.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last week
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ticket className="h-5 w-5 mr-2 text-blue-600" />
              Recent Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{ticket.id}</span>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{ticket.title}</p>
                    <p className="text-xs text-gray-500">
                      {ticket.customer} • {ticket.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Avg. Response Time</span>
                </div>
                <span className="font-semibold text-gray-900">2.3 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Resolution Rate</span>
                </div>
                <span className="font-semibold text-gray-900">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                </div>
                <span className="font-semibold text-gray-900">4.8/5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                  <span className="text-sm text-gray-600">First Contact Resolution</span>
                </div>
                <span className="font-semibold text-gray-900">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <Ticket className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium">Create New Ticket</span>
              </div>
              <p className="text-sm text-gray-600">Start a new support ticket</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium">Assign Tickets</span>
              </div>
              <p className="text-sm text-gray-600">Bulk assign unassigned tickets</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <span className="font-medium">Review Overdue</span>
              </div>
              <p className="text-sm text-gray-600">Check overdue tickets</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}