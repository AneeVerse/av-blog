"use client"
import RichTextEditor from '@/components/RichTextEditor'
import { useState } from 'react';
import { FaLink, FaUser, FaRegClock } from 'react-icons/fa';
import { MdImage } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { AiOutlineCalendar, AiOutlineFileText } from 'react-icons/ai';

export default function BlogEditorPage() {
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    setBlogData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const generateOutput = () => {
    const selectedAuthor = authors.find(author => author.name === blogData.author);
    const output = {
      id: blogData.id || "unique-blog-id",
      title: blogData.title || "Your Blog Title Here",
      thumbnail: blogData.thumbnail || "/path/to/thumbnail.avif",
      category: blogData.category || "Your Category",
      date: date || "DD MMM, YYYY",
      timeToRead: blogData.timeToRead || "X min read",
      author: selectedAuthor || {
        name: "Author Name",
        role: "Author Role",
        image: "/path/to/author/image.avif"
      },
      shortDescription: blogData.shortDescription || "A brief summary of your blog post...",
      description: blogData.description || "This is the main description of the blog.",
      content: `<div>${content}</div>`
    };
    setGeneratedOutput(output);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-[1536px] mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Blog <span className="text-blue-600">Template Generator</span>
        </h1>

        {/* Blog Data Form */}
        <div className="bg-white shadow-xl rounded-xl p-8 grid md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Blog Details</h2>
            <div className="space-y-4">
              <div className="relative">
                <FaLink className="absolute left-3 top-3 text-gray-500" />
                <input
                  name="id"
                  value={blogData.id}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="BLOG URL: how-to-improve-website-seo"
                />
              </div>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-500" />
                <input
                  name="title"
                  value={blogData.title}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="TITLE: How to improve website SEO"
                />
              </div>
              <div className="relative">
                <MdImage className="absolute left-3 top-3 text-gray-500" />
                <input
                  name="thumbnail"
                  value={blogData.thumbnail}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Image link"
                />
              </div>
              <div className="relative">
                <select
                  name="category"
                  value={blogData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-3 top-3 text-gray-500" />
              </div>
              <div className="relative">
                <AiOutlineCalendar className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <FaRegClock className="absolute left-3 top-3 text-gray-500" />
                <input
                  name="timeToRead"
                  value={blogData.timeToRead}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Time to read"
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Author & Description</h2>
            <div className="space-y-4">
              <div className="relative">
                <select
                  name="author"
                  value={blogData.author}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Author</option>
                  {authors.map((author, index) => (
                    <option key={index} value={author.name}>{author.name}</option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-3 top-3 text-gray-500" />
              </div>
              <div className="relative">
                <AiOutlineFileText className="absolute left-3 top-3 text-gray-500" />
                <textarea
                  name="shortDescription"
                  value={blogData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Short Description"
                />
              </div>
              <div className="relative">
                <AiOutlineFileText className="absolute left-3 top-3 text-gray-500" />
                <textarea
                  name="description"
                  value={blogData.description}
                  onChange={handleInputChange}
                  className="w-full pl-10 border border-gray-200 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Main Description"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rich Text Editor Section */}
        <div className="mt-8 bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Blog Content</h2>
          <RichTextEditor
            initialData={content}
            onEditorChange={handleEditorChange}
          />
        </div>

        {/* Generate Output Button */}
        <div className="mt-8">
          <button
            onClick={generateOutput}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Output
          </button>
        </div>

        {/* Generated Output Section */}
        {generatedOutput && (
          <div className="mt-8 bg-white shadow-xl rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Output</h2>
            <pre className="bg-gray-100 p-6 rounded-lg overflow-x-auto">
              <code className="text-sm text-gray-700">{JSON.stringify(generatedOutput, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}