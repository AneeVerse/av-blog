"use client"
import RichTextEditor from '@/components/RichTextEditor'

export default function BlogEditorPage() {
  const [content, setContent] = useState('')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-6">Blog Editor</h1>
      <RichTextEditor 
        initialData={content}
        onEditorChange={(newContent) => setContent(newContent)}
      />
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl mb-4">HTML Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}