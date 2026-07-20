# Global Attest SEO clean final package

Generated: 2026-07-20

Upload the contents of `upload-root/` to the website root.

Important notes:
- This is the recommended clean upload package after SEO review.
- Do not mix this package with the older 139-page full package.
- The package keeps the core service, case, contact, review/home language, and Blog pages.
- The package includes `CNAME`, `robots.txt`, `sitemap.xml`, a small `assets/main.js`, and the existing Google Search Console verification file.
- English home page is `/index.html`.
- Chinese home page is `/zh/index.html`, corresponding to https://globalattest.com/zh/.
- The package includes updated `sitemap.xml` and `robots.txt`.
- `index-en.html` is intentionally not included because it was returning 404 online.

Main SEO fixes included:
- Replaced China PCC and Australia PCC pages with the high-click-through versions.
- Fixed Chinese About URL consistency by keeping the established `/about.html` URL.
- Fixed broken Chinese internal links: about/services/cases/reviews/city-grid variants.
- Fixed hreflang/canonical blocks for included pages.
- Unified WhatsApp links to +86 176 2013 0150.
- Added refreshed sitemap entries for important PCC destination pages, WFOE, /zh/, and package pages.


Blog / guides update (2026-07-19):
- Added English resource center: /blog.html
- Added Chinese resource center: /blog-zh.html
- Added 8 SEO-focused guide articles covering China PCC, Canada PR, apostille/legalization and WES degree evaluation.
- Added guide navigation links and homepage guide sections.
- Updated sitemap.xml with the new guide URLs.


Blog naming update:
- Renamed the article section from Guides to Blog.
- Blog index pages are /blog.html and /blog-zh.html.
- Article filenames now use the blog- prefix.
- Sitemap and internal links were updated to the Blog URLs.


Contact-only email and Blog shell update (2026-07-20):
- Email is shown on Contact pages only: chinaattest@gmail.com.
- Removed the need to show email in every page footer.
- Contact forms now submit to chinaattest@gmail.com through the website form endpoint.
- Blog index and Blog article pages now use the same navigation and footer style as the homepage.


Formal English typography update (2026-07-20):
- English pages now use a more formal typography system inspired by professional services websites.
- English headings use Libre Baskerville with Georgia fallback.
- English body text, navigation, buttons and forms use Source Sans 3 with system sans fallbacks.
- Chinese pages were not changed.


SEO cleanup update (2026-07-20):
- Uses the 43-page core website package instead of the older 139-page mixed package.
- Avoids old Guide pages, old city templates, old review pagination pages, and duplicate legacy pages.
- Preserves the custom domain through `CNAME`.
- Preserves Google Search Console verification.
- Adds a lightweight `assets/main.js` so pages that reference it do not generate missing-script requests.
- Adds a unified sitewide typography stylesheet at `assets/globalattest-typography.css`.
- English pages use one consistent formal typography system across home, services, Blog, cases, Reviews and Contact pages.
- Chinese pages use one consistent Chinese system font stack.
- Replaces large hero PNG photos with compressed JPG files for faster loading.
- Keeps only the main Reviews pages instead of older paginated review duplicates.


Country PCC SEO update (2026-07-20):
- Rewrote and expanded the five destination PCC pages for Canada PR, U.S. visa/immigration, Australia visa/migration, New Zealand immigration and Spain/EU residence.
- Added country-specific decision tables covering search intent, timeline, validity, document version, translation/authentication needs and destination-specific risks.
- Added destination-specific high-intent FAQs to reduce template duplication and improve search relevance.
- Clarified WES service page vs WES guide page vs Chinese degree verification page search intent.
- Shortened/refined selected Title and Meta Description tags for better search-result clarity.
- Added `loading`, `decoding`, `width` and `height` attributes to image tags to improve layout stability and Core Web Vitals readiness.


PCC destinations navigation update (2026-07-20):
- Updated the English homepage H1 to "China Police Clearance Certificate, Apostille & Authentication Services".
- Added destination PCC pages for United Kingdom Visa / Immigration, Germany Visa / Residence, and France Visa / Residence.
- Added /china-police-certificate-by-country.html as the unified country directory for Europe, North America and Asia-Pacific.
- Added "View All Destinations →" to the PCC by Destination dropdown while keeping the main navigation concise.
- Added Italy, Ireland and Singapore to the country directory as case-review destinations for future expansion.
- Updated sitemap.xml with the new destination URLs.


Business navigation refinement update (2026-07-20):
- Updated the homepage subtitle to include China PCC, Apostille, certified translations, degree verification, embassy authentication and overseas applications.
- Simplified PCC country dropdown labels to short country names and reordered them by business priority.
- Standardized destination PCC page titles and H1 headings around "China Police Clearance Certificate for [Country]".
- Moved WFOE / China company setup out of the Services dropdown and added Business Setup as a top-level navigation item.
- Renamed Study in China navigation and page positioning to Student Document Services / China Student Document Services.
- Added a homepage hero CTA for China Business Setup and WFOE registration services.
- Added first-paragraph keyword coverage on destination pages for "China Police Clearance Certificate", "China Police Certificate" and "China PCC" while keeping country page URLs unchanged.

Homepage title and meta update (2026-07-20):
- Updated the homepage `<title>` to use "China Police Clearance Certificate" instead of the abbreviated "China PCC".
- Updated the homepage meta description to include immigration, employment, study and international-use search intent.
- Added matching Open Graph and Twitter title/description tags for consistent page previews.
