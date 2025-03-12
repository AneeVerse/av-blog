"use client"
import RichTextEditor from '@/components/RichTextEditor'
import { useState } from 'react';
import { FaLink, FaUser, FaRegClock, FaEye, FaCopy } from 'react-icons/fa';
import { MdImage } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { AiOutlineCalendar, AiOutlineFileText } from 'react-icons/ai';

// Enhanced HTML to JSX Converter
const convertHtmlToJsx = (html) => {
  // Convert style attributes to JSX format
  const styleRegex = /style="([^"]*)"/g;
  const jsxWithStyles = html.replace(styleRegex, (match, styleContent) => {
    const stylePairs = styleContent.split(';').filter(pair => pair.trim());
    const jsxStyle = stylePairs.map(pair => {
      const [key, value] = pair.split(':').map(s => s.trim());
      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return `${camelCaseKey}: '${value}'`;
    }).join(', ');
    return `style={{ ${jsxStyle} }}`;
  });

  return jsxWithStyles
    .replace(/class=/g, 'className=')
    .replace(/(stroke|clip|fill|font|marker|stop|underline)-(\w+)/g, (_, prefix, suffix) => 
      `${prefix}${suffix[0].toUpperCase()}${suffix.slice(1)}`
    )
    .replace(/<img([^>]+?)\/?>/g, '<img$1 />') // Fix self-closing with single slash
    .replace(/<br\s*\/?>/g, '<br />')
    .replace(/&nbsp;/g, ' ')
    .replace(/<(\w+)([^>]*)>\s*<\/\1>/g, '<$1$2 />'); // Self-close empty tags
};

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

  // Automatically format URL (id) when typing
  const handleIdChange = (e) => {
    const { value } = e.target;
    const formattedId = value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    setBlogData(prev => ({
      ...prev,
      id: formattedId
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\n/g, ' ');
    setBlogData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
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

    // Convert HTML to JSX
    const jsxContent = convertHtmlToJsx(content);

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
      content: jsxContent
    };

    setGeneratedOutput(output);
  };

  const generateVariableName = (id) => {
    return id
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '')
      .replace(/-/g, '_')
      .substring(0, 30);
  };

  const copyToClipboard = () => {
    if (!generatedOutput) return;

    const outputCode = `// data/blogs.js
export const ${generateVariableName(generatedOutput.id)} = {
  id: "${generatedOutput.id}",
  title: "${generatedOutput.title}",
  thumbnail: "${generatedOutput.thumbnail}",
  category: "${generatedOutput.category}",
  date: "${generatedOutput.date}",
  timeToRead: "${generatedOutput.timeToRead}",
  author: {
    name: "${generatedOutput.author.name}",
    role: "${generatedOutput.author.role}",
    image: "${generatedOutput.author.image}"
  },
  shortDescription: "${generatedOutput.shortDescription}",
  description: "${generatedOutput.description}",
  content: (
    <div className="prose max-w-none">
      ${convertHtmlToJsx(generatedOutput.content)
        .split('\n')
        .map(line => `      ${line}`)
        .join('\n')}
    </div>
  )
};`;

    navigator.clipboard.writeText(outputCode).then(() => {
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
                  onChange={handleIdChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter URL (e.g., my-blog-post)"
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
                  {`export const ${generateVariableName(generatedOutput.id)} = {\n`}
                  {`  id: "${generatedOutput.id}",\n`}
                  {`  title: "${generatedOutput.title}",\n`}
                  {`  thumbnail: "${generatedOutput.thumbnail}",\n`}
                  {`  category: "${generatedOutput.category}",\n`}
                  {`  date: "${generatedOutput.date}",\n`}
                  {`  timeToRead: "${generatedOutput.timeToRead}",\n`}
                  {`  author: {\n`}
                  {`    name: "${generatedOutput.author.name}",\n`}
                  {`    role: "${generatedOutput.author.role}",\n`}
                  {`    image: "${generatedOutput.author.image}"\n`}
                  {`  },\n`}
                  {`  shortDescription: "${generatedOutput.shortDescription}",\n`}
                  {`  description: "${generatedOutput.description}",\n`}
                  {`  content: (\n`}
                  {`    <div className="prose max-w-none">\n`}
                  {convertHtmlToJsx(generatedOutput.content).split('\n').map((line, i) => (
                    `      ${line}\n`
                  ))}
                  {`    </div>\n`}
                  {`  )\n`}
                  {`};`}
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