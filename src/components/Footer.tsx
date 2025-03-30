import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi'
import { Link } from 'react-router-dom'

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { icon: <FiGithub />, url: 'https://github.com/nshantha', ariaLabel: 'GitHub' },
    { icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/niteshs1001/', ariaLabel: 'LinkedIn' },
    { icon: <FiTwitter />, url: 'https://x.com/nitesh_aradhya', ariaLabel: 'Twitter' },
    { icon: <FiMail />, url: 'mailto:nithesh1001@gmail.com', ariaLabel: 'Email' }
  ]
  
  return (
    <footer className={`bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
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
          
          <div className="mt-8 md:mt-0">
            <nav className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link to="/" className="text-gray-600 hover:text-secondary dark:text-gray-400 dark:hover:text-secondary">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-secondary dark:text-gray-400 dark:hover:text-secondary">About</Link>
              <Link to="/projects" className="text-gray-600 hover:text-secondary dark:text-gray-400 dark:hover:text-secondary">Projects</Link>
              <Link to="/contact" className="text-gray-600 hover:text-secondary dark:text-gray-400 dark:hover:text-secondary">Contact</Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} Nitesh Shantha Kumar. All rights reserved.
          </p>
          <p className="text-center text-gray-400 dark:text-gray-500 text-xs mt-2">
            Built with React and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 