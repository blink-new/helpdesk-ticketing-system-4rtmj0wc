import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Clock,
  User,
  Tag,
  Calendar,
  ArrowUpDown
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function TicketsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const tickets = [
    {
      id: 'TK-001',
      title: 'Login issues with mobile app',
      description: 'User cannot log in to the mobile application after the latest update',
      customer: 'John Doe',
      customerEmail: 'john.doe@example.com',
      priority: 'high',
      status: 'open',
      category: 'Technical',
      tags: ['mobile', 'login', 'bug'],
      assignedAgent: 'Sarah Wilson',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      isOverdue: false
    },
    {
      id: 'TK-002',
      title: 'Payment processing error',
      description: 'Customer experiencing issues with credit card payment processing',
      customer: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      priority: 'urgent',
      status: 'in_progress',
      category: 'Billing',
      tags: ['payment', 'billing', 'urgent'],
      assignedAgent: 'Mike Johnson',
      createdAt: '2024-01-15T08:15:00Z',
      updatedAt: '2024-01-15T15:45:00Z',
      isOverdue: true
    },
    {
      id: 'TK-003',
      title: 'Feature request: Dark mode',
      description: 'Customer requesting dark mode theme for better user experience',
      customer: 'Mike Johnson',
      customerEmail: 'mike.johnson@example.com',
      priority: 'low',
      status: 'pending',
      category: 'Feature Request',
      tags: ['feature', 'ui', 'enhancement'],
      assignedAgent: null,
      createdAt: '2024-01-14T16:20:00Z',
      updatedAt: '2024-01-15T09:10:00Z',
      isOverdue: false
    },
    {
      id: 'TK-004',
      title: 'Account deletion request',
      description: 'User wants to permanently delete their account and all associated data',
      customer: 'Emily Davis',
      customerEmail: 'emily.davis@example.com',
      priority: 'medium',
      status: 'resolved',
      category: 'Account',
      tags: ['account', 'deletion', 'privacy'],
      assignedAgent: 'Sarah Wilson',
      createdAt: '2024-01-13T11:45:00Z',
      updatedAt: '2024-01-15T13:30:00Z',
      isOverdue: false
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600 mt-1">Manage and track all support tickets</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tickets, customers, or ticket IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className={`hover:shadow-md transition-shadow cursor-pointer ${ticket.isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{ticket.id}</span>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    {ticket.isOverdue && (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{ticket.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{ticket.customer}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{ticket.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                    {ticket.assignedAgent && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>Assigned to {ticket.assignedAgent}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Ticket</DropdownMenuItem>
                    <DropdownMenuItem>Assign Agent</DropdownMenuItem>
                    <DropdownMenuItem>Add Comment</DropdownMenuItem>
                    <DropdownMenuItem>Merge Tickets</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Close Ticket</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Summary */}
      <div className="text-center text-gray-500 text-sm">
        Showing {filteredTickets.length} of {tickets.length} tickets
      </div>
    </div>
  )
}