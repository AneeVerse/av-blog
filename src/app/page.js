"use client"
import RichTextEditor from '@/components/RichTextEditor'
import { useState, useEffect } from 'react';
import { FaLink, FaUser, FaRegClock, FaEye, FaCopy } from 'react-icons/fa';
import { MdImage } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { AiOutlineCalendar, AiOutlineFileText } from 'react-icons/ai';

export default function BlogEditorPage() {
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [blogData, setBlogData] = useState({
    id: '',
    title: '',
    thumbnail: '',
    category: '',
    timeToRead: '',
    author: '',
    shortDescription: '',
    description: '',
    content: ''
  });
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [copyText, setCopyText] = useState('Copy Code');
  const [validationErrors, setValidationErrors] = useState({});

  const categories = ["Design", "eBay", "E-Commerce", "SEO"];
  const authors = [
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
  ];

  // Automatically generate ID from title
  useEffect(() => {
    const generatedId = blogData.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
      
    setBlogData(prev => ({
      ...prev,
      id: generatedId
    }));
  }, [blogData.title]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Handle textarea input to remove new lines
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    // Remove new lines from the input
    const sanitizedValue = value.replace(/\n/g, ' ');
    setBlogData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    setBlogData(prev => ({
      ...prev,
      content: newContent
    }));
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      content: ''
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!blogData.title) errors.title = 'Title is required';
    if (!blogData.thumbnail) errors.thumbnail = 'Thumbnail URL is required';
    if (!blogData.category) errors.category = 'Category is required';
    if (!date) errors.date = 'Date is required';
    if (!blogData.timeToRead) errors.timeToRead = 'Reading time is required';
    if (!blogData.author) errors.author = 'Author is required';
    if (!blogData.shortDescription) errors.shortDescription = 'Short description is required';
    if (!content) errors.content = 'Content is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateOutput = () => {
    const isValid = validateForm();
    if (!isValid) return;

    const selectedAuthor = authors.find(author => author.name === blogData.author);
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');

    const output = {
      id: blogData.id || "unique-blog-id",
      title: blogData.title || "Your Blog Title Here",
      thumbnail: blogData.thumbnail || "/path/to/thumbnail.avif",
      category: blogData.category || "Your Category",
      date: formattedDate || "DD MMM, YYYY",
      timeToRead: blogData.timeToRead ? `${blogData.timeToRead} min read` : "X min read",
      author: selectedAuthor || {
        name: "Author Name",
        role: "Author Role",
        image: "/path/to/author/image.avif"
      },
      shortDescription: blogData.shortDescription || "",
      description: blogData.description || "",
      content: content || "<div>Your blog content goes here.</div>"
    };

    setGeneratedOutput(output);
  };

  // Generate variable name from title
  const generateVariableName = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    if (!generatedOutput) return;

    const code = `// data/blogs.js\n` +
      `export const ${generateVariableName(generatedOutput.title)} = \n` +
      JSON.stringify(generatedOutput, null, 2)
        .replace(/"([^"]+)":/g, '$1:')
        .replace(/^{\n/, '{\n')
        .replace(/\n}$/, '\n}') +
      `\n;`;

    navigator.clipboard.writeText(code).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy Code'), 3000);
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white shadow-xl rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Blog <span className="text-blue-600">Template Generator</span>
          </h1>
          <p className="text-gray-600 mt-2">Create professional blog templates with dynamic content generation</p>
        </div>

        {/* Blog Data Form */}
        <div className="bg-white shadow-xl rounded-xl p-8 grid md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Blog Details</h2>
            <div className="space-y-4">
              <div className="relative">
                <FaLink className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500" />
                <input
                  name="id"
                  value={blogData.id}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Auto-generated URL"
                  readOnly
                />
              </div>
              <div className="relative">
                <FaUser className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  name="title"
                  value={blogData.title}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Blog Title"
                  required
                />
                {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
              </div>
              <div className="relative">
                <MdImage className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  name="thumbnail"
                  value={blogData.thumbnail}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Thumbnail Image URL"
                  required
                />
                {validationErrors.thumbnail && <p className="text-red-500 text-sm mt-1">{validationErrors.thumbnail}</p>}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <select
                    name="category"
                    value={blogData.category}
                    onChange={handleInputChange}
                    className="w-full pl-10 border border-gray-200 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <IoMdArrowDropdown className="absolute right-3 top-[17px] text-gray-500" />
                  {validationErrors.category && <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>}
                </div>
                <div className="relative">
                  <AiOutlineCalendar className="absolute left-3 top-[17px] text-gray-500" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {validationErrors.date && <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Author & Metadata</h2>
            <div className="space-y-4">
              <div className="relative">
                <select
                  name="author"
                  value={blogData.author}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Author</option>
                  {authors.map((author, index) => (
                    <option key={index} value={author.name}>{author.name}</option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-3 top-[17px] text-gray-500" />
                {validationErrors.author && <p className="text-red-500 text-sm mt-1">{validationErrors.author}</p>}
              </div>
              <div className="relative">
                <FaRegClock className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  name="timeToRead"
                  value={blogData.timeToRead}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Reading Time (minutes)"
                  type="number"
                  required
                />
                {validationErrors.timeToRead && <p className="text-red-500 text-sm mt-1">{validationErrors.timeToRead}</p>}
              </div>
              <div className="relative">
                <AiOutlineFileText className="absolute left-3 top-[17px] text-gray-500" />
                <textarea
                  name="shortDescription"
                  value={blogData.shortDescription}
                  onChange={handleTextareaChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Short Description (Plain Text)"
                  required
                />
                {validationErrors.shortDescription && <p className="text-red-500 text-sm mt-1">{validationErrors.shortDescription}</p>}
              </div>
              {/* Description Field */}
              <div className="relative">
                <AiOutlineFileText className="absolute left-3 top-[17px] text-gray-500" />
                <textarea
                  name="description"
                  value={blogData.description}
                  onChange={handleTextareaChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed Description (Plain Text)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white shadow-xl rounded-xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Blog Content</h2>
            <button
              onClick={() => setShowHtmlPreview(!showHtmlPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <FaEye className="text-gray-600" />
              {showHtmlPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
          
          <RichTextEditor
            initialData={content}
            onEditorChange={handleEditorChange}
          />
          {validationErrors.content && <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>}

          {showHtmlPreview && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Content Preview</h3>
              <div 
                className="prose max-w-none description border border-gray-200 p-6 rounded-lg"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            </div>
          )}
        </div>

        {/* Generate Output Section */}
        <div className="bg-white shadow-xl rounded-xl p-8">
          <button
            onClick={generateOutput}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
          >
            Generate Blog Template
          </button>

          {generatedOutput && (
            <div className="mt-8 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Generated Output</h2>
              <pre className="bg-gray-50 p-6 rounded-lg overflow-x-auto text-sm relative">
                <code>
                  {`// data/blogs.js\n`}
                  {`export const ${generateVariableName(generatedOutput.title)} = \n`}
                  {JSON.stringify(generatedOutput, null, 2)
                    .replace(/"([^"]+)":/g, '$1:')
                    .replace(/^{\n/, '{\n')
                    .replace(/\n}$/, '\n}')}
                  {`\n;`}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <FaCopy />
                  {copyText}
                </button>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}