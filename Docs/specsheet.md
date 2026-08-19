# Website Specification Document

**Project:** Personal Portfolio Website
**Working title:** O White – Developer Portfolio
**Prepared from:** AS92005 planning notes

---

## 1. Purpose

To showcase the developer's own computer science work and projects to potential clients, employers, and other developers, and to serve as a central, professional online presence.

## 2. Target Users

| User group           | What they're looking for                                      |
| -------------------- | ------------------------------------------------------------- |
| Freelance clients    | Evidence of relevant skills, past work, a way to make contact |
| Employers            | Technical skills, project experience, professionalism         |
| Other developers     | Code quality, interesting projects, technical writing         |
| Teachers / assessors | Evidence of digital technology skills and process             |
| General visitors     | A quick sense of who the developer is and what they do        |

## 3. Context of Use

- Viewed on both desktop and mobile browsers.
- Must support screen widths from **375px (mobile)** up to **1920px (desktop)**, with the measurable spec extending the lower bound to **320px**.
- Visitors will typically arrive via links in resumes, social media, GitHub, or direct recommendation — so **fast load time and a strong first impression** matter more than for a site with returning/habitual traffic.

## 4. Site Map / Pages

1. **Home** – introduces the developer and their work; hero section + CTA.
2. **Projects** – listing of completed projects with descriptions and screenshots, card-based layout.
3. **Individual Project pages** – one per project, with detailed write-ups.
4. **About** – background, skills, interests.
5. **Contact** – methods of communication.
6. **Blog** – development updates and technical articles.

Navigation must be present and consistent on every page.

## 5. Functional Requirements

- Responsive layout supporting desktop, tablet, and mobile.
- Consistent navigation throughout the site.
- Interactive elements that give visual feedback (hover/focus states).
- Clear call-to-action buttons (e.g. "View my work").
- Light/dark mode support.
  - **Open decision:** should the site default to matching the user's system theme, or default to one mode? (Flagged but unresolved in planning notes — needs a decision before build.)
- Project cards display key metadata at a glance — e.g. languages used, time spent.

## 6. Measurable / Testable Specifications

These are the acceptance criteria the finished site should be checked against:

| #   | Specification                                                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Displays correctly across 320px–1920px screen widths                                                             |
| 2   | Navigation menu accessible from every page                                                                       |
| 3   | All text meets WCAG AA colour contrast requirements                                                              |
| 4   | All images have descriptive alt text                                                                             |
| 5   | Zero errors from the W3C HTML Validator                                                                          |
| 6   | Zero critical issues from WAVE accessibility checker                                                             |
| 7   | All interactive buttons have distinct hover and focus states                                                     |
| 8   | No horizontal scrolling on mobile at any supported width                                                         |
| 9   | Colour defined using the OKLCH colour space, with auto switching to hex in case of browsers not supporting OKLCH |
| 10  | Light and dark mode both available and functional                                                                |

## 7. Visual Design

**Colour palette:** [Catppuccin](https://catppuccin.com/palette/) — chosen for strong built-in contrast, accessibility, and native support for both light and dark themes.

Design principles to apply:

- High contrast improves readability — don't compromise it for aesthetics.
- Keep colour usage consistent across pages so it builds recognition.
- Reserve accent colours (pink/rosewater + complements) for buttons and interactive elements only.
- Use neutral tones for body/content sections.
- Avoid excessive colour variety — it reduces usability.

**Colour format:** OKLCH with hex fallback, per the measurable specs above.

**Layout style:**

- Large hero section on the homepage with a concise intro and CTA button(s).
- Card-based layout for the projects grid (screenshot, description, tags).
- Generous spacing between sections to support visual hierarchy and reduce cognitive load.

**Motion (optional/stretch):** Subtle animation or reactive visual effects (e.g. via Three.js) may be used where they don't compromise accessibility or performance — not a core requirement, more an enhancement opportunity.

## 8. Technical Stack

- **HTML / CSS / JavaScript**, organised into a clear, maintainable structure (not a tech requirement beyond "organised" — but explicitly assessed, so folder/file structure should be deliberate).
- **Three.js** — optional, for any animated/reactive 3D or visual elements.
- **Figma** — for wireframing and visual design before build.
- **VS Code** — development environment.
- Any code adapted from external sources (Stack Overflow, tutorials, etc.) should be commented with the source URL and a comment demonstrating understanding of how it works.

## 9. Accessibility Requirements

- WCAG AA colour contrast on all text.
- Descriptive alt text on all images.
- No critical issues reported by WAVE.
- Keyboard-navigable interactive elements with visible focus states.
- Content remains usable/readable without zooming or horizontal scrolling on small screens.

## 10. Testing & Validation Tools

| Purpose               | Tool                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colour palette ideas  | [coolors.co](https://coolors.co)                                                                                                                  |
| Colour contrast check | [coolors.co/contrast-checker](https://coolors.co/contrast-checker), [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)      |
| Accessibility check   | [WAVE](https://wave.webaim.org), [W3C evaluation tools](https://www.w3.org/WAI/test-evaluate/tools/list/)                                         |
| Wireframing           | [Figma wireframe kits](https://www.figma.com/templates/wireframe-kits/), [Figma community wireframes](https://www.figma.com/community/wireframes) |
| Layout prototyping    | [Layoutit Grid](https://grid.layoutit.com)                                                                                                        |
| Sustainability check  | [Website Carbon](https://www.websitecarbon.com)                                                                                                   |
| HTML validation       | [W3C HTML Validator](https://validator.w3.org)                                                                                                    |
| CSS validation        | [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)                                                                                         |

## 11. Design Inspiration & Heuristic Notes

**Good reference:** [techwithanirudh.com](https://www.techwithanirudh.com/) — clean, modern, strong visual hierarchy; large hero section communicates purpose immediately; consistent styling on CTAs; effective use of whitespace. Worth borrowing: hero treatment, card-based project showcase, consistent nav, restrained colour scheme.

**What to avoid:** weak contrast between sections, inconsistent visual hierarchy, cramped spacing, no clear focal points — these increase cognitive load and were identified as failure points in a less effective reference site.

**Heuristics to keep front-of-mind during build** (Nielsen's 10, as applied here):

- _Visibility of system status_ — users should always know where they are in the site.
- _Match between system and the real world_ — use familiar portfolio conventions.
- _Consistency and standards_ — buttons, nav, and layout patterns stay consistent site-wide.
- _Recognition rather than recall_ — don't make users remember where things are; keep nav obvious.
- _Aesthetic and minimalist design_ — every element on the page should earn its place.

## 12. Open Decisions (flag before/during build)

- Default theme behaviour: match system preference, or pick a fixed default with a manual toggle?
- Whether Three.js (or any animation) is in scope for v1, or a later enhancement.
- Final content/copy for About, Contact, and Blog sections.
