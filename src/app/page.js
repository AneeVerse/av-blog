"use client"
// pages/generator.js
import { useState } from 'react'
import { marked } from 'marked'

// Markdown to JSX converter configuration
const renderer = {
  paragraph(text) {
    return `<p>${text}</p>`
  },
  strong(text) {
    return `<strong>${text}</strong>`
  },
  em(text) {
    return `<em>${text}</em>`
  },
  heading(text, level) {
    return `<h${level}>${text}</h${level}>`
  },
  list(body, ordered) {
    return ordered ? `<ol>${body}</ol>` : `<ul>${body}</ul>`
  },
  listitem(text) {
    return `<li>${text}</li>`
  },
  image(href, title, text) {
    return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''} />`
  }
}

marked.use({ renderer })

const markdownToJSX = (markdown) => {
  return marked.parse(markdown.trim())
}

export default function BlogGenerator() {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    thumbnail: '',
    category: '',
    date: '',
    timeToRead: '',
    author: {
      name: '',
      role: '',
      image: ''
    },
    shortDescription: '',
    description: '',
    content: []
  })

  const [generatedCode, setGeneratedCode] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAuthorChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      author: { ...prev.author, [name]: value }
    }))
  }

  const handleContentChange = (index, field, value) => {
    const updatedContent = [...formData.content]
    updatedContent[index][field] = value
    setFormData(prev => ({ ...prev, content: updatedContent }))
  }

  const addContentItem = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, { title: '', type: 'text', srcUrl: '', description: '' }]
    }))
  }

  const removeContentItem = (index) => {
    const updatedContent = formData.content.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, content: updatedContent }))
  }

  const generateCode = () => {
    const descriptionJSX = markdownToJSX(formData.description)
    const formattedDescription = descriptionJSX.split('\n').map(line => `      ${line}`).join('\n')

    const contentCode = formData.content.map(item => {
      const itemDescription = markdownToJSX(item.description)
      const formattedItemDesc = itemDescription.split('\n').map(line => `          ${line}`).join('\n')
      
      return `      {
        title: "${item.title}",
        type: "${item.type}",
        srcUrl: "${item.type !== 'text' ? item.srcUrl : ''}",
        description: (
${formattedItemDesc}
        ),
      },`
    }).join('\n')

    const code = `// data/blogs.js
export const ${formData.id.replace(/[-]/g, '_')} = [
  {
    id: "${formData.id}",
    title: "${formData.title}",
    thumbnail: "${formData.thumbnail}",
    category: "${formData.category}",
    date: "${formData.date}",
    timeToRead: "${formData.timeToRead}",
    author: {
      name: "${formData.author.name}",
      role: "${formData.author.role}",
      image: "${formData.author.image}"
    },
    shortDescription: "${formData.shortDescription}",
    description: (
      <div>
${formattedDescription}
      </div>
    ),
    content: [
${contentCode}
    ],
  },
];`

    setGeneratedCode(code)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Template Generator</h1>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <input type="text" name="id" value={formData.id} onChange={handleInputChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thumbnail Path</label>
                <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Author Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Author Information</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" value={formData.author.name} onChange={handleAuthorChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input type="text" name="role" value={formData.author.role} onChange={handleAuthorChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image Path</label>
                <input type="text" name="image" value={formData.author.image} onChange={handleAuthorChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Short Description</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Markdown Format</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="**Bold text** *Italic* [Link](url)"
              />
            </div>
          </div>

          {/* Main Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Main Description</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Markdown Editor</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="8"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                placeholder={`## Heading\n**Bold text**\n- List item\n\n| Table | Example |\n|-------|---------|`}
              />
              <p className="mt-2 text-sm text-gray-500">
                Markdown supported: # Headers, **bold**, *italic*, `code`, - lists, [links](), tables
              </p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Content Sections</h2>
              <button onClick={addContentItem} type="button" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Add Section
              </button>
            </div>
            
            {formData.content.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Section {index + 1}</h3>
                  <button onClick={() => removeContentItem(index)} type="button" 
                    className="text-red-600 hover:text-red-900">Remove</button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" value={item.title} 
                      onChange={(e) => handleContentChange(index, 'title', e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select value={item.type} 
                      onChange={(e) => handleContentChange(index, 'type', e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                </div>

                {item.type !== 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source URL</label>
                    <input type="text" value={item.srcUrl} 
                      onChange={(e) => handleContentChange(index, 'srcUrl', e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description (Markdown)</label>
                  <textarea value={item.description} rows="4"
                    onChange={(e) => handleContentChange(index, 'description', e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm" />
                </div>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <button onClick={generateCode} type="button" 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
            Generate Code
          </button>
        </div>

        {/* Generated Code Preview */}
        {generatedCode && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Generated Code</h2>
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}