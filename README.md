# Onteddu Sudhakar Reddy: Portfolio (v8, hacker blue)

A static, single-page portfolio for GitHub Pages. No build step. Plain HTML, CSS and JavaScript, with GSAP and Lenis loaded from CDNs for the 3D scroll motion.

## Files

| File | Purpose |
|---|---|
| index.html | Page structure, the preloader markup, the side rail and all content |
| style.css | Hacker blue theme, layout, side rail, back-to-top, copy buttons, print styles |
| script.js | Hero intro, side-rail highlight, back-to-top, copy buttons, Guntur time, scroll-linked 3D, tilt, cursor, smooth scroll |
| preloader.css | Preloader styles: cracked display, repair tiles, 3D exit |
| preloader.js | Preloader sequence: cracks, terminal log, tile repair, exit |
| photo.jpg | Profile photo in the ID card |
| resume.pdf | Linked from the hero and the Contact section |
| nptel-hci.pdf | NPTEL certificate, Human-Computer Interfaces (IIT Guwahati) |
| nptel-sna.pdf | NPTEL certificate, Social Network Analysis (IIT Madras) |
| README.md | This file |

## Put it live on GitHub Pages

1. Create a public repository named `sudhakar-portfolio`.
2. Upload every file above to the repository root.
3. Settings, then Pages. Deploy from a branch: `main`, folder `/ (root)`. Save.
4. The site is at https://sudhakar-reddy20.github.io/sudhakar-portfolio/

## Features for visitors

- Side rail on the left edge (on phones, the right edge). It shows the sections, highlights the one you are reading, and opens labels on hover.
- Back-to-top button in the bottom-right corner, shown after scrolling down.
- Download resume button in the hero and in Contact.
- Copy buttons for the email address and phone number.
- Live local time for Guntur (IST) in the hero.
- Print or save as PDF: the page prints as a light, clean CV.

## The preloader

- Plays on every visit, about 6 seconds. Visitors can press Skip intro or Escape.
- Turned off for visitors who prefer reduced motion.
- Edit the log text in `preloader.js` (the `typeLine` calls in `run`).
- Edit the repaired word (currently "SR") in `index.html`, inside `.pl-restored`.
- Edit timing in `preloader.js` (the `wait` values in `run`).

## Edit the site later

- Text and sections: edit index.html. Section ids: about, experience, projects, lab-work, certificates, skills, contact. The side rail links are the `a[data-nav]` elements inside `nav.side-nav`.
- Typing title: the `phrases` list in script.js.
- Status badge: the `status` paragraph at the top of the hero in index.html.
- Local time city label: the `Guntur,` text in `script.js` (the `localTime` block).
- Colours: the `:root` variables at the top of style.css. The accent is `--accent`.
- Photo or resume: replace photo.jpg or resume.pdf with a file of the same name.

## Notes

- Font (Montserrat) and CDN scripts (GSAP, ScrollTrigger, Lenis) need an internet connection. The preloader does not need the CDN scripts.
- The custom cursor and tilt only run on mouse devices.
- Copy buttons use the browser clipboard. On very old browsers they fall back to a hidden text field.
