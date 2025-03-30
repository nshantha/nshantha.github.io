import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect, createContext } from 'react'
// @ts-ignore
import Navbar from './components/Navbar'
// @ts-ignore
import Footer from './components/Footer'
// @ts-ignore
import Home from './pages/Home'
// @ts-ignore
import About from './pages/About'
// @ts-ignore
import Projects from './pages/Projects'
// @ts-ignore
import Blog from './pages/Blog'
// @ts-ignore
import Resume from './pages/Resume'
import { fetchGitHubRepositories, fetchPinnedRepositories, convertToProjects, Project } from './utils/githubApi'

// Create a context to track project loading status
export const ProjectLoadingContext = createContext<{
  isLoaded: boolean;
  allProjects: Project[];
  pinnedProjects: Project[];
}>({
  isLoaded: false,
  allProjects: [],
  pinnedProjects: []
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [pinnedProjects, setPinnedProjects] = useState<Project[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check user's preference
    const savedTheme = localStorage.getItem('theme')
    
    // Default to dark mode unless explicitly set to light
    if (savedTheme === 'light') {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      // If no saved theme or saved theme is 'dark', use dark mode
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }, [])

  // Preload GitHub projects data as soon as the app loads
  useEffect(() => {
    let isMounted = true;
    
    const preloadProjects = async () => {
      try {
        console.log('Preloading GitHub projects data...');
        
        // First fetch all repositories to ensure we have the full data
        const repos = await fetchGitHubRepositories('nshantha');
        
        if (repos.length > 0 && isMounted) {
          // Process and cache the projects data
          const projectsData = await convertToProjects(repos);
          setAllProjects(projectsData);
          
          // Also fetch pinned repositories to preload them for the homepage
          const pinnedRepos = await fetchPinnedRepositories('nshantha');
          
          if (pinnedRepos.length > 0 && isMounted) {
            // Convert pinned repos to projects
            const pinnedProjectsData = await convertToProjects(pinnedRepos);
            setPinnedProjects(pinnedProjectsData);
          }
          
          console.log('GitHub projects data preloaded successfully');
          if (isMounted) {
            setIsLoaded(true);
          }
        }
      } catch (error) {
        console.error('Error preloading GitHub projects data:', error);
        // Even if there's an error, mark as loaded so we don't keep retrying
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    // Start preloading immediately with higher priority
    const preloadImmediate = async () => {
      await preloadProjects();
    };
    
    // Use requestIdleCallback if available, otherwise use setTimeout
    if (window.requestIdleCallback) {
      // Start loading immediately but allow browser to prioritize more important tasks
      window.requestIdleCallback(() => preloadImmediate(), { timeout: 2000 });
    } else {
      // Fallback to setTimeout
      setTimeout(preloadImmediate, 100);
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev
      if (newMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
      return newMode
    })
  }

  return (
    <ProjectLoadingContext.Provider value={{ isLoaded, allProjects, pinnedProjects }}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-grow md:pl-64 transition-all duration-300">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/resume" element={<Resume />} />
            </Routes>
          </main>
          <Footer className="md:pl-64 transition-all duration-300" />
        </div>
      </Router>
    </ProjectLoadingContext.Provider>
  )
}

export default App
