/* =========================================================
   Rentwise · Rental Management System — frontend (vanilla JS)
   ---------------------------------------------------------
   Structure
     1. Utilities & icons
     2. Mock database (replace with your backend)
     3. Domain rules (bill status, lease status) — derived, never hardcoded
     4. Service layer (async; swap the bodies for fetch() calls)
     5. UI components
     6. Views (auth, admin/manager portal, tenant portal)
     7. Actions & forms (event delegation)
     8. Router & boot
   Everything marked DEMO is mock behaviour: no real Google OAuth,
   payments, file uploads, email or push notifications.
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. Utilities & icons
   --------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Demo "today". In production use new Date(). */
const TODAY = new Date('2026-11-24T00:00:00');
const CURRENT_PERIOD = '2026-11';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pesoShort = (n) => n >= 1000 ? '₱' + Math.round(n / 1000) + 'k' : '₱' + n;
const toDate = (s) => new Date(String(s).slice(0, 10) + 'T00:00:00');
const fmtDate = (s) => toDate(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtShort = (s) => toDate(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtDT = (iso) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const monthLabel = (p) => new Date(p + '-01T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const monthShort = (p) => new Date(p + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short' });
const daysBetween = (a, b) => Math.round((b - a) / 86400000);
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const uid = (prefix) => prefix + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
const isoDate = (dt) => dt.toISOString().slice(0, 10);
/* A timestamp on the demo "today" with the real clock time */
const nowISO = () => { const n = new Date(); const d = new Date(TODAY); d.setHours(n.getHours(), n.getMinutes(), n.getSeconds()); return d.toISOString(); };
const wait = (ms = 160) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Brand: Rentwise. Logos are embedded below, so no extra files are needed.
   The light version (white + aqua) is used on the Ocean-blue sidebar and sign-in panel. */
/* Rentwise logo images, embedded so the logo shows even without the /assets folder. */
const LOGO_DATA = {
  logo: 'data:image/png;base64,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',
  logoLight: 'data:image/png;base64,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',
  mark: 'data:image/png;base64,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',
  markLight: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAABgCAMAAABIS46CAAAAkFBMVEX+//82yaL8/f0AAAA1uZY2tZb+/wH+/v6v+vn+/v4w+e43za5j+fBt/W0D/wN8/RJd8618fHz9q6v9/XusrFv/fX2r866urq4d9q3x6az/rP//AP9htK1CzKz6unY2q48p9Xd/fwesWger8l5/PwBtthYAeHg0uypxuHEffwAfuWw3wKKqVVWq/wD/AAB/f/+ONWkqAAAAMHRSTlP8/AYA75wCsBBeE1cNAgECBgIDAgMCBAMFBAMBFFQEZAQCAwQEBAIDAwMEhAMDAQLOEOQnAAAExklEQVR42t2aDXPiIBCG00URKZDvxLS22nr26653///fHSSx1bAbk9bM3Nw704465slmWeAFDJgn0CbUtWCAGDOcM85NrQ4q8OFQmNCYoXRgOrTo3/bK2zxPDh+62+J0oQsYJQGgrOwrKer3on0sn84rAYvhWkL2AmIz72gjMDrnvGLLYLgWrLJPOp91NFdo7JBWDEbRCwViPrs60WwuQHDu02Fs7JECNb/y6AlH6TCSrqLJ6bOJ6IqgQ3gJOkA5Kb2YlA7T0hMxJV3A/0nvjqYCLkJPzIHeDsgH/kXoNw19708gI+gBSWeODltYdjUm9gg0Qbfju731AotnsFahgZF0BmygTMgZTWdE7AUUUbT+aG3VYzkkTecZGntlQB05gwoKWWa2+dpmbzoG1PMwD+maIegp+3MaopLWTWjwJ3lLL1F62EcH30WsvATx8J2kv9N0aww8FzFT8NbNura20OB03RP7g3fF1dyWn9+q1j3CaPqr9OgzUdPbsQ4+20BIhJ7vRtO3rc8dQP/dQ7//8e3Y9T9IP+ql7X0uTT+eypxtH0t/VBPSIQaMDpPSR8ce4/SSoqdOzQrPtCOzbVXfYd/WngAG062LWNf0+zTLHpzy3LjwI4LOxtBd3oUTiNP5YzWaniD067vrrjZre6uvxP6zS7+aIXKD4Xj6E0LHZE2XhrH04Iffmyj6nwiryD56gowEFP3Xv0Z/lEPzDiSdX4IeRuRIQNPn09Eh/i79dlJ6PWtT9FwNpxcYPQkvREf7KpgL0cWE9Nyg9JvLZCaR6Mx3I4Gki3xYzbgUAOZSVQIpTU/EZjZE83p6CvyPk5KO3V6x9mciRBGzM7dYdz9e11MiGbsoum4RFahg987RL/XQI7vgC/bPz2uInaAqY7fQiN394iPteboKU562b+2Gc8Nt/tF0/fC4f35t43h6WwVvL1HUrpuqdGeNx8kCioeNPjZK+uiF3ioJrOO5NJmpFI73yA/fIumRiK7vrJpGcq/ugibyJSIb6k4b/Wm7++mQgVeR87VdgRPbK1DojMNg+i/E6bWxE9vBe3ag87P0nKSzBYZfrooD3a2/z9ATil5tgdoFYhega7MktrCCA/1sZkg67AvAc/OZmbP0GKXLSGjbf/HcLNnQVr1/FD5dKmn7sFZA7MuB3SMbVJHYmm8upYxUfQzFiNQXw/oqmhkb+/aw3iBSX3TOyr5GJ1IPRgyiY6syKdVhl6CicgOp/jzuoytS9dKp1C9ZyofQJU4/ElX1+iP6kbE304fr6zdk6m1VhefoJR277S4ht2edr1RZwvmKlHTeGddpql8ytujtsn29iaCbw2lA5HZzqdHyXOxPeL03w2zbo3ZP9GD8FfqKHdGBk2V5jr6m6J9401OW1Rf6qloZOLEhCnpyA2NHglO6vbYkR4ReH5n74/vM9ibZsUvBrq8sv0uP7zM89fBQgTv3YENrZqbkyrN61GC8UNvM0jXu9J4FcoovJEYnUi/rzLwgtnC/1XKz6Th++5w+nbkjG8xaLt9AOzpyzKN1pE9PAOtCX0nMBBO+OAyjoEFUSdUa88r90MP9RsTkSVnGWVZm9q+MdRyXoCOMznnhTnUa2cuT+rci4uVZBR2LfhJTm9b+EPue5C9jPHjFpBGEugAAAABJRU5ErkJggg==',
  favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAkFBMVEUbTHoAAAA2yaIO+/g2vJkaTYE1up04cY41ups2xKdo+vwqU3X////9/QIurqxzDwhPn7cy1rX/AP8Ta2xxcnEaF3N4uyIuWnNlAmIEfwQD+wB2+AxKpcoAAP8cs2ig4xt1chY2wZ9s/3ExY4YA/39Xp1pV/6q5AACvrw//AAAAf/8pqutQXaexFWOq/////3Go0+taAAAAMHRSTlP3APwG7P1pI5hVBqgBARQCDyUBBwIDA18DAgECEwEDBAOUAlcCBAMDAwECCAYDAwIs5DcPAAADRklEQVR42rWY63aqMBCFMw2gcokgoFysUgRbe33/tzsTEElCwFrW2f7RAN+aJDObiQQEUbrNYEwVBcjzwTCRAPak6HtFFckAL4IdmZDzWQJb9rKAyYC8QIDZ3Guaw+dN4pdgGU+dDAtqTwLQ8AbQa1/B6qkHrGCrAOJ7AAorYybAmgEwyR4UwPFBgH8PEM6NgI0BroNjgDiOQy7G7AYwTIIxwJscAYoDzDERn2oBdbi4aTKVh9uYYio/w0JMd/tj72vEB/es3N4BmKbD51F4YyWdagCRCCCOG2GJ0n5jFq1PoJ69n5+jZg0UAKyBWZa1sloxCG+17+Wep0nlIWBpdDcZBgPWu0eVZ3cAuIguAoSKpQho56BdAx0AFMCheghA5kcwBHT2iZjDXwGd67M/TWEWIMASPVzFAkRZkqnmCKB3IpAUgAw4wj3AShSjyaMAnoyC6MCR7gMk/QrwOg4w/gNAswuv9OX3gK0WsJwHWD8CeNMB7LkRuDMBX/AymQdSJkYaQO9IbfaJKcmLyeiSk7c4JB8CEsrQkztX5gbdf8dGjfUX0LI3SiLhO9T1mfheUHrC/Gc4pgLqMyFpe61IL4cwImS9LooC4HLBsXVR13W6DdM0iqDpE1XA9iw2kh/JhhCx2XQxjKziTr3Z6CMAai2XXf0uGbyHcrPJ0m3WeNwoQLY08Hn32rcI+O5qQ/cI0QJABWDj5JAbAm85QdwAPE8fQaICaG7LbcYCPpsIRqawVgFBDSeZQOFjAkAUQHA+QzMJYSEhnFhEJQIaYBcH3zLhhAs5mkgaABIWcsvHsjAbBVAJYDMebCIvA7ZSBbkS5CZLA6AbrgSXwZQmUWdZDzCnAXjW+iJU3cuwGgHAYAq0LEufByrGsI8/9QAlE6nfNHkBhSalxb2MNQCTfKuJFG3auswT0O7lLwDX/UqACfuAj7Amhh7Q9vnuKADT7yQBHDt+7wHXYnMG1UhuACiu59K+LjGlCc8y4UigAFjb5nVyHen8sMuak2vo9Nq5BB3phX+4luzWYUGT0swRtfNSBNBQNNmyPF9duXnSpbZk0a5syXnZnpm426JwoUPIsksC6y/8hYPJRvk7oIjjJIYk4bsSYyefwT9lJ0oEmXdCVgAAAABJRU5ErkJggg=='
};
const BRAND = { name: 'Rentwise', logo: LOGO_DATA.logo, logoLight: LOGO_DATA.logoLight, mark: LOGO_DATA.mark, markLight: LOGO_DATA.markLight };
/* Browser-tab icon also comes from the embedded image (works without /assets). */
(function setFavicon() { let l = document.querySelector('link[rel="icon"]'); if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l); } l.href = LOGO_DATA.favicon; })();
const brandBlock = (sub, size = 'md') => `<div class="brand brand-${size}"><img class="brand-logo" src="${BRAND.logoLight}" alt="${esc(BRAND.name)}" width="448" height="96"><span class="brand-sub">${esc(sub)}</span></div>`;

const ICONS = {
  home: 'M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  grid: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  building: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4',
  units: 'M4 4h16v16H4zM4 12h16M12 4v16',
  users: 'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 20v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1',
  file: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h4',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  megaphone: 'M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1M16 9a4 4 0 0 1 0 6',
  bell: 'M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9M10 20a2 2 0 0 0 4 0',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  plus: 'M12 5v14M5 12h14',
  menu: 'M4 6h16M4 12h16M4 18h16',
  x: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  half: 'M12 3v18M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  circle: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  alert: 'M12 7.5v5M12 16v.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  arrow: 'M5 12h12M13 7l5 5-5 5',
  back: 'M15 5l-7 7 7 7',
  print: 'M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z',
  download: 'M12 4v11M7 10l5 5 5-5M4 20h16',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M21 21l-4.3-4.3',
  logout: 'M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3',
  image: 'M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15.5 9.5h.01',
  sort: 'M8 9l4-4 4 4M8 15l4 4 4-4',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  refresh: 'M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4',
  chevron: 'M6 9l6 6 6-6',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  swap: 'M7 16V4M3 8l4-4 4 4M17 8v12M21 16l-4 4-4-4',
  key: 'M21 2l-2 2M11.4 11.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zM11.4 11.6L15.5 7.5M15.5 7.5l3 3L22 7l-3-3M15.5 7.5L19 4',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'
};
const icon = (name, size = 18, sw = 1.8) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[name] || ICONS.circle}"></path></svg>`;
const GOOGLE_G = `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`;

/* ---------------------------------------------------------
   2. Mock database
   Shapes follow the handoff ERD (USERS, PROPERTIES, UNITS, TENANTS,
   LEASES, BILLS, BILL_ITEMS, PAYMENTS, PAYMENT_ALLOCATIONS,
   CONCERNS, CONCERN_MESSAGES, ANNOUNCEMENTS(+TARGETS), NOTIFICATIONS).
   --------------------------------------------------------- */
const db = {
  users: [
    { id: 'U-M1', name: 'Maria Santos', email: 'maria.santos@gmail.com', role: 'manager', title: 'Property Manager', propertyIds: ['P1', 'P2', 'P3'] },
    { id: 'U-T1', name: 'Carlo Dizon', email: 'carlo.dizon@gmail.com', role: 'tenant', tenantId: 'T1' }
  ],
  properties: [
    { id: 'P1', name: 'Narra Court', address: '18 Narra St., Project 4, Quezon City', description: '3-storey walk-up with studios and 1-bedroom units.' },
    { id: 'P2', name: 'Sampaguita Residences', address: '220 Kalayaan Ave., Makati City', description: 'Mid-rise residences near the business district.' },
    { id: 'P3', name: 'Acacia Lofts', address: '7 Acacia Lane, Kapitolyo, Pasig City', description: 'Loft units with ground-floor parking.' }
  ],
  units: [
    { id: 'UN1', propertyId: 'P1', name: '104', type: 'Studio', rent: 4000, status: 'Occupied' },
    { id: 'UN2', propertyId: 'P1', name: '201', type: '1-Bedroom', rent: 5100, status: 'Occupied' },
    { id: 'UN3', propertyId: 'P1', name: '302', type: 'Studio', rent: 4200, status: 'Available' },
    { id: 'UN4', propertyId: 'P2', name: '2B', type: '1-Bedroom', rent: 5000, status: 'Occupied' },
    { id: 'UN5', propertyId: 'P2', name: '3A', type: '2-Bedroom', rent: 6200, status: 'Occupied' },
    { id: 'UN6', propertyId: 'P2', name: '1C', type: 'Studio', rent: 4800, status: 'Occupied' },
    { id: 'UN7', propertyId: 'P3', name: 'Loft 5', type: 'Loft', rent: 4650, status: 'Occupied' },
    { id: 'UN8', propertyId: 'P3', name: 'Loft 2', type: 'Loft', rent: 4500, status: 'Occupied' },
    { id: 'UN9', propertyId: 'P3', name: 'Loft 7', type: 'Loft', rent: 4500, status: 'Under Maintenance' }
  ],
  tenants: [
    { id: 'T1', userId: 'U-T1', name: 'Carlo Dizon', phone: '0917 555 0104', email: 'carlo.dizon@gmail.com', address: 'Narra Court 104, Quezon City', emergency: 'Liza Dizon · 0918 222 0199' },
    { id: 'T2', userId: null, name: 'Ana Villanueva', phone: '0920 555 0201', email: 'ana.villanueva@gmail.com', address: 'Narra Court 201, Quezon City', emergency: '' },
    { id: 'T3', userId: null, name: 'Joanna Reyes', phone: '0915 555 0022', email: 'joanna.reyes@gmail.com', address: 'Sampaguita 2B, Makati', emergency: '' },
    { id: 'T4', userId: null, name: 'Liza Manalo', phone: '0917 555 0303', email: 'liza.manalo@gmail.com', address: 'Sampaguita 3A, Makati', emergency: '' },
    { id: 'T5', userId: null, name: 'Mika Tan', phone: '0999 555 0011', email: 'mika.tan@gmail.com', address: 'Sampaguita 1C, Makati', emergency: '' },
    { id: 'T6', userId: null, name: 'Ramon Cruz', phone: '0918 555 0505', email: 'ramon.cruz@gmail.com', address: 'Acacia Lofts 5, Pasig', emergency: '' },
    { id: 'T7', userId: null, name: 'Paolo Garcia', phone: '0927 555 0202', email: 'paolo.garcia@gmail.com', address: 'Acacia Lofts 2, Pasig', emergency: '' }
  ],
  leases: [
    { id: 'LS-031', tenantId: 'T1', unitId: 'UN1', start: '2026-04-01', end: '2027-03-31', months: 12, rent: 4000, deposit: 8000, status: 'Active', notes: '' },
    { id: 'LS-024', tenantId: 'T2', unitId: 'UN2', start: '2026-01-15', end: '2027-01-14', months: 12, rent: 5100, deposit: 10200, status: 'Active', notes: '' },
    { id: 'LS-036', tenantId: 'T3', unitId: 'UN4', start: '2026-06-01', end: '2027-05-31', months: 12, rent: 5000, deposit: 10000, status: 'Active', notes: '' },
    { id: 'LS-019', tenantId: 'T4', unitId: 'UN5', start: '2026-01-01', end: '2026-12-31', months: 12, rent: 6200, deposit: 12400, status: 'Active', notes: '' },
    { id: 'LS-041', tenantId: 'T5', unitId: 'UN6', start: '2026-09-01', end: '2027-02-28', months: 6, rent: 4800, deposit: 9600, status: 'Active', notes: '' },
    { id: 'LS-012', tenantId: 'T6', unitId: 'UN7', start: '2025-12-16', end: '2026-12-15', months: 12, rent: 4650, deposit: 9300, status: 'Active', notes: 'Tenant asked about renewal.' },
    { id: 'LS-028', tenantId: 'T7', unitId: 'UN8', start: '2026-03-01', end: '2027-02-28', months: 12, rent: 4500, deposit: 9000, status: 'Active', notes: '' }
  ],
  bills: [
    { id: 'BL-2026-11-0042', leaseId: 'LS-031', period: '2026-11', issue: '2026-11-01', due: '2026-11-28', items: [
      { id: 'I1', type: 'Rent', desc: 'Monthly rent', amount: 4000, note: 'Nov 2026 · per lease LS-031' },
      { id: 'I2', type: 'Electricity', desc: 'Electricity', amount: 500, note: 'Meter 18,442 → 18,489 kWh' },
      { id: 'I3', type: 'Water', desc: 'Water', amount: 200, note: 'Meter 1,204 → 1,215 m³' },
      { id: 'I4', type: 'Internet', desc: 'Internet', amount: 300, note: 'Building fiber · Nov' },
      { id: 'I5', type: 'Parking', desc: 'Parking', amount: 500, note: 'Slot P-12' },
      { id: 'I6', type: 'Maintenance', desc: 'Maintenance', amount: 150, note: 'Common-area upkeep' }
    ], log: [
      { at: '2026-11-01T07:58:00', text: 'Bill generated from lease LS-031', by: 'Maria Santos', tone: '' },
      { at: '2026-11-01T08:00:00', text: 'Bill published, tenant notified', by: 'Maria Santos', tone: '' },
      { at: '2026-11-15T16:02:00', text: 'Payment of ₱3,000.00 verified and allocated', by: 'Maria Santos', tone: 'green' },
      { at: '2026-11-23T21:14:00', text: 'Payment of ₱2,650.00 submitted by tenant', by: 'Carlo Dizon', tone: 'amber' }
    ] },
    { id: 'BL-2026-11-0043', leaseId: 'LS-024', period: '2026-11', issue: '2026-11-01', due: '2026-11-10', items: [
      { id: 'I1', type: 'Rent', desc: 'Monthly rent', amount: 5100, note: 'Nov 2026' }
    ], log: [] },
    { id: 'BL-2026-11-0044', leaseId: 'LS-036', period: '2026-11', issue: '2026-11-01', due: '2026-11-25', items: [
      { id: 'I1', type: 'Rent', desc: 'Monthly rent', amount: 5000, note: 'Nov 2026' },
      { id: 'I2', type: 'Electricity', desc: 'Electricity', amount: 450, note: '' },
      { id: 'I3', type: 'Water', desc: 'Water', amount: 300, note: '' }
    ], log: [] },
    { id: 'BL-2026-11-0045', leaseId: 'LS-019', period: '2026-11', issue: '2026-11-01', due: '2026-11-20', items: [
      { id: 'I1', type: 'Rent', desc: 'Monthly rent', amount: 6200, note: 'Nov 2026' }
    ], log: [] },
    { id: 'BL-2026-11-0046', leaseId: 'LS-041', period: '2026-11', issue: '2026-11-01', due: '2026-11-30', items: [
      { id: 'I1', type: 'Rent', desc: 'Monthly rent', amount: 4800, note: 'Nov 2026' },
      { id: 'I2', type: 'Electricity', desc: 'Electricity', amount: 800, note: '' },
      { id: 'I3', type: 'Water', desc: 'Water', amount: 150, note: '' }
    ], log: [] },
    { id: 'BL-2026-11-0047', leaseId: 'LS-012', period: '2026-11', issue: '2026-11-01', due: '2026-11-15', items: [
      { id: 'I1', type: 'Rent', desc: 'Monthly rent', amount: 4650, note: 'Nov 2026' }
    ], log: [] },
    { id: 'BL-2026-11-0048', leaseId: 'LS-028', period: '2026-11', issue: '2026-11-01', due: '2026-11-15', items: [
      { id: 'I1', type: 'Rent', desc: 'Monthly rent', amount: 4500, note: 'Nov 2026' },
      { id: 'I2', type: 'Parking', desc: 'Parking', amount: 500, note: 'Slot A-2' }
    ], log: [] }
  ],
  payments: [
    { id: 'PY-1174', tenantId: 'T1', amount: 3000, date: '2026-11-15', method: 'Cash', ref: 'OR-1174', status: 'Verified', note: '', proof: '', reviewedBy: 'Maria Santos' },
    { id: 'PY-1190', tenantId: 'T1', amount: 2650, date: '2026-11-23', method: 'Bank transfer', ref: 'BDO-88213', status: 'Pending Verification', note: 'Balance for November', proof: 'bdo-transfer-receipt.jpg' },
    { id: 'PY-1191', tenantId: 'T3', amount: 5750, date: '2026-11-24', method: 'GCash', ref: '7712 4409', status: 'Pending Verification', note: '', proof: 'gcash-screenshot.png' },
    { id: 'PY-1182', tenantId: 'T4', amount: 6200, date: '2026-11-19', method: 'Cash', ref: 'OR-1182', status: 'Verified', note: '', proof: '', reviewedBy: 'Maria Santos' },
    { id: 'PY-1171', tenantId: 'T6', amount: 4650, date: '2026-11-14', method: 'GCash', ref: '7709 1123', status: 'Verified', note: '', proof: 'gcash.png', reviewedBy: 'Maria Santos' },
    { id: 'PY-1169', tenantId: 'T7', amount: 2250, date: '2026-11-12', method: 'GCash', ref: '7701 8830', status: 'Verified', note: 'Half now, half next week', proof: 'gcash.png', reviewedBy: 'Maria Santos' },
    { id: 'PY-1185', tenantId: 'T2', amount: 5100, date: '2026-11-20', method: 'Bank transfer', ref: 'BPI-55190', status: 'Rejected', note: '', proof: 'bpi.jpg', reviewedBy: 'Maria Santos', reason: 'Reference number not found in bank statement.' }
  ],
  allocations: [
    { paymentId: 'PY-1174', billId: 'BL-2026-11-0042', amount: 3000 },
    { paymentId: 'PY-1190', billId: 'BL-2026-11-0042', amount: 2650 },
    { paymentId: 'PY-1191', billId: 'BL-2026-11-0044', amount: 5750 },
    { paymentId: 'PY-1182', billId: 'BL-2026-11-0045', amount: 6200 },
    { paymentId: 'PY-1171', billId: 'BL-2026-11-0047', amount: 4650 },
    { paymentId: 'PY-1169', billId: 'BL-2026-11-0048', amount: 2250 },
    { paymentId: 'PY-1185', billId: 'BL-2026-11-0043', amount: 5100 }
  ],
  concerns: [
    { id: 'CN-0188', tenantId: 'T1', unitId: 'UN1', title: 'Wi-Fi drops every evening', category: 'Internet', status: 'In Progress', assignedTo: 'U-M1', created: '2026-11-22T20:41:00', attachment: 'router-lights.jpg' },
    { id: 'CN-0190', tenantId: 'T3', unitId: 'UN4', title: 'Low water pressure in bathroom', category: 'Water', status: 'Pending', assignedTo: null, created: '2026-11-24T10:05:00', attachment: '' },
    { id: 'CN-0186', tenantId: 'T6', unitId: 'UN7', title: 'Leaking sink pipe', category: 'Plumbing', status: 'In Progress', assignedTo: 'U-M1', created: '2026-11-21T08:30:00', attachment: 'sink.jpg' },
    { id: 'CN-0184', tenantId: 'T7', unitId: 'UN8', title: 'Hallway light not working', category: 'Facility', status: 'Acknowledged', assignedTo: 'U-M1', created: '2026-11-20T19:12:00', attachment: '' },
    { id: 'CN-0179', tenantId: 'T1', unitId: 'UN1', title: 'Bathroom door lock is loose', category: 'Room/Unit Maintenance', status: 'Resolved', assignedTo: 'U-M1', created: '2026-10-30T09:00:00', attachment: '' }
  ],
  messages: [
    { id: 'M1', concernId: 'CN-0188', senderId: 'U-T1', text: 'The Wi-Fi disconnects almost every night between 7 and 11 PM. The router light turns orange. I work from home, so this is urgent.', at: '2026-11-22T20:41:00', attachment: 'router-lights.jpg' },
    { id: 'M2', concernId: 'CN-0188', senderId: 'system', text: 'Status changed to Acknowledged', at: '2026-11-23T09:00:00' },
    { id: 'M3', concernId: 'CN-0188', senderId: 'U-M1', text: 'Thanks, Carlo. Can you tell us if other devices drop too, or only your laptop?', at: '2026-11-23T09:05:00' },
    { id: 'M4', concernId: 'CN-0188', senderId: 'U-T1', text: 'All devices: my phone and TV too.', at: '2026-11-23T10:12:00' },
    { id: 'M5', concernId: 'CN-0188', senderId: 'system', text: 'Status changed to In Progress', at: '2026-11-24T08:30:00' },
    { id: 'M6', concernId: 'CN-0188', senderId: 'U-M1', text: 'Our ISP technician will check the building line on Nov 25, 2–4 PM. Please be home so they can test the router in your unit.', at: '2026-11-24T08:32:00' },
    { id: 'M7', concernId: 'CN-0190', senderId: 'T3', text: 'Water pressure in the bathroom has been very weak since yesterday morning.', at: '2026-11-24T10:05:00' },
    { id: 'M8', concernId: 'CN-0186', senderId: 'T6', text: 'The pipe under the kitchen sink is dripping. I put a basin under it for now.', at: '2026-11-21T08:30:00' },
    { id: 'M9', concernId: 'CN-0186', senderId: 'U-M1', text: 'Plumber is scheduled for Nov 26 morning.', at: '2026-11-22T11:00:00' },
    { id: 'M10', concernId: 'CN-0184', senderId: 'T7', text: 'The 2nd floor hallway light near Loft 2 is out.', at: '2026-11-20T19:12:00' },
    { id: 'M11', concernId: 'CN-0179', senderId: 'U-T1', text: 'The bathroom door lock is loose and sometimes does not latch.', at: '2026-10-30T09:00:00' },
    { id: 'M12', concernId: 'CN-0179', senderId: 'U-M1', text: 'Fixed by our handyman today. Let us know if it happens again.', at: '2026-11-02T15:20:00' },
    { id: 'M13', concernId: 'CN-0179', senderId: 'system', text: 'Status changed to Resolved', at: '2026-11-02T15:21:00' }
  ],
  announcements: [
    { id: 'AN-14', createdBy: 'U-M1', title: 'Scheduled water interruption, Nov 26', body: 'Water will be off from 9:00 AM to 3:00 PM for tank cleaning at Narra Court. Please store water the night before.', category: 'Maintenance', priority: 'High', publish: '2026-11-24', expiry: '2026-11-27', targets: { type: 'property', ids: ['P1'] } },
    { id: 'AN-13', createdBy: 'U-M1', title: 'November bills are out', body: 'November statements are now available in the tenant portal. Please settle on or before your due date and upload your proof of payment.', category: 'Payment Reminder', priority: 'Normal', publish: '2026-11-01', expiry: '', targets: { type: 'all', ids: [] } },
    { id: 'AN-12', createdBy: 'U-M1', title: 'Fire drill at Sampaguita Residences', body: 'A fire drill will be held on Nov 29 at 10:00 AM. Please follow the marshals to the assembly area.', category: 'General Update', priority: 'Normal', publish: '2026-11-22', expiry: '2026-11-29', targets: { type: 'property', ids: ['P2'] } }
  ],
  notifications: [
    { id: 'N1', userId: 'U-T1', title: 'New reply on your concern', message: 'Maria Santos replied to “Wi-Fi drops every evening”.', type: 'concern_reply', link: '/tenant/concerns/CN-0188', read: false, at: '2026-11-24T08:32:00' },
    { id: 'N2', userId: 'U-T1', title: 'New announcement', message: 'Scheduled water interruption, Nov 26', type: 'announcement', link: '/tenant/announcements', read: false, at: '2026-11-24T07:00:00' },
    { id: 'N3', userId: 'U-T1', title: 'Payment verified', message: 'Your ₱3,000.00 cash payment was verified.', type: 'payment_verified', link: '/tenant/bills/BL-2026-11-0042', read: true, at: '2026-11-15T16:02:00' },
    { id: 'N4', userId: 'U-M1', title: 'Payment awaiting verification', message: 'Joanna Reyes submitted ₱5,750.00 via GCash.', type: 'payment_submitted', link: '/admin/payments', read: false, at: '2026-11-24T11:20:00' },
    { id: 'N5', userId: 'U-M1', title: 'New concern', message: 'Low water pressure in bathroom · Sampaguita 2B', type: 'concern_new', link: '/admin/concerns/CN-0190', read: false, at: '2026-11-24T10:05:00' },
    { id: 'N6', userId: 'U-M1', title: 'Payment awaiting verification', message: 'Carlo Dizon submitted ₱2,650.00 via bank transfer.', type: 'payment_submitted', link: '/admin/billing/BL-2026-11-0042', read: false, at: '2026-11-23T21:14:00' },
    { id: 'N7', userId: 'U-M1', title: 'Contract expiring soon', message: 'Ramon Cruz · Acacia Lofts, Loft 5 ends Dec 15.', type: 'contract_expiring', link: '/admin/contracts', read: true, at: '2026-11-15T08:00:00' }
  ]
};

/* Seed earlier months (Jun–Oct) as fully paid rent-only bills so the
   collections chart and payment history are derived from real records. */
(function seedHistory() {
  const months = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
  const methods = ['GCash', 'Bank transfer', 'Cash'];
  db.leases.forEach((l, li) => months.forEach((m, mi) => {
    if (l.start > m + '-28') return;
    const billId = `BL-${m}-${l.id.slice(3)}`;
    const payId = `PY-${m.replace('-', '')}${l.id.slice(3)}`;
    const day = String(5 + ((mi + li) % 5)).padStart(2, '0');
    db.bills.push({ id: billId, leaseId: l.id, period: m, issue: m + '-01', due: m + '-10',
      items: [{ id: 'I1', type: 'Rent', desc: 'Monthly rent', amount: l.rent, note: monthLabel(m) }], log: [] });
    db.payments.push({ id: payId, tenantId: l.tenantId, amount: l.rent, date: `${m}-${day}`, method: methods[(mi + li) % 3],
      ref: 'REF-' + payId.slice(3), status: 'Verified', note: '', proof: '', reviewedBy: 'Maria Santos' });
    db.allocations.push({ paymentId: payId, billId, amount: l.rent });
  }));
})();

/* ---------------------------------------------------------
   3. Domain rules (from the handoff "Important Business Rules")
   --------------------------------------------------------- */
const byId = (list, id) => db[list].find((x) => x.id === id);
const userById = (id) => db.users.find((u) => u.id === id);
const unitLabel = (unitId) => { const u = byId('units', unitId); const p = u && byId('properties', u.propertyId); return u ? `${p.name} · ${u.name}` : '—'; };
const leaseOfBill = (b) => byId('leases', b.leaseId);
const tenantOfBill = (b) => byId('tenants', leaseOfBill(b).tenantId);

/** Bill money + status. Status is ALWAYS derived, never stored. */
function billCalc(b) {
  const total = b.items.reduce((s, i) => s + Number(i.amount), 0);
  const allocs = db.allocations.filter((a) => a.billId === b.id).map((a) => ({ ...a, payment: byId('payments', a.paymentId) }));
  const paid = allocs.filter((a) => a.payment.status === 'Verified').reduce((s, a) => s + a.amount, 0);
  const pending = allocs.filter((a) => a.payment.status === 'Pending Verification').reduce((s, a) => s + a.amount, 0);
  const balance = Math.max(0, +(total - paid).toFixed(2));
  let status;
  if (balance <= 0) status = 'Paid';
  else if (toDate(b.due) < TODAY) status = 'Overdue';          // due date passed AND balance remains
  else if (paid > 0) status = 'Partially Paid';
  else status = 'Unpaid';
  return { total, paid, pending, balance, status, allocs };
}

function leaseStatus(l) {
  if (l.status === 'Terminated') return 'Terminated';
  if (toDate(l.start) > TODAY) return 'Pending';
  const end = toDate(l.end);
  if (end < TODAY) return 'Expired';
  if (daysBetween(TODAY, end) <= 45) return 'Expiring Soon';
  return 'Active';
}

function remaining(l) {
  const days = daysBetween(TODAY, toDate(l.end));
  if (days < 0) return 'Ended';
  const months = Math.floor(days / 30.44);
  const rest = Math.round(days - months * 30.44);
  return months > 0 ? `${months} mo, ${rest} d left` : `${days} days left`;
}

function activeLeaseOfTenant(tenantId) {
  return db.leases.filter((l) => l.tenantId === tenantId && ['Active', 'Expiring Soon', 'Pending'].includes(leaseStatus(l)))
    .sort((a, b) => b.start.localeCompare(a.start))[0];
}

function senderOf(m) {
  if (m.senderId === 'system') return { name: 'System', role: 'system' };
  const u = userById(m.senderId);
  if (u) return { name: u.name, role: u.role, userId: u.id };
  const t = byId('tenants', m.senderId);
  return { name: t ? t.name : 'Tenant', role: 'tenant' };
}

function announcementTargetsTenant(a, tenantId) {
  if (a.targets.type === 'all') return true;
  if (a.targets.type === 'tenant') return a.targets.ids.includes(tenantId);
  const lease = activeLeaseOfTenant(tenantId);
  const unit = lease && byId('units', lease.unitId);
  return !!unit && a.targets.ids.includes(unit.propertyId);
}

function audienceLabel(a) {
  if (a.targets.type === 'all') return 'All tenants';
  if (a.targets.type === 'property') return a.targets.ids.map((id) => byId('properties', id).name).join(', ');
  return a.targets.ids.map((id) => byId('tenants', id).name).join(', ');
}

/* ---------------------------------------------------------
   4. Service layer — every screen talks to these, never to db directly.
      Replace bodies with fetch('/api/...') calls when the backend exists.
   --------------------------------------------------------- */
const services = {
  auth: {
    /** DEMO: simulates Google OAuth + backend verification. */
    async signInWithGoogle(scenario) {
      await wait(700);
      if (scenario === 'manager') return { user: db.users[0] };
      if (scenario === 'tenant') return { user: db.users[1] };
      if (scenario === 'domain') return { error: 'Only verified @gmail.com accounts can sign in. You used juan.cruz@company.ph.' };
      if (scenario === 'pending') return { pending: true, email: 'new.tenant@gmail.com' };
      return { error: 'Google sign-in was cancelled or failed. Please try again.' };
    }
  },

  async dashboard() {
    await wait();
    const units = db.units;
    const curBills = db.bills.filter((b) => b.period === CURRENT_PERIOD).map((b) => ({ b, c: billCalc(b) }));
    const count = (s) => curBills.filter((x) => x.c.status === s).length;
    const billed = curBills.reduce((s, x) => s + x.c.total, 0);
    const collected = curBills.reduce((s, x) => s + x.c.paid, 0);
    const outstanding = db.bills.reduce((s, b) => s + billCalc(b).balance, 0);
    const pendingPayments = db.payments.filter((p) => p.status === 'Pending Verification');
    const periods = [...new Set(db.bills.map((b) => b.period))].sort().slice(-6);
    const series = periods.map((p) => {
      const bills = db.bills.filter((b) => b.period === p).map(billCalc);
      return { label: monthShort(p), period: p, billed: bills.reduce((s, c) => s + c.total, 0), collected: bills.reduce((s, c) => s + c.paid, 0) };
    });
    return {
      kpi: {
        properties: db.properties.length,
        units: units.length,
        occupied: units.filter((u) => u.status === 'Occupied').length,
        available: units.filter((u) => u.status === 'Available').length,
        maintenance: units.filter((u) => u.status === 'Under Maintenance').length,
        tenants: db.tenants.filter((t) => activeLeaseOfTenant(t.id)).length,
        unlinked: db.tenants.filter((t) => !t.userId).length,
        paid: count('Paid'), partial: count('Partially Paid'), unpaid: count('Unpaid'), overdue: count('Overdue'),
        overdueAmount: curBills.filter((x) => x.c.status === 'Overdue').reduce((s, x) => s + x.c.balance, 0),
        bills: curBills.length, billed, collected, outstanding,
        pendingCount: pendingPayments.length,
        openConcerns: db.concerns.filter((c) => !['Resolved', 'Closed'].includes(c.status)).length,
        unassigned: db.concerns.filter((c) => !c.assignedTo && !['Resolved', 'Closed'].includes(c.status)).length
      },
      series,
      recentPayments: [...db.payments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
      dueBills: db.bills.map((b) => ({ b, c: billCalc(b) })).filter((x) => x.c.balance > 0).sort((a, b) => a.b.due.localeCompare(b.b.due)).slice(0, 5),
      expiring: db.leases.filter((l) => ['Expiring Soon', 'Pending'].includes(leaseStatus(l))).sort((a, b) => a.end.localeCompare(b.end)).slice(0, 5),
      concerns: [...db.concerns].sort((a, b) => b.created.localeCompare(a.created)).slice(0, 5)
    };
  },

  async properties() { await wait(); return db.properties; },
  async units() { await wait(); return db.units; },
  async tenants() { await wait(); return db.tenants; },
  async leases() { await wait(); return db.leases; },
  async bills() { await wait(); return db.bills; },
  async bill(id) { await wait(); return byId('bills', id); },
  async payments() { await wait(); return db.payments; },
  async concerns() { await wait(); return db.concerns; },
  async concern(id) { await wait(); return byId('concerns', id); },
  async announcements() { await wait(); return db.announcements; },
  async notifications(userId) { await wait(80); return db.notifications.filter((n) => n.userId === userId).sort((a, b) => b.at.localeCompare(a.at)); },

  async addBillItem(billId, item) {
    await wait();
    const b = byId('bills', billId);
    b.items.push({ id: uid('I'), ...item });
    b.log.push({ at: nowISO(), text: `Line item added: ${item.desc} (${peso(item.amount)})`, by: state.user.name, tone: '' });
  },
  async removeBillItem(billId, itemId) {
    await wait();
    const b = byId('bills', billId);
    const it = b.items.find((i) => i.id === itemId);
    b.items = b.items.filter((i) => i.id !== itemId);
    b.log.push({ at: nowISO(), text: `Line item removed: ${it.desc} (${peso(it.amount)})`, by: state.user.name, tone: 'red' });
  },
  /** Manager records a payment against one bill (allocation = min(amount, balance)). */
  async recordPayment(billId, p) {
    await wait();
    const b = byId('bills', billId);
    const tenant = tenantOfBill(b);
    const pay = { id: uid('PY'), tenantId: tenant.id, amount: p.amount, date: p.date, method: p.method, ref: p.ref, status: p.verified ? 'Verified' : 'Pending Verification', note: p.note, proof: '', reviewedBy: p.verified ? state.user.name : '' };
    db.payments.push(pay);
    db.allocations.push({ paymentId: pay.id, billId, amount: Math.min(p.amount, billCalc(b).balance) || p.amount });
    b.log.push({ at: nowISO(), text: `Payment of ${peso(p.amount)} recorded${p.verified ? ' and verified' : ''}`, by: state.user.name, tone: p.verified ? 'green' : 'amber' });
    if (p.verified) notifyTenant(tenant.id, 'Payment verified', `Your ${peso(p.amount)} payment was recorded and verified.`, `/tenant/bills/${billId}`);
  },
  async verifyPayment(paymentId) {
    await wait();
    const p = byId('payments', paymentId);
    p.status = 'Verified'; p.reviewedBy = state.user.name;
    db.allocations.filter((a) => a.paymentId === p.id).forEach((a) => {
      const b = byId('bills', a.billId);
      b.log.push({ at: nowISO(), text: `Payment of ${peso(a.amount)} verified and allocated · bill is now ${billCalc(b).status}`, by: state.user.name, tone: 'green' });
    });
    notifyTenant(p.tenantId, 'Payment verified', `Your ${peso(p.amount)} payment (${p.method}) was verified.`, '/tenant/payments');
  },
  async rejectPayment(paymentId, reason) {
    await wait();
    const p = byId('payments', paymentId);
    p.status = 'Rejected'; p.reviewedBy = state.user.name; p.reason = reason;
    db.allocations.filter((a) => a.paymentId === p.id).forEach((a) => {
      byId('bills', a.billId).log.push({ at: nowISO(), text: `Payment of ${peso(a.amount)} rejected: ${reason}`, by: state.user.name, tone: 'red' });
    });
    notifyTenant(p.tenantId, 'Payment rejected', `Your ${peso(p.amount)} payment was rejected: ${reason}`, '/tenant/payments');
  },
  async replyConcern(concernId, text) {
    await wait();
    const c = byId('concerns', concernId);
    db.messages.push({ id: uid('M'), concernId, senderId: state.user.id, text, at: nowISO() });
    if (state.user.role === 'manager') notifyTenant(c.tenantId, 'New reply on your concern', `${state.user.name} replied to “${c.title}”.`, `/tenant/concerns/${c.id}`);
    else notifyManagers('Tenant replied', `${byId('tenants', c.tenantId).name} replied on “${c.title}”.`, `/admin/concerns/${c.id}`);
  },
  async updateConcern(concernId, { status, assignedTo }) {
    await wait();
    const c = byId('concerns', concernId);
    if (assignedTo !== undefined && assignedTo !== (c.assignedTo || '')) {
      c.assignedTo = assignedTo || null;
      const who = assignedTo ? userById(assignedTo).name : 'nobody';
      db.messages.push({ id: uid('M'), concernId, senderId: 'system', text: `Assigned to ${who}`, at: nowISO() });
    }
    if (status && status !== c.status) {
      c.status = status;
      db.messages.push({ id: uid('M'), concernId, senderId: 'system', text: `Status changed to ${status}`, at: nowISO() });
      notifyTenant(c.tenantId, 'Concern status updated', `“${c.title}” is now ${status}.`, `/tenant/concerns/${c.id}`);
    }
  },
  async createConcern(tenantId, data) {
    await wait(300);
    const lease = activeLeaseOfTenant(tenantId);
    const id = 'CN-' + String(191 + db.concerns.length).padStart(4, '0');
    db.concerns.push({ id, tenantId, unitId: lease ? lease.unitId : null, title: data.title, category: data.category, status: 'Pending', assignedTo: null, created: nowISO(), attachment: data.attachment });
    db.messages.push({ id: uid('M'), concernId: id, senderId: state.user.id, text: data.description, at: nowISO(), attachment: data.attachment });
    notifyManagers('New concern', `${data.title} · ${lease ? unitLabel(lease.unitId) : ''}`, `/admin/concerns/${id}`);
    return id;
  },
  async publishAnnouncement(data) {
    await wait(300);
    const a = { id: uid('AN'), createdBy: state.user.id, ...data };
    db.announcements.unshift(a);
    let count = 0;
    if (data.publish <= isoDate(TODAY)) {
      db.tenants.filter((t) => announcementTargetsTenant(a, t.id)).forEach((t) => {
        count++;
        notifyTenant(t.id, 'New announcement', a.title, '/tenant/announcements');
      });
    }
    return count;
  },
  async markRead(id) { await wait(40); const n = byId('notifications', id); if (n) n.read = true; },
  async markAllRead(userId) { await wait(80); db.notifications.filter((n) => n.userId === userId).forEach((n) => { n.read = true; }); }
};

/* In-app notifications only go to tenants who have a linked account */
function notifyTenant(tenantId, title, message, link) {
  const t = byId('tenants', tenantId);
  if (!t || !t.userId) return;
  db.notifications.push({ id: uid('N'), userId: t.userId, title, message, type: 'info', link, read: false, at: nowISO() });
}
function notifyManagers(title, message, link) {
  db.users.filter((u) => u.role === 'manager').forEach((u) => db.notifications.push({ id: uid('N'), userId: u.id, title, message, type: 'info', link, read: false, at: nowISO() }));
}

/* ---------------------------------------------------------
   5. UI components
   --------------------------------------------------------- */
const TONES = {
  'Paid': ['green', 'check'], 'Verified': ['green', 'check'], 'Resolved': ['green', 'check'], 'Active': ['green', 'check'], 'Available': ['green', 'check'],
  'Partially Paid': ['amber', 'half'], 'Pending Verification': ['amber', 'clock'], 'Pending': ['amber', 'clock'], 'Expiring Soon': ['amber', 'clock'],
  'Unpaid': ['gray', 'circle'], 'Closed': ['gray', 'check'], 'Expired': ['gray', 'circle'], 'Under Maintenance': ['gray', 'gear'], 'Occupied': ['blue', 'user'],
  'Overdue': ['red', 'alert'], 'Rejected': ['red', 'x'], 'Terminated': ['red', 'x'],
  'In Progress': ['blue', 'arrow'], 'Acknowledged': ['blue', 'check']
};
const badge = (status) => { const [tone, ic] = TONES[status] || ['gray', 'circle']; return `<span class="badge ${tone}">${icon(ic, 14, 2.2)}${esc(status)}</span>`; };

const statCard = (label, value, sub = '', tone = '') =>
  `<div class="card stat"><div class="label">${esc(label)}</div><div class="value ${tone}">${esc(value)}</div><div class="sub">${esc(sub)}</div></div>`;

const emptyState = (title, text = '', action = '', ic = 'grid') =>
  `<div class="state"><div class="state-icon">${icon(ic, 26)}</div><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ''}${action}</div>`;

const errorState = (text) =>
  `<div class="card"><div class="state error"><div class="state-icon">${icon('alert', 26)}</div><h2>Something went wrong</h2><p>${esc(text)}</p><button class="btn btn-outline" data-action="reload">${icon('refresh')}Try again</button></div></div>`;

const loadingState = () =>
  `<div class="content" aria-busy="true"><span class="sr-only">Loading…</span><div class="skeleton"><div class="sk" style="height:110px"></div><div class="grid grid-2"><div class="sk" style="height:220px"></div><div class="sk" style="height:220px"></div></div><div class="sk" style="height:260px"></div></div></div>`;

/**
 * Table with client-side search/filter (data-row + data-f-*) and sortable headers.
 * cols: [{ label, cell(row) -> html, num?, sortValue?(row), cls? }]
 */
function dataTable({ cols, rows, rowAttrs = () => '', empty = ['No records yet', ''], minWidth = 680 }) {
  if (!rows.length) return emptyState(empty[0], empty[1], empty[2] || '', empty[3] || 'grid');
  const head = cols.map((c, i) => `<th scope="col" class="${c.num ? 'num-r' : ''}" ${c.sortValue ? 'aria-sort="none"' : ''}>${c.sortValue
    ? `<button type="button" class="th" data-action="sort" data-col="${i}">${esc(c.label)}${icon('sort', 14)}</button>`
    : `<span class="th">${esc(c.label)}</span>`}</th>`).join('');
  const body = rows.map((r) => `<tr ${rowAttrs(r)}>${cols.map((c, i) =>
    `<td data-label="${esc(c.label)}" class="${c.num ? 'num-r' : ''} ${c.cls || ''}" ${c.sortValue ? `data-sort="${esc(c.sortValue(r))}"` : ''}><div class="cv">${c.cell(r)}</div></td>`).join('')}</tr>`).join('');
  return `<div class="table-wrap"><table class="table" style="min-width:${minWidth}px"><thead><tr>${head}</tr></thead><tbody>${body}<tr data-nomatch hidden><td colspan="${cols.length}" class="nomatch">No records match your search or filters.</td></tr></tbody></table></div>`;
}

const searchBox = (placeholder) =>
  `<div class="search"><label class="sr-only" for="q">Search</label>${icon('search', 16)}<input id="q" type="search" placeholder="${esc(placeholder)}" data-filter="q" autocomplete="off"></div>`;
const filterSelect = (key, label, options) =>
  `<label class="inline">${esc(label)}<select data-filter="${key}"><option value="">All</option>${options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}">${esc(l)}</option>`; }).join('')}</select></label>`;

function field({ id, label, type = 'text', required = false, help = '', options = [], value = '', attrs = '' }) {
  const req = required ? '<span class="req" aria-hidden="true">*</span><span class="sr-only"> (required)</span>' : '';
  const desc = `aria-describedby="${help ? id + '-help ' : ''}${id}-err"`;
  let control;
  if (type === 'select') {
    control = `<select id="${id}" name="${id}" ${required ? 'required' : ''} ${desc} ${attrs}>${options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select>`;
  } else if (type === 'textarea') {
    control = `<textarea id="${id}" name="${id}" ${required ? 'required' : ''} ${desc} ${attrs}>${esc(value)}</textarea>`;
  } else {
    control = `<input id="${id}" name="${id}" type="${type}" value="${esc(value)}" ${required ? 'required' : ''} ${desc} ${attrs}>`;
  }
  return `<div class="field"><label for="${id}">${esc(label)}${req}</label>${control}${help ? `<p class="help" id="${id}-help">${help}</p>` : ''}<p class="error" id="${id}-err" hidden></p></div>`;
}

/** Validate a form. rules: { fieldId: (value, form) => errorMessage | '' } */
function validate(form, rules) {
  const errors = [];
  Object.entries(rules).forEach(([id, rule]) => {
    const el = form.elements[id];
    const msg = rule(el.type === 'checkbox' ? el.checked : el.value.trim(), form);
    const err = $(`#${id}-err`, form);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.hidden = !msg; err.innerHTML = msg ? `${icon('alert', 14, 2.2)}${esc(msg)}` : ''; }
    if (msg) shake(el);
    if (msg) errors.push({ id, msg, label: form.querySelector(`label[for="${id}"]`)?.textContent.replace('*', '').replace('(required)', '').trim() });
  });
  let summary = $('.error-summary', form);
  if (errors.length > 1) {
    if (!summary) { summary = document.createElement('div'); summary.className = 'error-summary'; summary.tabIndex = -1; summary.setAttribute('role', 'alert'); form.prepend(summary); }
    summary.innerHTML = `<strong>Please fix ${errors.length} problems:</strong><ul>${errors.map((e) => `<li><a href="#${e.id}" data-action="focus-field" data-id="${e.id}">${esc(e.label)}: ${esc(e.msg)}</a></li>`).join('')}</ul>`;
    summary.focus();
  } else {
    summary?.remove();
    if (errors.length) form.elements[errors[0].id].focus();
  }
  return errors.length === 0;
}

/** Shake an invalid field: x keyframes, 360ms (skipped for reduced motion). */
function shake(el) {
  if (!el || !el.animate || reduceMotion()) return;
  el.animate([0, -10, 10, -6, 6, -3, 3, 0].map((x) => ({ transform: `translateX(${x}px)` })), { duration: 360, easing: 'ease-out' });
}

/** Toast slides with transform (never animates left/bottom). */
function toast(msg, type = '') {
  const t = $('#toast');
  t.innerHTML = `${icon(type === 'error' ? 'alert' : 'check', 18, 2.2)}<span>${esc(msg)}</span>`;
  t.classList.toggle('error', type === 'error');
  requestAnimationFrame(() => t.classList.remove('is-hidden'));
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.add('is-hidden'), 3600);
}

function openDialog({ title, body, submit = 'Save', form, danger = false, ctx = {} }) {
  state.dialogCtx = ctx;
  state.lastFocus = document.activeElement;
  const root = $('#dialog-root');
  root.innerHTML = `<dialog class="dialog" aria-labelledby="dlg-title">
    <form class="dialog-form" data-form="${form}" novalidate>
      <header><h2 id="dlg-title">${esc(title)}</h2><button type="button" class="icon-btn plain" data-action="close-dialog" aria-label="Close dialog" data-tip="Close">${icon('x', 20)}</button></header>
      <div class="dialog-body">${body}</div>
      <footer><button type="button" class="btn btn-outline" data-action="close-dialog">Cancel</button><button type="submit" class="btn ${danger ? 'btn-danger' : 'btn-primary'}">${esc(submit)}</button></footer>
    </form></dialog>`;
  const dlg = $('dialog', root);
  dlg.addEventListener('close', () => { root.innerHTML = ''; state.lastFocus?.focus?.(); });
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeDialog(); });   // Esc animates out too
  dlg.showModal();
  ($('input, select, textarea', dlg) || $('[type=submit]', dlg)).focus();
}
function closeDialog() {
  const dlg = $('#dialog-root dialog');
  if (!dlg || dlg.classList.contains('closing')) return;
  if (reduceMotion()) return dlg.close();
  dlg.classList.add('closing');
  dlg.addEventListener('animationend', (e) => { if (e.target === dlg) dlg.close(); });
  setTimeout(() => dlg.open && dlg.close(), 260);   // safety net
}

const confirmDialog = (title, message, submit, form, ctx, danger = false) =>
  openDialog({ title, body: `<p>${message}</p>`, submit, form, ctx, danger });

/** Monthly collections: bars = collected, dashed line = billed. Accessible table fallback. */
function collectionsChart(series) {
  const W = 620, T = 18, B = 186, L = 56, R = 10;
  const max = Math.max(1, ...series.map((s) => Math.max(s.billed, s.collected)));
  const pow = 10 ** Math.floor(Math.log10(max));
  const top = Math.ceil(max / pow) * pow;
  const y = (v) => B - (v / top) * (B - T);
  const step = (W - L - R) / series.length;
  const bw = Math.min(46, step * 0.52);
  const cx = (i) => L + step * i + step / 2;
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => `<line x1="${L}" x2="${W - R}" y1="${y(top * f)}" y2="${y(top * f)}" class="${f ? 'ch-grid' : 'ch-axis'}"/><text x="${L - 8}" y="${y(top * f) + 4}" text-anchor="end" font-size="11" class="ch-label">${pesoShort(top * f)}</text>`).join('');
  const bars = series.map((s, i) => `<rect x="${cx(i) - bw / 2}" y="${y(s.collected)}" width="${bw}" height="${Math.max(0, B - y(s.collected))}" rx="4" class="ch-bar${s.period === CURRENT_PERIOD ? ' current' : ''}" style="animation-delay:${i * 60}ms"><title>${s.label}: collected ${peso(s.collected)} of ${peso(s.billed)}</title></rect>`).join('');
  const line = `<polyline points="${series.map((s, i) => `${cx(i)},${y(s.billed)}`).join(' ')}" fill="none" class="ch-line" stroke-width="2" stroke-dasharray="5 4"/>`;
  const labels = series.map((s, i) => `<text x="${cx(i)}" y="${B + 20}" text-anchor="middle" font-size="12" class="ch-label">${s.label}${s.period === CURRENT_PERIOD ? '*' : ''}</text>`).join('');
  const summary = series.map((s) => `${s.label} ${Math.round((s.collected / (s.billed || 1)) * 100)}%`).join(' · ');
  return `<div class="chart"><svg viewBox="0 0 ${W} 214" role="img" aria-label="Monthly collected versus billed amounts. Collection rate: ${summary}">${grid}${bars}${line}${labels}</svg></div>
    <p class="small muted" style="margin-top:8px">Collection rate: ${summary}. *Current month is still open.</p>
    <table class="sr-only"><caption>Monthly collections</caption><thead><tr><th>Month</th><th>Billed</th><th>Collected</th></tr></thead><tbody>${series.map((s) => `<tr><td>${s.label}</td><td>${peso(s.billed)}</td><td>${peso(s.collected)}</td></tr>`).join('')}</tbody></table>`;
}

/* ---------------------------------------------------------
   6. Views
   Each view returns { title, crumbs?, actions?, html } (or a Promise of it).
   --------------------------------------------------------- */
const state = { user: null, shell: false, authMode: 'signin', dialogCtx: {}, lastFocus: null, path: '', navCollapsed: false };
try { state.navCollapsed = localStorage.getItem('rms-nav') === '1'; } catch (e) { /* ignore */ }
try { const saved = sessionStorage.getItem('rms-user'); if (saved) state.user = db.users.find((u) => u.id === saved) || null; } catch (e) { /* storage unavailable */ }

const home = (u = state.user) => (u ? (u.role === 'tenant' ? '/tenant/dashboard' : '/admin/dashboard') : '/login');

/* ---------- Auth (card layout + rental scene) ---------- */
const BUILDING_SVG = (() => {
  // 3 × 5 windows; each lights up on its own rhythm (occupancy "coming alive")
  const wins = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
    const d = ((r * 3 + c) * 0.37 + (c * 1.3)) % 4.8;
    wins.push(`<rect class="win" x="${30 + c * 36}" y="${62 + r * 30}" width="22" height="18" rx="3" style="animation-delay:${d.toFixed(2)}s"/>`);
  }
  return `<svg viewBox="0 0 170 240" class="building-svg" aria-hidden="true">
    <rect class="b-shadow" x="10" y="226" width="150" height="10" rx="5"/>
    <path class="b-roof" d="M14 54 L85 14 L156 54 Z"/>
    <rect class="b-body" x="20" y="52" width="130" height="178" rx="6"/>
    ${wins.join('')}
    <rect class="b-door" x="70" y="200" width="30" height="30" rx="4"/>
    <circle class="b-knob" cx="94" cy="216" r="1.8"/>
    <g class="b-sign"><line x1="150" y1="118" x2="164" y2="118" class="b-bracket"/><line x1="160" y1="118" x2="160" y2="126" class="b-bracket"/>
      <g class="b-sign-board"><rect x="143" y="126" width="34" height="18" rx="3"/><text x="160" y="138.5" text-anchor="middle">RENT</text></g></g>
  </svg>`;
})();

const MASCOT_SVG = `<svg viewBox="0 0 96 96" class="mascot-svg" aria-hidden="true">
  <ellipse class="m-shadow" cx="48" cy="90" rx="26" ry="4"/>
  <g class="m-body-g">
    <path class="m-roof" d="M12 44 L48 12 L84 44" />
    <rect class="m-chimney" x="64" y="18" width="9" height="16" rx="2"/>
    <rect class="m-body" x="20" y="38" width="56" height="46" rx="12"/>
    <g class="m-eyes">
      <g class="m-eye" transform="translate(37 56)"><circle r="7.5" class="m-white"/><circle r="3.6" class="m-pupil"/></g>
      <g class="m-eye" transform="translate(59 56)"><circle r="7.5" class="m-white"/><circle r="3.6" class="m-pupil"/></g>
    </g>
    <g class="m-happy"><path d="M31 57 q6 -7 12 0" /><path d="M53 57 q6 -7 12 0" /></g>
    <circle class="m-blush" cx="28" cy="67" r="3.5"/><circle class="m-blush" cx="68" cy="67" r="3.5"/>
    <path class="m-mouth" d="M42 70 q6 5 12 0"/>
    <path class="m-frown" d="M42 73 q6 -5 12 0"/>
  </g>
</svg>`;

function viewLogin() {
  const signup = state.authMode === 'signup';
  return `<div class="auth2">
  <div class="auth-frame">
    <section class="auth-art">
      <div class="scene" aria-hidden="true">
        <div class="layer building" style="--depth:10">${BUILDING_SVG}</div>
        <div class="layer fc fc-main" style="--depth:22"><div class="fc-in" style="--i:0">
          <div class="fc-head"><span class="fc-ic">${icon('receipt', 15, 2)}</span><span>Rent collected</span><span class="fc-period">This month</span></div>
          <div class="fc-big"><span data-count="16100" data-prefix="₱">₱0</span><span class="fc-up">${icon('arrow', 12, 2.4)}12.4%</span></div>
          <svg class="spark" viewBox="0 0 220 64"><defs><linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2FD3A0" stop-opacity=".35"/><stop offset="1" stop-color="#2FD3A0" stop-opacity="0"/></linearGradient></defs>
            <path class="spark-area" d="M0 52 C20 50 30 44 45 46 S70 36 85 38 S110 30 125 32 S150 18 165 22 S195 8 220 6 L220 64 L0 64 Z" fill="url(#sparkFill)"/>
            <path class="spark-line" pathLength="1" d="M0 52 C20 50 30 44 45 46 S70 36 85 38 S110 30 125 32 S150 18 165 22 S195 8 220 6"/>
            <circle class="spark-dot" cx="220" cy="6" r="4"/></svg>
        </div></div>
        <div class="layer fc fc-pay" style="--depth:34"><div class="fc-in" style="--i:1">
          <span class="fc-av">${icon('check', 16, 2.6)}</span><div class="fc-txt"><b>Payment verified</b><small>Unit 104 · just now</small></div><b class="fc-amt">₱2,650</b>
        </div></div>
        <div class="layer fc fc-ring" style="--depth:28"><div class="fc-in" style="--i:2">
          <svg viewBox="0 0 44 44" class="ring"><circle class="ring-track" cx="22" cy="22" r="17"/><circle class="ring-val" cx="22" cy="22" r="17" pathLength="100"/></svg>
          <div class="fc-txt"><b data-count="92" data-suffix="%">0%</b><small>Occupancy</small></div>
        </div></div>
        <div class="layer fc fc-chip" style="--depth:40"><div class="fc-in" style="--i:3">
          <span class="fc-chip-ic">${icon('key', 14, 2.2)}</span>Lease renewed · Loft 5
        </div></div>
      </div>
      <div class="art-copy">
        <span class="eyebrow">With Rentwise you can</span>
        <h2>Effortlessly manage your rentals, tenants and payments in one place.</h2>
      </div>
    </section>

    <section class="auth-panel">
      <div class="auth-card">
        <img class="auth-logo logo-on-light" src="${BRAND.logo}" alt="${esc(BRAND.name)}" width="448" height="96">
        <img class="auth-logo logo-on-dark" src="${BRAND.logoLight}" alt="${esc(BRAND.name)}" width="448" height="96">
        <div class="auth-head">
          <div class="mascot" id="mascot">${MASCOT_SVG}</div>
          <div class="auth-viewport"><div class="auth-track ${signup ? 'signup' : ''}">
            <div class="auth-pane" id="pane-signin" role="tabpanel" aria-labelledby="tab-signin" ${signup ? 'inert' : ''}><h1>Welcome back</h1><p class="muted">Sign in to your portal.</p></div>
            <div class="auth-pane" id="pane-signup" role="tabpanel" aria-labelledby="tab-signup" ${signup ? '' : 'inert'}><h1>Create account</h1><p class="muted">Use the Gmail your office has on file.</p></div>
          </div></div>
        </div>
        <div class="tabs ${signup ? 'signup' : ''}" role="tablist" aria-label="Account">
          <button role="tab" id="tab-signin" aria-controls="pane-signin" aria-selected="${!signup}" data-action="auth-mode" data-mode="signin">Sign in</button>
          <button role="tab" id="tab-signup" aria-controls="pane-signup" aria-selected="${signup}" data-action="auth-mode" data-mode="signup">Create account</button>
        </div>
        <div id="auth-msg" role="alert"></div>
        <div class="auth-actions">
          <button class="google-btn" data-action="google-signin">${GOOGLE_G}<span id="google-label">${signup ? 'Sign up with Google' : 'Continue with Google'}</span></button>
          <p class="auth-note">${icon('lock', 13, 2)}Verified Gmail accounts only</p>
        </div>
        <div class="demo-row">
          <label for="demo-scenario"><span class="demo-dot" aria-hidden="true"></span>Demo</label>
          <select id="demo-scenario" aria-describedby="demo-hint">
            <option value="manager">Manager · Maria Santos</option>
            <option value="tenant">Tenant · Carlo Dizon</option>
            <option value="pending">Not linked yet</option>
            <option value="domain">Non-Gmail address</option>
            <option value="error">Google error</option>
          </select>
          <span id="demo-hint" class="sr-only">Demo mode: choose what the simulated Google sign-in returns.</span>
        </div>
      </div>
    </section>
  </div></div>`;
}

/* Sign-in page motion: count-ups, parallax depth, mascot eyes. */
function initAuthArt() {
  $$('.auth-art [data-count]').forEach((el, i) => {
    const target = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const fmt = (v) => pre + Math.round(v).toLocaleString('en-PH') + suf;
    if (reduceMotion()) { el.textContent = fmt(target); return; }
    const start = performance.now() + 450 + i * 150, dur = 1400;
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      el.textContent = fmt(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1 && document.body.contains(el)) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
const authPointer = { raf: 0, x: 0, y: 0 };
document.addEventListener('pointermove', (e) => {
  if (!$('.auth2') || reduceMotion()) return;
  authPointer.x = e.clientX; authPointer.y = e.clientY;
  if (authPointer.raf) return;
  authPointer.raf = requestAnimationFrame(() => {
    authPointer.raf = 0;
    const art = $('.auth-art');
    if (art) {
      const r = art.getBoundingClientRect();
      const mx = Math.max(-1, Math.min(1, ((authPointer.x - r.left) / r.width) * 2 - 1));
      const my = Math.max(-1, Math.min(1, ((authPointer.y - r.top) / r.height) * 2 - 1));
      art.style.setProperty('--mx', mx.toFixed(3));
      art.style.setProperty('--my', my.toFixed(3));
    }
    $$('#mascot .m-eye').forEach((eye) => {
      const r = eye.getBoundingClientRect();
      const dx = authPointer.x - (r.left + r.width / 2), dy = authPointer.y - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 160) * 3;
      eye.querySelector('.m-pupil').setAttribute('transform', `translate(${((dx / d) * k).toFixed(2)} ${((dy / d) * k).toFixed(2)})`);
    });
  });
});
function mascotMood(mood) {
  const m = $('#mascot');
  if (!m) return;
  m.classList.remove('is-happy', 'is-error', 'is-thinking');
  void m.offsetWidth;                          // restart the mood animation
  if (mood) m.classList.add('is-' + mood);
}

function viewAccessPending() {
  return `<div class="auth-panel" style="min-height:100vh;background:var(--bg)">
    <div class="card card-pad auth-card" style="width:min(480px,100%)">
      <div class="state-icon" style="width:52px;height:52px;border-radius:14px;background:var(--amber-bg);color:var(--amber-fg);display:grid;place-items:center">${icon('lock', 26)}</div>
      <h1>Your account is waiting for access</h1>
      <p class="muted">We verified <strong>new.tenant@gmail.com</strong>, but it isn’t linked to a tenant or staff record yet.</p>
      <ul class="muted" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px">
        <li>Tenants: ask your property office for an invitation or registration code.</li>
        <li>Staff: an administrator must invite this address.</li>
      </ul>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" data-action="logout">Back to sign in</button><a class="btn btn-outline" href="mailto:office@example.com">Contact the office</a></div>
    </div></div>`;
}

/* ---------- Admin / Manager ---------- */
async function adminDashboard() {
  const d = await services.dashboard();
  const k = d.kpi;
  const pct = (n) => (k.bills ? ((n / k.bills) * 100).toFixed(1) + '%' : '0%');
  const dist = [['Paid', k.paid, 'var(--green)'], ['Partially Paid', k.partial, 'var(--amber)'], ['Unpaid', k.unpaid, 'var(--gray)'], ['Overdue', k.overdue, 'var(--red)']];
  const rate = k.billed ? Math.round((k.collected / k.billed) * 100) : 0;
  return {
    title: 'Dashboard',
    crumbs: [['Overview · ' + monthLabel(CURRENT_PERIOD)]],
    actions: `<a class="btn btn-primary" href="#/admin/billing">${icon('plus', 18, 2)}<span class="btn-label">Generate bills</span></a>`,
    html: `<div class="content">
      <section class="grid grid-stats" aria-label="Key figures">
        <div class="card card-dark hero-stat row-span-2">
          <h2>Collections · ${monthLabel(CURRENT_PERIOD)}</h2>
          <div class="big">${peso(k.collected)}</div>
          <div class="small muted num">of ${peso(k.billed)} billed · ${rate}% collected</div>
          <div class="progress" role="img" aria-label="${rate}% of billed amount collected"><span style="width:${rate}%"></span></div>
          <div class="kv kv-top"><span class="muted">Outstanding (all bills)</span><span class="strong num">${peso(k.outstanding)}</span></div>
          <div class="kv"><span class="muted">Awaiting verification</span><a href="#/admin/payments" class="strong on-hero">${k.pendingCount} payments</a></div>
        </div>
        ${statCard('Properties', k.properties, 'Assigned to you')}
        ${statCard('Total units', k.units, `${k.maintenance} under maintenance`)}
        ${statCard('Occupied units', k.occupied, `${Math.round((k.occupied / k.units) * 100)}% occupancy`)}
        ${statCard('Available units', k.available, 'Ready to lease')}
        ${statCard('Active tenants', k.tenants, `${k.unlinked} without linked account`)}
        ${statCard('Paid bills', k.paid, `of ${k.bills} this month`, 'green')}
        ${statCard('Unpaid bills', k.unpaid, `+${k.partial} partially paid`)}
        ${statCard('Overdue bills', k.overdue, `${peso(k.overdueAmount)} past due`, k.overdue ? 'red' : '')}
      </section>

      <section class="grid grid-2">
        <div class="card card-pad span-2">
          <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:baseline;margin-bottom:12px"><h2>Monthly collections</h2>
            <div class="legend"><span><i class="swatch bar"></i>Collected</span><span><i class="swatch cur"></i>Current month</span><span><i class="dash"></i>Billed</span></div></div>
          ${collectionsChart(d.series)}
        </div>
        <div class="card card-pad" style="display:flex;flex-direction:column;gap:14px">
          <h2>Bill status · ${monthShort(CURRENT_PERIOD)}</h2>
          <div class="small muted num">${k.bills} bills issued</div>
          <div class="stack-bar" role="img" aria-label="${dist.map((x) => `${x[0]} ${x[1]}`).join(', ')}">${dist.map((x) => `<span style="width:${pct(x[1])};background:${x[2]}"></span>`).join('')}</div>
          ${dist.map((x) => `<div class="dist-row"><i class="swatch" style="background:${x[2]}"></i><span class="name">${badge(x[0])}</span><span class="strong num">${x[1]}</span><span class="pct">${pct(x[1])}</span></div>`).join('')}
          <a class="card-link" href="#/admin/reports" style="margin-top:auto">Open billing report →</a>
        </div>
      </section>

      <section class="card">
        <div class="card-head"><h2>Recent payments</h2><a class="card-link" href="#/admin/payments">View all payments</a></div>
        ${paymentsTable(d.recentPayments, { compact: true })}
      </section>

      <section class="grid grid-3">
        <div class="card card-pad"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px"><h2>Overdue &amp; due soon</h2><a class="card-link" href="#/admin/billing">View all</a></div>
          <ul class="list">${d.dueBills.map(({ b, c }) => `<li><a class="list-row" href="#/admin/billing/${b.id}"><div class="body"><div class="t">${esc(tenantOfBill(b).name)} · ${esc(unitLabel(leaseOfBill(b).unitId))}</div><div class="s">${peso(c.balance)} balance · due ${fmtShort(b.due)}</div></div>${badge(c.status)}</a></li>`).join('') || '<li class="muted small">Nothing outstanding.</li>'}</ul></div>
        <div class="card card-pad"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px"><h2>Contracts expiring soon</h2><a class="card-link" href="#/admin/contracts">View all</a></div>
          <ul class="list">${d.expiring.map((l) => `<li><a class="list-row" href="#/admin/contracts"><div class="body"><div class="t">${esc(byId('tenants', l.tenantId).name)} · ${esc(unitLabel(l.unitId))}</div><div class="s">Ends ${fmtShort(l.end)} · ${remaining(l)}</div></div>${badge(leaseStatus(l))}</a></li>`).join('') || '<li class="muted small">No contracts ending in the next 45 days.</li>'}</ul></div>
        <div class="card card-pad"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px"><h2>Newest concerns</h2><a class="card-link" href="#/admin/concerns">View all</a></div>
          <ul class="list">${d.concerns.map((c) => `<li><a class="list-row" href="#/admin/concerns/${c.id}"><div class="body"><div class="t">${esc(c.title)}</div><div class="s">${esc(c.category)} · ${esc(unitLabel(c.unitId))} · ${fmtShort(c.created)}</div></div>${badge(c.status)}</a></li>`).join('')}</ul></div>
      </section>
    </div>`
  };
}

function paymentsTable(list, { compact = false } = {}) {
  const cols = [
    { label: 'Tenant', cell: (p) => `<span class="t-strong">${esc(byId('tenants', p.tenantId).name)}</span>`, sortValue: (p) => byId('tenants', p.tenantId).name },
    { label: 'Bill', cell: (p) => db.allocations.filter((a) => a.paymentId === p.id).map((a) => `<a href="#/admin/billing/${a.billId}">${esc(a.billId)}</a>`).join('<br>') || '<span class="t-muted">Unallocated</span>' },
    { label: 'Method · Ref', cell: (p) => `<span class="t-muted">${esc(p.method)} · ${esc(p.ref)}</span>` },
    { label: 'Date', cell: (p) => `<span class="num t-muted">${fmtShort(p.date)}</span>`, sortValue: (p) => p.date },
    { label: 'Amount', num: true, cell: (p) => `<span class="t-strong">${peso(p.amount)}</span>`, sortValue: (p) => p.amount },
    { label: 'Status', cell: (p) => badge(p.status) + (p.reason ? `<div class="small muted" style="margin-top:4px">${esc(p.reason)}</div>` : '') }
  ];
  if (!compact) cols.push({ label: 'Actions', num: true, cell: (p) => p.status === 'Pending Verification'
    ? `<div class="actions"><button class="btn btn-danger-outline btn-sm" data-action="reject-payment" data-id="${p.id}">Reject</button><button class="btn btn-primary btn-sm" data-action="verify-payment" data-id="${p.id}">Verify</button></div>`
    : `<span class="small muted">${p.reviewedBy ? 'by ' + esc(p.reviewedBy) : ''}</span>` });
  return dataTable({ cols, rows: list, minWidth: compact ? 720 : 900,
    rowAttrs: (p) => `data-row data-search="${esc((byId('tenants', p.tenantId).name + ' ' + p.ref + ' ' + p.method).toLowerCase())}" data-f-status="${esc(p.status)}"`,
    empty: ['No payments yet', 'Recorded and submitted payments will appear here.', '', 'card'] });
}

async function adminProperties() {
  const props = await services.properties();
  return {
    title: 'Properties',
    actions: `<button class="btn btn-primary" data-action="todo" data-what="Create property">${icon('plus', 18, 2)}<span class="btn-label">Add property</span></button>`,
    html: `<div class="content"><div class="grid grid-3">${props.map((p) => {
      const units = db.units.filter((u) => u.propertyId === p.id);
      const occ = units.filter((u) => u.status === 'Occupied').length;
      const rate = units.length ? Math.round((occ / units.length) * 100) : 0;
      return `<article class="card card-pad" style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;gap:12px;align-items:center"><div style="width:40px;height:40px;border-radius:10px;background:var(--chip);color:var(--chip-fg);display:grid;place-items:center;flex:none">${icon('building', 20)}</div><div><h2>${esc(p.name)}</h2><div class="small muted">${esc(p.address)}</div></div></div>
        <p class="small muted">${esc(p.description)}</p>
        <div><div style="display:flex;justify-content:space-between" class="small"><span>Occupancy</span><span class="strong num">${occ}/${units.length} · ${rate}%</span></div>
          <div class="progress light" style="margin-top:6px" role="img" aria-label="${rate}% occupied"><span style="width:${rate}%"></span></div></div>
        <ul class="list">${units.map((u) => `<li class="list-row"><div class="body"><div class="t">Unit ${esc(u.name)}</div><div class="s">${esc(u.type)} · ${peso(u.rent)}/mo</div></div>${badge(u.status)}</li>`).join('')}</ul>
      </article>`;
    }).join('')}</div></div>`
  };
}

async function adminUnits() {
  const units = await services.units();
  return {
    title: 'Units / Spaces',
    actions: `<button class="btn btn-primary" data-action="todo" data-what="Add unit">${icon('plus', 18, 2)}<span class="btn-label">Add unit</span></button>`,
    html: `<div class="content"><section class="card" data-filterable>
      <div class="toolbar">${searchBox('Search unit or type')}${filterSelect('property', 'Property', db.properties.map((p) => [p.id, p.name]))}${filterSelect('status', 'Status', ['Available', 'Occupied', 'Under Maintenance'])}</div>
      ${dataTable({ cols: [
        { label: 'Unit', cell: (u) => `<span class="t-strong">${esc(u.name)}</span>`, sortValue: (u) => u.name },
        { label: 'Property', cell: (u) => esc(byId('properties', u.propertyId).name), sortValue: (u) => byId('properties', u.propertyId).name },
        { label: 'Type', cell: (u) => `<span class="t-muted">${esc(u.type)}</span>` },
        { label: 'Monthly rent', num: true, cell: (u) => peso(u.rent), sortValue: (u) => u.rent },
        { label: 'Current tenant', cell: (u) => { const l = db.leases.find((x) => x.unitId === u.id && ['Active', 'Expiring Soon'].includes(leaseStatus(x))); return l ? esc(byId('tenants', l.tenantId).name) : '<span class="t-muted">—</span>'; } },
        { label: 'Status', cell: (u) => badge(u.status) }
      ], rows: units, rowAttrs: (u) => `data-row data-search="${esc((u.name + ' ' + u.type).toLowerCase())}" data-f-property="${u.propertyId}" data-f-status="${esc(u.status)}"` })}
    </section></div>`
  };
}

async function adminTenants() {
  const tenants = await services.tenants();
  return {
    title: 'Tenants',
    actions: `<button class="btn btn-primary" data-action="todo" data-what="Create tenant">${icon('plus', 18, 2)}<span class="btn-label">Add tenant</span></button>`,
    html: `<div class="content"><section class="card" data-filterable>
      <div class="toolbar">${searchBox('Search name, email or phone')}${filterSelect('account', 'Account', [['linked', 'Linked'], ['unlinked', 'Not linked']])}</div>
      ${dataTable({ cols: [
        { label: 'Tenant', cell: (t) => `<div style="display:flex;gap:10px;align-items:center"><span class="avatar">${initials(t.name)}</span><span class="t-strong">${esc(t.name)}</span></div>`, sortValue: (t) => t.name },
        { label: 'Contact', cell: (t) => `<div class="small">${esc(t.phone)}</div><div class="small t-muted">${esc(t.email)}</div>` },
        { label: 'Current unit', cell: (t) => { const l = activeLeaseOfTenant(t.id); return l ? esc(unitLabel(l.unitId)) : '<span class="t-muted">—</span>'; } },
        { label: 'Balance', num: true, cell: (t) => { const bal = db.bills.filter((b) => tenantOfBill(b).id === t.id).reduce((s, b) => s + billCalc(b).balance, 0); return bal ? `<span class="t-strong">${peso(bal)}</span>` : '<span class="t-muted">₱0.00</span>'; }, sortValue: (t) => db.bills.filter((b) => tenantOfBill(b).id === t.id).reduce((s, b) => s + billCalc(b).balance, 0) },
        { label: 'Google account', cell: (t) => t.userId ? badge('Active') : `<button class="btn btn-ghost btn-sm" data-action="todo" data-what="Send invitation to ${esc(t.email)}">Send invite</button>` }
      ], rows: tenants, rowAttrs: (t) => `data-row data-search="${esc((t.name + ' ' + t.email + ' ' + t.phone).toLowerCase())}" data-f-account="${t.userId ? 'linked' : 'unlinked'}"` })}
    </section></div>`
  };
}

async function adminContracts() {
  const leases = await services.leases();
  return {
    title: 'Contracts',
    actions: `<button class="btn btn-primary" data-action="todo" data-what="Create contract">${icon('plus', 18, 2)}<span class="btn-label">New contract</span></button>`,
    html: `<div class="content"><section class="card" data-filterable>
      <div class="toolbar">${searchBox('Search tenant or unit')}${filterSelect('status', 'Status', ['Pending', 'Active', 'Expiring Soon', 'Expired', 'Terminated'])}</div>
      ${dataTable({ cols: [
        { label: 'Lease', cell: (l) => `<span class="t-strong">${esc(l.id)}</span>` },
        { label: 'Tenant', cell: (l) => esc(byId('tenants', l.tenantId).name), sortValue: (l) => byId('tenants', l.tenantId).name },
        { label: 'Unit', cell: (l) => `<span class="t-muted">${esc(unitLabel(l.unitId))}</span>` },
        { label: 'Term', cell: (l) => `<span class="num small">${fmtDate(l.start)} – ${fmtDate(l.end)}</span><div class="small t-muted">${l.months} months · ${remaining(l)}</div>`, sortValue: (l) => l.end },
        { label: 'Rent', num: true, cell: (l) => peso(l.rent), sortValue: (l) => l.rent },
        { label: 'Deposit', num: true, cell: (l) => `<span class="t-muted">${peso(l.deposit)}</span>` },
        { label: 'Status', cell: (l) => badge(leaseStatus(l)) },
        { label: 'Actions', num: true, cell: (l) => `<div class="actions"><button class="btn btn-outline btn-sm" data-action="todo" data-what="Renew ${l.id} (creates a new lease record)">Renew</button></div>` }
      ], rows: [...leases].sort((a, b) => a.end.localeCompare(b.end)), minWidth: 980, rowAttrs: (l) => `data-row data-search="${esc((byId('tenants', l.tenantId).name + ' ' + unitLabel(l.unitId) + ' ' + l.id).toLowerCase())}" data-f-status="${esc(leaseStatus(l))}"` })}
      <div class="card-foot">Renewals create a new lease record; the old agreement stays in history. Overlapping active leases on one unit are blocked.</div>
    </section></div>`
  };
}

async function adminBilling() {
  const bills = (await services.bills()).map((b) => ({ b, c: billCalc(b) })).sort((x, y) => y.b.period.localeCompare(x.b.period) || x.b.due.localeCompare(y.b.due));
  return {
    title: 'Billing',
    actions: `<button class="btn btn-primary" data-action="todo" data-what="Generate December bills from active leases">${icon('plus', 18, 2)}<span class="btn-label">Generate bills</span></button>`,
    html: `<div class="content"><section class="card" data-filterable>
      <div class="toolbar">${searchBox('Search bill no. or tenant')}${filterSelect('period', 'Period', [...new Set(bills.map((x) => x.b.period))].map((p) => [p, monthLabel(p)]))}${filterSelect('status', 'Status', ['Paid', 'Partially Paid', 'Unpaid', 'Overdue'])}</div>
      ${dataTable({ cols: [
        { label: 'Bill', cell: ({ b }) => `<a class="row-link" href="#/admin/billing/${b.id}">${esc(b.id)}</a>` },
        { label: 'Tenant · Unit', cell: ({ b }) => `<div class="t-strong">${esc(tenantOfBill(b).name)}</div><div class="small t-muted">${esc(unitLabel(leaseOfBill(b).unitId))}</div>`, sortValue: ({ b }) => tenantOfBill(b).name },
        { label: 'Period', cell: ({ b }) => esc(monthLabel(b.period)), sortValue: ({ b }) => b.period },
        { label: 'Due', cell: ({ b }) => `<span class="num">${fmtShort(b.due)}</span>`, sortValue: ({ b }) => b.due },
        { label: 'Total', num: true, cell: ({ c }) => peso(c.total), sortValue: ({ c }) => c.total },
        { label: 'Paid', num: true, cell: ({ c }) => `<span class="t-muted">${peso(c.paid)}</span>`, sortValue: ({ c }) => c.paid },
        { label: 'Balance', num: true, cell: ({ c }) => `<span class="t-strong">${peso(c.balance)}</span>`, sortValue: ({ c }) => c.balance },
        { label: 'Status', cell: ({ c }) => badge(c.status) }
      ], rows: bills, minWidth: 960, rowAttrs: ({ b, c }) => `data-row data-search="${esc((b.id + ' ' + tenantOfBill(b).name).toLowerCase())}" data-f-period="${b.period}" data-f-status="${esc(c.status)}"` })}
    </section></div>`
  };
}

async function adminBillDetail({ id }) {
  const b = await services.bill(id);
  if (!b) return notFound('Bill not found', '/admin/billing');
  return billDetail(b, true);
}

/** Shared bill detail. Managers can edit items, record/verify payments; tenants read only. */
function billDetail(b, manage) {
  const c = billCalc(b);
  const lease = leaseOfBill(b);
  const tenant = tenantOfBill(b);
  const days = daysBetween(TODAY, toDate(b.due));
  const dueNote = c.balance <= 0 ? 'Fully paid. Thank you!'
    : c.status === 'Overdue' ? `Overdue by ${-days} day${-days === 1 ? '' : 's'}.`
    : days === 0 ? 'Due today.' : `Due in ${days} day${days === 1 ? '' : 's'}. Turns Overdue after ${fmtShort(b.due)} if a balance remains.`;
  const base = manage ? '/admin/billing' : '/tenant/bills';
  const itemCols = [
    { label: 'Description', cell: (i) => `<span class="t-strong">${esc(i.desc)}</span>` },
    { label: 'Category', cell: (i) => `<span class="tag ${i.type === 'Penalty' ? 'red' : ''}">${esc(i.type)}</span>` },
    { label: 'Period / notes', cell: (i) => `<span class="t-muted">${esc(i.note) || '—'}</span>` },
    { label: 'Amount', num: true, cell: (i) => peso(i.amount) }
  ];
  if (manage) itemCols.push({ label: 'Remove', num: true, cell: (i) => c.status === 'Paid' ? '' : `<button class="icon-btn plain" style="margin-left:auto" data-action="remove-item" data-bill="${b.id}" data-item="${i.id}" aria-label="Remove ${esc(i.desc)}" data-tip="Remove line item">${icon('trash', 18)}</button>` });

  const payRows = c.allocs.length ? c.allocs.map(({ payment: p, amount }) => {
    const tone = TONES[p.status][0];
    return `<div class="pay-row ${p.status === 'Pending Verification' ? 'pending' : ''}">
      <div class="ico badge ${tone}" style="padding:0">${icon(TONES[p.status][1], 20, 2)}</div>
      <div class="body"><div class="strong">${esc(p.method)} · ${esc(p.ref)}</div><div class="small muted num">Paid ${fmtDate(p.date)}${p.reviewedBy ? ` · reviewed by ${esc(p.reviewedBy)}` : ''}${p.proof ? ` · proof: ${esc(p.proof)}` : ''}${p.reason ? ` · ${esc(p.reason)}` : ''}</div></div>
      <div class="amt">${peso(amount)}</div>${badge(p.status)}
      ${manage && p.status === 'Pending Verification' ? `<div class="decide"><span class="note">Verifying moves this bill to <strong>${c.balance - amount <= 0 ? 'Paid' : 'Partially Paid'}</strong> (balance ${peso(Math.max(0, c.balance - amount))}).</span>
        <button class="btn btn-danger-outline btn-sm" data-action="reject-payment" data-id="${p.id}">Reject…</button><button class="btn btn-primary btn-sm" data-action="verify-payment" data-id="${p.id}">Verify &amp; allocate</button></div>` : ''}
    </div>`;
  }).join('') : emptyState('No payments yet', manage ? 'Record a payment when the tenant pays.' : 'Payments you make toward this bill will show here.', '', 'card');

  return {
    title: `Bill ${b.id}`,
    crumbs: manage ? [['Billing', '#/admin/billing'], [b.id]] : [['My Bills', '#/tenant/bills'], [b.id]],
    actions: `<button class="btn btn-outline no-print" data-action="print">${icon('print')}<span class="btn-label">Print statement</span></button>
      <button class="btn btn-outline no-print" data-action="todo" data-what="PDF download (needs backend PDF service)">${icon('download')}<span class="btn-label">Download PDF</span></button>
      ${manage && c.balance > 0 ? `<button class="btn btn-primary no-print" data-action="record-payment" data-id="${b.id}">${icon('plus', 18, 2)}<span class="btn-label">Record payment</span></button>` : ''}`,
    html: `<div class="content"><div class="split">
      <div class="primary">
        <section class="card" aria-labelledby="items-h">
          <div class="card-head"><div><h2 id="items-h">Charges ${badge(c.status)}</h2><div class="sub">Billing period ${monthLabel(b.period)}</div></div>
            ${manage && c.status !== 'Paid' ? `<button class="btn btn-dashed btn-sm no-print" data-action="add-item" data-id="${b.id}">${icon('plus', 16, 2)}Add line item</button>` : ''}</div>
          ${dataTable({ cols: itemCols, rows: b.items, minWidth: 560, empty: ['No charges', 'Add rent and utilities as line items.'] })}
          <div class="totals">
            <div class="line"><span class="muted">Total amount</span><span class="strong">${peso(c.total)}</span></div>
            <div class="line"><span class="muted">Amount paid (verified)</span><span class="strong" style="color:var(--green-fg)">− ${peso(c.paid)}</span></div>
            ${c.pending ? `<div class="line"><span class="muted">Awaiting verification</span><span style="color:var(--amber-fg)">${peso(c.pending)}</span></div>` : ''}
            <div class="line grand"><span>Outstanding balance</span><span>${peso(c.balance)}</span></div>
          </div>
          ${manage ? '<div class="card-foot">Penalties are never added automatically. Add a late fee as its own line item, and only where the lease allows it.</div>' : ''}
        </section>
        <section class="card" aria-labelledby="pay-h">
          <div class="card-head"><h2 id="pay-h">Payments allocated to this bill</h2></div>
          ${payRows}
        </section>
      </div>
      <aside class="aside">
        <section class="card card-pad" style="display:flex;flex-direction:column;gap:12px" aria-labelledby="bd-h">
          <h2 id="bd-h">Bill details</h2>
          <div style="display:flex;gap:12px;align-items:center"><span class="avatar lg">${initials(tenant.name)}</span><div><div class="strong">${esc(tenant.name)}</div><div class="small muted">${esc(unitLabel(lease.unitId))}</div></div></div>
          <dl class="dl">
            <dt>Lease</dt><dd>${esc(lease.id)} · ${esc(leaseStatus(lease))}</dd>
            <dt>Issue date</dt><dd>${fmtDate(b.issue)}</dd>
            <dt>Due date</dt><dd class="strong">${fmtDate(b.due)}</dd>
            <dt>Agreed rent</dt><dd>${peso(lease.rent)} / month</dd>
          </dl>
          <div class="callout ${c.status === 'Overdue' ? 'danger' : ''}">${dueNote}</div>
        </section>
        ${manage ? activityCard(b) : ''}
      </aside>
    </div></div>`
  };
}

/** Activity log: latest 3 visible, the rest expands with a height:auto transition. */
function activityCard(b) {
  const entries = b.log.length ? [...b.log].reverse() : [{ at: b.issue + 'T08:00:00', text: 'Bill generated and published', by: 'System', tone: '' }];
  const li = (e) => `<li><span class="tdot ${e.tone}"></span><div><div style="font-size:14px">${esc(e.text)}</div><div class="small muted num">${fmtDT(e.at)} · ${esc(e.by)}</div></div></li>`;
  const more = entries.slice(3);
  return `<section class="card card-pad" aria-labelledby="act-h"><h2 id="act-h" style="margin-bottom:12px">Activity</h2>
    <ol class="timeline">${entries.slice(0, 3).map(li).join('')}</ol>
    ${more.length ? `<div class="collapsible"><button type="button" class="disclosure" data-action="toggle-collapse" aria-expanded="false" aria-controls="act-more">Full history (${more.length} more)${icon('chevron', 16, 2)}</button>
      <div class="collapse" id="act-more"><div class="collapse-inner"><ol class="timeline">${more.map(li).join('')}</ol></div></div></div>` : ''}
  </section>`;
}

async function adminPayments() {
  const list = [...(await services.payments())].sort((a, b) => (a.status === 'Pending Verification' ? -1 : 0) - (b.status === 'Pending Verification' ? -1 : 0) || b.date.localeCompare(a.date));
  const pending = list.filter((p) => p.status === 'Pending Verification');
  return {
    title: 'Payments',
    html: `<div class="content">
      ${pending.length ? `<div class="callout warn" role="status">${pending.length} payment${pending.length > 1 ? 's' : ''} waiting for verification (${peso(pending.reduce((s, p) => s + p.amount, 0))}). Bills update as soon as you verify.</div>` : ''}
      <section class="card" data-filterable>
        <div class="toolbar">${searchBox('Search tenant, reference or method')}${filterSelect('status', 'Verification', ['Pending Verification', 'Verified', 'Rejected'])}</div>
        ${paymentsTable(list)}
      </section></div>`
  };
}

async function adminConcerns() {
  const list = [...(await services.concerns())].sort((a, b) => b.created.localeCompare(a.created));
  return {
    title: 'Concerns',
    html: `<div class="content"><section class="card" data-filterable>
      <div class="toolbar">${searchBox('Search concerns')}${filterSelect('property', 'Property', db.properties.map((p) => [p.id, p.name]))}${filterSelect('category', 'Category', CATEGORIES)}${filterSelect('status', 'Status', CONCERN_STATUSES)}</div>
      ${dataTable({ cols: [
        { label: 'Concern', cell: (c) => `<a class="row-link" href="#/admin/concerns/${c.id}">${esc(c.title)}</a><div class="small t-muted">${esc(c.id)}</div>` },
        { label: 'Tenant · Unit', cell: (c) => `<div>${esc(byId('tenants', c.tenantId).name)}</div><div class="small t-muted">${esc(unitLabel(c.unitId))}</div>` },
        { label: 'Category', cell: (c) => `<span class="tag">${esc(c.category)}</span>` },
        { label: 'Opened', cell: (c) => `<span class="num small">${fmtDT(c.created)}</span>`, sortValue: (c) => c.created },
        { label: 'Assigned', cell: (c) => c.assignedTo ? esc(userById(c.assignedTo).name) : '<span class="tag red">Unassigned</span>' },
        { label: 'Status', cell: (c) => badge(c.status) }
      ], rows: list, minWidth: 900, rowAttrs: (c) => `data-row data-search="${esc((c.title + ' ' + c.id + ' ' + byId('tenants', c.tenantId).name).toLowerCase())}" data-f-property="${byId('units', c.unitId)?.propertyId || ''}" data-f-category="${esc(c.category)}" data-f-status="${esc(c.status)}"`,
        empty: ['No concerns', 'Tenant concerns will appear here.', '', 'chat'] })}
    </section></div>`
  };
}

const CATEGORIES = ['Water', 'Electricity', 'Internet', 'Plumbing', 'Room/Unit Maintenance', 'Security', 'Noise', 'Facility', 'Other'];
const CONCERN_STATUSES = ['Pending', 'Acknowledged', 'In Progress', 'Resolved', 'Closed'];

/** Shared concern detail + thread. */
async function concernDetail({ id }) {
  const c = await services.concern(id);
  const manage = state.user.role === 'manager';
  if (!c || (!manage && c.tenantId !== state.user.tenantId)) return notFound('Concern not found', manage ? '/admin/concerns' : '/tenant/concerns');
  const tenant = byId('tenants', c.tenantId);
  const msgs = db.messages.filter((m) => m.concernId === c.id).sort((a, b) => a.at.localeCompare(b.at));
  const idx = CONCERN_STATUSES.indexOf(c.status);
  const thread = msgs.map((m) => {
    const s = senderOf(m);
    if (s.role === 'system') return `<div class="sys">${esc(m.text)} · ${fmtShort(m.at)}</div>`;
    const mine = manage ? s.role === 'manager' : s.role === 'tenant';
    return `<div class="msg ${mine ? 'me' : 'them'}"><div class="bubble">${esc(m.text)}</div>
      ${m.attachment ? `<div class="attachment">${icon('image', 22)}Photo: ${esc(m.attachment)}</div>` : ''}
      <div class="meta num">${mine && !manage ? 'You' : esc(s.name)}${s.role === 'manager' ? ' · Manager' : ''} · ${fmtDT(m.at)}</div></div>`;
  }).join('');
  const closed = ['Resolved', 'Closed'].includes(c.status);
  return {
    title: c.title,
    crumbs: manage ? [['Concerns', '#/admin/concerns'], [c.id]] : [['My Concerns', '#/tenant/concerns'], [c.id]],
    html: `<div class="content"><div class="split">
      <div class="primary"><section class="card">
        <div class="card-pad" style="display:flex;flex-direction:column;gap:12px;border-bottom:1px solid var(--line)">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${badge(c.status)}<span class="tag">${esc(c.category)}</span><span class="small muted">${esc(c.id)}</span></div>
          <ol class="stepper" aria-label="Progress: ${esc(c.status)}, step ${idx + 1} of 5">${CONCERN_STATUSES.map((s, i) => `<li class="${i <= idx ? 'done' : ''} ${i === idx ? 'current' : ''}">${s}</li>`).join('')}</ol>
        </div>
        <div class="thread" role="log" aria-label="Messages">${thread}</div>
        ${c.status === 'Closed' ? '<div class="card-foot">This concern is closed. Raise a new concern if the problem comes back.</div>' : `
        <form class="composer" data-form="reply" data-id="${c.id}" novalidate>
          ${field({ id: 'reply', label: manage ? `Reply to ${tenant.name}` : 'Reply to manager', type: 'textarea', attrs: 'rows="3" placeholder="Write a message…"' })}
          <div class="row">${!manage ? `<button type="button" class="btn btn-outline" data-action="todo" data-what="Photo upload (needs file storage)">${icon('image')}Add photo</button>` : ''}<button class="btn btn-primary" type="submit">Send</button></div>
        </form>`}
      </section></div>
      <aside class="aside">
        <section class="card card-pad" style="display:flex;flex-direction:column;gap:12px">
          <h2>Details</h2>
          <dl class="dl">
            <dt>Tenant</dt><dd>${esc(tenant.name)}</dd>
            <dt>Unit</dt><dd>${esc(unitLabel(c.unitId))}</dd>
            <dt>Opened</dt><dd>${fmtDT(c.created)}</dd>
            <dt>Assigned to</dt><dd>${c.assignedTo ? esc(userById(c.assignedTo).name) : 'Not yet assigned'}</dd>
          </dl>
          ${!manage && !closed ? '<div class="callout">You’ll get a notification when the manager replies or changes the status.</div>' : ''}
        </section>
        ${manage ? `<section class="card card-pad"><form class="form" data-form="concern-update" data-id="${c.id}" novalidate>
          <h2>Manage</h2>
          ${field({ id: 'c-status', label: 'Status', type: 'select', options: CONCERN_STATUSES, value: c.status })}
          ${field({ id: 'c-assign', label: 'Assign to', type: 'select', options: [['', 'Unassigned'], ...db.users.filter((u) => u.role === 'manager').map((u) => [u.id, u.name])], value: c.assignedTo || '' })}
          <button class="btn btn-primary" type="submit">Save changes</button>
          <p class="help">The tenant is notified when the status changes.</p>
        </form></section>` : ''}
      </aside>
    </div></div>`
  };
}

async function adminAnnouncements() {
  const list = await services.announcements();
  return {
    title: 'Announcements',
    actions: `<button class="btn btn-primary" data-action="new-announcement">${icon('plus', 18, 2)}<span class="btn-label">New announcement</span></button>`,
    html: `<div class="content"><div class="grid grid-3">${list.map((a) => announcementCard(a, true)).join('') || emptyState('No announcements yet', 'Publish one to notify tenants.', '', 'megaphone')}</div></div>`
  };
}

function announcementCard(a, manage) {
  const live = a.publish <= isoDate(TODAY) && (!a.expiry || a.expiry >= isoDate(TODAY));
  return `<article class="card announce">
    <div class="top"><span class="tag ${a.category === 'Emergency' ? 'red' : 'blue'}">${esc(a.category)}</span>${a.priority === 'High' ? `<span class="badge red">${icon('alert', 14, 2.2)}High priority</span>` : ''}${manage ? (live ? badge('Active') : a.publish > isoDate(TODAY) ? badge('Pending') : badge('Expired')) : ''}</div>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.body)}</p>
    <div class="foot"><span>${fmtDate(a.publish)}${a.expiry ? ' – ' + fmtDate(a.expiry) : ''}</span>${manage ? `<span>Audience: ${esc(audienceLabel(a))}</span>` : '<span>Property office</span>'}</div>
  </article>`;
}

async function adminReports() {
  await wait();
  const periods = [...new Set(db.bills.map((b) => b.period))].sort().reverse();
  const rows = periods.map((p) => { const cs = db.bills.filter((b) => b.period === p).map(billCalc); const billed = cs.reduce((s, c) => s + c.total, 0); const paid = cs.reduce((s, c) => s + c.paid, 0); return { p, n: cs.length, billed, paid, bal: billed - paid, rate: billed ? Math.round((paid / billed) * 100) : 0 }; });
  const statusCounts = ['Paid', 'Partially Paid', 'Unpaid', 'Overdue'].map((s) => [s, db.bills.filter((b) => billCalc(b).status === s).length]);
  const concernCounts = CONCERN_STATUSES.map((s) => [s, db.concerns.filter((c) => c.status === s).length]);
  return {
    title: 'Reports',
    actions: `<button class="btn btn-outline" data-action="todo" data-what="Excel export (needs backend support)">${icon('download')}<span class="btn-label">Export Excel</span></button><button class="btn btn-outline" data-action="todo" data-what="PDF export (needs backend support)">${icon('download')}<span class="btn-label">Export PDF</span></button>`,
    html: `<div class="content">
      <section class="card"><div class="card-head"><h2>Monthly collection report</h2></div>
        ${dataTable({ cols: [
          { label: 'Period', cell: (r) => `<span class="t-strong">${monthLabel(r.p)}</span>` },
          { label: 'Bills', num: true, cell: (r) => r.n },
          { label: 'Billed', num: true, cell: (r) => peso(r.billed) },
          { label: 'Collected', num: true, cell: (r) => peso(r.paid) },
          { label: 'Outstanding', num: true, cell: (r) => `<span class="t-strong">${peso(r.bal)}</span>` },
          { label: 'Rate', num: true, cell: (r) => r.rate + '%' }
        ], rows })}</section>
      <div class="grid grid-3">
        <section class="card card-pad"><h2 style="margin-bottom:10px">Bills by status (all periods)</h2>${statusCounts.map(([s, n]) => `<div class="dist-row" style="padding:6px 0">${badge(s)}<span class="name"></span><span class="strong num">${n}</span></div>`).join('')}</section>
        <section class="card card-pad"><h2 style="margin-bottom:10px">Occupancy by property</h2>${db.properties.map((p) => { const u = db.units.filter((x) => x.propertyId === p.id); const o = u.filter((x) => x.status === 'Occupied').length; return `<div style="padding:6px 0"><div class="dist-row"><span class="name">${esc(p.name)}</span><span class="strong num">${o}/${u.length}</span></div><div class="progress light" style="margin-top:6px"><span style="width:${Math.round((o / u.length) * 100)}%"></span></div></div>`; }).join('')}</section>
        <section class="card card-pad"><h2 style="margin-bottom:10px">Concern status summary</h2>${concernCounts.map(([s, n]) => `<div class="dist-row" style="padding:6px 0">${badge(s)}<span class="name"></span><span class="strong num">${n}</span></div>`).join('')}</section>
      </div></div>`
  };
}

async function notificationsView() {
  const list = await services.notifications(state.user.id);
  return {
    title: 'Notifications',
    actions: list.some((n) => !n.read) ? `<button class="btn btn-outline" data-action="mark-all-read">${icon('check')}<span class="btn-label">Mark all as read</span></button>` : '',
    html: `<div class="content"><section class="card">${list.length ? `<ul class="list">${list.map(notifItem).join('')}</ul>` : emptyState('You’re all caught up', 'New bills, payment updates, replies and announcements will show here.', '', 'bell')}</section></div>`
  };
}
const notifItem = (n) => `<li><a class="notif-item ${n.read ? '' : 'unread'}" href="#${n.link}" data-action="open-notif" data-id="${n.id}" data-link="${esc(n.link)}"><span class="dot" aria-hidden="true"></span><div style="flex:1;min-width:0"><div class="t">${esc(n.title)}${n.read ? '' : '<span class="sr-only"> (unread)</span>'}</div><div class="muted">${esc(n.message)}</div><div class="small muted num">${fmtDT(n.at)}</div></div></a></li>`;

async function settingsView() {
  await wait();
  const u = state.user;
  const t = u.tenantId ? byId('tenants', u.tenantId) : null;
  return {
    title: u.role === 'tenant' ? 'My Profile' : 'Settings',
    html: `<div class="content"><div class="grid grid-2">
      <section class="card card-pad" style="display:flex;flex-direction:column;gap:14px"><h2>Profile</h2>
        <div style="display:flex;gap:12px;align-items:center"><span class="avatar lg">${initials(u.name)}</span><div><div class="strong">${esc(u.name)}</div><div class="small muted">${esc(u.role === 'tenant' ? 'Tenant' : u.title)}</div></div></div>
        <dl class="dl"><dt>Google account</dt><dd>${esc(u.email)}</dd>${t ? `<dt>Phone</dt><dd>${esc(t.phone)}</dd><dt>Address</dt><dd>${esc(t.address)}</dd><dt>Emergency contact</dt><dd>${esc(t.emergency || '—')}</dd>` : `<dt>Properties</dt><dd>${u.propertyIds.map((id) => esc(byId('properties', id).name)).join(', ')}</dd>`}</dl>
        <div class="callout">Your sign-in is managed by Google. ${u.role === 'tenant' ? 'Ask the property office to update your contact details.' : ''}</div>
      </section>
      ${u.role === 'manager' ? `<section class="card card-pad" style="display:flex;flex-direction:column;gap:12px"><h2>Team &amp; access</h2><p class="small muted">Staff are invited by an administrator; public sign-up never grants staff access.</p>
        <ul class="list">${db.users.filter((x) => x.role === 'manager').map((x) => `<li class="list-row"><span class="avatar">${initials(x.name)}</span><div class="body"><div class="t">${esc(x.name)}</div><div class="s">${esc(x.email)} · ${x.propertyIds.length} properties</div></div>${badge('Active')}</li>`).join('')}</ul>
        <button class="btn btn-outline" data-action="todo" data-what="Invite staff member">${icon('plus')}Invite staff</button></section>` : ''}
    </div></div>`
  };
}

/* ---------- Tenant portal ---------- */
async function tenantDashboard() {
  await wait();
  const tid = state.user.tenantId;
  const lease = activeLeaseOfTenant(tid);
  const bills = db.bills.filter((b) => tenantOfBill(b).id === tid).sort((a, b) => b.period.localeCompare(a.period));
  const current = bills[0];
  const c = current ? billCalc(current) : null;
  const ann = db.announcements.filter((a) => announcementTargetsTenant(a, tid) && a.publish <= isoDate(TODAY)).sort((a, b) => b.publish.localeCompare(a.publish))[0];
  const concerns = db.concerns.filter((x) => x.tenantId === tid).sort((a, b) => b.created.localeCompare(a.created)).slice(0, 3);
  const payments = db.payments.filter((p) => p.tenantId === tid).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const paidPct = c && c.total ? Math.round((c.paid / c.total) * 100) : 0;
  return {
    title: `Hi, ${state.user.name.split(' ')[0]}`,
    crumbs: [[lease ? unitLabel(lease.unitId) : 'No active unit']],
    actions: `<a class="btn btn-primary" href="#/tenant/raise-concern">${icon('plus', 18, 2)}<span class="btn-label">Raise a concern</span></a>`,
    html: `<div class="content"><div class="grid grid-2">
      ${current ? `<section class="card card-dark card-pad span-2" style="display:flex;flex-wrap:wrap;gap:24px" aria-labelledby="bal-h">
        <div style="flex:1 1 280px;display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><h2 id="bal-h">Current balance · ${monthLabel(current.period)}</h2>${badge(c.status)}</div>
          <div class="num" style="font-size:38px;font-weight:700;letter-spacing:-.5px">${peso(c.balance)}</div>
          <div class="small muted num">Due ${fmtDate(current.due)} · ${peso(c.paid)} of ${peso(c.total)} paid</div>
          <div class="progress" style="max-width:420px" role="img" aria-label="${paidPct}% of this bill paid"><span style="width:${paidPct}%"></span></div>
          ${c.pending ? `<div class="callout on-hero">${icon('clock', 16, 2)}<span class="num">${peso(c.pending)} sent, waiting for verification</span></div>` : ''}
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px"><a class="btn btn-light" href="#/tenant/bills/${current.id}">View full bill</a><a class="btn btn-on-dark" href="#/tenant/payments">Payment history</a></div>
        </div>
        <div class="hero-inner" style="flex:1 1 260px">
          <div class="strong">This month’s charges</div>
          ${current.items.map((i) => `<div class="row"><span>${esc(i.desc)}</span><span>${peso(i.amount)}</span></div>`).join('')}
          <div class="row total"><span>Total</span><span>${peso(c.total)}</span></div>
        </div>
      </section>` : `<section class="card span-2">${emptyState('No bills yet', 'Your first bill will appear here once it is published.', '', 'receipt')}</section>`}

      <section class="card card-pad" style="display:flex;flex-direction:column;gap:14px" aria-labelledby="c-h">
        <div style="display:flex;justify-content:space-between;align-items:center"><h2 id="c-h">My contract</h2>${lease ? badge(leaseStatus(lease)) : ''}</div>
        ${lease ? `<dl class="dl"><dt>Unit</dt><dd>${esc(unitLabel(lease.unitId))}</dd><dt>Monthly rent</dt><dd class="strong">${peso(lease.rent)}</dd><dt>Start</dt><dd>${fmtDate(lease.start)}</dd><dt>End</dt><dd>${fmtDate(lease.end)}</dd></dl>
        <div class="callout num">${remaining(lease)}</div><a class="card-link" href="#/tenant/contract">See contract details →</a>` : '<p class="muted">No active contract.</p>'}
      </section>

      <section class="card card-pad" style="display:flex;flex-direction:column;gap:10px" aria-labelledby="an-h">
        <div style="display:flex;justify-content:space-between;align-items:center"><h2 id="an-h">Latest announcement</h2>${ann ? `<span class="tag blue">${esc(ann.category)}</span>` : ''}</div>
        ${ann ? `<h3>${esc(ann.title)}</h3><p class="muted" style="font-size:14px;line-height:1.55">${esc(ann.body)}</p><div class="small muted" style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><span>Posted ${fmtDate(ann.publish)}</span><a class="strong" href="#/tenant/announcements">All announcements</a></div>` : '<p class="muted">No announcements right now.</p>'}
      </section>

      <section class="card card-pad" aria-labelledby="cc-h">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><h2 id="cc-h">My concerns</h2><a class="card-link" href="#/tenant/concerns">View all</a></div>
        <ul class="list">${concerns.map((x) => `<li><a class="list-row" href="#/tenant/concerns/${x.id}"><div class="body"><div class="t">${esc(x.title)}</div><div class="s">${esc(x.category)} · ${fmtShort(x.created)}</div></div>${badge(x.status)}</a></li>`).join('') || '<li class="muted small">No concerns raised.</li>'}</ul>
      </section>

      <section class="card" aria-labelledby="p-h">
        <div class="card-head"><h2 id="p-h">Recent payments</h2><a class="card-link" href="#/tenant/payments">Payment history</a></div>
        <ul class="list" style="padding:0 20px">${payments.map((p) => `<li class="list-row"><div class="body"><div class="t num">${peso(p.amount)} · ${esc(p.method)}</div><div class="s">${fmtDate(p.date)} · ${esc(p.ref)}</div></div>${badge(p.status)}</li>`).join('')}</ul>
      </section>
    </div></div>`
  };
}

async function tenantContract() {
  await wait();
  const tid = state.user.tenantId;
  const leases = db.leases.filter((l) => l.tenantId === tid).sort((a, b) => b.start.localeCompare(a.start));
  const l = leases[0];
  if (!l) return { title: 'My Contract', html: `<div class="content"><section class="card">${emptyState('No contract yet', 'Your contract will appear here once the office creates it.', '', 'file')}</section></div>` };
  return {
    title: 'My Contract',
    actions: `<button class="btn btn-outline" data-action="todo" data-what="Contract file download (when the office uploads one)">${icon('download')}<span class="btn-label">Download contract</span></button>`,
    html: `<div class="content"><div class="grid grid-2">
      <section class="card card-pad" style="display:flex;flex-direction:column;gap:14px"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Lease ${esc(l.id)}</h2>${badge(leaseStatus(l))}</div>
        <dl class="dl"><dt>Property / unit</dt><dd>${esc(unitLabel(l.unitId))}</dd><dt>Start date</dt><dd>${fmtDate(l.start)}</dd><dt>End date</dt><dd>${fmtDate(l.end)}</dd><dt>Duration</dt><dd>${l.months} months</dd><dt>Agreed monthly rent</dt><dd class="strong">${peso(l.rent)}</dd><dt>Security deposit</dt><dd>${peso(l.deposit)}</dd></dl>
        <div class="callout num">${remaining(l)}</div></section>
      <section class="card card-pad"><h2 style="margin-bottom:12px">Lease timeline</h2>
        <div class="progress light" role="img" aria-label="Lease progress"><span style="width:${Math.min(100, Math.max(0, Math.round((daysBetween(toDate(l.start), TODAY) / daysBetween(toDate(l.start), toDate(l.end))) * 100)))}%"></span></div>
        <div class="small muted num" style="display:flex;justify-content:space-between;margin-top:8px"><span>${fmtShort(l.start)}</span><span>Today</span><span>${fmtShort(l.end)}</span></div>
        <p class="small muted" style="margin-top:16px">Renewals are made as a new contract by the property office. Message them through a concern if you’d like to renew.</p></section>
    </div></div>`
  };
}

async function tenantBills() {
  const tid = state.user.tenantId;
  const bills = (await services.bills()).filter((b) => tenantOfBill(b).id === tid).map((b) => ({ b, c: billCalc(b) })).sort((x, y) => y.b.period.localeCompare(x.b.period));
  const outstanding = bills.reduce((s, x) => s + x.c.balance, 0);
  return {
    title: 'My Bills',
    html: `<div class="content"><div class="grid grid-stats">${statCard('Outstanding balance', peso(outstanding), outstanding ? 'Across all bills' : 'You’re all paid up', outstanding ? '' : 'green')}${statCard('Bills this year', bills.length, 'Since your lease started')}</div>
      <section class="card" data-filterable><div class="toolbar">${filterSelect('status', 'Status', ['Paid', 'Partially Paid', 'Unpaid', 'Overdue'])}</div>
      ${dataTable({ cols: [
        { label: 'Period', cell: ({ b }) => `<a class="row-link" href="#/tenant/bills/${b.id}">${monthLabel(b.period)}</a>` },
        { label: 'Due date', cell: ({ b }) => `<span class="num">${fmtDate(b.due)}</span>` },
        { label: 'Total', num: true, cell: ({ c }) => peso(c.total) },
        { label: 'Paid', num: true, cell: ({ c }) => `<span class="t-muted">${peso(c.paid)}</span>` },
        { label: 'Balance', num: true, cell: ({ c }) => `<span class="t-strong">${peso(c.balance)}</span>` },
        { label: 'Status', cell: ({ c }) => badge(c.status) }
      ], rows: bills, minWidth: 640, rowAttrs: ({ c }) => `data-row data-search="" data-f-status="${esc(c.status)}"`, empty: ['No bills yet', 'Published bills will appear here.', '', 'receipt'] })}</section></div>`
  };
}

async function tenantBillDetail({ id }) {
  const b = await services.bill(id);
  if (!b || tenantOfBill(b).id !== state.user.tenantId) return notFound('Bill not found', '/tenant/bills');
  return billDetail(b, false);
}

async function tenantPayments() {
  const list = (await services.payments()).filter((p) => p.tenantId === state.user.tenantId).sort((a, b) => b.date.localeCompare(a.date));
  return {
    title: 'My Payments',
    html: `<div class="content"><div class="callout">Online payment isn’t available yet. Pay through the office, bank transfer or GCash, then the office records and verifies it.</div>
      <section class="card">${dataTable({ cols: [
        { label: 'Date', cell: (p) => `<span class="num">${fmtDate(p.date)}</span>` },
        { label: 'Method · Ref', cell: (p) => `${esc(p.method)} <span class="t-muted">· ${esc(p.ref)}</span>` },
        { label: 'Applied to', cell: (p) => db.allocations.filter((a) => a.paymentId === p.id).map((a) => `<a href="#/tenant/bills/${a.billId}">${monthLabel(byId('bills', a.billId).period)}</a>`).join(', ') },
        { label: 'Amount', num: true, cell: (p) => `<span class="t-strong">${peso(p.amount)}</span>` },
        { label: 'Status', cell: (p) => badge(p.status) + (p.reason ? `<div class="small muted" style="margin-top:4px">${esc(p.reason)}</div>` : '') },
        { label: 'Receipt', num: true, cell: (p) => p.status === 'Verified' ? `<button class="btn btn-ghost btn-sm" data-action="todo" data-what="Receipt download">Receipt</button>` : '' }
      ], rows: list, minWidth: 760, empty: ['No payments yet', 'Your payments will show here after the office records them.', '', 'card'] })}</section></div>`
  };
}

function tenantRaiseConcern() {
  const lease = activeLeaseOfTenant(state.user.tenantId);
  return {
    title: 'Raise a Concern',
    html: `<div class="content" style="max-width:760px"><section class="card card-pad">
      <form class="form" data-form="new-concern" novalidate>
        <p class="muted">Reporting for <strong>${lease ? esc(unitLabel(lease.unitId)) : 'your unit'}</strong>. Fields marked <span class="req">*</span> are required.</p>
        ${field({ id: 'n-category', label: 'Category', type: 'select', required: true, options: [['', 'Choose a category'], ...CATEGORIES] })}
        ${field({ id: 'n-title', label: 'Title', required: true, help: 'A short summary, e.g. “Leaking kitchen faucet”.', attrs: 'maxlength="80" autocomplete="off"' })}
        ${field({ id: 'n-desc', label: 'Description', type: 'textarea', required: true, help: 'What happened, since when, and where exactly. At least 15 characters.', attrs: 'rows="5"' })}
        <div class="field"><label for="n-photo">Photo (optional)</label>
          <div class="file-drop">${icon('image', 22)}<div style="flex:1"><input id="n-photo" name="n-photo" type="file" accept="image/*" aria-describedby="n-photo-help"><p class="help" id="n-photo-help">JPG or PNG up to 5 MB. Demo: the file name is saved, not the file.</p></div></div></div>
        <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap"><a class="btn btn-outline" href="#/tenant/dashboard">Cancel</a><button class="btn btn-primary" type="submit">Submit concern</button></div>
      </form></section></div>`
  };
}

async function tenantConcerns() {
  const list = (await services.concerns()).filter((c) => c.tenantId === state.user.tenantId).sort((a, b) => b.created.localeCompare(a.created));
  return {
    title: 'My Concerns',
    actions: `<a class="btn btn-primary" href="#/tenant/raise-concern">${icon('plus', 18, 2)}<span class="btn-label">Raise a concern</span></a>`,
    html: `<div class="content"><section class="card">${list.length ? `<ul class="list" style="padding:0 20px">${list.map((c) => {
      const last = db.messages.filter((m) => m.concernId === c.id).sort((a, b) => b.at.localeCompare(a.at))[0];
      return `<li><a class="list-row" href="#/tenant/concerns/${c.id}" style="padding:14px 0"><div class="body"><div class="t">${esc(c.title)}</div><div class="s">${esc(c.category)} · opened ${fmtShort(c.created)}${last ? ' · last update ' + fmtShort(last.at) : ''}</div></div>${badge(c.status)}</a></li>`;
    }).join('')}</ul>` : emptyState('No concerns yet', 'Report a problem with your unit and follow the replies here.', '<a class="btn btn-primary" href="#/tenant/raise-concern">Raise a concern</a>', 'chat')}</section></div>`
  };
}

async function tenantAnnouncements() {
  const list = (await services.announcements()).filter((a) => announcementTargetsTenant(a, state.user.tenantId) && a.publish <= isoDate(TODAY)).sort((a, b) => b.publish.localeCompare(a.publish));
  return { title: 'Announcements', html: `<div class="content"><div class="grid grid-3">${list.map((a) => announcementCard(a, false)).join('') || `<section class="card">${emptyState('No announcements', 'Updates from your property office will show here.', '', 'megaphone')}</section>`}</div></div>` };
}

function notFound(title, back) {
  return { title, html: `<div class="content"><section class="card">${emptyState(title, 'It may have been removed, or you don’t have access to it.', `<a class="btn btn-outline" href="#${back}">Go back</a>`, 'alert')}</section></div>` };
}

/* ---------------------------------------------------------
   7. Actions (clicks) and forms (submits) — event delegation
   --------------------------------------------------------- */
const actions = {
  'auth-mode': (el) => {
    // Directional slide between panes (translate, not a re-render)
    state.authMode = el.dataset.mode;
    const signup = state.authMode === 'signup';
    $('.tabs').classList.toggle('signup', signup);
    $('.auth-track').classList.toggle('signup', signup);
    $$('.tabs [role=tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === state.authMode)));
    $('#pane-signin').inert = signup;
    $('#pane-signup').inert = !signup;
    $('#google-label').textContent = signup ? 'Sign up with Google' : 'Continue with Google';
    $('#auth-msg').innerHTML = '';
    fitAuthPane();
  },
  async 'google-signin'(el) {
    const scenario = $('#demo-scenario').value;
    const msg = $('#auth-msg');
    msg.innerHTML = '';
    el.disabled = true;
    const label = el.innerHTML;
    el.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Connecting to Google…</span>';
    mascotMood('thinking');
    const r = await services.auth.signInWithGoogle(scenario);
    if (r.error) {
      el.disabled = false; el.innerHTML = label;
      msg.innerHTML = `<div class="error-summary">${esc(r.error)}</div>`;
      shake(msg.firstElementChild);
      mascotMood('error');
      return;
    }
    mascotMood('happy');
    await wait(reduceMotion() ? 0 : 550);
    if (r.pending) return navigate('/access-pending');
    state.user = r.user;
    try { sessionStorage.setItem('rms-user', r.user.id); } catch (e) { /* ignore */ }
    navigate(home());
  },
  logout() {
    state.user = null; state.shell = false;
    try { sessionStorage.removeItem('rms-user'); } catch (e) { /* ignore */ }
    navigate('/login');
  },
  'open-menu': () => { $('.shell').classList.add('menu-open'); $('.menu-btn').setAttribute('aria-expanded', 'true'); setTimeout(() => moveIndicator(true), 20); $('#sidebar a')?.focus(); },
  'close-menu': () => closeMenu(),
  reload: () => router(),
  'toggle-nav': () => setNavCollapsed(!state.navCollapsed),
  'search-expand': () => { if (state.navCollapsed) setNavCollapsed(false); setTimeout(() => $('#nav-search')?.focus(), state.navCollapsed ? 0 : 60); $('#nav-search')?.focus(); },
  'account-menu': (el) => {
    const menu = $('#account-menu');
    const open = menu.hidden;
    menu.hidden = !open;
    el.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('[role=menuitem]')?.focus();
  },
  'switch-account': (el) => {
    const u = db.users.find((x) => x.id === el.dataset.id);
    if (!u) return;
    state.user = u; state.shell = false; state.path = '';
    try { sessionStorage.setItem('rms-user', u.id); } catch (e) { /* ignore */ }
    toast(`Switched to ${u.name}`);
    navigate(home());
  },
  'toggle-collapse': (el) => { const open = el.parentElement.classList.toggle('open'); el.setAttribute('aria-expanded', String(open)); },
  'toggle-theme': () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'),
  print: () => window.print(),
  todo: (el) => toast(`${el.dataset.what || 'This action'} — coming in the next build (demo).`),
  'close-dialog': () => closeDialog(),
  'focus-field': (el) => document.getElementById(el.dataset.id)?.focus(),

  async 'toggle-notif'(el) {
    const menu = $('#notif-menu');
    const open = menu.hidden;
    if (!open) { menu.hidden = true; el.setAttribute('aria-expanded', 'false'); return; }
    const list = (await services.notifications(state.user.id)).slice(0, 6);
    const base = state.user.role === 'tenant' ? '/tenant' : '/admin';
    menu.innerHTML = `<header><strong>Notifications</strong>${list.some((n) => !n.read) ? '<button class="btn btn-ghost btn-sm" data-action="mark-all-read">Mark all read</button>' : ''}</header>
      ${list.length ? `<ul>${list.map(notifItem).join('')}</ul>` : '<p class="muted small" style="padding:16px">No notifications yet.</p>'}
      <footer><a href="#${base}/notifications" data-action="close-notif">See all notifications</a></footer>`;
    menu.hidden = false; el.setAttribute('aria-expanded', 'true');
  },
  'close-notif': (el) => { $('#notif-menu').hidden = true; navigate(el.getAttribute('href').slice(1)); },
  async 'open-notif'(el) { await services.markRead(el.dataset.id); $('#notif-menu').hidden = true; navigate(el.dataset.link); refreshBell(); },
  async 'mark-all-read'() { await services.markAllRead(state.user.id); $('#notif-menu').hidden = true; toast('All notifications marked as read'); router(); },

  sort(el) {
    const table = el.closest('table');
    const col = +el.dataset.col;
    const th = el.closest('th');
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th', table).forEach((h) => h.hasAttribute('aria-sort') && h.setAttribute('aria-sort', 'none'));
    th.setAttribute('aria-sort', dir);
    const tbody = $('tbody', table);
    const rows = $$('tr:not([data-nomatch])', tbody);
    rows.sort((a, b) => {
      const va = a.children[col].dataset.sort, vb = b.children[col].dataset.sort;
      const na = parseFloat(va), nb = parseFloat(vb);
      const cmp = !isNaN(na) && !isNaN(nb) && String(na) === va && String(nb) === vb ? na - nb : String(va).localeCompare(String(vb));
      return dir === 'ascending' ? cmp : -cmp;
    });
    rows.forEach((r) => tbody.insertBefore(r, $('[data-nomatch]', tbody)));
  },

  'verify-payment'(el) {
    const p = byId('payments', el.dataset.id);
    const t = byId('tenants', p.tenantId);
    confirmDialog('Verify payment?', `Confirm that <strong>${peso(p.amount)}</strong> from <strong>${esc(t.name)}</strong> (${esc(p.method)} · ${esc(p.ref)}) was received. It will be allocated to the bill and the balance recalculated.`, 'Verify payment', 'verify', { id: p.id });
  },
  'reject-payment'(el) {
    const p = byId('payments', el.dataset.id);
    openDialog({ title: 'Reject payment', form: 'reject', submit: 'Reject payment', danger: true, ctx: { id: p.id },
      body: `<p>Rejecting <strong>${peso(p.amount)}</strong> (${esc(p.method)} · ${esc(p.ref)}). The tenant will be notified with your reason.</p>${field({ id: 'r-reason', label: 'Reason', type: 'textarea', required: true, help: 'Shown to the tenant.', attrs: 'rows="3"' })}` });
  },
  'add-item'(el) {
    openDialog({ title: 'Add line item', form: 'add-item', submit: 'Add to bill', ctx: { id: el.dataset.id },
      body: `<div class="form-grid">${field({ id: 'i-type', label: 'Charge type', type: 'select', required: true, options: ['Electricity', 'Water', 'Internet', 'Parking', 'Maintenance', 'Association dues', 'Penalty', 'Other'] })}
        ${field({ id: 'i-amount', label: 'Amount (₱)', type: 'number', required: true, attrs: 'min="0.01" step="0.01" inputmode="decimal"' })}</div>
        ${field({ id: 'i-desc', label: 'Description', required: true, attrs: 'maxlength="60"' })}
        <div>${field({ id: 'i-note', label: 'Billing period / notes', help: 'e.g. meter readings or coverage dates.' })}
          <div id="penalty-note"><div class="collapse"><div class="collapse-inner"><div class="callout warn">Only add a penalty where the contract permits it. It will be shown to the tenant as its own line.</div></div></div></div></div>` });
  },
  'remove-item'(el) {
    const b = byId('bills', el.dataset.bill);
    const it = b.items.find((i) => i.id === el.dataset.item);
    confirmDialog('Remove line item?', `Remove <strong>${esc(it.desc)}</strong> (${peso(it.amount)}) from ${esc(b.id)}? This is recorded in the bill’s activity log.`, 'Remove', 'remove-item', { bill: b.id, item: it.id }, true);
  },
  'record-payment'(el) {
    const b = byId('bills', el.dataset.id);
    const c = billCalc(b);
    openDialog({ title: 'Record payment', form: 'record-payment', submit: 'Record payment', ctx: { id: b.id },
      body: `<p class="muted">${esc(tenantOfBill(b).name)} · ${esc(b.id)} · balance <strong class="num">${peso(c.balance)}</strong></p>
        <div class="form-grid">${field({ id: 'p-amount', label: 'Amount (₱)', type: 'number', required: true, value: c.balance, attrs: 'min="0.01" step="0.01" inputmode="decimal"' })}
        ${field({ id: 'p-date', label: 'Payment date', type: 'date', required: true, value: isoDate(TODAY), attrs: `max="${isoDate(TODAY)}"` })}
        ${field({ id: 'p-method', label: 'Method', type: 'select', required: true, options: ['Cash', 'Bank transfer', 'GCash', 'Maya', 'Check'] })}
        ${field({ id: 'p-ref', label: 'Reference no.', required: true, help: 'OR number, bank or e-wallet reference.' })}</div>
        ${field({ id: 'p-note', label: 'Notes', type: 'textarea', attrs: 'rows="2"' })}
        <label class="check"><input type="checkbox" id="p-verified" name="p-verified" checked><span>Mark as verified now (you received the money)</span></label>` });
  },
  'new-announcement'() {
    openDialog({ title: 'New announcement', form: 'announcement', submit: 'Publish',
      body: `${field({ id: 'a-title', label: 'Title', required: true, attrs: 'maxlength="90"' })}
        ${field({ id: 'a-body', label: 'Message', type: 'textarea', required: true, attrs: 'rows="4"' })}
        <div class="form-grid">${field({ id: 'a-category', label: 'Category', type: 'select', required: true, options: ['Maintenance', 'Electricity', 'Payment Reminder', 'General Update', 'Emergency', 'System Update'] })}
        ${field({ id: 'a-priority', label: 'Priority', type: 'select', options: ['Normal', 'High'] })}</div>
        <div>${field({ id: 'a-audience', label: 'Audience', type: 'select', required: true, options: [['all', 'All tenants'], ['property', 'Selected property'], ['tenant', 'Selected tenant']] })}
          <div id="aud-property"><div class="collapse"><div class="collapse-inner">${field({ id: 'a-property', label: 'Property', type: 'select', options: db.properties.map((p) => [p.id, p.name]) })}</div></div></div>
          <div id="aud-tenant"><div class="collapse"><div class="collapse-inner">${field({ id: 'a-tenant', label: 'Tenant', type: 'select', options: db.tenants.map((t) => [t.id, t.name]) })}</div></div></div></div>
        <div class="form-grid">${field({ id: 'a-publish', label: 'Publish date', type: 'date', required: true, value: isoDate(TODAY) })}
        ${field({ id: 'a-expiry', label: 'Expiry date (optional)', type: 'date' })}</div>
        <p class="help">Targeted tenants get an in-app notification when it publishes.</p>` });
  }
};

const forms = {
  async verify() {
    await services.verifyPayment(state.dialogCtx.id);
    closeDialog(); toast('Payment verified and allocated'); router();
  },
  async reject(form) {
    if (!validate(form, { 'r-reason': (v) => (v.length < 5 ? 'Give the tenant a short reason (at least 5 characters).' : '') })) return;
    await services.rejectPayment(state.dialogCtx.id, form.elements['r-reason'].value.trim());
    closeDialog(); toast('Payment rejected; tenant notified'); router();
  },
  async 'add-item'(form) {
    const ok = validate(form, {
      'i-amount': (v) => (!v ? 'Enter an amount.' : Number(v) <= 0 ? 'Amount must be more than ₱0.' : ''),
      'i-desc': (v) => (!v ? 'Describe the charge.' : '')
    });
    if (!ok) return;
    const e = form.elements;
    await services.addBillItem(state.dialogCtx.id, { type: e['i-type'].value, desc: e['i-desc'].value.trim(), amount: +(+e['i-amount'].value).toFixed(2), note: e['i-note'].value.trim() });
    closeDialog(); toast('Line item added; totals recalculated'); router();
  },
  async 'remove-item'() {
    await services.removeBillItem(state.dialogCtx.bill, state.dialogCtx.item);
    closeDialog(); toast('Line item removed'); router();
  },
  async 'record-payment'(form) {
    const ok = validate(form, {
      'p-amount': (v) => (!v ? 'Enter the amount received.' : Number(v) <= 0 ? 'Amount must be more than ₱0.' : ''),
      'p-date': (v) => (!v ? 'Choose the payment date.' : v > isoDate(TODAY) ? 'Date can’t be in the future.' : ''),
      'p-ref': (v) => (!v ? 'Enter a reference so the payment can be audited.' : '')
    });
    if (!ok) return;
    const e = form.elements;
    await services.recordPayment(state.dialogCtx.id, { amount: +(+e['p-amount'].value).toFixed(2), date: e['p-date'].value, method: e['p-method'].value, ref: e['p-ref'].value.trim(), note: e['p-note'].value.trim(), verified: e['p-verified'].checked });
    closeDialog(); toast('Payment recorded'); router();
  },
  async announcement(form) {
    const e = form.elements;
    const ok = validate(form, {
      'a-title': (v) => (!v ? 'Add a title.' : ''),
      'a-body': (v) => (v.length < 10 ? 'Write a message (at least 10 characters).' : ''),
      'a-publish': (v) => (!v ? 'Choose a publish date.' : ''),
      'a-expiry': (v) => (v && v < e['a-publish'].value ? 'Expiry must be after the publish date.' : '')
    });
    if (!ok) return;
    const type = e['a-audience'].value;
    const ids = type === 'property' ? [e['a-property'].value] : type === 'tenant' ? [e['a-tenant'].value] : [];
    const n = await services.publishAnnouncement({ title: e['a-title'].value.trim(), body: e['a-body'].value.trim(), category: e['a-category'].value, priority: e['a-priority'].value, publish: e['a-publish'].value, expiry: e['a-expiry'].value, targets: { type, ids } });
    closeDialog(); toast(n ? `Published · ${n} tenant${n > 1 ? 's' : ''} targeted` : 'Announcement scheduled'); router();
  },
  async reply(form) {
    if (!validate(form, { reply: (v) => (!v ? 'Write a message before sending.' : '') })) return;
    const btn = $('[type=submit]', form); btn.disabled = true;
    await services.replyConcern(form.dataset.id, form.elements.reply.value.trim());
    toast('Message sent'); await router();
    $('.thread')?.lastElementChild?.scrollIntoView({ block: 'nearest' });
  },
  async 'concern-update'(form) {
    await services.updateConcern(form.dataset.id, { status: form.elements['c-status'].value, assignedTo: form.elements['c-assign'].value });
    toast('Concern updated; tenant notified of status changes'); router();
  },
  async 'new-concern'(form) {
    const ok = validate(form, {
      'n-category': (v) => (!v ? 'Choose a category.' : ''),
      'n-title': (v) => (!v ? 'Add a short title.' : v.length < 4 ? 'Title is too short.' : ''),
      'n-desc': (v) => (v.length < 15 ? 'Describe the problem in at least 15 characters.' : '')
    });
    if (!ok) return;
    const e = form.elements;
    const btn = $('[type=submit]', form); btn.disabled = true; btn.innerHTML = '<span class="spinner" aria-hidden="true"></span>Submitting…';
    const id = await services.createConcern(state.user.tenantId, { category: e['n-category'].value, title: e['n-title'].value.trim(), description: e['n-desc'].value.trim(), attachment: e['n-photo'].files[0]?.name || '' });
    toast('Concern submitted. The property team has been notified.');
    navigate('/tenant/concerns/' + id);
  }
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (el && actions[el.dataset.action]) {
    if (el.tagName === 'A' || el.tagName === 'BUTTON') e.preventDefault();
    actions[el.dataset.action](el, e);
    return;
  }
  const am = $('#account-menu');
  if (am && !am.hidden && !e.target.closest('.sb-profile-wrap')) { am.hidden = true; $('.sb-profile')?.setAttribute('aria-expanded', 'false'); }
  // Close the notification menu on outside click
  const menu = $('#notif-menu');
  if (menu && !menu.hidden && !e.target.closest('.notif-wrap')) { menu.hidden = true; $('#bell')?.setAttribute('aria-expanded', 'false'); }
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-form]');
  if (!form) return;
  e.preventDefault();
  forms[form.dataset.form]?.(form);
});

document.addEventListener('input', (e) => {
  if (e.target.matches('[data-filter]')) applyFilters(e.target.closest('[data-filterable]'));
  if (e.target.id === 'nav-search') filterNav(e.target.value);
});
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && state.shell) {
    e.preventDefault();
    if (isMobileNav() && !$('.shell.menu-open')) actions['open-menu']();
    actions['search-expand']();
  }
  if (e.target.id === 'nav-search') {
    if (e.key === 'Enter') { const first = $('#sb-nav li[data-item]:not(.out) a'); if (first) { e.preventDefault(); first.click(); e.target.value = ''; filterNav(''); } }
    if (e.key === 'Escape' && e.target.value) { e.stopPropagation(); e.target.value = ''; filterNav(''); }
  }
  if (e.key === 'Escape' && $('#account-menu') && !$('#account-menu').hidden) { $('#account-menu').hidden = true; $('.sb-profile').setAttribute('aria-expanded', 'false'); $('.sb-profile').focus(); }
});
window.addEventListener('resize', () => moveIndicator(true));
document.addEventListener('change', (e) => {
  if (e.target.matches('select[data-filter]')) applyFilters(e.target.closest('[data-filterable]'));
  if (e.target.id === 'a-audience') { $('#aud-property').classList.toggle('open', e.target.value === 'property'); $('#aud-tenant').classList.toggle('open', e.target.value === 'tenant'); }
  if (e.target.id === 'i-type') { $('#penalty-note').classList.toggle('open', e.target.value === 'Penalty'); const d = $('#i-desc'); if (!d.value) d.value = e.target.value === 'Other' ? '' : e.target.value; }
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if ($('.shell.menu-open')) closeMenu();
  const menu = $('#notif-menu');
  if (menu && !menu.hidden) { menu.hidden = true; $('#bell')?.focus(); }
});

function applyFilters(scope) {
  if (!scope) return;
  const q = ($('[data-filter="q"]', scope)?.value || '').toLowerCase().trim();
  const sels = $$('select[data-filter]', scope);
  let shown = 0;
  $$('[data-row]', scope).forEach((r) => {
    let ok = !q || (r.dataset.search || '').includes(q);
    sels.forEach((s) => { const key = 'f' + s.dataset.filter[0].toUpperCase() + s.dataset.filter.slice(1); if (s.value && r.dataset[key] !== s.value) ok = false; });
    r.hidden = !ok;
    if (ok) shown++;
  });
  const nm = $('[data-nomatch]', scope);
  if (nm) nm.hidden = shown > 0;
}

/* ---------------------------------------------------------
   8. Router & shell
   --------------------------------------------------------- */
/* Sidebar sections: [section label, [[key, label, icon], ...]] */
const NAV = {
  manager: [
    ['Menu', [['dashboard', 'Dashboard', 'grid'], ['properties', 'Properties', 'building'], ['units', 'Units / Spaces', 'units'], ['tenants', 'Tenants', 'users'], ['contracts', 'Contracts', 'file']]],
    ['Finance', [['billing', 'Billing', 'receipt'], ['payments', 'Payments', 'card'], ['reports', 'Reports', 'chart']]],
    ['Communication', [['concerns', 'Concerns', 'chat'], ['announcements', 'Announcements', 'megaphone'], ['notifications', 'Notifications', 'bell']]],
    ['General', [['settings', 'Settings', 'gear']]]
  ],
  tenant: [
    ['Menu', [['dashboard', 'My Dashboard', 'grid'], ['contract', 'My Contract', 'file'], ['bills', 'My Bills', 'receipt'], ['payments', 'My Payments', 'card']]],
    ['Support', [['raise-concern', 'Raise a Concern', 'plus'], ['concerns', 'My Concerns', 'chat'], ['announcements', 'Announcements', 'megaphone'], ['notifications', 'Notifications', 'bell']]],
    ['General', [['profile', 'My Profile', 'user']]]
  ]
};
const navItems = (role) => NAV[role].flatMap(([, items]) => items);

const ROUTES = [
  ['/login', viewLogin, null], ['/access-pending', viewAccessPending, null],
  ['/admin/dashboard', adminDashboard, 'manager'], ['/admin/properties', adminProperties, 'manager'], ['/admin/units', adminUnits, 'manager'],
  ['/admin/tenants', adminTenants, 'manager'], ['/admin/contracts', adminContracts, 'manager'], ['/admin/billing', adminBilling, 'manager'],
  ['/admin/billing/:id', adminBillDetail, 'manager'], ['/admin/payments', adminPayments, 'manager'], ['/admin/concerns', adminConcerns, 'manager'],
  ['/admin/concerns/:id', concernDetail, 'manager'], ['/admin/announcements', adminAnnouncements, 'manager'], ['/admin/notifications', notificationsView, 'manager'],
  ['/admin/reports', adminReports, 'manager'], ['/admin/settings', settingsView, 'manager'],
  ['/tenant/dashboard', tenantDashboard, 'tenant'], ['/tenant/contract', tenantContract, 'tenant'], ['/tenant/bills', tenantBills, 'tenant'],
  ['/tenant/bills/:id', tenantBillDetail, 'tenant'], ['/tenant/payments', tenantPayments, 'tenant'], ['/tenant/raise-concern', tenantRaiseConcern, 'tenant'],
  ['/tenant/concerns', tenantConcerns, 'tenant'], ['/tenant/concerns/:id', concernDetail, 'tenant'], ['/tenant/announcements', tenantAnnouncements, 'tenant'],
  ['/tenant/notifications', notificationsView, 'tenant'], ['/tenant/profile', settingsView, 'tenant']
];

function matchRoute(path) {
  const parts = path.split('/').filter(Boolean);
  for (const route of ROUTES) {
    const rp = route[0].split('/').filter(Boolean);
    if (rp.length !== parts.length) continue;
    const params = {};
    if (rp.every((seg, i) => (seg.startsWith(':') ? ((params[seg.slice(1)] = decodeURIComponent(parts[i])), true) : seg === parts[i]))) return { route, params };
  }
  return null;
}

const navigate = (path) => { if (location.hash === '#' + path) router(); else location.hash = '#' + path; };

function renderPublic(html) { state.shell = false; $('#app').innerHTML = html; document.title = 'Rentwise · Sign in'; fitAuthPane(); initAuthArt(); }

/* The sign-in area takes the height of the visible tab, animating between them. */
function fitAuthPane() {
  const vp = $('.auth-viewport');
  const pane = $(state.authMode === 'signup' ? '#pane-signup' : '#pane-signin');
  if (vp && pane) vp.style.height = pane.offsetHeight + 'px';
}
window.addEventListener('resize', fitAuthPane);

function renderShell() {
  const u = state.user;
  const base = u.role === 'tenant' ? '/tenant/' : '/admin/';
  let n = 0;
  const sections = NAV[u.role].map(([label, items], si) => `
    ${si ? '<div class="sb-divider" role="presentation"></div>' : ''}
    <div class="nav-section" data-section>
      <div class="nav-label">${esc(label)}</div>
      <ul class="nav">${items.map(([key, text, ic]) => `<li data-item data-key="${key}" data-label="${esc(text.toLowerCase())}" style="--i:${n++}">
        <a href="#${base}${key}" data-tip="${esc(text)}" class="tip-collapsed"><span class="nav-ic">${icon(ic, 18)}</span><span class="label">${esc(text)}</span><span class="nav-count" hidden></span></a></li>`).join('')}
        ${label === 'General' ? `<li data-item data-key="logout" data-label="log out sign out" style="--i:${n++}"><a href="#/login" data-action="logout" data-tip="Log out" class="tip-collapsed"><span class="nav-ic">${icon('logout', 18)}</span><span class="label">Log out</span></a></li>` : ''}
      </ul>
    </div>`).join('');
  const others = db.users.filter((x) => x.id !== u.id);
  $('#app').innerHTML = `<a class="skip" href="#view" data-action="focus-field" data-id="view">Skip to content</a>
  <div class="shell ${state.navCollapsed ? 'nav-collapsed' : ''}">
    <aside class="sidebar" id="sidebar" aria-label="Main navigation">
      <div class="sb-head">
        <a class="sb-logo" href="#${base}dashboard" aria-label="${esc(BRAND.name)} home">
          <img class="logo-full" src="${BRAND.logoLight}" alt="${esc(BRAND.name)}" width="448" height="96">
          <img class="logo-mark" src="${BRAND.markLight}" alt="" width="93" height="96">
        </a>
        <button class="sb-collapse" data-action="toggle-nav" aria-label="${state.navCollapsed ? 'Expand' : 'Collapse'} sidebar" aria-expanded="${!state.navCollapsed}" aria-controls="sidebar" data-tip="${state.navCollapsed ? 'Expand' : 'Collapse'}">${icon('chevronLeft', 16, 2.2)}<span class="sb-collapse-text">Collapse</span></button>
      </div>
      <div class="sb-divider" role="presentation"></div>
      <div class="sb-profile-wrap">
        <button class="sb-profile tip-collapsed" data-action="account-menu" aria-haspopup="menu" aria-expanded="false" aria-controls="account-menu" data-tip="${esc(u.name)}">
          <span class="avatar">${initials(u.name)}</span>
          <span class="sb-profile-text"><span class="nm">${esc(u.name)}</span><span class="sw">${icon('swap', 13, 2)}Switch account</span></span>
          <span class="sb-chev">${icon('chevronRight', 16, 2)}</span>
        </button>
        <div class="account-menu" id="account-menu" role="menu" hidden>
          <div class="am-label">Signed in as</div>
          <div class="am-me"><span class="avatar">${initials(u.name)}</span><div><div class="strong">${esc(u.name)}</div><div class="small">${esc(u.email)}</div></div></div>
          <div class="am-label">Demo accounts</div>
          ${others.map((o) => `<button role="menuitem" class="am-item" data-action="switch-account" data-id="${o.id}"><span class="avatar">${initials(o.name)}</span><span><span class="strong">${esc(o.name)}</span><span class="small">${o.role === 'tenant' ? 'Tenant' : 'Manager'}</span></span></button>`).join('')}
          <div class="am-sep"></div>
          <a role="menuitem" class="am-item" href="#${base}${u.role === 'tenant' ? 'profile' : 'settings'}">${icon('user', 16)}<span>${u.role === 'tenant' ? 'My profile' : 'Settings'}</span></a>
          <button role="menuitem" class="am-item danger" data-action="logout">${icon('logout', 16)}<span>Log out</span></button>
        </div>
      </div>
      <div class="sb-divider" role="presentation"></div>
      <div class="sb-search">
        <button type="button" class="sb-search-btn tip-collapsed" data-action="search-expand" aria-label="Search menu" data-tip="Search (Ctrl K)">${icon('search', 17, 2)}</button>
        <label class="sr-only" for="nav-search">Search menu</label>
        <input id="nav-search" type="search" placeholder="Search…" autocomplete="off" spellcheck="false">
        <kbd aria-hidden="true">Ctrl K</kbd>
      </div>
      <nav class="sb-nav" id="sb-nav" aria-label="Main">
        <span class="nav-indicator" aria-hidden="true"></span>
        ${sections}
        <p class="nav-empty" hidden>No menu items match.</p>
      </nav>
    </aside>
    <div class="scrim" data-action="close-menu"></div>
    <div class="main">
      <header class="topbar">
        <button class="icon-btn menu-btn" data-action="open-menu" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false" data-tip="Menu">${icon('menu', 20)}</button>
        <div class="topbar-title"><nav class="crumbs" id="crumbs" aria-label="Breadcrumb"></nav><h1 id="page-title"></h1></div>
        <div class="topbar-actions" id="topbar-actions"></div>
        <button class="icon-btn" id="theme-btn" data-action="toggle-theme"></button>
        <div class="notif-wrap"><button class="icon-btn" id="bell" data-action="toggle-notif" aria-haspopup="true" aria-expanded="false" aria-controls="notif-menu" aria-label="Notifications" data-tip="Notifications">${icon('bell', 20)}<span class="count-dot" id="bell-count" hidden></span></button><div class="notif-menu" id="notif-menu" hidden></div></div>
      </header>
      <main id="view" tabindex="-1"></main>
    </div>
  </div>`;
  state.shell = true;
  updateThemeButton();
}

function updateNav(pattern) {
  const role = state.user.role;
  const section = pattern.split('/')[2];
  const unread = db.notifications.filter((n) => n.userId === state.user.id && !n.read).length;
  const newConcerns = role === 'manager' ? db.concerns.filter((c) => c.status === 'Pending').length : 0;
  $$('#sb-nav li[data-item]').forEach((li) => {
    const a = li.querySelector('a');
    const key = li.dataset.key;
    if (key === section) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    const badge = li.querySelector('.nav-count');
    if (badge) {
      const count = key === 'notifications' ? unread : key === 'concerns' ? newConcerns : 0;
      badge.hidden = !count; badge.textContent = count;
      badge.setAttribute('aria-label', `${count} new`);
    }
  });
  moveIndicator();
}

/* Full-width highlight bar that slides to the active item. */
function moveIndicator(instant = false) {
  const nav = $('#sb-nav');
  if (!nav) return;
  const ind = $('.nav-indicator', nav);
  const a = $('a[aria-current="page"]', nav);
  const li = a?.closest('li');
  if (!a || li.classList.contains('out')) { ind.classList.remove('on'); return; }
  if (instant || !ind.classList.contains('ready')) ind.classList.add('no-anim');
  const top = a.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop;
  ind.style.transform = `translateY(${top}px)`;
  ind.style.height = a.offsetHeight + 'px';
  ind.classList.add('on');
  if (ind.classList.contains('no-anim')) { void ind.offsetHeight; requestAnimationFrame(() => { ind.classList.remove('no-anim'); ind.classList.add('ready'); }); }
}

/* Live menu search: matching items stay, others collapse (height:auto transition). */
function filterNav(q) {
  q = q.toLowerCase().trim();
  let any = 0;
  $$('#sb-nav .nav-section').forEach((sec) => {
    let shown = 0;
    $$('li[data-item]', sec).forEach((li) => { const ok = !q || li.dataset.label.includes(q); li.classList.toggle('out', !ok); li.querySelector('a').tabIndex = ok ? 0 : -1; if (ok) shown++; });
    sec.classList.toggle('out', !shown);
    any += shown;
  });
  $$('#sb-nav .sb-divider').forEach((d) => d.classList.toggle('out', !!q));
  $('#sb-nav .nav-empty').hidden = any > 0;
  setTimeout(() => moveIndicator(), 220);
  moveIndicator();
}

function setNavCollapsed(collapsed) {
  state.navCollapsed = collapsed;
  try { localStorage.setItem('rms-nav', collapsed ? '1' : '0'); } catch (e) { /* ignore */ }
  const shell = $('.shell');
  shell.classList.toggle('nav-collapsed', collapsed);
  const btn = $('.sb-collapse');
  btn.setAttribute('aria-expanded', String(!collapsed));
  btn.setAttribute('aria-label', (collapsed ? 'Expand' : 'Collapse') + ' sidebar');
  btn.dataset.tip = collapsed ? 'Expand' : 'Collapse';
  hideTip();
  $('#account-menu').hidden = true;
  if (collapsed) { $('#nav-search').value = ''; filterNav(''); }
  const sb = $('#sidebar');
  const done = (e) => { if (e.target === sb && e.propertyName === 'width') { sb.removeEventListener('transitionend', done); moveIndicator(true); } };
  sb.addEventListener('transitionend', done);
  setTimeout(() => moveIndicator(true), 320);
}

function refreshBell() {
  if (!state.user || !$('#bell-count')) return;
  const unread = db.notifications.filter((n) => n.userId === state.user.id && !n.read).length;
  const b = $('#bell-count');
  b.hidden = !unread; b.textContent = unread;
  $('#bell').setAttribute('aria-label', unread ? `Notifications, ${unread} unread` : 'Notifications');
}

function closeMenu() {
  $('.shell')?.classList.remove('menu-open');
  $('.menu-btn')?.setAttribute('aria-expanded', 'false');
}

let routeToken = 0;
async function router() {
  const path = location.hash.slice(1) || home();
  const m = matchRoute(path);
  if (!m) return navigate(home());
  const [pattern, view, role] = m.route;
  if (!role) {
    if (state.user && pattern === '/login') return navigate(home());
    return renderPublic(view(m.params));
  }
  if (!state.user) return navigate('/login');
  if (state.user.role !== role) return navigate(home());       // role-based access control (backend must enforce too)
  if (!state.shell) renderShell();
  closeMenu();
  updateNav(pattern);
  const token = ++routeToken;
  const viewEl = $('#view');
  const samePage = state.path === path;
  const dir = samePage ? '' : slideDirection(state.path, path);
  if (!samePage) viewEl.innerHTML = loadingState();
  state.path = path;
  try {
    const out = await view(m.params);
    if (token !== routeToken) return;                             // a newer navigation won
    $('#page-title').textContent = out.title;
    $('#crumbs').innerHTML = (out.crumbs || []).map(([label, href], i, arr) => (href ? `<a href="${href}">${esc(label)}</a>` : `<span ${i === arr.length - 1 ? 'aria-current="page"' : ''}>${esc(label)}</span>`)).join('<span aria-hidden="true">/</span>');
    $('#topbar-actions').innerHTML = out.actions || '';
    viewEl.innerHTML = out.html;
    if (dir) viewEl.firstElementChild?.classList.add('slide-' + dir);
    document.title = `${out.title} · Rentwise`;
    if (!samePage) { window.scrollTo(0, 0); viewEl.focus({ preventScroll: true }); }
  } catch (err) {
    console.error(err);
    viewEl.innerHTML = `<div class="content">${errorState(err.message || 'Could not load this page.')}</div>`;
  }
  refreshBell();
}

/* ---------------------------------------------------------
   9. Motion systems
   --------------------------------------------------------- */

/* Directional slides: deeper page or later menu item = "next" (enters from the right). */
function slideDirection(from, to) {
  if (!from || !state.user) return '';
  const rank = (p) => { const parts = p.split('/').filter(Boolean); return { depth: parts.length, idx: navItems(state.user.role).findIndex((n) => n[0] === parts[1]), area: parts[0] }; };
  const a = rank(from), b = rank(to);
  if (a.area !== b.area) return '';
  if (b.depth !== a.depth) return b.depth > a.depth ? 'next' : 'back';
  return b.idx >= a.idx ? 'next' : 'back';
}

/* Instant theme switch: disable all transitions for the frame the theme flips. */
function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  root.dataset.theme = theme;
  void root.offsetHeight;                                  // flush styles with transitions off
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
  try { localStorage.setItem('rms-theme', theme); } catch (e) { /* ignore */ }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0A1726' : '#1B4D7E');
  updateThemeButton();
}
function updateThemeButton() {
  const btn = $('#theme-btn');
  if (!btn) return;
  const dark = document.documentElement.dataset.theme === 'dark';
  const label = dark ? 'Switch to light theme' : 'Switch to dark theme';
  btn.innerHTML = icon(dark ? 'sun' : 'moon', 20);
  btn.setAttribute('aria-label', label);
  btn.dataset.tip = dark ? 'Light theme' : 'Dark theme';
  if (tip.target === btn && tip.el) tip.el.textContent = btn.dataset.tip;
}

/* Tooltips: 600ms delay for the first one, then instant (skip delay 300ms)
   while the pointer moves between controls. Mouse + keyboard focus only. */
const tip = { el: null, target: null, timer: 0, lastHide: -Infinity };
const TIP_DELAY = 600, TIP_SKIP = 300;
function scheduleTip(target) {
  // Sidebar labels only need tooltips when the sidebar is collapsed to icons
  if (target.classList.contains('tip-collapsed') && !($('.shell.nav-collapsed') && !isMobileNav())) return;
  clearTimeout(tip.timer);
  const skip = tip.el || performance.now() - tip.lastHide < TIP_SKIP;
  if (tip.el) removeTip(false);
  tip.target = target;
  if (skip) showTip(target, true);
  else tip.timer = setTimeout(() => showTip(target, false), TIP_DELAY);
}
function showTip(target, instant) {
  if (!document.body.contains(target)) return;
  const el = document.createElement('div');
  el.className = 'tooltip' + (instant ? ' instant' : '');
  el.setAttribute('role', 'tooltip');
  el.textContent = target.dataset.tip;
  document.body.appendChild(el);
  const r = target.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
  const below = r.bottom + 8 + h < window.innerHeight;
  const left = Math.min(window.innerWidth - w - 8, Math.max(8, r.left + r.width / 2 - w / 2));
  el.style.left = left + 'px';
  el.style.top = (below ? r.bottom + 8 : r.top - h - 8) + 'px';
  el.style.setProperty('--tip-origin', below ? 'top center' : 'bottom center');
  tip.el = el;
}
function removeTip(markHidden = true) {
  if (tip.el) { tip.el.remove(); tip.el = null; if (markHidden) tip.lastHide = performance.now(); }
}
function hideTip() { clearTimeout(tip.timer); removeTip(true); tip.target = null; }
document.addEventListener('pointerover', (e) => {
  if (e.pointerType !== 'mouse') return;
  const t = e.target.closest('[data-tip]');
  if (t && t !== tip.target) scheduleTip(t);
});
document.addEventListener('pointerout', (e) => {
  const t = e.target.closest('[data-tip]');
  if (t && t === tip.target && !t.contains(e.relatedTarget)) hideTip();
});
document.addEventListener('focusin', (e) => { const t = e.target.closest?.('[data-tip]'); if (t && t.matches(':focus-visible')) scheduleTip(t); });
document.addEventListener('focusout', (e) => { if (e.target === tip.target) hideTip(); });
document.addEventListener('pointerdown', hideTip, true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideTip(); });
window.addEventListener('scroll', hideTip, { passive: true, capture: true });

/* Velocity spring (bounce 0, ~0.5s), seeded with the gesture's release velocity. */
function springTo(from, to, velocity, onUpdate, onDone, { duration = 0.5, bounce = 0 } = {}) {
  if (reduceMotion()) { onUpdate(to); onDone(); return 0; }
  const omega = (2 * Math.PI) / duration;
  const k = omega * omega;
  const c = 2 * (1 - bounce) * omega;                       // bounce 0 = critically damped
  let x = from, v = velocity, last = performance.now();
  const step = (now) => {
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    for (let i = 0; i < 4; i++) { const h = dt / 4; v += (-k * (x - to) - c * v) * h; x += v * h; }
    onUpdate(x);
    if (Math.abs(x - to) < 0.5 && Math.abs(v) < 20) { onUpdate(to); onDone(); return; }
    drawer.raf = requestAnimationFrame(step);
  };
  drawer.raf = requestAnimationFrame(step);
  return drawer.raf;
}

/* Mobile drawer gesture: drag left to close (follows the finger),
   drag right past the open edge = rubber band, release = velocity spring. */
const drawer = { active: false, moved: false, startX: 0, lastX: 0, lastT: 0, v: 0, x: 0, sb: null, id: null, raf: 0, justDragged: false };
const isMobileNav = () => window.matchMedia('(max-width: 1023px)').matches;
function paintDrawer(x) {
  const w = drawer.sb.offsetWidth;
  drawer.sb.style.transform = `translateX(${Math.min(x, 64)}px)`;
  const scrim = $('.scrim');
  if (scrim) scrim.style.opacity = String(Math.max(0, Math.min(1, 1 + Math.min(0, x) / w)));
}
document.addEventListener('pointerdown', (e) => {
  const sb = e.target.closest('.sidebar');
  if (!sb || !isMobileNav() || !$('.shell.menu-open')) return;
  cancelAnimationFrame(drawer.raf);
  Object.assign(drawer, { active: true, moved: false, startX: e.clientX, lastX: e.clientX, lastT: performance.now(), v: 0, x: 0, sb, id: e.pointerId });
});
document.addEventListener('pointermove', (e) => {
  if (!drawer.active || e.pointerId !== drawer.id) return;
  const pull = e.clientX - drawer.startX;
  if (!drawer.moved) {
    if (Math.abs(pull) < 6) return;
    drawer.moved = true;
    drawer.sb.classList.add('dragging');
    try { drawer.sb.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }
  let x;
  if (pull <= 0) x = pull;                                   // closing: 1:1 with the finger
  else { const over = Math.max(0, pull - 12); x = 64 * (over / (over + 150)); }   // rubber band
  const now = performance.now(), dt = now - drawer.lastT;
  if (dt > 0) drawer.v = 0.8 * (((e.clientX - drawer.lastX) / dt) * 1000) + 0.2 * drawer.v;   // px/s, smoothed
  drawer.lastX = e.clientX; drawer.lastT = now; drawer.x = x;
  paintDrawer(x);
});
function endDrawerDrag(e) {
  if (!drawer.active || e.pointerId !== drawer.id) return;
  drawer.active = false;
  if (!drawer.moved) return;
  drawer.justDragged = true;
  setTimeout(() => { drawer.justDragged = false; }, 0);
  const w = drawer.sb.offsetWidth;
  const close = drawer.x < -w * 0.35 || drawer.v < -500;
  const v0 = drawer.x > 0 ? 0 : drawer.v;                   // rubber band springs back from rest
  springTo(drawer.x, close ? -(w + 16) : 0, v0, paintDrawer, () => {
    if (close) closeMenu();
    drawer.sb.classList.remove('dragging');
    drawer.sb.style.transform = '';
    const scrim = $('.scrim'); if (scrim) scrim.style.opacity = '';
  });
}
document.addEventListener('dragstart', (e) => { if (e.target.closest?.('.sidebar')) e.preventDefault(); });   // links must not start a native drag
document.addEventListener('pointerup', endDrawerDrag);
document.addEventListener('pointercancel', endDrawerDrag);
document.addEventListener('click', (e) => { if (drawer.justDragged) { e.preventDefault(); e.stopPropagation(); } }, true);

/* Boot */
try { document.documentElement.dataset.theme = localStorage.getItem('rms-theme') || document.documentElement.dataset.theme || 'light'; } catch (e) { /* ignore */ }
window.addEventListener('hashchange', router);
router();