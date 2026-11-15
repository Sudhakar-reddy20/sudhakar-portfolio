# Onteddu Sudhakar Reddy: Portfolio (v7, Gotham theme)

A static, single-page portfolio for GitHub Pages. No build step. Plain HTML, CSS and JavaScript, with GSAP and Lenis loaded from CDNs for the 3D scroll motion.

## Files

| File | Purpose |
|---|---|
| index.html | Page structure, the preloader markup and all content |
| preloader.css | Preloader styles: cracked display, repair tiles, 3D exit |
| preloader.js | Preloader sequence: cracks, terminal log, tile repair, exit |
| style.css | Theme, layout, 3D name cube, glass navigation, responsive rules |
| script.js | Hero intro (plays after the preloader), scroll-linked 3D, tilt, cursor, smooth scroll |
| photo.jpg | Profile photo in the ID card |
| resume.pdf | Linked from the Contact section |
| nptel-hci.pdf | NPTEL certificate, Human-Computer Interfaces (IIT Guwahati) |
| nptel-sna.pdf | NPTEL certificate, Social Network Analysis (IIT Madras) |
| README.md | This file |

## Put it live on GitHub Pages

1. Create a public repository named `sudhakar-portfolio`.
2. Upload every file above to the repository root.
3. Settings, then Pages. Deploy from a branch: `main`, folder `/ (root)`. Save.
4. The site is at https://sudhakar-reddy20.github.io/sudhakar-portfolio/

## The preloader

- Plays on every visit, about 6 seconds. Visitors can press Skip intro or Escape.
- Sequence: the monitor swings in, cracks spread from an impact point, a terminal log types out, the static tiles are repaired one by one, the cracks heal, and the screen flies toward the viewer before the page opens.
- Turned off for visitors who prefer reduced motion.
- Edit the log text in `preloader.js` (the `typeLine` calls in `run`).
- Edit the repaired word (currently "SR") in `index.html`, inside `.pl-restored`.
- Edit timing in `preloader.js` (the `wait` values in `run`).

## Edit the site later

- Text and sections: edit index.html. Section ids: about, experience, projects, lab-work, certificates, skills, contact.
- Typing title: the `phrases` list in script.js.
- Status badge: the `status` paragraph at the top of the hero in index.html.
- Cube faces: the six `span.face` elements in index.html.
- Colours and fonts: the `:root` variables at the top of style.css.
- Photo or resume: replace photo.jpg or resume.pdf with a file of the same name.

## Notes

- Font (Montserrat, a Gotham-style free alternative) and CDN scripts (GSAP, ScrollTrigger, Lenis) need an internet connection. The preloader does not need the CDN scripts.
- The custom cursor and tilt only run on mouse devices.
