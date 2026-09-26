# All Flutes Plus — homepage refresh

Static concept for a visual upgrade of the All Flutes Plus homepage, keeping the existing purple, lavender and white palette.

Open `index.html` in a browser. No build step is needed.

## What's new
- Refined header with a mega-menu and dropdowns, a rotating announcement bar and a sticky header.
- Hero with a velvet display-case of flutes (a nod to the shop's stand photo), plus a staggered entrance and parallax.
- Brand marquee on the purple band.
- A restyled "Back to School, Back to Music!" campaign card.
- **Scroll story**: the headjoint, body and foot joint glide in and join as you scroll, with the camera zooming in on each part.
- Shop-by-instrument cards, a services section, a visit-us section, an accessible FAQ accordion (`<details>`), a newsletter signup and a footer.
- Scroll-reveal fades throughout, mobile slide-out menu, and a WhatsApp chat bubble.
- Respects `prefers-reduced-motion`.

## Before going live
- Flutes are drawn as inline SVG (`js/main.js`) because the live site couldn't be reached. Swap in real product photography where it's available.
- Items marked `TODO` in `index.html` need confirming: store address, opening hours and FAQ answers.
- The site runs on Shopify, so these sections would need porting into the theme (Liquid sections + theme CSS/JS).
