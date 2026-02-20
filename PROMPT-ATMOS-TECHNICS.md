# PROMPT – Site vitrine Atmos Technics

## CONTEXTE & OBJECTIF

Crée un site vitrine HTML/CSS/JS statique complet, **prêt pour déploiement**, pour **Atmos Technics**, plombier et chauffagiste certifié à Bruxelles. Le site doit être **mobile-first**, optimisé **SEO local**, avec une architecture multi-pages orientée conversion (appels, WhatsApp, devis).

---

## IDENTITÉ DE L'ENTREPRISE

| Champ | Valeur |
|---|---|
| Nom | **Atmos Technics** |
| Métier | Plombier & Chauffagiste |
| Zone | Bruxelles (19 communes) + Brabant |
| Téléphone | **+32 485 60 67 43** |
| Email | info@atmos-technics.be |
| Adresse | Rue Van Soust 460, 1070 Anderlecht |
| TVA | BE 1015.938.210 |
| Disponibilité | **24h/24 – 7j/7** |
| Favicon (webp) | `https://images.squarespace-cdn.com/content/v1/56ae587e60b5e9e25fc8f373/1766509011394-O9FC7MC5LBPF4Z8K8D8L/atmos-technics-logo-favic-48px.webp?format=100w` |
| Logo (png) | `https://images.squarespace-cdn.com/content/v1/56ae587e60b5e9e25fc8f373/1766509451036-6C00RBEWKHZR3XCP9LUC/Logo-1%400%2C5x.png?format=500w` |

---

## DESIGN SYSTEM

### Palette de couleurs (CSS custom properties)
```css
--primary-blue: #0077B6;
--primary-orange: #FF6B35;
--dark: #1A1A2E;
--light-blue: #90E0EF;
--white: #FFFFFF;
--gray-light: #F8F9FA;
--gray-text: #6C757D;
--hover-blue: #005A8C;
--hover-orange: #E55A2B;
--whatsapp: #25D366;
```

### Typographie (Google Fonts)
- **Titres** : Montserrat 600/700
- **Corps** : Inter 400/500/600

### Principes UI
- Mobile-first responsive (breakpoints : 768px, 992px, 1200px)
- Bordures arrondies (`border-radius: 8px` par défaut)
- Ombres subtiles (`box-shadow` à 3 niveaux : sm, md, lg)
- Transitions fluides (150ms–350ms ease)
- Icônes SVG inline (pas de bibliothèque externe)

---

## ARCHITECTURE DES PAGES (20 fichiers HTML)

### Structure des dossiers
```
/
├── index.html                        ← Accueil
├── contact-devis.html                ← Formulaire contact/devis
├── mentions-legales.html             ← noindex
├── politique-confidentialite.html    ← noindex, RGPD
├── sitemap.xml
├── robots.txt
├── css/styles.css
├── js/main.js
│
├── plomberie/
│   ├── index.html                    ← Hub plomberie
│   ├── installation-plomberie.html
│   ├── reparation-fuites.html
│   └── sanitaires-robinetterie.html
│
├── chauffage/
│   ├── index.html                    ← Hub chauffage
│   ├── installation-radiateurs.html
│   ├── reparation-circuit-chauffage.html
│   └── conformite-mise-en-service.html
│
├── chaudiere/
│   ├── index.html                    ← Hub chaudière
│   ├── installation-chaudiere.html
│   ├── entretien-chaudiere.html
│   └── depannage-chaudiere.html
│
└── traitement-eau/
    ├── index.html                    ← Hub traitement eau
    ├── adoucisseur-sel.html
    └── adoucisseur-co2.html
```

### Chemins CSS/JS relatifs
- Fichiers à la racine : `href="./css/styles.css"` / `src="./js/main.js"`
- Fichiers dans un sous-dossier : `href="../css/styles.css"` / `src="../js/main.js"`

---

## NAVIGATION

### Header (sticky, ombre au scroll)
- **Logo** : image seule (pas de texte à côté), lien vers `/`
- **Menu desktop** (visible ≥992px) :
  - Accueil (lien direct)
  - **Plomberie** → clic ouvre dropdown (pas de lien direct, `href="#"` + `onclick="return false;"`)
    - Installation plomberie
    - Réparation de fuites
    - Sanitaires & Robinetterie
  - **Chauffage** → clic ouvre dropdown (même logique)
    - Installation radiateurs
    - Réparation circuit chauffage
    - Conformité & Mise en service
  - **Chaudière** → clic ouvre dropdown (même logique)
    - Installation chaudière
    - Entretien chaudière
    - Dépannage chaudière
  - Traitement eau (lien direct)
  - Contact (lien direct)
- **CTA header** : numéro de téléphone + bouton "Devis gratuit" (orange)
- **Pas de lien "Tous nos services"** dans les dropdowns

### Menu mobile (hamburger, ≤991px)
- Même structure avec dropdowns dépliables au clic
- Overlay avec `overflow: hidden` sur body
- Fermeture au clic extérieur ou touche Escape

### Barre d'action mobile fixe (z-index: 9999)
Toujours visible en bas de l'écran sur mobile :
| Bouton | Lien | Couleur |
|---|---|---|
| WhatsApp | `https://wa.me/32485606743` | Vert #25D366 |
| Avis | Google search Atmos Technics avis | Jaune/Orange |
| Appeler | `tel:+32485606743` | Bleu #0077B6 |

---

## STRUCTURE DE CHAQUE PAGE

### Template commun
1. `<!DOCTYPE html>` + `<html lang="fr">`
2. `<head>` : meta charset, viewport, title, description, canonical, favicon, OG tags, geo tags, fonts, CSS, Schema.org JSON-LD
3. Skip link accessibilité
4. Header sticky + nav desktop
5. Mobile nav
6. `<main id="main-content">`
7. Breadcrumbs (fil d'Ariane)
8. Sections alternées (blanc / gris `#F8F9FA`)
9. CTA section finale (fond bleu foncé, boutons orange + blanc)
10. Footer (logo, services, contact, horaires, mentions légales)
11. Barre d'action mobile fixe
12. Script JS

### Page d'accueil (index.html)
- Hero section avec H1 SEO, sous-titre, 2 CTA (Appeler + Devis)
- Bandeau "Urgence 24h/24"
- Grille de services (4 cartes cliquables avec icônes SVG)
- Section "Pourquoi Atmos Technics" (features grid)
- Témoignages clients
- FAQ accordion (Schema.org FAQPage)
- Zone d'intervention (19 communes listées)
- Schema.org : Plumber, LocalBusiness, FAQPage, BreadcrumbList

### Pages hub (plomberie/, chauffage/, chaudiere/, traitement-eau/)
- H1 descriptif SEO
- Intro + CTA urgence
- Grille de sous-services (service-cards cliquables)
- Section réglementation / avantages
- Liste détaillée des prestations
- FAQ accordion
- CTA final

### Sous-pages service
- Breadcrumbs 3 niveaux
- H1 spécifique longue traîne
- Intro détaillée
- Liste des prestations (check icons SVG)
- Processus d'intervention (features grid numérotée)
- FAQ spécifique
- CTA final

### Contact/Devis
- Formulaire avec fieldsets : coordonnées + type d'intervention
- Champs : nom, email, téléphone, adresse, type service (select), message, RGPD checkbox
- Validation JS (required, email, téléphone belge)
- Attribut `data-validate` sur le form

---

## SEO & SCHEMA.ORG

### Chaque page doit inclure :
- `<title>` unique optimisé (mot-clé + localité + marque)
- `<meta name="description">` unique (150-160 chars, CTA + téléphone)
- `<link rel="canonical">`
- Open Graph : og:title, og:description, og:url, og:type, og:locale (fr_BE)
- Geo tags : geo.region (BE-BRU), geo.placename (Bruxelles)

### Schema.org JSON-LD
- **Accueil** : `@type: Plumber` avec areaServed (19 communes), openingHours 24/7, vatID, hasOfferCatalog
- **Pages hub** : `@type: Service` avec serviceType, provider, areaServed
- **Sous-pages** : `@type: Service` spécifique
- **Toutes les pages** : `BreadcrumbList`
- **Pages FAQ** : `FAQPage` avec Question/Answer

---

## JAVASCRIPT (vanilla, IIFE, strict mode)

### Fonctionnalités :
1. **initDesktopDropdowns()** – Toggle dropdown au clic, fermeture au clic extérieur, classe `.dropdown-open`
2. **initMobileMenu()** – Toggle hamburger, dropdowns dépliables, fermeture Escape + clic extérieur, ARIA
3. **initStickyHeader()** – Ajout classe `.scrolled` (ombre) au scroll, throttle avec requestAnimationFrame
4. **initFAQAccordion()** – Comportement accordion (un seul ouvert), ARIA expanded/hidden, keyboard support
5. **initSmoothScroll()** – Scroll fluide vers ancres avec offset header
6. **initFormValidation()** – Validation required/email/tel, messages d'erreur inline, validation blur + input
7. **initLazyLoading()** – Support natif + fallback IntersectionObserver
8. **trackPhoneClick()** / **trackFormSubmit()** – Hooks pour Google Analytics + Facebook Pixel

---

## CSS (mobile-first, custom properties)

### Sections principales :
1. Variables CSS (couleurs, typo, espacements, ombres, z-index)
2. Reset & base (box-sizing, body, skip-link)
3. Typographie (h1–h4, .service-intro)
4. Layout (.container max-width 1200px)
5. Header & Navigation (sticky, dropdown, mobile nav, hamburger animation)
6. Boutons (.btn, .btn-orange, .btn-white, .btn-sm, .btn-lg)
7. Sections (.section-gray, .section-dark, .cta-section)
8. Service cards (.service-card, hover effect, .services-grid)
9. Features grid (.feature-item, icon + content)
10. FAQ accordion (.faq-item, .faq-question, .faq-answer, .active)
11. Formulaire (.form-group, .form-row, validation states)
12. Footer (.footer-grid, .footer-legal)
13. Mobile action bar (fixe en bas, 3 boutons, z-index: 9999)
14. Breadcrumbs
15. Responsive media queries (768px, 992px, 1200px)

---

## ACCESSIBILITÉ (WCAG)

- Skip link "Aller au contenu principal"
- ARIA : aria-label, aria-expanded, aria-hidden, aria-controls
- Focus states visibles
- Keyboard navigation (Enter/Space sur FAQ)
- Sémantique HTML5 (header, nav, main, section, footer, address)
- Alt text sur toutes les images

---

## CONTRAINTES TECHNIQUES

- **Pas de framework** : HTML/CSS/JS vanilla uniquement
- **Pas de dépendances externes** sauf Google Fonts
- **Pas d'images locales** : logos via URLs Squarespace CDN
- **Chemins relatifs** pour CSS/JS (fonctionne en ouverture fichier locale)
- **Pas de page "Tous nos services"** dans les dropdowns
- **Copyright** : `© 2024 Atmos Technics`
- Footer : liens vers mentions-legales.html et politique-confidentialite.html
