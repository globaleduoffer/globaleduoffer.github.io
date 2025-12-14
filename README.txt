WES English Sidebar Scroll Fix – Patch v2 (Stronger)
===================================================

Problem
-------
On the English article page, the right-side box remains fixed (sticky/fixed)
and does NOT scroll with the page.

This patch
----------
1) en-disable-sticky-sidebar.v2.css  (RECOMMENDED)
   - Strong CSS override, beats inline styles + common sticky plugins.

2) en-disable-sticky-sidebar.v2.js   (OPTIONAL)
   - Use ONLY if a sticky plugin keeps re-injecting sticky on scroll.

How to apply
------------
Option A (Best): Add CSS file after all theme CSS
- WordPress: Appearance → Customize → Additional CSS (paste CSS), OR enqueue file last.
- Static site: <link rel="stylesheet" href="/css/en-disable-sticky-sidebar.v2.css">

If CSS alone is not enough:
- Include JS after main scripts:
  <script src="/js/en-disable-sticky-sidebar.v2.js"></script>

Verify
------
Open the English WES article → scroll.
Right-side boxes should scroll away with the page.

Note
----
Scope is EN only (html[lang="en"]), Chinese pages unaffected.