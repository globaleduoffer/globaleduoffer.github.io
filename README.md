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
