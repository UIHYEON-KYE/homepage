# Data Scientist Portfolio — homepage

This repository contains a simple, static portfolio website template for a data scientist. It includes an HTML/CSS/JS single-page layout with sample projects and a small interactive chart (Chart.js).

Files of note:

- `index.html` — main page (Korean text, organized into About, Skills, Projects, Blog, Contact)
- `css/styles.css` — styles for layout and responsive design
- `js/main.js` — loads `data/projects.json` and renders project cards + small Chart.js demo
- `data/projects.json` — sample project metadata (edit to add your projects)
- `assets/` — small SVG placeholder images used by the template

Quick start (serve locally with Python):

```bash
# from the repository root
python3 -m http.server 8000 --bind 127.0.0.1

# then open http://127.0.0.1:8000 in your browser
```

Tips & next steps:

- Put your resume in `resume.pdf` (used in header link)
- Replace image placeholders in `assets/` with your own screenshots and add projects in `data/projects.json` (demo and repo links)
- Optionally convert this template to a small React/Vite app or deploy it to GitHub Pages / Netlify for public hosting

If you'd like, I can:

- Turn this into a template (npm project with SSG) or a React-based portfolio
- Add automated deploy configs (GitHub Actions) for GitHub Pages

Enjoy — use this as a simple, minimal starting point for a data-science portfolio site.

