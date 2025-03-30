import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiCode, FiLoader, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Project } from '../utils/githubApi'
import { ProjectLoadingContext } from '../App'

// Fallback projects data in case the GitHub API fails
const fallbackProjectsData: Project[] = [
  {
    id: 1,
    title: "SqlAI",
    description: "A SQL query generator powered by AI that helps users create complex database queries using natural language input.",
    technologies: ["Python", "AI/ML", "SQL", "Natural Language Processing"],
    github: "https://github.com/nshantha/SqlAI",
    featured: false
  },
  {
    id: 2,
    title: "AI Research Assistant",
    description: "An AI-powered research assistant that helps researchers find and summarize academic papers, generate insights, and track research progress.",
    technologies: ["Python", "AI/ML", "NLP", "PDF Processing"],
    github: "https://github.com/nshantha/ai_research_assistant",
    featured: false
  },
  {
    id: 3,
    title: "CyberSageAI",
    description: "An intelligent cybersecurity assistant that uses ML techniques to detect and respond to security threats and vulnerabilities.",
    technologies: ["Jupyter Notebook", "Python", "TensorFlow", "Cybersecurity"],
    github: "https://github.com/nshantha/CyberSageAI",
    featured: false
  },
  {
    id: 4,
    title: "Neo4jAI",
    description: "A graph database integration with AI capabilities for intelligent relationship mapping and knowledge representation using Neo4j.",
    technologies: ["Python", "Neo4j", "Graph Databases", "AI/ML"],
    github: "https://github.com/nshantha/Neo4jAI",
    featured: false
  },
  {
    id: 5,
    title: "Grid Localization With Bayes Filter",
    description: "Implementation of grid localization for robots using Bayes filter to find the most probable location based on sensor data and predefined object tags.",
    technologies: ["Python", "Robotics", "Bayes Filter", "Localization"],
    github: "https://github.com/nshantha/Grid-Localization-With-Bayes-Filter",
    demo: "https://github.com/nshantha/Grid-Localization-With-Bayes-Filter",
    featured: false
  },
  {
    id: 6,
    title: "Realtor Agent",
    description: "An AI-powered realtor assistant that helps agents and clients find, evaluate, and manage real estate properties.",
    technologies: ["Python", "AI/ML", "Real Estate", "NLP"],
    github: "https://github.com/nshantha/realtor-agent",
    featured: false
  }
]

// Component to display truncated description with expand/collapse functionality
const TruncatedDescription = ({ text, maxLength = 120 }: { text: string; maxLength?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If text is shorter than maxLength, just return it
  if (text.length <= maxLength) {
    return <p className="text-gray-600 dark:text-textDark mb-4">{text}</p>;
  }
  
  return (
    <div className="mb-4">
      <p className="text-gray-600 dark:text-textDark">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 text-secondary flex items-center text-sm font-medium"
      >
        {isExpanded ? (
          <>
            Show less <FiChevronUp className="ml-1" />
          </>
        ) : (
          <>
            Read more <FiChevronDown className="ml-1" />
          </>
        )}
      </button>
    </div>
  );
};

const Projects = () => {
  const { isLoaded, allProjects } = useContext(ProjectLoadingContext);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  
  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'featured', label: 'Featured' }
  ]
  
  // Update filtered projects when allProjects changes
  useEffect(() => {
    if (allProjects && allProjects.length > 0) {
      setFilteredProjects(allProjects);
    } else if (!isLoaded) {
      // Do nothing while loading
    } else {
      // If loading is complete but no projects, use fallback
      setFilteredProjects(fallbackProjectsData);
      setError('No projects found from GitHub. Using fallback data.');
    }
  }, [allProjects, isLoaded]);
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter)
    
    if (filter === 'all') {
      setFilteredProjects(allProjects.length > 0 ? allProjects : fallbackProjectsData);
      return;
    }
    
    if (filter === 'featured') {
      const projectsToFilter = allProjects.length > 0 ? allProjects : fallbackProjectsData;
      setFilteredProjects(projectsToFilter.filter(project => project.featured));
      return;
    }
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="mb-4">My Projects</h1>
          <p className="text-gray-600 dark:text-textDark text-lg">
            Here's a collection of my work from GitHub. These projects showcase my expertise in various technologies.
            Each project reflects my passion for solving complex engineering challenges.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterClick(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.key
                  ? 'bg-secondary text-primary'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-textDark hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            <p>{error}</p>
          </div>
        )}
        
        {/* Projects Grid */}
        {!isLoaded ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 mb-4 relative">
              <div className="h-full w-full border-t-2 border-b-2 border-white rounded-full absolute"></div>
              <div className="h-full w-full border-l-2 border-r-2 border-transparent border-t-white rounded-full animate-spin absolute" style={{ animationDuration: '1s' }}></div>
            </div>
            <p className="text-lg text-gray-300">Loading projects from GitHub...</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold flex items-center">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <div className="bg-secondary text-primary text-xs font-medium px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>
                    
                    <TruncatedDescription text={project.description} />
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary"
                        >
                          <FiCode className="mr-1" size={12} />
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-secondary hover:text-secondary/80"
                        aria-label={`View ${project.title} GitHub repository`}
                      >
                        <FiGithub className="mr-1" size={16} />
                        GitHub
                      </a>
                      {project.demo && (
                        <a 
                          href={project.demo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-secondary hover:text-secondary/80"
                          aria-label={`View ${project.title} live demo`}
                        >
                          <FiExternalLink className="mr-1" size={16} />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
        
        {!isLoaded && filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-gray-600 dark:text-textDark">
              Try selecting a different filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects 