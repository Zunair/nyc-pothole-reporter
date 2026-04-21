# Compliance (NYC.gov Terms of Use)

Reference ToU: http://www.nyc.gov/html/misc/html/tou.html

## Do

- Help users collect their own complaint details locally.
- Open the official NYC complaint form in a new tab for manual submission.
- Keep clear disclaimers about non-affiliation.

## Don't

- Do not scrape/crawl NYC.gov pages.
- Do not automate POST submissions to NYC endpoints.
- Do not bypass CAPTCHA or automate browser interactions with city forms.
- Do not copy NYC logos/branding.

## Design choices used here

- No code posts to `a841-dotvweb01.nyc.gov`.
- User-triggered "Open official NYC form" button only.
- Complaint status tracking is independent and stored in local/optional project database.
