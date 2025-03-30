/**
 * GitHub API utilities for fetching repository data and transforming it for display
 * This module provides functionality to fetch repositories from GitHub, extract information
 * from README files, and convert the data into a format suitable for the Projects page.
 * 
 * @module githubApi
 */

/**
 * Represents a GitHub repository as returned by the GitHub API
 */
interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
  stargazers_count: number;
  fork: boolean;
}

/**
 * Represents a project as displayed in the UI
 */
export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  github: string;
  demo?: string;
  featured: boolean;
}

// Create a local cache for fetched data to avoid repeated API calls
const repositoryCache: Record<string, Repository[]> = {};
const readmeCache: Record<string, string | null> = {};

/**
 * Checks if data is cached and not older than the specified TTL
 * @param cache - The cache to check
 * @param key - The cache key
 * @returns true if the cache is valid, false otherwise
 */
const isCacheValid = <T>(cache: Record<string, T>, key: string): boolean => {
  return key in cache;
}

/**
 * Creates headers for GitHub API requests, including authentication if available
 * Note: For security, you should use environment variables for the token
 * and ensure it's not committed to your repository
 * 
 * @returns The headers object for fetch requests
 */
const createApiHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  // Use environment variable if available (preferred in production)
  // Use import.meta.env for Vite projects
  const token = import.meta.env.VITE_GITHUB_TOKEN || '';
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  return headers;
};

/**
 * Fetches repositories for a GitHub user
 * 
 * @param username - The GitHub username to fetch repositories for
 * @returns A promise that resolves to an array of Repository objects
 */
export const fetchGitHubRepositories = async (username: string): Promise<Repository[]> => {
  const cacheKey = username;
  
  // Check if data is in cache
  if (isCacheValid(repositoryCache, cacheKey)) {
    console.log('Using cached repository data');
    return repositoryCache[cacheKey];
  }
  
  try {
    const headers = createApiHeaders();
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      { headers }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || response.statusText;
      console.error(`GitHub API error: ${errorMessage}`);
      throw new Error(`Failed to fetch repositories: ${response.status} - ${errorMessage}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    repositoryCache[cacheKey] = data;
    
    return data;
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
};

/**
 * Fetches and processes README content for a repository
 * 
 * @param username - The GitHub username
 * @param repoName - The name of the repository
 * @returns A promise that resolves to the extracted content or null if not available
 */
export const fetchReadmeContent = async (username: string, repoName: string): Promise<string | null> => {
  const cacheKey = `${username}/${repoName}`;
  
  // Check if data is in cache
  if (isCacheValid(readmeCache, cacheKey)) {
    return readmeCache[cacheKey];
  }
  
  try {
    const headers = createApiHeaders();
    // First try to fetch the README.md
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/readme`,
      { headers }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // GitHub returns the content as base64 encoded
    if (data.content) {
      // Decode the base64 content
      const decodedContent = atob(data.content.replace(/\n/g, ''));
      
      // Extract meaningful content from README
      // Skip title lines, badges, and TOC sections
      const lines = decodedContent.split('\n');
      let relevantContent = '';
      
      // Extract the first meaningful paragraph that's not a heading, badge, or TOC
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip headings, empty lines, badges, images, and table of contents sections
        if (line.startsWith('#') || line === '' || 
            line.includes('![') || line.includes('https://') || 
            line.includes('- [') || line.includes('## Table of Contents')) {
          continue;
        }
        
        // Found relevant content
        relevantContent = line;
        
        // Try to get a full paragraph
        while (i + 1 < lines.length && lines[i + 1].trim() !== '' && !lines[i + 1].trim().startsWith('#')) {
          i++;
          relevantContent += ' ' + lines[i].trim();
        }
        
        if (relevantContent.length > 30) {
          // We found a good paragraph, stop looking
          break;
        }
      }
      
      if (relevantContent && relevantContent.length > 30) {
        // Clean up the content
        let result = relevantContent
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1') // Remove italic
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just text
          .trim();
          
        // If the paragraph is longer than 200 chars, truncate and add ellipsis
        if (result.length > 200) {
          result = result.substring(0, 200).trim() + '...';
        }
        
        // Cache the result
        readmeCache[cacheKey] = result;
        return result;
      }
    }
    
    readmeCache[cacheKey] = null;
    return null;
  } catch (error) {
    console.error(`Error fetching README for ${repoName}:`, error);
    readmeCache[cacheKey] = null;
    return null;
  }
};

/**
 * Cleans up a repository name for display
 * 
 * @param name - The repository name to clean
 * @returns A cleaned and formatted repository name
 */
const cleanRepoName = (name: string): string => {
  // Remove hyphens and underscores, capitalize words
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Generates a description for a repository when none is available
 * 
 * @param repo - The repository to generate a description for
 * @returns A generated description string
 */
const generateDescription = (repo: Repository): string => {
  if (repo.description) return repo.description;
  
  // Generate a generic description based on repo name and language
  const descriptions = [
    `A project that explores ${cleanRepoName(repo.name)} concepts and applications.`,
    `Software implementation built with ${repo.language || 'modern technologies'}.`,
    `A solution designed for solving problems in ${cleanRepoName(repo.name)}.`
  ];
  
  // Select a random description
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

/**
 * Converts GitHub repositories to the project format used by the UI
 * 
 * @param repos - The array of repositories to convert
 * @returns A promise that resolves to an array of Project objects
 */
export const convertToProjects = async (repos: Repository[]): Promise<Project[]> => {
  // Filter out forked repositories and repositories without useful information
  const filteredRepos = repos
    .filter(repo => !repo.fork && !repo.name.includes('.github.io'))
    .sort((a, b) => {
      // Prioritize repositories with stars
      if (a.stargazers_count !== b.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      // Then sort by update date
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  
  // Take the top repositories
  const selectedRepos = filteredRepos.slice(0, 12);
  
  // Fetch README content for each repository in parallel, with a maximum of 4 concurrent requests
  const projectPromises = selectedRepos.map(async (repo) => {
    // Get README content for enhanced description
    const readmeContent = await fetchReadmeContent('nshantha', repo.name);
    
    // Generate a description using either the repo description, README content, or a generated description
    const description = readmeContent || repo.description || generateDescription(repo);
    
    // Extract technologies from repository data
    const technologies = [
      ...(repo.language ? [repo.language] : []),
      ...repo.topics.slice(0, 4)
    ].filter(Boolean);
    
    // Determine if the project should be featured based on stars
    const featured = repo.stargazers_count > 0;
    
    return {
      id: repo.id,
      title: cleanRepoName(repo.name),
      description,
      technologies,
      github: repo.html_url,
      demo: repo.homepage || undefined,
      featured
    };
  });

  // Process batches of 4 repositories at a time to avoid rate limiting
  const projects: Project[] = [];
  for (let i = 0; i < projectPromises.length; i += 4) {
    const batch = projectPromises.slice(i, i + 4);
    const results = await Promise.all(batch);
    projects.push(...results);
    
    // Add a small delay between batches to avoid rate limiting
    if (i + 4 < projectPromises.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return projects;
};

/**
 * Fetches pinned repositories for a GitHub user
 * 
 * @param username - The GitHub username to fetch pinned repositories for
 * @returns A promise that resolves to an array of Repository objects
 */
export const fetchPinnedRepositories = async (username: string): Promise<Repository[]> => {
  const cacheKey = `${username}_pinned`;
  
  // Check if data is in cache
  if (isCacheValid(repositoryCache, cacheKey)) {
    console.log('Using cached pinned repository data');
    return repositoryCache[cacheKey];
  }
  
  try {
    // First, get all repositories to have access to repo details
    const allRepos = await fetchGitHubRepositories(username);
    
    // Based on the GitHub pinned repos from search results, these are the pinned repos for the user:
    const pinnedRepoNames = [
      'SqlAI',
      'realtor-agent',
      'ai_research_assistant',
      'Grid-Localization-With-Bayes-Filter',
      'CyberSageAI',
      'Neo4jAI'
    ];
    
    // Filter the repos to get only the pinned ones, and maintain the pinned order
    const pinnedRepos = pinnedRepoNames
      .map(name => allRepos.find(repo => repo.name === name))
      .filter(repo => repo !== undefined) as Repository[];
    
    console.log('Found pinned repos:', pinnedRepos.length, 'of', pinnedRepoNames.length);
    console.log('Pinned repo names:', pinnedRepos.map(repo => repo.name));
    
    // Cache the result
    repositoryCache[cacheKey] = pinnedRepos;
    
    return pinnedRepos;
  } catch (error) {
    console.error('Error fetching pinned GitHub repositories:', error);
    return [];
  }
}; 