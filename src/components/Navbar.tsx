import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSun, FiMoon, FiMenu, FiX, FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const Navbar = ({ isDarkMode, toggleDarkMode }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Projects', path: '/projects' },
    { title: 'Blog', path: '/blog' },
    { title: 'Resume', path: '/resume' }
  ]
  
  const socialLinks = [
    { icon: <FiGithub />, url: 'https://github.com/nshantha', ariaLabel: 'GitHub' },
    { icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/niteshs1001/', ariaLabel: 'LinkedIn' },
    { icon: <FiTwitter />, url: 'https://x.com/nitesh_aradhya', ariaLabel: 'Twitter' },
    { icon: <FiMail />, url: 'mailto:nithesh1001@gmail.com', ariaLabel: 'Email' }
  ]

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(prev => !prev)

  return (
    <>
      {/* Mobile Menu Button - Fixed at the top for mobile */}
      <div className="fixed top-4 right-4 z-50 flex items-center md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md bg-white/90 dark:bg-primary/90 hover:bg-gray-200 dark:hover:bg-gray-700/50 shadow-md"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FiX className="w-6 h-6 text-gray-800 dark:text-white" />
          ) : (
            <FiMenu className="w-6 h-6 text-gray-800 dark:text-white" />
          )}
        </button>
      </div>
      
      {/* Desktop Left Sidebar */}
      <header className="fixed left-0 top-0 h-full w-64 bg-white/95 dark:bg-primary/95 backdrop-blur-sm shadow-md z-40 hidden md:block">
        <div className="flex flex-col h-full py-8 px-6">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white mb-12">
            Nitesh Shantha Kumar
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="flex flex-col space-y-6 flex-grow">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`nav-link text-lg flex items-center transition-colors duration-300 ${
                  location.pathname === link.path 
                    ? 'text-accent font-medium' 
                    : 'text-gray-800 dark:text-textDark hover:text-highlight dark:hover:text-highlight'
                }`}
              >
                {link.title}
                {location.pathname === link.path && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent ml-2"></span>
                )}
              </Link>
            ))}
            
            {/* Social Links */}
            <div className="pt-6 mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Connect With Me</p>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a 
                    key={link.ariaLabel}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-secondary dark:text-gray-400 dark:hover:text-secondary transition-colors duration-300"
                    aria-label={link.ariaLabel}
                  >
                    <span className="sr-only">{link.ariaLabel}</span>
                    <span className="text-xl">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </nav>
          
          {/* Dark Mode Toggle */}
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700/50">
            <button 
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FiSun className="text-yellow-400 w-5 h-5" />
              ) : (
                <FiMoon className="text-gray-700 w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu - Full screen overlay with content */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white dark:bg-primary z-40 md:hidden overflow-auto"
          >
            <div className="flex flex-col h-full p-6 pt-16">
              {/* Logo */}
              <div className="mb-8 mt-2">
                <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
                  Nitesh Shantha Kumar
                </Link>
              </div>
              
              {/* Dark Mode Toggle in Mobile Menu */}
              <div className="mb-8">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors duration-300"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <FiSun className="text-yellow-400 w-5 h-5" />
                  ) : (
                    <FiMoon className="text-gray-700 w-5 h-5" />
                  )}
                  <span className="ml-2 text-gray-800 dark:text-white">
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>
              </div>
              
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`py-2 px-3 text-lg rounded-md flex items-center transition-colors duration-300 ${
                      location.pathname === link.path
                        ? 'text-accent font-medium' 
                        : 'text-gray-800 dark:text-textDark hover:text-highlight dark:hover:text-highlight'
                    }`}
                  >
                    {link.title}
                    {location.pathname === link.path && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent ml-2"></span>
                    )}
                  </Link>
                ))}
                
                {/* Social Links for Mobile */}
                <div className="pt-6 mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 px-3">Connect With Me</p>
                  <div className="flex px-3 space-x-5">
                    {socialLinks.map((link) => (
                      <a 
                        key={link.ariaLabel}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-secondary dark:text-gray-400 dark:hover:text-secondary transition-colors duration-300"
                        aria-label={link.ariaLabel}
                      >
                        <span className="sr-only">{link.ariaLabel}</span>
                        <span className="text-xl">{link.icon}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar 