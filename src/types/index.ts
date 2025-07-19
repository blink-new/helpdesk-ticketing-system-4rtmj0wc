export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'agent' | 'user'
  createdAt: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  tags?: string
  assignedTo?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  dueDate?: string
}

export interface Comment {
  id: string
  ticketId: string
  userId: string
  content: string
  isInternal: boolean
  createdAt: string
}

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags?: string
  fileUrl?: string
  fileType?: string
  fileSize?: number
  createdAt: string
  updatedAt: string
}

export interface KnowledgeArticleTag {
  id: string
  articleId: string
  tag: string
  createdAt: string
}