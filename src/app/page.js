"use client"
import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import HtmlToJsx from 'html-to-jsx-transform'
import SectionEditor from '@/components/SectionEditor' // Import the new component

// Predefined options
const CATEGORIES = ["Design", "eBay", "E-Commerce", "SEO"]
const AUTHORS = [
  {
    name: "Pushkar Dake",
    role: "Chief Marketing Officer",
    image: "/images/blog/author/pushkar.png",
  },
  {
    name: "Abhijit",
    role: "UI/UX Designer",
    image: "/images/blog/author/abhi.png",
  },
]

export default function BlogGenerator() {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    thumbnail: '',
    category: '',
    date: '',
    timeToRead: '',
    author: AUTHORS[0],
    shortDescription: '',
    description: '',
    content: []
  })

  const [generatedCode, setGeneratedCode] = useState('')

  // Main Tiptap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.description,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, description: editor.getHTML() }))
    }
  })

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle author selection
  const handleAuthorChange = (e) => {
    const selectedAuthor = AUTHORS.find(a => a.name === e.target.value)
    setFormData(prev => ({ ...prev, author: selectedAuthor }))
  }

  // Add content section
  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, { title: '', type: 'text', srcUrl: '', description: '' }]
    }))
  }

  // Remove content section
  const removeContentSection = (index) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }))
  }

  // Handle content section changes
  const handleContentChange = (index, field, value) => {
    const updatedContent = [...formData.content]
    updatedContent[index][field] = value
    setFormData(prev => ({ ...prev, content: updatedContent }))
  }

  // Convert HTML to JSX
  const convertHtmlToJSX = (html) => {
    try {
      const converter = new HtmlToJsx()
      return converter.convert(html)
    } catch {
      return html
    }
  }

  // Generate final code
  const generateCode = () => {
    const jsxDescription = convertHtmlToJSX(formData.description)
    
    const contentCode = formData.content.map(item => {
      const itemDescription = convertHtmlToJSX(item.description)
      return `{
        title: "${item.title.replace(/"/g, '\\"')}",
        type: "${item.type}",
        srcUrl: "${item.srcUrl}",
        description: (
          ${itemDescription.split('\n').join('\n          ')}
        ),
      }`
    }).join(',\n      ')

    const code = `// blogs.js
export const ${formData.id.replace(/[-]/g, '_')} = [
  {
    id: "${formData.id}",
    title: "${formData.title.replace(/"/g, '\\"')}",
    thumbnail: "${formData.thumbnail}",
    category: "${formData.category}",
    date: "${formData.date}",
    timeToRead: "${formData.timeToRead}",
    author: ${JSON.stringify(formData.author, null, 2).replace(/"([^"]+)":/g, '$1:')},
    shortDescription: "${formData.shortDescription.replace(/"/g, '\\"')}",
    description: (
      <div>
        ${jsxDescription.split('\n').join('\n        ')}
      </div>
    ),
    content: [
      ${contentCode}
    ],
  },
]`

    setGeneratedCode(code)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1580px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Template Generator</h1>

          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unique ID</label>
                <input 
                  type="text" 
                  name="id" 
                  value={formData.id} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time to read</label>
                <input 
                  type="text" 
                  name="timeToRead" 
                  value={formData.timeToRead} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Author Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Author Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Author</label>
                <select 
                  value={formData.author.name} 
                  onChange={handleAuthorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {AUTHORS.map(author => (
                    <option key={author.name} value={author.name}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input 
                  type="text" 
                  value={formData.author.role} 
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Path</label>
                <input 
                  type="text" 
                  value={formData.author.image} 
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Content Editor</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Description</label>
              <div className="border border-gray-300 rounded-lg p-4">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Content Sections</h2>
            <button 
              onClick={addContentSection}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Section
            </button>

            {formData.content.map((section, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Section {index + 1}</h3>
                  <button
                    onClick={() => removeContentSection(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remove Section
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleContentChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={section.type}
                      onChange={(e) => handleContentChange(index, 'type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                {section.type !== 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
                    <input
                      type="text"
                      value={section.srcUrl}
                      onChange={(e) => handleContentChange(index, 'srcUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <SectionEditor
                    content={section.description}
                    onUpdate={(html) => handleContentChange(index, 'description', html)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <button 
            onClick={generateCode} 
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Generate Code
          </button>
        </div>

        {/* Right Side - Generated Code Preview */}
        <div className="sticky top-8 h-[calc(100vh-4rem)] bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto">
          <h2 className="text-2xl font-semibold text-white mb-6">Generated Code</h2>
          <pre className="text-sm text-gray-100">
            {generatedCode && <code>{generatedCode}</code>}
          </pre>
        </div>
      </div>
    </div>
  )
}