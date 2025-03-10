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

  const categories = ["Digital Advertising", "SEO", "Content Marketing"];
  const authors = [
    { name: "John Doe", role: "Content Writer", image: "/images/john.jpg" },
    { name: "Jane Smith", role: "SEO Expert", image: "/images/jane.jpg" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({
      ...prev,
      [name]: value
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
      description: content,
      content: `<div>${content}</div>`
    };
    setGeneratedOutput(output);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog <span className="text-gray-500">Template Generator</span></h1>
        <div className="bg-white shadow-lg rounded-lg p-6 grid md:grid-cols-2 gap-6">
          {/* Left Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Blog Data</h2>
            <div className="space-y-4">
              <div className="relative">
                <FaLink className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="id"
                  value={blogData.id}
                  onChange={handleInputChange}
                  className="w-full pl-10 border-gray-300 rounded-lg p-2"
                  placeholder="BLOG URL: how-to-improve-website-seo"
                />
              </div>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="title"
                  value={blogData.title}
                  onChange={handleInputChange}
                  className="w-full pl-10 border-gray-300 rounded-lg p-2"
                  placeholder="TITLE: How to improve website SEO"
                />
              </div>
              <div className="relative">
                <MdImage className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="thumbnail"
                  value={blogData.thumbnail}
                  onChange={handleInputChange}
                  className="w-full pl-10 border-gray-300 rounded-lg p-2"
                  placeholder="Image link"
                />
              </div>
              <div className="relative">
                <select
                  name="category"
                  value={blogData.category}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-lg p-2 appearance-none"
                >
                  <option value="">Select category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-3 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <AiOutlineCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="relative">
                <FaRegClock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="timeToRead"
                  value={blogData.timeToRead}
                  onChange={handleInputChange}
                  className="w-full pl-10 border-gray-300 rounded-lg p-2"
                  placeholder="Time to read"
                />
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div>
            <div className="space-y-4">
              <div className="relative">
                <select
                  name="author"
                  value={blogData.author}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-lg p-2 appearance-none"
                >
                  <option value="">Select Author</option>
                  {authors.map((author, index) => (
                    <option key={index} value={author.name}>{author.name}</option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-3 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <AiOutlineFileText className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="shortDescription"
                  value={blogData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full pl-10 border-gray-300 rounded-lg p-2 h-20"
                  placeholder="Short Description"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6">
        <RichTextEditor
          initialData={content}
          onEditorChange={(newContent) => setContent(newContent)}
        />
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={generateOutput}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Generate Output
        </button>
      </div>
      {generatedOutput && (
        <div className="max-w-7xl mx-auto p-6 bg-gray-100 rounded-lg mt-6">
          <h2 className="text-xl font-bold mb-4">Generated Output</h2>
          <pre className="bg-white p-4 rounded-lg overflow-x-auto">
            <code>{JSON.stringify(generatedOutput, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}