/**
 * Single source of truth for every page whose body copy is editable from the
 * studio under "Site pages". Each entry ships:
 *
 * - `slug`: identifier used as the row id in `site_pages` and as the URL
 *   segment in the studio editor (`/studio/pages/<slug>/edit`).
 * - `label`, `path`: shown in the studio list and "view live" link.
 * - `title`: default heading rendered by the public page when the editor has
 *   not customised it.
 * - `defaultParagraphs`: default body. Either an array of plain-text
 *   paragraphs (legacy support format) or a single-element array containing
 *   HTML (rich text editor format). The site-wide body renderer
 *   (`<SitePageBody />`) handles both shapes.
 *
 * Adding a new editable page means appending one entry here, plus updating
 * the public page to fetch from the CMS using `getSitePage(slug)`.
 */

export type SitePageDefault = {
  slug: string;
  label: string;
  path: string;
  title: string;
  defaultParagraphs: string[];
};

export const SUPPORT_PAGE_SLUG = "support" as const;

/**
 * Support default kept as legacy multi-paragraph plain text so the public
 * Support layout (centered serif paragraphs animated one-by-one) remains
 * pixel-identical until a studio editor explicitly replaces it. Once edited,
 * the body becomes HTML and the page renders through `prose prose-rcablk`
 * which is left-aligned by design.
 */
export const DEFAULT_SUPPORT_PARAGRAPHS: string[] = [
  "RCA BLK's supporters play a vital role in sustaining our key activities, from the commissioning of major new exhibitions and events, and the development of our pioneering participatory, learning and offsite programmes, to the provision of much-needed residencies and affordable onsite studios for artists.",
  "By supporting RCA BLK you will directly contribute to the sustainability, ambition and future development of one of London's leading independent arts organisations.",
  "We develop a close and reciprocal relationship with all of our Supporters, giving you the opportunity to enjoy a tailored package of benefits whilst enabling RCA BLK to flourish and increase the amount of support and opportunities we offer to artists, audiences and our community.",
  "To learn more about joining RCA BLK's Supporters' Scheme or to discuss a particular project, please contact us.",
];

const ABOUT_DEFAULT_HTML = `<p>The Royal College of Art Association of Black Students, Alumni &amp; Friends started as a grassroots organisation and community group in 2020.</p>
<p>Since its inception RCA BLK has evolved after a successful tenure of partnerships and involvement. We're happy to be the first association in the country to action incremental change within an institutional ecosystem. Thus far, we are the proud initiators of the Sir Frank Bowling Scholarship, the RCA BLK x Yinka Shonibare Residency, BLACK STAR Time Capsule and the proud recipients of the Black British Artist Grant 2023.</p>
<p>Our core objectives are to promote, improve and advance education by encouraging and supporting the practice of contemporary visual arts for artists who identify as Black and or of African heritage within the RCA community. We aim to do so by fostering relationships with pre-enrolled students, current students as well as alumni. RCA BLK has positively impacted the Black student experience and has built upon the rich legacies of the RCA Student and Alumni body.</p>
<h3>Stakeholders</h3>
<p>RCA BLK's founding members are Emily Moore, Roxanne Simone, Melanie Issaka, Andy Hart, Josh Woolford, Jerome Ince-Mitchell, Ibrahim Cissé, Michael Forbes, Sheran Forbes, Mary Adeturinmo and Timi Oyedeji. The group currently has over 200 active members made up of current students and alumni with many friends and supporters from the wider RCA community. Through ongoing conversations and feedback from members of the RCA BLK organisation, it was evident that the legacy and achievements of black students and alumni of African and Caribbean heritage lacked acknowledgement, documentation and publication within and around the RCA archives and amongst the wider international community. However, this is not a new thought. Historically, RCA students have created groups that have provided a platform and a much-needed area of support for Black and PoC students. Exhibitions such as <em>RCA Black</em> co-created by Ekua McMorris and the <em>PoC Link-up Collective</em> by Jerome Ince-Mitchell have paved the way and created a network within and beyond the walls of the college. Nevertheless, the (in)visibility and (un)sustainability of Black alumni within the RCA remained prevalent as each year went by, and as a consequence, feelings of isolation, lack of diversity in student numbers, encounters of microaggressions and racial prejudice arose. To combat this and forge a new model, Emily Moore and Roxanne Simone began the conversation to create an association that would remain central to the Black student during and after their time at the RCA. This, we believe, does not end with us. RCA BLK is a reflection of all the visionaries that came before and will come after us.</p>
<p>We are proud of our journey thus far and look forward to forging and actioning new initiatives and partnerships for the next generation.</p>`;

const RESOURCES_DEFAULT_HTML = `<p>The RCA is committed to celebrating diversity, eliminating discrimination and promoting equality of opportunity to all.</p>
<p>The College believes it is vital to provide visible pathways of access to study across our programmes for those suffering financial hardship and for those from under-represented groups.</p>
<p>In 2022, the RCA gave £1m from its own operating surplus to create the Sir Frank Bowling Scholarships to support individuals from under-represented communities, prioritising Black and African diaspora British applicants and / or including those facing significant financial hardship.</p>
<p>The Sir Frank Bowling Scholarship will support students from Black African and Caribbean diaspora heritage, or mixed Black African and Caribbean diaspora heritage, across MA, MRes and PhD study. Each year, 24 enrolled students will be awarded financial support for their tuition fees and living expenses in the duration of their time at RCA.</p>
<p>Alongside this, through the support of generous individuals, charitable trusts and foundations and corporate supporters, the RCA is proud to offer a number of named scholarships. Availability of named scholarships is limited and almost all are restricted to certain MA programmes.</p>
<p>The RCA offers a range of scholarships that are open to students with refugee and asylum seeker status. These scholarships cover the full cost of study at the RCA; some scholarships also offer support towards living expenses.</p>
<h3>Links</h3>
<ul>
<li><a href="https://www.rca.ac.uk/studying-at-the-rca/fees-and-funding/scholarships/" target="_blank" rel="noopener noreferrer">Scholarships</a></li>
<li><a href="#" target="_blank" rel="noopener noreferrer">Online Resources</a></li>
<li><a href="#" target="_blank" rel="noopener noreferrer">Join RCA BLK</a></li>
</ul>`;

const PRIVACY_DEFAULT_HTML = `<p>This privacy policy explains how RCA BLK and the Royal College of Art collect, use, and protect your personal information when you use rcablk.com.</p>
<h3>Information we collect</h3>
<p>When you use this website, we may collect information you provide directly (such as when you contact us via the contact form), as well as technical information about your visit (such as your IP address and how you use the site). We use cookies to improve your experience; see our <a href="/cookie-policy">Cookie Policy</a> for details.</p>
<h3>How we use your information</h3>
<p>We use your information to respond to inquiries, improve our website, and comply with legal obligations. We do not sell your personal data.</p>
<h3>Data protection</h3>
<p>The Royal College of Art is the data controller for this website. We take appropriate measures to keep your information secure and handle it in line with applicable data protection law.</p>
<h3>Your rights</h3>
<p>You have the right to access, correct, or delete your personal data. If you have questions or wish to exercise these rights, please contact us.</p>
<h3>Contact</h3>
<p>For privacy-related enquiries, please contact <a href="mailto:rcablk@rca.ac.uk">rcablk@rca.ac.uk</a> or <a href="mailto:websupport@rca.ac.uk">websupport@rca.ac.uk</a>.</p>`;

const COOKIE_DEFAULT_HTML = `<p>This cookie policy explains how RCA BLK and the Royal College of Art use cookies and similar technologies when you visit rcablk.com. It forms part of our approach to privacy and explains your choices about how cookies are used.</p>
<h3>What are cookies?</h3>
<p>Cookies are small text files that are placed on your device (computer, tablet or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site owners.</p>
<h3>How we use cookies</h3>
<p>We use cookies to:</p>
<ul>
<li>ensure the website functions correctly (essential cookies)</li>
<li>remember your preferences and settings</li>
<li>understand how visitors use our site so we can improve it (analytics cookies, if applicable)</li>
</ul>
<h3>Types of cookies we use</h3>
<ul>
<li><strong>Strictly necessary cookies:</strong> These are essential for the website to work. They enable basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.</li>
<li><strong>Functionality cookies:</strong> These allow the website to remember choices you make (such as your preferred language or region) and provide enhanced features.</li>
<li><strong>Analytics cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the site.</li>
</ul>
<h3>Managing your cookie preferences</h3>
<p>Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or to delete certain cookies. Please note that restricting cookies may affect the functionality of our website.</p>
<p>For more information on how to manage cookies in your browser, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">aboutcookies.org</a>.</p>
<h3>Updates to this policy</h3>
<p>We may update this cookie policy from time to time to reflect changes in our practices or for other operational, legal or regulatory reasons. We encourage you to review this page periodically.</p>
<h3>Contact us</h3>
<p>If you have any questions about our use of cookies, please contact us at <a href="mailto:rcablk@rca.ac.uk">rcablk@rca.ac.uk</a> or <a href="mailto:websupport@rca.ac.uk">websupport@rca.ac.uk</a>.</p>`;

const TERMS_DEFAULT_HTML = `<p>This website is run by the Royal College of Art. By using rcablk.com, you agree to these terms and conditions.</p>
<h3>Use of this website</h3>
<p>The content of this website is for general information only. The Royal College of Art and RCA BLK endeavour to keep the information up to date and correct, but we make no representations or warranties of any kind about the completeness or accuracy of the material.</p>
<h3>Intellectual property</h3>
<p>Unless otherwise stated, all content on this site is the property of the Royal College of Art or its licensors. You may not reproduce, distribute, or use our content without prior written permission.</p>
<h3>Links to other sites</h3>
<p>This website may link to external sites. We are not responsible for the content or privacy practices of those sites.</p>
<h3>Contact</h3>
<p>For questions about these terms, please contact <a href="mailto:rcablk@rca.ac.uk">rcablk@rca.ac.uk</a> or <a href="mailto:websupport@rca.ac.uk">websupport@rca.ac.uk</a>.</p>`;

const ACCESSIBILITY_DEFAULT_HTML = `<p>This website is run by the Royal College of Art and this statement applies to rcablk.com. We aim to meet the requirements of the Web Content Accessibility Guidelines (WCAG) 2.2 (Level AA). We are also committed to making the site accessible in accordance with The Public Sector Bodies (Websites and Mobile Applications) (No.2) Accessibility Regulations 2018.</p>
<p>We have developed this site to ensure that it is usable by as many people as possible, regardless of age, technology, device or disability. This means you should be able to:</p>
<ul>
<li>change colours, contrast levels and fonts</li>
<li>zoom in up to 300% without the text spilling off the screen</li>
<li>navigate most of the website using just a keyboard</li>
<li>navigate most of the website using speech recognition software</li>
<li>listen to most of the website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver).</li>
</ul>
<p>We have also made the website text as simple as possible to understand. If you have a disability, AbilityNet has advice on making your device easier to use in the My Computer My Way section on its website.</p>
<h3>Feedback and contact information</h3>
<p>If you need information on this website in a different format, such as an accessible PDF, large print, easy read, audio recording or braille, please email us at <a href="mailto:websupport@rca.ac.uk">websupport@rca.ac.uk</a>.</p>
<h3>Reporting accessibility problems with this website</h3>
<p>We're always looking to improve the accessibility of our website. If you find any problems not listed on this page, or think we're not meeting accessibility requirements, please contact <a href="mailto:websupport@rca.ac.uk">websupport@rca.ac.uk</a>.</p>
<h3>Contacting us by phone or visiting us in person</h3>
<ul>
<li>We provide a text relay service for people who are D/deaf, hearing impaired or have a speech impediment.</li>
<li>Our offices have audio induction loops, or if you contact us before your visit we can arrange a British Sign Language (BSL) interpreter.</li>
<li>See our main website for details on how to contact us.</li>
</ul>`;

export const SITE_PAGES: SitePageDefault[] = [
  {
    slug: SUPPORT_PAGE_SLUG,
    label: "Support",
    path: "/support",
    title: "Support",
    defaultParagraphs: DEFAULT_SUPPORT_PARAGRAPHS,
  },
  {
    slug: "about",
    label: "About",
    path: "/about",
    title: "About Us",
    defaultParagraphs: [ABOUT_DEFAULT_HTML],
  },
  {
    slug: "resources",
    label: "Resources",
    path: "/resources",
    title: "Resources",
    defaultParagraphs: [RESOURCES_DEFAULT_HTML],
  },
  {
    slug: "privacy-policy",
    label: "Privacy Policy",
    path: "/privacy-policy",
    title: "Privacy Policy",
    defaultParagraphs: [PRIVACY_DEFAULT_HTML],
  },
  {
    slug: "cookie-policy",
    label: "Cookie Policy",
    path: "/cookie-policy",
    title: "Cookie Policy",
    defaultParagraphs: [COOKIE_DEFAULT_HTML],
  },
  {
    slug: "terms",
    label: "Terms & Conditions",
    path: "/terms",
    title: "Terms & Conditions",
    defaultParagraphs: [TERMS_DEFAULT_HTML],
  },
  {
    slug: "accessibility",
    label: "Accessibility",
    path: "/accessibility",
    title: "RCA BLK Accessibility Statement",
    defaultParagraphs: [ACCESSIBILITY_DEFAULT_HTML],
  },
];

export function getSitePageDefaults(slug: string): SitePageDefault | undefined {
  return SITE_PAGES.find((p) => p.slug === slug);
}
