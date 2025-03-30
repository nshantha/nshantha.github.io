import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  readTime: string
  image: string
  url: string
  categories: string[]
}

// Placeholder blog posts - in a real app, these would be fetched from the blog API
const blogPostsData: BlogPost[] = [
  {
    id: 1,
    title: "What Only Humans Can Do..",
    excerpt: "Exploring the unique capabilities and value of human ingenuity in an increasingly AI-driven world.",
    date: "March 29, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=1000&auto=format&fit=crop",
    url: "https://nitesh.bearblog.dev/what-only-humans-can-do/",
    categories: ["AI", "Human Intelligence", "Philosophy"]
  },
  {
    id: 2,
    title: "AI, the RUSH",
    excerpt: "An analysis of the current AI boom, its implications for society, and how we can navigate the rapid changes it brings.",
    date: "March 23, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    url: "https://nitesh.bearblog.dev/ai-the-rush/",
    categories: ["AI", "Technology", "Future"]
  }
]

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  // Get unique categories
  const allCategories = ['All', ...Array.from(new Set(
    blogPostsData.flatMap(post => post.categories)
  ))].sort()
  
  // Simulate fetching blog posts
  useEffect(() => {
    setTimeout(() => {
      setBlogPosts(blogPostsData)
      setLoading(false)
    }, 800)
  }, [])
  
  // Filter blog posts by category
  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.categories.includes(activeCategory))
  
  return (
    <div className="pt-20 min-h-screen">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="mb-4">Blog</h1>
          <p className="text-gray-600 dark:text-muted text-lg">
            I write about technology, AI, and their impact on society.
            Check out my latest thoughts on my Bear blog.
          </p>
        </div>
        
        {/* Categories Filter */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-secondary text-primary'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Blog Posts */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                    <span className="flex items-center">
                      <FiCalendar className="mr-1" />
                      {post.date}
                    </span>
                    <span className="flex items-center">
                      <FiClock className="mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                  
                  <p className="text-gray-600 dark:text-muted mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {post.categories.map((category, i) => (
                      <span
                        key={i}
                        className="inline-flex text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-secondary hover:underline mt-auto"
                  >
                    Read Article
                    <FiArrowRight className="ml-2" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-muted">
              Try selecting a different category.
            </p>
          </div>
        )}
        
        {/* Link to Blog */}
        <div className="text-center mt-16">
          <a
            href="https://nitesh.bearblog.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center"
          >
            Visit My Blog
            <FiArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Blog 