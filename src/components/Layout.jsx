"use client"
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FiMenu, FiX, FiUsers, FiBox, FiShoppingBag, FiSettings } from 'react-icons/fi'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toggleSidebar } from '@/redux/slices/sidebarSlice'

export default function Layout({ children }) {
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen)
  const dispatch = useDispatch()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { name: 'Blog Post', path: '/blog-code-generator', icon: <FiSettings /> },
    { name: 'Customer Story', path: '/products', icon: <FiSettings /> },
    { name: 'Our Works', path: '/orders', icon: <FiBox /> },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-lg z-50  ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4">
          <button 
            onClick={() => dispatch(toggleSidebar())}
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            <FiX size={24} />
          </button>
          <nav>
            {menuItems.map((item) => (
              <Link key={item.name} href={item.path}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center p-3 mb-2 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => dispatch(toggleSidebar())}
              className="text-gray-600 hover:text-gray-800"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center">
              {/* User Profile Dropdown */}
            </div>
          </div>
        </header>
        
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}