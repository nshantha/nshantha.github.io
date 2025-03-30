# GitHub API Integration

This utility provides functionality to fetch repository data from GitHub and convert it into a format suitable for display in the Projects page.

## Overview

The `githubApi.ts` file contains:

- TypeScript interfaces for GitHub repository data
- Functions to fetch repositories and README content
- Utilities to categorize projects and generate descriptions
- Conversion logic to transform GitHub API data into project cards

## Key Functions

### `fetchGitHubRepositories`

Fetches a user's repositories from the GitHub API.

```typescript
const repos = await fetchGitHubRepositories('nshantha');
```

### `fetchReadmeContent`

Fetches and processes README content for a specific repository.

```typescript
const readmeContent = await fetchReadmeContent('nshantha', 'repo-name');
```

### `convertToProjects`

Converts GitHub repository data into the project format used by the UI.

```typescript
const projects = await convertToProjects(repos);
```

## Project Categorization

Projects are automatically categorized based on:

1. Repository topics
2. Programming language
3. Repository name
4. Description content

Categories include:
- `ai` - AI/ML projects
- `robotics` - Robotics and autonomous systems
- `frontend` - Web and UI projects
- `backend` - Server-side and data processing
- `other` - Projects that don't fit other categories

## Description Generation

The utility attempts to get project descriptions in this order:

1. Content from the repository's README file
2. The repository description from GitHub
3. A generated description based on the project's category and metadata

## Customization

### Modifying Categories

To add or change categories, edit the `determineCategory` function:

```typescript
// Example: Adding a new 'data-science' category
if (lowerTopics.some(topic => ['data', 'analytics', 'visualization'].includes(topic)) ||
    lowerName.includes('data') || 
    (lowerDescription && lowerDescription.includes('data science'))) {
  return 'data-science';
}
```

### Changing the Image Selection

Custom images for each category can be modified in the `getDefaultImage` function:

```typescript
const imageMap: Record<string, string> = {
  ai: 'https://path-to-your-ai-image.jpg',
  // other categories...
};
```

### Fallback Descriptions

If no description is available, modify the template descriptions in the `generateDescription` function.

## Error Handling

The utility includes error handling to gracefully fail if:
- The GitHub API is unavailable
- Rate limits are exceeded
- Repositories or READMEs cannot be fetched

## Usage in Projects Component

See the implementation in `src/pages/Projects.tsx` for how these utilities are used in practice. 