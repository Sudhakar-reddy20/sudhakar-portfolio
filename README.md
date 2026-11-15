# Onteddu Sudhakar Reddy: Cybersecurity Portfolio (v4)

A static, single-page portfolio for GitHub Pages. No build step, no 3D engine. Plain HTML, CSS and JavaScript, with GSAP and Lenis loaded from CDNs for the scroll animations.

## Files

| File | Purpose |
|---|---|
| index.html | Page structure and all content |
| style.css | Layout, glass navigation, ID card, cards and responsive rules |
| script.js | Typing title, mouse spotlight, tilt, smooth scroll, scroll reveals |
| photo.jpg | Profile photo shown in the ID-card hero |
| resume.pdf | Resume linked from the Contact section |
| README.md | This file |

## Put it live on GitHub Pages

1. Create a public repository named `sudhakar-portfolio` on GitHub.
2. Upload all the files above to the root of that repository (drag and drop on the repo page, then Commit changes).
3. Go to Settings, then Pages. Under "Build and deployment", choose Deploy from a branch, select `main` and `/ (root)`, then Save.
4. Wait one or two minutes. The site will be at:
   https://sudhakar-reddy20.github.io/sudhakar-portfolio/

## Edit the site later

- Text and sections: open index.html and edit the content directly. Each section has its own id (about, experience, projects, lab-work, certificates, skills, contact).
- Typing title phrases: the list `phrases` near the top of the typing block in script.js.
- Status badge: the `status-badge` paragraph in index.html.
- Photo: replace photo.jpg with a new file of the same name (portrait, about 3:4 works best).
- Resume: replace resume.pdf with a new file of the same name.
- Colours: the variables at the top of style.css (`--primary`, `--secondary`, and so on).
- Adding a project or certificate: copy an existing `<article class="card">` block and change the text and link.

After each change, commit the file on GitHub. The site updates within a minute or two.

## Notes

- The page uses Google Fonts (Inter and JetBrains Mono) and CDN scripts (GSAP, ScrollTrigger, Lenis), so it needs an internet connection to show the intended look.
- Animations turn off automatically for visitors who prefer reduced motion.
- Mouse-only effects (spotlight and tilt) are skipped on touch screens.
