# Nitesh's Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features real-time GitHub repository integration.

## Features

- 🌓 Light/Dark mode toggle
- 📱 Fully responsive design
- 🎭 Interactive UI with animations
- 🧩 Modular components
- 📝 Blog posts integration
- 📊 Skills visualization
- 📁 Dynamic GitHub projects showcase
- 📄 Downloadable resume
- 📬 Contact form

## Tech Stack

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [React Router](https://reactrouter.com/) - Page routing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [GitHub API](https://docs.github.com/en/rest) - Dynamic project data

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/nshantha/nshantha.github.io.git
   cd nshantha.github.io
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## Project Structure

```
nshantha.github.io/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   │   └── githubApi.ts # GitHub API integration
│   ├── App.tsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## GitHub Projects Integration

The Projects page dynamically fetches and displays repositories from GitHub:

- **Live Repository Data**: Fetches your latest GitHub repositories in real-time
- **README Integration**: Extracts descriptions from repository README files when available
- **Smart Categorization**: Automatically categorizes projects based on language and topics
- **Fallback Mechanism**: Uses predefined project data if GitHub API is unavailable
- **Expandable Descriptions**: Long project descriptions can be expanded with "Read more"

To customize the GitHub username:
1. Open `src/pages/Projects.tsx`
2. Update the username in the `fetchGitHubRepositories('nshantha')` function call
3. Optionally update the fallback projects in `fallbackProjectsData`

## Customization

- **Colors**: Edit the `theme.extend.colors` section in `tailwind.config.js`
- **Content**: Update the text and images in the page components
- **Projects Filtering**: Modify the filter categories in `src/pages/Projects.tsx`
- **GitHub Integration**: Customize repository fetching logic in `src/utils/githubApi.ts`
- **Blog Posts**: Update the blog post data in `src/pages/Blog.tsx`

## Deployment

This site is configured for easy deployment to GitHub Pages:

1. Install the gh-pages package if you haven't already:
   ```
   npm install --save-dev gh-pages
   ```

2. Make sure your package.json has these scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Set the homepage in package.json:
   ```json
   "homepage": "https://nshantha.github.io/"
   ```

4. Configure GitHub token for API access (optional):
   - Create a `.env` file based on `.env.example`
   - Add your GitHub token with public repo access

5. Run the deployment command:
   ```
   npm run deploy
   ```

This will build the project and push it to the `gh-pages` branch of your repository.

### Troubleshooting GitHub Pages Deployment

If your site is not loading properly on GitHub Pages, check the following:

1. Make sure you're using HashRouter instead of BrowserRouter in App.tsx
2. Check that all asset paths in index.html use relative paths (./assets) instead of absolute paths (/assets)
3. Verify that your repository settings have GitHub Pages enabled and pointing to the gh-pages branch
4. Check for any token exposure issues in the GitHub Security tab

## License

[MIT](LICENSE)

## Author

Nitesh
