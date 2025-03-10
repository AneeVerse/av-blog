'use client';
import { useState } from 'react';
import { FaLink, FaUser, FaRegClock } from 'react-icons/fa';
import { MdImage } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { AiOutlineCalendar, AiOutlineFileText } from 'react-icons/ai';

export default function BlogTemplateGenerator() {
  const [date, setDate] = useState('');
  return (
    <div className="bg-gray-100 p-6">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog <span className="text-gray-500">Template Generator</span></h1>
        <div className="bg-white shadow-lg rounded-lg p-6 grid md:grid-cols-2 gap-6">
          {/* Left Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Blog Data</h2>
            <div className="space-y-4">
              <div className="relative">
                <FaLink className="absolute left-3 top-3 text-gray-400" />
                <input className="w-full pl-10 border-gray-300 rounded-lg p-2" placeholder="BLOG URL: how-to-improve-website-seo" readOnly />
              </div>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input className="w-full pl-10 border-gray-300 rounded-lg p-2" placeholder="TITLE: How to improve website SEO" readOnly />
              </div>
              <div className="relative">
                <MdImage className="absolute left-3 top-3 text-gray-400" />
                <input className="w-full pl-10 border-gray-300 rounded-lg p-2" placeholder="Image link" />
              </div>
              <div className="relative">
                <select className="w-full border-gray-300 rounded-lg p-2 appearance-none">
                  <option>Select category</option>
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
                <input className="w-full pl-10 border-gray-300 rounded-lg p-2" placeholder="Time to read" />
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div>
            <div className="space-y-4">
              <select className="w-full border-gray-300 rounded-lg p-2">
                <option>Select Author</option>
              </select>
              <div className="relative">
                <AiOutlineFileText className="absolute left-3 top-3 text-gray-400" />
                <textarea className="w-full pl-10 border-gray-300 rounded-lg p-2 h-20" placeholder="Short Description"></textarea>
              </div>
              <div className="relative">
                <AiOutlineFileText className="absolute left-3 top-3 text-gray-400" />
                <textarea className="w-full pl-10 border-gray-300 rounded-lg p-2 h-32" placeholder="Main Description"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
