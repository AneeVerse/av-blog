"use client"
import RichTextEditor from '@/components/RichTextEditor'
import { useState, useEffect } from 'react';
import { FaLink, FaUser, FaRegClock, FaEye, FaCopy } from 'react-icons/fa';
import { MdImage } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { AiOutlineCalendar, AiOutlineFileText } from 'react-icons/ai';

export default function CustomerStoryEditorPage() {
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [storyData, setStoryData] = useState({
    id: '',
    title: '',
    thumbnail: '',
    category: '',
    timeToRead: '',
    author: '',
    client: {
      name: '',
      industry: '',
      logo: ''
    },
    shortDescription: '',
    description: '',
    content: ''
  });
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [copyText, setCopyText] = useState('Copy Code');
  const [validationErrors, setValidationErrors] = useState({});

  const categories = ["Saas", "E-commerce", "Technology", "Marketing"];
  const authors = [
    {
      name: "John Smith",
      role: "Head of Growth at XYZ Tech",
      image: "/images/customer-stories/author/john-smith.png",
    },
    {
      name: "Jane Doe",
      role: "Marketing Director at ABC Corp",
      image: "/images/customer-stories/author/jane-doe.png",
    },
  ];

  // Automatically format URL (id) when typing
  const handleIdChange = (e) => {
    const { value } = e.target;
    // Allow hyphens and alphanumeric characters
    const formattedId = value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '') // Allow only alphanumeric and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .substring(0, 50); // Limit length

    setStoryData(prev => ({
      ...prev,
      id: formattedId
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setStoryData(prev => ({
      ...prev,
      client: {
        ...prev.client,
        [name]: value
      }
    }));
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [`client_${name}`]: ''
    }));
  };

  // Handle textarea input to remove new lines
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    // Remove new lines from the input
    const sanitizedValue = value.replace(/\n/g, ' ');
    setStoryData(prev => ({
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
    setStoryData(prev => ({
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

    if (!storyData.title) errors.title = 'Title is required';
    if (!storyData.thumbnail) errors.thumbnail = 'Thumbnail URL is required';
    if (!storyData.category) errors.category = 'Category is required';
    if (!date) errors.date = 'Date is required';
    if (!storyData.timeToRead) errors.timeToRead = 'Reading time is required';
    if (!storyData.author) errors.author = 'Author is required';
    if (!storyData.shortDescription) errors.shortDescription = 'Short description is required';
    if (!content) errors.content = 'Content is required';
    if (!storyData.client.name) errors.client_name = 'Client name is required';
    if (!storyData.client.industry) errors.client_industry = 'Client industry is required';
    if (!storyData.client.logo) errors.client_logo = 'Client logo URL is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateOutput = () => {
    const isValid = validateForm();
    if (!isValid) return;

    const selectedAuthor = authors.find(author => author.name === storyData.author);
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');

    // Wrap content in div without quotes
    const wrappedContent = `<div>${content}</div>`;

    const output = {
      id: storyData.id || "unique-story-id",
      title: storyData.title || "Your Story Title Here",
      thumbnail: storyData.thumbnail || "/path/to/thumbnail.avif",
      category: storyData.category || "Your Category",
      date: formattedDate || "DD MMM, YYYY",
      timeToRead: storyData.timeToRead ? `${storyData.timeToRead} min read` : "X min read",
      author: selectedAuthor || {
        name: "Author Name",
        role: "Author Role",
        image: "/path/to/author/image.avif"
      },
      client: {
        name: storyData.client.name || "Client Name",
        industry: storyData.client.industry || "Client Industry",
        logo: storyData.client.logo || "/path/to/client/logo.avif"
      },
      shortDescription: storyData.shortDescription || "",
      description: storyData.description || "",
      content: wrappedContent // Use unquoted content here
    };

    setGeneratedOutput(output);
  };

  // Generate variable name from URL (replace hyphens with underscores)
  const generateVariableName = (id) => {
    return id
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '') // Allow only alphanumeric and hyphens
      .replace(/-/g, '_') // Replace hyphens with underscores
      .substring(0, 30); // Limit length
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    if (!generatedOutput) return;

    // Manually format the output to remove quotes from content
    const outputCode = `// data/customerStories.js
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
  client: {
    name: "${generatedOutput.client.name}",
    industry: "${generatedOutput.client.industry}",
    logo: "${generatedOutput.client.logo}"
  },
  shortDescription: "${generatedOutput.shortDescription}",
  description: "${generatedOutput.description}",
  content: ${generatedOutput.content}
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
            Customer Story <span className="text-blue-600">Template Generator</span>
          </h1>
          <p className="text-gray-600 mt-2">Create professional customer story templates with dynamic content generation</p>
        </div>

        {/* Story Data Form */}
        <div className="bg-white shadow-xl rounded-xl p-8 grid md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Story Details</h2>
            <div className="space-y-4">
              <div className="relative">
                <FaLink className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500" />
                <input
                  name="id"
                  value={storyData.id}
                  onChange={handleIdChange} // Use handleIdChange for URL input
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter URL (e.g., my-story)"
                />
              </div>
              <div className="relative">
                <FaUser className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500" />
                <input
                  name="title"
                  value={storyData.title}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Story Title"
                  required
                />
                {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
              </div>
              <div className="relative">
                <MdImage className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500" />
                <input
                  name="thumbnail"
                  value={storyData.thumbnail}
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
                    value={storyData.category}
                    onChange={handleInputChange}
                    className="w-full pl-10 border border-gray-200 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <IoMdArrowDropdown className="absolute right-3 top-[50%] translate-y-[-50%] text-gray-500" />
                  {validationErrors.category && <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>}
                </div>
                <div className="relative">
                  <AiOutlineCalendar className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500" />
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
                  value={storyData.author}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Author</option>
                  {authors.map((author, index) => (
                    <option key={index} value={author.name}>{author.name}</option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-3 top-[50%] translate-y-[-50%] text-gray-500" />
                {validationErrors.author && <p className="text-red-500 text-sm mt-1">{validationErrors.author}</p>}
              </div>
              <div className="relative">
                <FaRegClock className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500" />
                <input
                  name="timeToRead"
                  value={storyData.timeToRead}
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
                  value={storyData.shortDescription}
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
                  value={storyData.description}
                  onChange={handleTextareaChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed Description (Plain Text)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Details Section */}
        <div className="bg-white shadow-xl rounded-xl p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Client Details</h2>
          <div className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500" />
              <input
                name="name"
                value={storyData.client.name}
                onChange={handleClientInputChange}
                className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Client Name"
                required
              />
              {validationErrors.client_name && <p className="text-red-500 text-sm mt-1">{validationErrors.client_name}</p>}
            </div>
            <div className="relative">
              <FaUser className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500" />
              <input
                name="industry"
                value={storyData.client.industry}
                onChange={handleClientInputChange}
                className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Client Industry"
                required
              />
              {validationErrors.client_industry && <p className="text-red-500 text-sm mt-1">{validationErrors.client_industry}</p>}
            </div>
            <div className="relative">
              <MdImage className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500" />
              <input
                name="logo"
                value={storyData.client.logo}
                onChange={handleClientInputChange}
                className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Client Logo URL"
                required
              />
              {validationErrors.client_logo && <p className="text-red-500 text-sm mt-1">{validationErrors.client_logo}</p>}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white shadow-xl rounded-xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Story Content</h2>
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
            Generate Story Template
          </button>

          {generatedOutput && (
            <div className="mt-8 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Generated Output</h2>
              <pre className="bg-gray-50 p-6 rounded-lg overflow-x-auto text-sm relative">
                <code>
                  {`// data/customerStories.js\n`}
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
                  {`  client: {\n`}
                  {`    name: "${generatedOutput.client.name}",\n`}
                  {`    industry: "${generatedOutput.client.industry}",\n`}
                  {`    logo: "${generatedOutput.client.logo}"\n`}
                  {`  },\n`}
                  {`  shortDescription: "${generatedOutput.shortDescription}",\n`}
                  {`  description: "${generatedOutput.description}",\n`}
                  {`  content: ${generatedOutput.content}\n`}
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