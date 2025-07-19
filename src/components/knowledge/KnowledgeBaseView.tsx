import React, { useState, useEffect } from 'react'
import { Search, Upload, FileText, Video, File, Tag, Plus, Filter, Download, Eye } from 'lucide-react'
import { ArticleDetailView } from './ArticleDetailView'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { blink } from '@/blink/client'
import type { KnowledgeArticle } from '@/types'

interface KnowledgeBaseViewProps {
  userRole?: 'admin' | 'agent' | 'user'
}

export function KnowledgeBaseView({ userRole = 'user' }: KnowledgeBaseViewProps) {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    file: null as File | null
  })

  useEffect(() => {
    loadArticles()
    loadTags()
  }, [])

  const loadArticles = async () => {
    try {
      const data = await blink.db.knowledgeArticles.list({
        orderBy: { createdAt: 'desc' }
      })
      setArticles(data)
    } catch (error) {
      console.error('Failed to load articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTags = async () => {
    try {
      const data = await blink.db.knowledgeArticleTags.list()
      const uniqueTags = [...new Set(data.map(item => item.tag))]
      setAvailableTags(uniqueTags)
    } catch (error) {
      console.error('Failed to load tags:', error)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.title || !uploadForm.content) return

    setUploadLoading(true)
    try {
      let fileUrl = ''
      let fileType = ''
      let fileSize = 0

      // Upload file if provided
      if (uploadForm.file) {
        const { publicUrl } = await blink.storage.upload(
          uploadForm.file,
          `knowledge-base/${uploadForm.file.name}`,
          { upsert: true }
        )
        fileUrl = publicUrl
        fileType = uploadForm.file.type
        fileSize = uploadForm.file.size
      }

      // Create article
      const article = await blink.db.knowledgeArticles.create({
        title: uploadForm.title,
        content: uploadForm.content,
        category: uploadForm.category,
        tags: uploadForm.tags,
        fileUrl,
        fileType,
        fileSize,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      // Create individual tag entries
      if (uploadForm.tags) {
        const tagList = uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        for (const tag of tagList) {
          await blink.db.knowledgeArticleTags.create({
            articleId: article.id,
            tag: tag.toLowerCase()
          })
        }
      }

      // Reset form and reload data
      setUploadForm({ title: '', content: '', category: '', tags: '', file: null })
      setIsUploadOpen(false)
      await loadArticles()
      await loadTags()
    } catch (error) {
      console.error('Failed to upload article:', error)
    } finally {
      setUploadLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => article.tags?.toLowerCase().includes(tag.toLowerCase()))

    const matchesType = filterType === 'all' || 
      (filterType === 'documents' && article.fileUrl && article.fileType?.includes('pdf')) ||
      (filterType === 'videos' && article.fileUrl && article.fileType?.includes('video')) ||
      (filterType === 'articles' && !article.fileUrl)

    return matchesSearch && matchesTags && matchesType
  })

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return <FileText className="h-4 w-4" />
    if (fileType?.includes('video')) return <Video className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading knowledge base...</div>
      </div>
    )
  }

  // Show article detail view if an article is selected
  if (selectedArticle) {
    return (
      <ArticleDetailView 
        article={selectedArticle} 
        onBack={() => setSelectedArticle(null)} 
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-muted-foreground">Search articles, documents, and resources</p>
        </div>
        {userRole === 'admin' && (
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Article</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Article title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={uploadForm.content}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Article content or description"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                        <SelectItem value="how-to">How-to Guide</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                        <SelectItem value="policy">Policy</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="file">Upload File (optional)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.mp4,.mov,.avi,.mkv,.txt,.md"
                    onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Supported: PDF, DOC, DOCX, MP4, MOV, AVI, MKV, TXT, MD
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploadLoading}>
                    {uploadLoading ? 'Uploading...' : 'Add Article'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <Tabs value={filterType} onValueChange={setFilterType}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Available Tags */}
            {availableTags.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Filter by Tags:</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-6">
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedTags.length > 0 
                  ? "Try adjusting your search or filters"
                  : "No articles have been added yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map(article => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                    <p className="text-muted-foreground line-clamp-2">{article.content}</p>
                  </div>
                  {article.fileUrl && (
                    <div className="ml-4 flex items-center space-x-2">
                      {getFileIcon(article.fileType || '')}
                      <span className="text-sm text-muted-foreground">
                        {formatFileSize(article.fileSize || 0)}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  {article.tags && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Separator />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Category: {article.category || 'General'}</span>
                      <span>•</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {article.fileUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={article.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}