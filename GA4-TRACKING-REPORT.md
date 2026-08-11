# GLOBAL ATTEST — GA4 TRACKING CONSISTENCY REPORT

- Source snapshot: `/Users/chang/Documents/Codex/2026-07-29/global-attest-china-no-criminal-record/output/globalattest-full-site-final-review-2026-08-staging`
- Report generated: `2026-08-11T22:16:57+08:00`
- Expected GA4 ID: `G-VDC1P9N84P`

## Final Results

- Total indexable pages: **92**
- Pages with GA4 before: **5**
- Pages with GA4 after: **92**
- Missing GA4: **0**
- Wrong GA ID: **0**
- Duplicate GA initialization: **0**
- Undefined `trackAndNavigate()` calls: **0**
- Undefined `trackGAEvent()` calls: **0**
- Modified HTML count: **87**
- `trackAndNavigate()` definitions added where called: **59**
- `trackGAEvent()` definitions added where called: **0**

## Approved GA4 Implementation

All indexable pages use the same Google tag property:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VDC1P9N84P"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-VDC1P9N84P');
</script>
```

No GTM container, second GA ID, test ID, consent banner, Consent Mode or CMP was added.

## Helper Validation

`trackAndNavigate()` was added only to pages that already called it without a definition. No new tracking onclick attributes were added. `trackGAEvent()` was not added to pages that did not call it.

- Pages receiving `trackAndNavigate()`: **59**
- Pages receiving `trackGAEvent()`: **0**

### trackAndNavigate() added

- `about-en.html`
- `apostille-guide-en.html`
- `beijing.html`
- `blog-china-pcc-apostille-legalization.html`
- `blog-china-pcc-canada-pr.html`
- `blog-china-police-certificate-after-leaving-china.html`
- `blog-wes-china-degree-evaluation.html`
- `blog.html`
- `case-china-police-certificate.html`
- `case-degree-verification.html`
- `case-embassy-legalization.html`
- `case-hague-apostille.html`
- `chengdu.html`
- `china-apostille-samples.html`
- `china-degree-apostille.html`
- `china-degree-transcript-verification-chsi-resource-center.html`
- `china-embassy-consular-legalization.html`
- `china-hague-apostille-services.html`
- `china-no-criminal-record-certificate.html`
- `china-police-certificate-australia.html`
- `china-police-certificate-by-country.html`
- `china-police-certificate-canada-pr.html`
- `china-police-certificate-france.html`
- `china-police-certificate-germany.html`
- `china-police-certificate-new-zealand.html`
- `china-police-certificate-spain.html`
- `china-police-certificate-united-kingdom.html`
- `china-police-certificate-usa.html`
- `china-police-certificate.html`
- `china-police-clearance-certificate-samples.html`
- `china-temporary-residence-registration-form-samples.html`
- `chongqing.html`
- `city-grid-en.html`
- `contact-en.html`
- `dalian.html`
- `degree-certification-guide-en.html`
- `degree-verification.html`
- `document-legalization.html`
- `embassy-authentication-samples.html`
- `embassy-certification-guide-en.html`
- `guangzhou.html`
- `hangzhou.html`
- `resources.html`
- `reviews-en.html`
- `reviews.html`
- `sanya.html`
- `shanghai.html`
- `shenyang.html`
- `shenzhen.html`
- `study-in-china.html`
- `suzhou.html`
- `tianjin.html`
- `wes-certification-guide-en.html`
- `wes-en.html`
- `wes-evaluation-report-samples.html`
- `wes-guide-en.html`
- `wfoe-china.html`
- `wuhan.html`
- `xiamen.html`

### trackGAEvent() added

None

## Protected Content Verification

- Body changes: **0**
- Title changes: **0**
- Meta changes: **0**
- Canonical changes: **0**
- hreflang changes: **0**
- Schema / JSON-LD changes: **0**
- Sitemap modified: **No**
- SEO files modified: **None**

Protection was verified by hashing each page body and the exact Title, Meta, Canonical, hreflang and JSON-LD blocks before and after insertion. `sitemap.xml` was also hash-compared.

## Excluded Pages

No GA4 tracking was added specifically to:

- `google21b3d9a4951cbca3.html`
- `services-en.html` — legacy/noindex
- `shenzhen-degree-notarization.html` — legacy/noindex
- `study-in-china-en.html` — legacy/noindex

## Modified HTML Files

- `about-en.html`
- `about.html`
- `apostille-guide-en.html`
- `beijing.html`
- `blog-canada-pr-china-pcc-zh.html`
- `blog-china-pcc-apostille-legalization.html`
- `blog-china-pcc-apostille-zh.html`
- `blog-china-pcc-canada-pr.html`
- `blog-china-police-certificate-after-leaving-china-zh.html`
- `blog-china-police-certificate-after-leaving-china.html`
- `blog-wes-china-degree-evaluation-zh.html`
- `blog-wes-china-degree-evaluation.html`
- `blog-zh.html`
- `blog.html`
- `case-apostille-zh.html`
- `case-china-pcc-zh.html`
- `case-china-police-certificate.html`
- `case-degree-verification-zh.html`
- `case-degree-verification.html`
- `case-embassy-legalization-zh.html`
- `case-embassy-legalization.html`
- `case-hague-apostille.html`
- `cases-en.html`
- `cases.html`
- `chengdu.html`
- `china-apostille-samples-zh.html`
- `china-apostille-samples.html`
- `china-degree-apostille.html`
- `china-degree-transcript-verification-chsi-resource-center-zh.html`
- `china-degree-transcript-verification-chsi-resource-center.html`
- `china-embassy-consular-legalization.html`
- `china-hague-apostille-services.html`
- `china-no-criminal-record-certificate-zh.html`
- `china-no-criminal-record-certificate.html`
- `china-police-certificate-australia.html`
- `china-police-certificate-by-country.html`
- `china-police-certificate-canada-pr.html`
- `china-police-certificate-france.html`
- `china-police-certificate-germany.html`
- `china-police-certificate-new-zealand.html`
- `china-police-certificate-spain.html`
- `china-police-certificate-united-kingdom.html`
- `china-police-certificate-usa.html`
- `china-police-certificate-zh.html`
- `china-police-certificate.html`
- `china-police-clearance-certificate-samples-zh.html`
- `china-police-clearance-certificate-samples.html`
- `china-temporary-residence-registration-form-samples-zh.html`
- `china-temporary-residence-registration-form-samples.html`
- `chongqing.html`
- `city-grid-en.html`
- `contact-en.html`
- `contact-zh.html`
- `dalian.html`
- `degree-certification-guide-en.html`
- `degree-verification-zh.html`
- `degree-verification.html`
- `document-legalization-zh.html`
- `document-legalization.html`
- `embassy-authentication-samples-zh.html`
- `embassy-authentication-samples.html`
- `embassy-certification-guide-en.html`
- `guangzhou.html`
- `hangzhou.html`
- `resources-zh.html`
- `resources.html`
- `reviews-en.html`
- `reviews.html`
- `sanya.html`
- `shanghai.html`
- `shenyang.html`
- `shenzhen.html`
- `study-in-china-zh.html`
- `study-in-china.html`
- `suzhou.html`
- `tianjin.html`
- `wes-certification-guide-en.html`
- `wes-cn.html`
- `wes-en.html`
- `wes-evaluation-report-samples-zh.html`
- `wes-evaluation-report-samples.html`
- `wes-guide-en.html`
- `wes-guide-zh.html`
- `wfoe-china.html`
- `wuhan.html`
- `xiamen.html`
- `zh/index.html`

## Exceptions

### Missing GA4

None

### Wrong GA ID

None

### Duplicate GA initialization

None

### Undefined trackAndNavigate() calls

None

### Undefined trackGAEvent() calls

None

## Change Scope Confirmation

- HTML changes were limited to GA4 page-view initialization and required existing tracking helper definitions in `<head>`.
- No body content, visible design, links, Navbar structure, Footer, SEO metadata, Schema, sitemap or business content was changed.
- No cookie banner, consent tooling or new tracking event attributes were introduced.
