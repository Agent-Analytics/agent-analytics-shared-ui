import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import header from '../src/header.js';
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

function buildTrackingAttr(trackingId) {
  return trackingId ? ` onclick="window.aa?.track('cta_click',{id:'${trackingId}'})"` : '';
}

function buildLinkAttrs(link, className) {
  const attrs = [`href="${link.href}"`, `class="${className}"`];
  if (link.external) {
    attrs.push('target="_blank"', 'rel="noopener noreferrer"');
  }
  return attrs.join(' ');
}

function renderFooterSections(className) {
  return footer.sections
    .map((section) => {
      const linksMarkup = section.links
        .map(
          (link) =>
            `          <a ${buildLinkAttrs(link, 'aa-footer__link')}${buildTrackingAttr(link.trackingId)}>${link.label}</a>`
        )
        .join('\n');
      return `      <section class="${className}">\n        <h3 class="aa-footer__heading">${section.title}</h3>\n        <div class="aa-footer__list">\n${linksMarkup}\n        </div>\n      </section>`;
    })
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

const headerLinkMarkup = header.links
  .map(
    (link) =>
      `      <a ${buildLinkAttrs(link, 'aa-utility-header__link aa-link-muted')}${buildTrackingAttr(link.trackingId)}>${link.label}</a>`
  )
  .join('\n');

const recipesCss = `:root {\n  --surface-border: rgba(16, 19, 19, 0.1);\n  --surface-border-soft: rgba(16, 19, 19, 0.08);\n  --surface-border-faint: rgba(16, 19, 19, 0.06);\n}\n\n.aa-page-theme {\n  min-height: 100vh;\n  position: relative;\n  background: var(--page-background);\n  color: var(--text);\n}\n\n.aa-page-theme::before {\n  content: "";\n  position: fixed;\n  inset: 0;\n  pointer-events: none;\n  background-image: var(--grid-overlay-image);\n  background-size: var(--grid-overlay-size);\n  mask-image: var(--grid-overlay-mask);\n  opacity: var(--grid-overlay-opacity);\n}\n\n.aa-site-shell {\n  position: relative;\n  z-index: 1;\n}\n\n.aa-site-header {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n  backdrop-filter: blur(18px);\n  background: var(--header-backdrop);\n  border-bottom: 1px solid var(--header-border);\n}\n\n.aa-utility-header__inner {\n  width: min(1180px, calc(100% - 56px));\n  margin: 0 auto;\n  padding: 18px 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 24px;\n}\n\n.aa-utility-header__brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 12px;\n  min-width: 0;\n  color: var(--text);\n  text-decoration: none;\n}\n\n.aa-utility-header__mark {\n  width: 42px;\n  height: 42px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n\n.aa-utility-header__mark img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n}\n\n.aa-utility-header__copy {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n\n.aa-utility-header__copy strong {\n  font-size: 16px;\n  font-weight: 700;\n  letter-spacing: -0.03em;\n}\n\n.aa-utility-header__copy span {\n  font-family: var(--font-mono);\n  font-size: 11px;\n  color: var(--text-dim);\n  text-transform: uppercase;\n  letter-spacing: 0.14em;\n  white-space: nowrap;\n}\n\n.aa-utility-header__nav {\n  display: flex;\n  align-items: center;\n  gap: 22px;\n  font-size: 14px;\n}\n\n.aa-utility-header__link {\n  text-decoration: none;\n  transition: color 0.2s ease;\n}\n\n.aa-utility-header__cta {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 11px 18px;\n  border-radius: 14px;\n  font-size: 13px;\n  font-weight: 600;\n  text-decoration: none;\n}\n\n.aa-paper-card,\n.aa-paper-panel {\n  background: var(--surface-glass);\n  border: 1px solid var(--surface-border);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--paper-shadow);\n}\n\n.aa-paper-card-strong {\n  background: var(--surface-strong);\n  border: 1px solid var(--surface-border-soft);\n  border-radius: var(--radius-md);\n}\n\n.aa-paper-panel {\n  background: var(--surface-panel);\n}\n\n.aa-paper-green {\n  background: var(--surface-green);\n}\n\n.aa-soft-pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 12px;\n  border-radius: 999px;\n  border: 1px solid var(--chip-border);\n  background: var(--chip-background);\n}\n\n.aa-chip-mark {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 22px;\n  min-height: 22px;\n  border-radius: 999px;\n  background: var(--chip-background-strong);\n}\n\n.aa-button-dark {\n  background: var(--button-dark-background);\n  color: var(--button-dark-text);\n  border: 1px solid var(--button-dark-background);\n  box-shadow: none;\n}\n\n.aa-button-dark:hover {\n  background: var(--button-dark-hover);\n}\n\n.aa-link-muted {\n  color: var(--text-dim);\n}\n\n.aa-link-muted:hover {\n  color: var(--text);\n}\n\n.aa-category-guide,\n.aa-category-announcement,\n.aa-category-engineering,\n.aa-category-story,\n.aa-category-default {\n  display: inline-flex;\n  align-items: center;\n  padding: 6px 11px;\n  border-radius: 999px;\n  font-family: var(--font-mono);\n  font-size: 11px;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  border: 1px solid transparent;\n}\n\n.aa-category-guide {\n  background: var(--guide-soft);\n  border-color: var(--guide-border);\n  color: var(--accent);\n}\n\n.aa-category-announcement,\n.aa-category-story {\n  background: var(--announcement-soft);\n  border-color: var(--announcement-border);\n  color: var(--accent-warm);\n}\n\n.aa-category-engineering {\n  background: var(--engineering-soft);\n  border-color: var(--engineering-border);\n  color: var(--accent-blue);\n}\n\n.aa-category-default {\n  background: rgba(16, 19, 19, 0.05);\n  border-color: rgba(16, 19, 19, 0.08);\n  color: var(--text-dim);\n}\n\n.aa-footer {\n  margin-top: clamp(4rem, 8vw, 6rem);\n  padding: clamp(3rem, 5vw, 4rem) 0 clamp(3rem, 6vw, 4.5rem);\n  border-top: 1px solid var(--aa-footer-border, var(--sl-color-hairline, rgba(16, 19, 19, 0.08)));\n}\n\n.aa-footer__inner {\n  width: min(72rem, calc(100% - 3rem));\n  margin: 0 auto;\n}\n\n.aa-footer__grid {\n  display: grid;\n  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.6fr);\n  gap: 2.5rem 3rem;\n  align-items: start;\n}\n\n.aa-footer__brand {\n  display: grid;\n  gap: 1.25rem;\n  align-content: start;\n}\n\n.aa-footer__mark {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 5rem;\n  height: 5rem;\n  border-radius: 1.75rem;\n  border: 1px solid var(--aa-footer-mark-border, var(--sl-color-hairline, rgba(16, 19, 19, 0.08)));\n  background: var(--aa-footer-mark-bg, var(--sl-color-bg-sidebar, var(--surface-strong, rgba(255, 255, 255, 0.6))));\n  box-shadow: var(--aa-footer-mark-shadow, var(--shadow-soft, 0 12px 30px rgba(70, 58, 30, 0.08)));\n}\n\n.aa-footer__mark img {\n  width: 3rem;\n  height: 3rem;\n  object-fit: contain;\n  border-radius: 1rem;\n}\n\n.aa-footer__brand-copy {\n  display: grid;\n  gap: 0.7rem;\n}\n\n.aa-footer__title {\n  margin: 0;\n  font-size: clamp(1.5rem, 3vw, 1.9rem);\n  line-height: 1.05;\n  letter-spacing: -0.04em;\n}\n\n.aa-footer__description {\n  margin: 0;\n  max-width: 24rem;\n  color: var(--text-dim);\n  font-size: 1rem;\n  line-height: 1.65;\n}\n\n.aa-footer__copy {\n  margin: 0;\n  color: var(--aa-footer-copy, var(--sl-color-gray-3, var(--text-muted)));\n  font-size: 0.95rem;\n  line-height: 1.6;\n}\n\n.aa-footer__sections {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 1.5rem 1.75rem;\n}\n\n.aa-footer__section {\n  display: grid;\n  gap: 0.9rem;\n  align-content: start;\n}\n\n.aa-footer__heading {\n  margin: 0;\n  font-size: 0.95rem;\n  font-weight: 700;\n  letter-spacing: -0.02em;\n}\n\n.aa-footer__list {\n  display: grid;\n  gap: 0.7rem;\n}\n\n.aa-footer__link {\n  color: var(--aa-footer-text, var(--sl-color-text, var(--text-dim)));\n  text-decoration: none;\n  font-size: 0.98rem;\n  line-height: 1.45;\n  transition: color 0.18s ease;\n}\n\n.aa-footer__link:hover {\n  color: var(--aa-footer-hover, var(--sl-color-white, var(--text)));\n}\n\n@media (max-width: 960px) {\n  .aa-footer__grid {\n    grid-template-columns: 1fr;\n  }\n\n  .aa-footer__sections {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n\n@media (max-width: 720px) {\n  .aa-utility-header__inner {\n    width: min(100%, calc(100% - 32px));\n    padding: 14px 0;\n    gap: 14px;\n  }\n\n  .aa-utility-header__mark {\n    width: 36px;\n    height: 36px;\n  }\n\n  .aa-utility-header__copy strong {\n    font-size: 14px;\n  }\n\n  .aa-utility-header__copy span {\n    font-size: 10px;\n    letter-spacing: 0.12em;\n  }\n\n  .aa-utility-header__nav {\n    gap: 12px;\n  }\n\n  .aa-utility-header__link {\n    display: none;\n  }\n\n  .aa-utility-header__cta {\n    min-height: 44px;\n    padding: 10px 14px;\n    font-size: 14px;\n  }\n\n  .aa-footer {\n    padding-top: 3rem;\n  }\n\n  .aa-footer__inner {\n    width: min(100%, calc(100% - 2rem));\n  }\n\n  .aa-footer__sections {\n    grid-template-columns: 1fr;\n    gap: 1.25rem;\n  }\n\n  .aa-footer__brand {\n    gap: 1rem;\n  }\n\n  .aa-footer__link,\n  .aa-footer__copy,\n  .aa-footer__description {\n    font-size: 0.95rem;\n  }\n}\n`;

const indexJs = `import tokens from '../tokens.json' with { type: 'json' };\n\nexport { tokens };\nexport default tokens;\n`;
const headerJs = `export const headerBrand = ${JSON.stringify(header.brand, null, 2)};\nexport const headerLinks = ${JSON.stringify(header.links, null, 2)};\nexport const headerCta = ${JSON.stringify(header.cta, null, 2)};\n\nexport default {\n  brand: headerBrand,\n  cta: headerCta,\n  links: headerLinks,\n};\n`;
const footerJs = `export const footerLinks = ${JSON.stringify(footer.links, null, 2)};\nexport const footerSections = ${JSON.stringify(footer.sections, null, 2)};\nexport const footerCopy = ${JSON.stringify(footer.copy)};\nexport const footerDescription = ${JSON.stringify(footer.description)};\nexport const footerLogoSrc = ${JSON.stringify(footer.logoSrc)};\nexport const footerLogoAlt = ${JSON.stringify(footer.logoAlt)};\nexport const footerTitle = ${JSON.stringify(footer.title)};\n\nexport default {\n  copy: footerCopy,\n  description: footerDescription,\n  links: footerLinks,\n  logoAlt: footerLogoAlt,\n  logoSrc: footerLogoSrc,\n  sections: footerSections,\n  title: footerTitle,\n};\n`;
const astroFooter = `<footer class="aa-footer" data-aa-impression="footer">\n  <div class="aa-footer__inner">\n    <div class="aa-footer__grid">\n      <div class="aa-footer__brand">\n        <div class="aa-footer__mark">\n          <img src="${footer.logoSrc}" alt="${footer.logoAlt}" />\n        </div>\n        <div class="aa-footer__brand-copy">\n          <h2 class="aa-footer__title">${footer.title}</h2>\n          <p class="aa-footer__description">${footer.description}</p>\n          <p class="aa-footer__copy">${footer.copy}</p>\n        </div>\n      </div>\n      <nav class="aa-footer__sections" aria-label="Footer">\n${renderFooterSections('aa-footer__section')}\n      </nav>\n    </div>\n  </div>\n</footer>\n`;
const eleventyHeader = `<header class="aa-site-header aa-utility-header">\n  <div class="aa-utility-header__inner">\n    <a href="${header.brand.href}" class="aa-utility-header__brand">\n      <span class="aa-utility-header__mark">\n        <img src="${header.brand.logoSrc}" alt="${header.brand.logoAlt}">\n      </span>\n      <span class="aa-utility-header__copy">\n        <strong>${header.brand.title}</strong>\n        <span>${header.brand.subtitle}</span>\n      </span>\n    </a>\n    <nav class="aa-utility-header__nav" aria-label="Primary">\n${headerLinkMarkup}\n      <a ${buildLinkAttrs(header.cta, 'aa-utility-header__cta aa-button-dark')}${buildTrackingAttr(header.cta.trackingId)}>${header.cta.label}</a>\n    </nav>\n  </div>\n</header>\n`;
const eleventyFooter = `<footer class="aa-footer" data-aa-impression="footer">\n  <div class="aa-footer__inner">\n    <div class="aa-footer__grid">\n      <div class="aa-footer__brand">\n        <div class="aa-footer__mark">\n          <img src="${footer.logoSrc}" alt="${footer.logoAlt}">\n        </div>\n        <div class="aa-footer__brand-copy">\n          <h2 class="aa-footer__title">${footer.title}</h2>\n          <p class="aa-footer__description">${footer.description}</p>\n          <p class="aa-footer__copy">${footer.copy}</p>\n        </div>\n      </div>\n      <nav class="aa-footer__sections" aria-label="Footer">\n${renderFooterSections('aa-footer__section')}\n      </nav>\n    </div>\n  </div>\n</footer>\n`;

await mkdir(distDir, { recursive: true });
await mkdir(path.join(distDir, 'astro'), { recursive: true });
await mkdir(path.join(distDir, 'eleventy'), { recursive: true });
await writeFile(path.join(distDir, 'variables.css'), variablesCss);
await writeFile(path.join(distDir, 'tailwind.css'), tailwindCss);
await writeFile(path.join(distDir, 'recipes.css'), recipesCss);
await writeFile(path.join(distDir, 'index.js'), indexJs);
await writeFile(path.join(distDir, 'header.js'), headerJs);
await writeFile(path.join(distDir, 'footer.js'), footerJs);
await writeFile(path.join(distDir, 'astro', 'Footer.astro'), astroFooter);
await writeFile(path.join(distDir, 'eleventy', 'header.njk'), eleventyHeader);
await writeFile(path.join(distDir, 'eleventy', 'footer.njk'), eleventyFooter);
