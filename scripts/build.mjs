import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import footer from '../src/footer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const tokensPath = path.join(root, 'tokens.json');

const tokens = JSON.parse(await readFile(tokensPath, 'utf8'));

const sections = [
  ['colors', tokens.colors],
  ['effects', tokens.effects],
  ['recipes', tokens.recipes],
];

function toCssVars(entries) {
  return entries
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
}

const rootVars = [
  ...sections
    .map(([, values]) => Object.entries(values))
    .flat(),
  ...Object.entries(tokens.fonts).map(([key, value]) => [`font-${key}`, value]),
];

const variablesCss = `:root {\n${toCssVars(rootVars)}\n}\n`;

const tailwindTheme = {
  'color-bg': tokens.colors.bg,
  'color-bg-warm': tokens.colors['bg-warm'],
  'color-bg-card': tokens.colors['bg-card'],
  'color-bg-card-hover': tokens.colors['bg-card-hover'],
  'color-bg-hover': tokens.colors['bg-card-hover'],
  'color-bg-input': tokens.colors['bg-card'],
  'color-bg-subtle': tokens.recipes['surface-soft'],
  'color-bg-strong': tokens.recipes['surface-strong'],
  'color-text': tokens.colors.text,
  'color-text-bright': tokens.colors.text,
  'color-text-dim': tokens.colors['text-dim'],
  'color-text-muted': tokens.colors['text-muted'],
  'color-accent': tokens.colors.accent,
  'color-accent-dim': '#0c8f52',
  'color-accent-warm': tokens.colors['accent-warm'],
  'color-accent-blue': tokens.colors['accent-blue'],
  'color-green': tokens.colors.accent,
  'color-red': '#b44b32',
  'color-warning': '#c9751f',
  'color-border': tokens.colors.border,
  'color-border-light': tokens.colors['border-light'],
  'color-border-hover': tokens.colors['border-light'],
  'color-badge-muted': 'rgba(16, 19, 19, 0.06)',
  'shadow-paper': tokens.effects['paper-shadow'],
  'shadow-soft': tokens.effects['shadow-soft'],
  'radius-card': tokens.effects['radius-md'],
  'radius-panel': tokens.effects['radius-lg'],
  'radius-hero': tokens.effects['radius-xl'],
  'font-sans': tokens.fonts.body,
  'font-serif': tokens.fonts.serif,
  'font-mono': tokens.fonts.mono,
};

const tailwindCss = `${variablesCss}\n@theme {\n${toCssVars(Object.entries(tailwindTheme))}\n}\n`;

const footerLinkMarkup = footer.links
  .map((link) => {
    const attrs = [`href="${link.href}"`, 'class="aa-footer__link"'];
    if (link.external) {
      attrs.push('target="_blank"', 'rel="noopener noreferrer"');
    }
    return `      <a ${attrs.join(' ')}>${link.label}</a>`;
  })
  .join('\n');

const recipesCss = `:root {\n  --surface-border: rgba(16, 19, 19, 0.1);\n  --surface-border-soft: rgba(16, 19, 19, 0.08);\n  --surface-border-faint: rgba(16, 19, 19, 0.06);\n}\n\n.aa-page-theme {\n  min-height: 100vh;\n  position: relative;\n  background: var(--page-background);\n  color: var(--text);\n}\n\n.aa-page-theme::before {\n  content: "";\n  position: fixed;\n  inset: 0;\n  pointer-events: none;\n  background-image: var(--grid-overlay-image);\n  background-size: var(--grid-overlay-size);\n  mask-image: var(--grid-overlay-mask);\n  opacity: var(--grid-overlay-opacity);\n}\n\n.aa-site-shell {\n  position: relative;\n  z-index: 1;\n}\n\n.aa-site-header {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n  backdrop-filter: blur(18px);\n  background: var(--header-backdrop);\n  border-bottom: 1px solid var(--header-border);\n}\n\n.aa-paper-card,\n.aa-paper-panel {\n  background: var(--surface-glass);\n  border: 1px solid var(--surface-border);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--paper-shadow);\n}\n\n.aa-paper-card-strong {\n  background: var(--surface-strong);\n  border: 1px solid var(--surface-border-soft);\n  border-radius: var(--radius-md);\n}\n\n.aa-paper-panel {\n  background: var(--surface-panel);\n}\n\n.aa-paper-green {\n  background: var(--surface-green);\n}\n\n.aa-soft-pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 12px;\n  border-radius: 999px;\n  border: 1px solid var(--chip-border);\n  background: var(--chip-background);\n}\n\n.aa-chip-mark {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 22px;\n  min-height: 22px;\n  border-radius: 999px;\n  background: var(--chip-background-strong);\n}\n\n.aa-button-dark {\n  background: var(--button-dark-background);\n  color: var(--button-dark-text);\n  border: 1px solid var(--button-dark-background);\n  box-shadow: none;\n}\n\n.aa-button-dark:hover {\n  background: var(--button-dark-hover);\n}\n\n.aa-link-muted {\n  color: var(--text-dim);\n}\n\n.aa-link-muted:hover {\n  color: var(--text);\n}\n\n.aa-category-guide,\n.aa-category-announcement,\n.aa-category-engineering,\n.aa-category-story,\n.aa-category-default {\n  display: inline-flex;\n  align-items: center;\n  padding: 6px 11px;\n  border-radius: 999px;\n  font-family: var(--font-mono);\n  font-size: 11px;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  border: 1px solid transparent;\n}\n\n.aa-category-guide {\n  background: var(--guide-soft);\n  border-color: var(--guide-border);\n  color: var(--accent);\n}\n\n.aa-category-announcement,\n.aa-category-story {\n  background: var(--announcement-soft);\n  border-color: var(--announcement-border);\n  color: var(--accent-warm);\n}\n\n.aa-category-engineering {\n  background: var(--engineering-soft);\n  border-color: var(--engineering-border);\n  color: var(--accent-blue);\n}\n\n.aa-category-default {\n  background: rgba(16, 19, 19, 0.05);\n  border-color: rgba(16, 19, 19, 0.08);\n  color: var(--text-dim);\n}\n\n.aa-footer {\n  margin-top: clamp(4rem, 8vw, 6rem);\n  padding: 3.5rem 0 4rem;\n  border-top: 1px solid var(--aa-footer-border, var(--sl-color-hairline, rgba(16, 19, 19, 0.08)));\n}\n\n.aa-footer__inner {\n  width: min(72rem, calc(100% - 3rem));\n  margin: 0 auto;\n  text-align: center;\n}\n\n.aa-footer__mark {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 5rem;\n  height: 5rem;\n  margin-bottom: 1.5rem;\n  border-radius: 1.75rem;\n  border: 1px solid var(--aa-footer-mark-border, var(--sl-color-hairline, rgba(16, 19, 19, 0.08)));\n  background: var(--aa-footer-mark-bg, var(--sl-color-bg-sidebar, var(--surface-strong, rgba(255, 255, 255, 0.6))));\n  box-shadow: var(--aa-footer-mark-shadow, var(--shadow-soft, 0 12px 30px rgba(70, 58, 30, 0.08)));\n}\n\n.aa-footer__mark img {\n  width: 3rem;\n  height: 3rem;\n  object-fit: contain;\n  border-radius: 1rem;\n}\n\n.aa-footer__links {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.9rem 2rem;\n  margin-bottom: 1.25rem;\n}\n\n.aa-footer__link {\n  color: var(--aa-footer-text, var(--sl-color-text, var(--text-dim)));\n  text-decoration: none;\n  font-size: 1rem;\n  line-height: 1.4;\n  transition: color 0.18s ease;\n}\n\n.aa-footer__link:hover {\n  color: var(--aa-footer-hover, var(--sl-color-white, var(--text)));\n}\n\n.aa-footer__copy {\n  margin: 0;\n  color: var(--aa-footer-copy, var(--sl-color-gray-3, var(--text-muted)));\n  font-size: 1rem;\n  line-height: 1.6;\n}\n\n@media (max-width: 720px) {\n  .aa-footer {\n    padding-top: 3rem;\n  }\n\n  .aa-footer__inner {\n    width: min(100%, calc(100% - 2rem));\n  }\n\n  .aa-footer__links {\n    gap: 0.75rem 1.25rem;\n  }\n\n  .aa-footer__link,\n  .aa-footer__copy {\n    font-size: 0.95rem;\n  }\n}\n`;

const indexJs = `import tokens from '../tokens.json' with { type: 'json' };\n\nexport { tokens };\nexport default tokens;\n`;
const footerJs = `export const footerLinks = ${JSON.stringify(footer.links, null, 2)};\nexport const footerCopy = ${JSON.stringify(footer.copy)};\nexport const footerLogoSrc = ${JSON.stringify(footer.logoSrc)};\nexport const footerLogoAlt = ${JSON.stringify(footer.logoAlt)};\n\nexport default {\n  copy: footerCopy,\n  links: footerLinks,\n  logoAlt: footerLogoAlt,\n  logoSrc: footerLogoSrc,\n};\n`;
const astroFooter = `---\nconst links = ${JSON.stringify(footer.links, null, 2)};\nconst copy = ${JSON.stringify(footer.copy)};\nconst logoSrc = ${JSON.stringify(footer.logoSrc)};\nconst logoAlt = ${JSON.stringify(footer.logoAlt)};\n---\n\n<footer class="aa-footer" data-aa-impression="footer">\n  <div class="aa-footer__inner">\n    <div class="aa-footer__mark">\n      <img src={logoSrc} alt={logoAlt} />\n    </div>\n    <nav class="aa-footer__links" aria-label="Footer">\n${footer.links
  .map((link) => {
    const rel = link.external ? ' rel="noopener noreferrer"' : '';
    const target = link.external ? ' target="_blank"' : '';
    return `      <a href="${link.href}" class="aa-footer__link"${target}${rel}>${link.label}</a>`;
  })
  .join('\n')}\n    </nav>\n    <p class="aa-footer__copy">{copy}</p>\n  </div>\n</footer>\n`;
const eleventyFooter = `<footer class="aa-footer" data-aa-impression="footer">\n  <div class="aa-footer__inner">\n    <div class="aa-footer__mark">\n      <img src="${footer.logoSrc}" alt="${footer.logoAlt}">\n    </div>\n    <nav class="aa-footer__links" aria-label="Footer">\n${footerLinkMarkup}\n    </nav>\n    <p class="aa-footer__copy">${footer.copy}</p>\n  </div>\n</footer>\n`;

await mkdir(distDir, { recursive: true });
await mkdir(path.join(distDir, 'astro'), { recursive: true });
await mkdir(path.join(distDir, 'eleventy'), { recursive: true });
await writeFile(path.join(distDir, 'variables.css'), variablesCss);
await writeFile(path.join(distDir, 'tailwind.css'), tailwindCss);
await writeFile(path.join(distDir, 'recipes.css'), recipesCss);
await writeFile(path.join(distDir, 'index.js'), indexJs);
await writeFile(path.join(distDir, 'footer.js'), footerJs);
await writeFile(path.join(distDir, 'astro', 'Footer.astro'), astroFooter);
await writeFile(path.join(distDir, 'eleventy', 'footer.njk'), eleventyFooter);
