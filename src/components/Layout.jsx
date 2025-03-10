"use client"
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FiMenu, FiBook, FiUsers, FiBox, FiChevronDown, FiChevronUp, FiTool } from 'react-icons/fi'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toggleSidebar } from '@/redux/slices/sidebarSlice'
import { usePathname } from 'next/navigation'

export default function Layout({ children }) {
  const pathname = usePathname()
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen)
  const dispatch = useDispatch()
  const [mounted, setMounted] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { 
      name: 'Generators',
      icon: <FiTool className="text-blue-500" />,
      subItems: [
        { name: 'Blog Post', path: '/blog-code-generator', icon: <FiBook /> },
        { name: 'Customer Story', path: '/customer-story-generator', icon: <FiUsers /> },
        { name: 'Our Works', path: '/works-generator', icon: <FiBox /> },
      ]
    }
  ]

  const getPageTitle = () => {
    const allItems = menuItems.flatMap(group => group.subItems)
    const currentItem = allItems.find(item => item.path === pathname)
    return currentItem?.name || 'Dashboard'
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className={`fixed top-0 ${isSidebarOpen ? 'left-64' : 'left-0'} right-0 bg-white shadow-sm z-40 `}>
        <div className="flex items-center justify-between p-4 h-16">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => dispatch(toggleSidebar())}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-lg z-50 ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden `}>
        <div className="p-4 h-full overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-700 px-3 py-4 mb-2">AV Tools Editor</h2>
          
          <nav className="space-y-1">
            {menuItems.map((group) => (
              <div key={group.name} className="mb-2">
                <div 
                  className="flex items-center justify-between p-3 text-gray-600 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setOpenDropdown(!openDropdown)}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">{group.icon}</span>
                    <span className="font-medium text-gray-700">{group.name}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: openDropdown ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    <FiChevronDown />
                  </motion.span>
                </div>

                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: openDropdown ? 1 : 0,
                    height: openDropdown ? 'auto' : 0
                  }}
                  className="overflow-hidden"
                >
                  <div className="pl-10 space-y-1">
                    {group.subItems.map((item) => (
                      <Link key={item.name} href={item.path}>
                        <motion.div
                          whileHover={{ translateX: 4 }}
                          className={`flex items-center p-3 text-sm rounded-lg transition-colors
                            ${pathname === item.path 
                              ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500'
                              : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.name}
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <main className="p-6 min-h-screen">{children}</main>
      </div>
    </div>
  )
}