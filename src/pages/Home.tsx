import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Project } from "../utils/githubApi";
import { ProjectLoadingContext } from "../App";

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const { isLoaded, pinnedProjects } = useContext(ProjectLoadingContext);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set featured projects from context
  useEffect(() => {
    if (pinnedProjects.length > 0) {
      // Convert project titles to a Set to track which ones we've already included
      const includedProjects = new Set();
      
      // First, include GitHub pinned projects (up to 6)
      const displayProjects = pinnedProjects
        .filter(project => {
          // Only include each project once
          if (includedProjects.has(project.title)) {
            return false;
          }
          includedProjects.add(project.title);
          return true;
        })
        .slice(0, 6);
      
      console.log("Number of projects to display from GitHub:", displayProjects.length);
      
      // If we have less than 6 projects from GitHub, supplement with fallback projects
      if (displayProjects.length < 6) {
        console.log("Supplementing with fallback projects");
        
        // Add fallback projects that haven't already been included
        const fallbackProjectsToAdd = fallbackProjects
          .filter(p => !includedProjects.has(p.title))
          .slice(0, 6 - displayProjects.length)
          .map((p, i) => ({ 
            id: 1000 + i, // Use a high ID to avoid conflicts
            title: p.title, 
            description: p.description, 
            technologies: [p.category], 
            github: p.github, 
            featured: true 
          }));
        
        setFeaturedProjects([...displayProjects, ...fallbackProjectsToAdd]);
      } else {
        setFeaturedProjects(displayProjects);
      }
    }
  }, [pinnedProjects]);

  // Fallback project data in case GitHub API fails or is still loading
  const fallbackProjects = [
    {
      title: "SqlAI",
      category: "PYTHON",
      description: "A SQL query generator powered by AI that helps users create complex database queries using natural language input.",
      github: "https://github.com/nshantha/SqlAI"
    },
    {
      title: "AI Research Assistant",
      category: "PYTHON",
      description: "An AI-powered research assistant that helps researchers find and summarize academic papers, generate insights, and track research progress.",
      github: "https://github.com/nshantha/ai_research_assistant"
    },
    {
      title: "CyberSageAI",
      category: "AI/ML",
      description: "An intelligent cybersecurity assistant that uses ML techniques to detect and respond to security threats and vulnerabilities.",
      github: "https://github.com/nshantha/CyberSageAI"
    },
    {
      title: "Neo4jAI",
      category: "PYTHON",
      description: "A graph database integration with AI capabilities for intelligent relationship mapping and knowledge representation using Neo4j.",
      github: "https://github.com/nshantha/Neo4jAI"
    },
    {
      title: "Grid Localization With Bayes Filter",
      category: "ROBOTICS",
      description: "Implementation of grid localization for robots using Bayes filter to find the most probable location based on sensor data and predefined object tags.",
      github: "https://github.com/nshantha/Grid-Localization-With-Bayes-Filter"
    },
    {
      title: "Realtor Agent",
      category: "AI/ML",
      description: "An AI-powered realtor assistant that helps agents and clients find, evaluate, and manage real estate properties.",
      github: "https://github.com/nshantha/realtor-agent"
    }
  ];

  return (
    <div className="bg-bgLight dark:bg-bgDark min-h-screen">
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Hero Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-textLight dark:text-textDark">
              Hello, I'm <span className="uppercase">Nitesh</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl md:text-2xl mt-4 text-textLight dark:text-textDark font-light tracking-wide">
              Engineer | Architect | Distributed Systems
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 max-w-3xl text-textLight/80 dark:text-textDark/80 text-lg leading-relaxed"
          >
            <p>
              I'm a Seattle-based engineer building high-throughput distributed systems at{" "}
              <a href="https://nordstrom.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                Nordstrom
              </a>. 
              I specialize in microservices architecture, database optimization, and cloud-native applications. 
              My passion lies in creating scalable systems and exploring the potential of AI and intelligent agents.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 flex space-x-6"
          >
            <Link 
              to="/projects" 
              className="inline-flex items-center group bg-transparent border border-accent text-accent hover:bg-accent hover:text-white px-5 py-2 transition-all duration-300"
            >
              Projects
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/resume" 
              className="inline-flex items-center group bg-transparent border border-textLight dark:border-textDark text-textLight dark:text-textDark hover:bg-textLight dark:hover:bg-textDark hover:text-bgLight dark:hover:text-bgDark px-5 py-2 transition-all duration-300"
            >
              Resume
            </Link>
          </motion.div>
        </section>
        
        {/* Recent Projects */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-textLight dark:text-textDark">Recent Projects</h2>
          
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              {/* Spinner animation */}
              <div className="animate-spin h-12 w-12 mb-4 relative">
                <div className="h-full w-full border-t-2 border-b-2 border-white rounded-full absolute"></div>
                <div className="h-full w-full border-l-2 border-r-2 border-transparent border-t-white rounded-full animate-spin absolute" style={{ animationDuration: '1s' }}></div>
              </div>
              <p className="text-lg text-gray-300">Loading projects from GitHub...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(featuredProjects.length > 0 ? featuredProjects : fallbackProjects.map((p, i) => ({ 
                  id: i, 
                  title: p.title, 
                  description: p.description, 
                  technologies: [p.category], 
                  github: p.github, 
                  featured: true 
                }))).slice(0, 6).map((project, index) => {
                  // Find the matching fallback project for additional data
                  const matchingFallback = fallbackProjects.find(p => p.title === project.title);
                  
                  // Determine project category
                  const projectCategory = project.technologies && project.technologies.length > 0
                    ? project.technologies[0]
                    : matchingFallback?.category || "PROJECT";
                  
                  return (
                    <a 
                      key={project.id} 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-200 dark:border-gray-800 p-6 hover:border-accent dark:hover:border-accent transition-all duration-300 group relative bg-white/30 dark:bg-gray-800/30 hover:bg-white/70 dark:hover:bg-gray-800/70 hover:shadow-lg"
                    >
                      <div className="text-accent mb-2 text-sm font-semibold">{projectCategory.toUpperCase()}</div>
                      <h3 className="text-xl font-bold mb-3 text-textLight dark:text-textDark group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-textLight/70 dark:text-textDark/70">
                        {project.description}
                      </p>
                      <div className="mt-4 text-accent text-sm group-hover:opacity-100 opacity-0 transition-opacity flex items-center font-medium">
                        View project <FaArrowRight className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  );
                })}
              </div>
              
              {/* View All Projects button */}
              <div className="flex justify-center mt-12">
                <Link 
                  to="/projects" 
                  className="inline-flex items-center text-lg text-textLight dark:text-white hover:text-accent border-2 border-gray-300 dark:border-gray-700 rounded-full px-8 py-3 transition-all duration-200 hover:border-accent"
                >
                  View All Projects
                </Link>
              </div>
            </>
          )}
        </section>
        
        {/* Skills */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-textLight dark:text-textDark">Core Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-bold mb-4 text-textLight dark:text-textDark">Distributed Systems</h3>
              <p className="text-textLight/70 dark:text-textDark/70 mb-2">
                Designing and implementing scalable distributed architectures that handle millions of requests per day.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-textLight dark:text-textDark">Cloud Infrastructure</h3>
              <p className="text-textLight/70 dark:text-textDark/70 mb-2">
                Extensive experience with AWS, containerization, and infrastructure as code practices.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-textLight dark:text-textDark">Machine Learning</h3>
              <p className="text-textLight/70 dark:text-textDark/70 mb-2">
                Building and deploying ML models for real-time prediction and data analysis.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-textLight dark:text-textDark">Backend Development</h3>
              <p className="text-textLight/70 dark:text-textDark/70 mb-2">
                Creating robust APIs and services using Java, Python, and TypeScript.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-textLight dark:text-textDark">Database Systems</h3>
              <p className="text-textLight/70 dark:text-textDark/70 mb-2">
                Optimizing relational and NoSQL databases for performance, reliability, and scale.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-textLight dark:text-textDark">AI & Agents</h3>
              <p className="text-textLight/70 dark:text-textDark/70 mb-2">
                Exploring the frontier of AI agents and their applications in solving complex problems.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 