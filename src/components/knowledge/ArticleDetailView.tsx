import React from 'react'
import { ArrowLeft, Download, Calendar, Tag, User, FileText, Video, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { KnowledgeArticle } from '@/types'

interface ArticleDetailViewProps {
  article: KnowledgeArticle
  onBack: () => void
}

export function ArticleDetailView({ article, onBack }: ArticleDetailViewProps) {
  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return <FileText className="h-5 w-5" />
    if (fileType?.includes('video')) return <Video className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderFilePreview = () => {
    if (!article.fileUrl) return null

    if (article.fileType?.includes('video')) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Video Content</h3>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video 
              controls 
              className="w-full h-full"
              src={article.fileUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )
    }

    if (article.fileType?.includes('pdf')) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Document Preview</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-medium">PDF Document</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(article.fileSize || 0)}
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <a href={article.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Attached File</h3>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(article.fileType || '')}
              <div>
                <p className="font-medium">Attached File</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(article.fileSize || 0)}
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href={article.fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Knowledge Base
        </Button>
      </div>

      {/* Article Content */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-3xl">{article.title}</CardTitle>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Admin
              </div>
              {article.category && (
                <Badge variant="secondary">
                  {article.category}
                </Badge>
              )}
            </div>

            {/* Tags */}
            {article.tags && (
              <div className="flex flex-wrap gap-2">
                {article.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none">
            {/* Article Content */}
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>

            {/* File Preview */}
            {renderFilePreview()}
          </div>
        </CardContent>
      </Card>

      {/* Related Articles Section */}
      <Card>
        <CardHeader>
          <CardTitle>Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Related articles will be shown here based on tags and category.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}