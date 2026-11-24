/* ==========================================================================
   RentFlow — Rental Management System Frontend (Mock Service + Role-Based UI)
   ========================================================================== */

const STORAGE_KEY = 'rentflow_rms_state_v1';

const INITIAL_DATA = {
  users: [
    { id: 'u1', email: 'manager@gmail.com', name: 'Elena Reyes', role: 'admin', isActive: true },
    { id: 'u2', email: 'juan.delacruz@gmail.com', name: 'Juan Dela Cruz', role: 'tenant', tenantId: 't1', isActive: true },
    { id: 'u3', email: 'maria.clara@gmail.com', name: 'Maria Clara', role: 'tenant', tenantId: 't2', isActive: true }
  ],
  properties: [
    { id: 'p1', name: 'Cedar Heights Apartments', address: '124 Tibanga Rd, Iligan City', description: '3-storey residential apartment near university belt.' },
    { id: 'p2', name: 'Palm Courtyard Suites', address: '88 Pala-o Ave, Iligan City', description: 'Modern studio and 1-bedroom units with parking.' }
  ],
  units: [
    { id: 'un1', propertyId: 'p1', name: 'Unit 101', type: 'Studio', rent: 4000, status: 'Occupied', notes: 'Ground floor, near gate' },
    { id: 'un2', propertyId: 'p1', name: 'Unit 102', type: '1-Bedroom', rent: 6500, status: 'Occupied', notes: 'With balcony' },
    { id: 'un3', propertyId: 'p1', name: 'Unit 201', type: 'Studio', rent: 4200, status: 'Available', notes: 'Newly painted' },
    { id: 'un4', propertyId: 'p2', name: 'Suite A1', type: '1-Bedroom', rent: 8000, status: 'Occupied', notes: 'Includes 1 parking slot' },
    { id: 'un5', propertyId: 'p2', name: 'Suite A2', type: 'Studio', rent: 5500, status: 'Under Maintenance', notes: 'Plumbing upgrade' }
  ],
  tenants: [
    { id: 't1', userId: 'u2', fullName: 'Juan Dela Cruz', contact: '0917-123-4567', email: 'juan.delacruz@gmail.com', address: 'Cagayan de Oro City', emergencyContact: 'Rosa Dela Cruz (0917-999-1111)' },
    { id: 't2', userId: 'u3', fullName: 'Maria Clara', contact: '0918-234-5678', email: 'maria.clara@gmail.com', address: 'Iligan City', emergencyContact: 'Tiago Santos (0918-888-2222)' },
    { id: 't3', userId: null, fullName: 'Carlo Mendoza', contact: '0920-345-6789', email: 'carlo.mendoza@gmail.com', address: 'Ozamiz City', emergencyContact: 'Ana Mendoza (0920-777-3333)' }
  ],
  leases: [
    { id: 'l1', tenantId: 't1', unitId: 'un1', startDate: '2026-01-01', endDate: '2026-12-31', durationMonths: 12, agreedRent: 4000, deposit: 8000, status: 'Expiring Soon', notes: 'Standard 1-year residential lease.' },
    { id: 'l2', tenantId: 't2', unitId: 'un2', startDate: '2026-03-01', endDate: '2027-02-28', durationMonths: 12, agreedRent: 6500, deposit: 13000, status: 'Active', notes: 'Includes water sub-meter.' },
    { id: 'l3', tenantId: 't3', unitId: 'un4', startDate: '2026-06-01', endDate: '2026-11-30', durationMonths: 6, agreedRent: 8000, deposit: 16000, status: 'Expiring Soon', notes: '6-month lease with parking.' }
  ],
  bills: [
    {
      id: 'b1', leaseId: 'l1', billingPeriod: '2026-10', issueDate: '2026-10-01', dueDate: '2026-10-10',
      items: [
        { description: 'Monthly Rent', category: 'Rent', amount: 4000 },
        { description: 'Electricity (45 kWh)', category: 'Electricity', amount: 500 },
        { description: 'Water', category: 'Water', amount: 200 },
        { description: 'Fiber Internet Share', category: 'Internet', amount: 300 }
      ]
    },
    {
      id: 'b2', leaseId: 'l1', billingPeriod: '2026-11', issueDate: '2026-11-01', dueDate: '2026-11-15',
      items: [
        { description: 'Monthly Rent', category: 'Rent', amount: 4000 },
        { description: 'Electricity', category: 'Electricity', amount: 500 },
        { description: 'Water', category: 'Water', amount: 200 },
        { description: 'Internet', category: 'Internet', amount: 300 },
        { description: 'Parking Slot', category: 'Parking', amount: 500 },
        { description: 'Maintenance Fee', category: 'Maintenance', amount: 150 },
        { description: 'Garbage Collection', category: 'Other Charges', amount: 100 }
      ]
    },
    {
      id: 'b3', leaseId: 'l2', billingPeriod: '2026-11', issueDate: '2026-11-01', dueDate: '2026-11-28',
      items: [
        { description: 'Monthly Rent', category: 'Rent', amount: 6500 },
        { description: 'Electricity', category: 'Electricity', amount: 950 },
        { description: 'Water', category: 'Water', amount: 250 }
      ]
    },
    {
      id: 'b4', leaseId: 'l3', billingPeriod: '2026-11', issueDate: '2026-11-01', dueDate: '2026-11-10',
      items: [
        { description: 'Monthly Rent', category: 'Rent', amount: 8000 },
        { description: 'Electricity', category: 'Electricity', amount: 1200 },
        { description: 'Association Dues', category: 'Association Dues', amount: 400 }
      ]
    }
  ],
  payments: [
    { id: 'pay1', tenantId: 't1', billId: 'b1', amount: 5000, date: '2026-10-08', method: 'GCash', reference: 'GC-8841201', status: 'Verified', notes: 'Paid in full' },
    { id: 'pay2', tenantId: 't1', billId: 'b2', amount: 3000, date: '2026-11-12', method: 'Bank Transfer', reference: 'BPI-559012', status: 'Verified', notes: 'Partial payment for Nov bill' },
    { id: 'pay3', tenantId: 't2', billId: 'b3', amount: 7700, date: '2026-11-20', method: 'GCash', reference: 'GC-9920311', status: 'Pending Verification', notes: 'Uploaded receipt screenshot' }
  ],
  concerns: [
    {
      id: 'c1', tenantId: 't1', propertyId: 'p1', unitId: 'un1', category: 'Plumbing',
      title: 'Leaking kitchen sink faucet',
      description: 'The faucet under the sink drips continuously even when turned off tightly.',
      attachment: 'sink_leak.jpg', status: 'In Progress', assignedTo: 'Elena Reyes', createdAt: '2026-11-18',
      messages: [
        { senderRole: 'tenant', senderName: 'Juan Dela Cruz', text: 'Hi, the kitchen faucet has been leaking since last night.', sentAt: '2026-11-18 09:15' },
        { senderRole: 'manager', senderName: 'Elena Reyes', text: 'Thanks for reporting, Juan. Our plumber is scheduled to visit tomorrow at 2 PM.', sentAt: '2026-11-18 11:30' }
      ]
    },
    {
      id: 'c2', tenantId: 't2', propertyId: 'p1', unitId: 'un2', category: 'Internet',
      title: 'Slow Wi-Fi on 2nd floor',
      description: 'Connection drops intermittently during evening hours.',
      attachment: '', status: 'Pending', assignedTo: 'Unassigned', createdAt: '2026-11-22',
      messages: [
        { senderRole: 'tenant', senderName: 'Maria Clara', text: 'Wi-Fi has been disconnecting every 20 minutes.', sentAt: '2026-11-22 19:40' }
      ]
    }
  ],
  announcements: [
    {
      id: 'a1', title: 'Scheduled Water Tank Cleaning',
      description: 'Water supply at Cedar Heights Apartments will be interrupted on Nov 29 from 9:00 AM to 1:00 PM for routine tank sanitation.',
      category: 'Maintenance', priority: 'High', publishDate: '2026-11-20', expiryDate: '2026-11-30',
      audienceType: 'property', targetPropertyId: 'p1', targetTenantId: null
    },
    {
      id: 'a2', title: 'November Billing Reminder',
      description: 'Please settle your November statements on or before the due date to avoid late fees. Upload your payment reference in the portal.',
      category: 'Payment Reminder', priority: 'Normal', publishDate: '2026-11-10', expiryDate: '2026-11-30',
      audienceType: 'all', targetPropertyId: null, targetTenantId: null
    }
  ],
  notifications: [
    { id: 'n1', userId: 'u2', title: 'Concern Updated', message: 'Your concern "Leaking kitchen sink faucet" is now In Progress.', type: 'concern', targetRoute: 'my-concerns', isRead: false, createdAt: '2026-11-18' },
    { id: 'n2', userId: 'u2', title: 'New Announcement', message: 'Scheduled Water Tank Cleaning at Cedar Heights Apartments.', type: 'announcement', targetRoute: 'announcements', isRead: false, createdAt: '2026-11-20' },
    { id: 'n3', userId: 'u1', title: 'Payment Pending Verification', message: 'Maria Clara submitted a ₱7,700.00 payment for verification.', type: 'payment', targetRoute: 'payments', isRead: false, createdAt: '2026-11-20' },
    { id: 'n4', userId: 'u1', title: 'New Tenant Concern', message: 'Maria Clara reported "Slow Wi-Fi on 2nd floor".', type: 'concern', targetRoute: 'concerns', isRead: false, createdAt: '2026-11-22' }
  ]
};

/* ---------- State & Persistence ---------- */
let state = loadState();
let currentUser = null;
let currentRoute = 'dashboard';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return structuredClone(INITIAL_DATA);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- Helpers & Domain Calculations ---------- */
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const uid = (prefix) => prefix + Math.random().toString(36).slice(2, 8);
const todayISO = () => new Date().toISOString().slice(0, 10);

function getProperty(id) { return state.properties.find(p => p.id === id); }
function getUnit(id) { return state.units.find(u => u.id === id); }
function getTenant(id) { return state.tenants.find(t => t.id === id); }
function getLease(id) { return state.leases.find(l => l.id === id); }

function getBillMetrics(bill) {
  const total = bill.items.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const paid = state.payments
    .filter(p => p.billId === bill.id && p.status === 'Verified')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const balance = Math.max(0, total - paid);
  let status = 'Unpaid';
  if (balance === 0 && total > 0) {
    status = 'Paid';
  } else if (new Date(bill.dueDate) < new Date(todayISO()) && balance > 0) {
    status = 'Overdue';
  } else if (paid > 0 && balance > 0) {
    status = 'Partially Paid';
  }
  return { total, paid, balance, status };
}

function statusBadge(status) {
  const map = {
    'Paid': 'badge-green',
    'Active': 'badge-green',
    'Available': 'badge-green',
    'Verified': 'badge-green',
    'Resolved': 'badge-green',
    'Partially Paid': 'badge-amber',
    'Pending': 'badge-amber',
    'Pending Verification': 'badge-amber',
    'Expiring Soon': 'badge-amber',
    'Under Maintenance': 'badge-amber',
    'In Progress': 'badge-blue',
    'Acknowledged': 'badge-blue',
    'Occupied': 'badge-blue',
    'Unpaid': 'badge-gray',
    'Closed': 'badge-gray',
    'Expired': 'badge-gray',
    'Overdue': 'badge-red',
    'Rejected': 'badge-red',
    'Terminated': 'badge-red',
    'High': 'badge-red',
    'Normal': 'badge-blue'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

let modalOpener = null;

function openModal(title, html) {
  modalOpener = document.activeElement;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-box').setAttribute('aria-labelledby', 'modal-title');
  document.getElementById('modal-close-btn').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  if (modalOpener && typeof modalOpener.focus === 'function') modalOpener.focus();
  modalOpener = null;
}

function notifyUser(userId, title, message, type, targetRoute) {
  if (!userId) return;
  state.notifications.unshift({
    id: uid('n'),
    userId,
    title,
    message,
    type,
    targetRoute,
    isRead: false,
    createdAt: todayISO()
  });
}

/* ---------- Navigation Config ---------- */
const ADMIN_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'properties', label: 'Properties', icon: 'building' },
  { id: 'units', label: 'Units / Spaces', icon: 'door' },
  { id: 'tenants', label: 'Tenants', icon: 'users' },
  { id: 'contracts', label: 'Contracts', icon: 'document' },
  { id: 'billing', label: 'Billing', icon: 'receipt' },
  { id: 'payments', label: 'Payments', icon: 'card' },
  { id: 'concerns', label: 'Concerns', icon: 'tool' },
  { id: 'announcements', label: 'Announcements', icon: 'megaphone' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'reports', label: 'Reports', icon: 'chart' },
  { id: 'settings', label: 'Settings', icon: 'settings' }
];

const TENANT_NAV = [
  { id: 'dashboard', label: 'My Dashboard', icon: 'home' },
  { id: 'my-contract', label: 'My Contract', icon: 'document' },
  { id: 'my-bills', label: 'My Bills', icon: 'receipt' },
  { id: 'my-payments', label: 'My Payments', icon: 'card' },
  { id: 'raise-concern', label: 'Raise a Concern', icon: 'plus' },
  { id: 'my-concerns', label: 'My Concerns', icon: 'tool' },
  { id: 'announcements', label: 'Announcements', icon: 'megaphone' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'profile', label: 'My Profile', icon: 'user' }
];

function navIcon(name) {
  const icons = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    building: '<path d="M3 21V5l9-3 9 3v16M7 9h2M7 13h2M7 17h2M15 9h2M15 13h2M15 17h2M11 21v-4h2v4"/>',
    door: '<path d="M4 21V3h16v18M8 21V7h8v14M13 14h.01"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    receipt: '<path d="M6 2l2 2 2-2 2 2 2-2 2 2 2-2v20l-2-2-2 2-2-2-2 2-2-2-2 2zM8 8h8M8 12h8M8 16h5"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5-5l2.1 2.1-3.5 3.5-2.1-2.1a4 4 0 0 0 5 5l7.1 7.1a2 2 0 0 0 2.8-2.8z"/>',
    megaphone: '<path d="M3 11v2a2 2 0 0 0 2 2h3l9 4V5l-9 4H5a2 2 0 0 0-2 2zM8 15l1 5h3l-1-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    chart: '<path d="M3 3v18h18M7 16v-4M12 16V8M17 16V5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2H12v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L7.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 6 14H5.8v-2H6a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L7.2 9l1.8-1.8.1.1A1.7 1.7 0 0 0 11 7a1.7 1.7 0 0 0 1-1.6v-.2h2v.2A1.7 1.7 0 0 0 15 7a1.7 1.7 0 0 0 1.9-.3l.1-.1L18.8 9l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2H20a1.7 1.7 0 0 0-.6 1z"/>',
    home: '<path d="M3 11l9-8 9 8M5 10v11h14V10M9 21v-6h6v6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
  };
  return `<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.grid}</svg>`;
}

/* ---------- Auth Logic ---------- */
function initAuth() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.dataset.authTab;
      document.getElementById('auth-login-panel').classList.toggle('hidden', mode !== 'login');
      document.getElementById('auth-signup-panel').classList.toggle('hidden', mode !== 'signup');
      document.getElementById('auth-pending-panel').classList.add('hidden');
    });
  });

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    handleLogin(email);
  });

  document.getElementById('demo-admin-btn').addEventListener('click', () => handleLogin('manager@gmail.com'));
  document.getElementById('demo-tenant-btn').addEventListener('click', () => handleLogin('juan.delacruz@gmail.com'));

  document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const errEl = document.getElementById('signup-error');

    if (!email.endsWith('@gmail.com')) {
      errEl.textContent = 'Only verified @gmail.com addresses are allowed.';
      errEl.classList.remove('hidden');
      return;
    }
    errEl.classList.add('hidden');

    // Check if tenant record already exists for automatic linking
    const existingTenant = state.tenants.find(t => t.email.toLowerCase() === email);
    if (existingTenant) {
      const newUser = { id: uid('u'), email, name: existingTenant.fullName, role: 'tenant', tenantId: existingTenant.id, isActive: true };
      state.users.push(newUser);
      existingTenant.userId = newUser.id;
      saveState();
      showToast('Account linked to your tenant record!');
      enterApp(newUser);
    } else {
      document.getElementById('auth-signup-panel').classList.add('hidden');
      document.getElementById('auth-pending-panel').classList.remove('hidden');
      document.getElementById('pending-email-text').textContent =
        `${name} (${email}) is authenticated with Google, but is not yet linked to an authorized tenant or staff record.`;
    }
  });

  document.getElementById('back-to-login-btn').addEventListener('click', () => {
    document.getElementById('auth-pending-panel').classList.add('hidden');
    document.getElementById('auth-login-panel').classList.remove('hidden');
    document.querySelectorAll('.auth-tab')[0].click();
  });
}

function handleLogin(email) {
  const errEl = document.getElementById('login-error');
  if (!email.endsWith('@gmail.com')) {
    errEl.textContent = 'Strict Gmail policy: please use a @gmail.com email address.';
    errEl.classList.remove('hidden');
    return;
  }
  const user = state.users.find(u => u.email.toLowerCase() === email);
  if (!user) {
    document.getElementById('auth-login-panel').classList.add('hidden');
    document.getElementById('auth-pending-panel').classList.remove('hidden');
    document.getElementById('pending-email-text').textContent =
      `The Google account (${email}) is not yet authorized. Ask your administrator to link your account.`;
    return;
  }
  errEl.classList.add('hidden');
  enterApp(user);
}

function enterApp(user) {
  currentUser = user;
  currentRoute = 'dashboard';
  document.getElementById('auth-view').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');

  document.getElementById('role-badge-text').textContent = user.role === 'admin' ? 'Admin / Manager' : 'Tenant Portal';
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-avatar').textContent = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  renderSidebar();
  renderNotificationBell();
  navigate('dashboard');
}

function logout() {
  currentUser = null;
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('auth-view').classList.remove('hidden');
  showToast('Signed out successfully.');
}

/* ---------- Shell & Navigation ---------- */
function renderSidebar() {
  const items = currentUser.role === 'admin' ? ADMIN_NAV : TENANT_NAV;
  const unreadNotifs = state.notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;
  const openConcerns = currentUser.role === 'admin'
    ? state.concerns.filter(c => !['Resolved', 'Closed'].includes(c.status)).length
    : state.concerns.filter(c => c.tenantId === currentUser.tenantId && !['Resolved', 'Closed'].includes(c.status)).length;

  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = items.map(item => {
    let count = '';
    if (item.id === 'notifications' && unreadNotifs > 0) count = `<span class="nav-count">${unreadNotifs}</span>`;
    if ((item.id === 'concerns' || item.id === 'my-concerns') && openConcerns > 0) count = `<span class="nav-count">${openConcerns}</span>`;
    return `
      <button class="nav-item ${currentRoute === item.id ? 'active' : ''}" data-route="${item.id}" ${currentRoute === item.id ? 'aria-current="page"' : ''}>
        <span class="nav-item-left">${navIcon(item.icon)}<span>${item.label}</span></span>
        ${count}
      </button>`;
  }).join('');

  nav.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(btn.dataset.route);
      closeMobileSidebar();
    });
  });
}

function renderNotificationBell() {
  const myNotifs = state.notifications.filter(n => n.userId === currentUser.id);
  const unread = myNotifs.filter(n => !n.isRead).length;
  const badge = document.getElementById('notif-badge');
  badge.textContent = unread;
  badge.classList.toggle('hidden', unread === 0);

  const list = document.getElementById('notif-dropdown-list');
  if (!myNotifs.length) {
    list.innerHTML = `<div class="empty-state" style="padding:20px;">No notifications yet.</div>`;
    return;
  }
  list.innerHTML = myNotifs.slice(0, 5).map(n => `
    <button type="button" class="notif-item ${n.isRead ? '' : 'unread'}" data-nid="${n.id}" data-route="${n.targetRoute}">
      <strong>${n.title}</strong>
      <span class="muted" style="font-size:12px;">${n.message}</span>
      <small class="muted">${n.createdAt}</small>
    </button>
  `).join('');

  list.querySelectorAll('.notif-item').forEach(el => {
    el.addEventListener('click', () => {
      const n = state.notifications.find(x => x.id === el.dataset.nid);
      if (n) n.isRead = true;
      saveState();
      document.getElementById('notif-dropdown').classList.add('hidden');
      renderNotificationBell();
      renderSidebar();
      navigate(el.dataset.route);
    });
  });
}

function navigate(route) {
  currentRoute = route;
  renderSidebar();
  const navItems = currentUser.role === 'admin' ? ADMIN_NAV : TENANT_NAV;
  const meta = navItems.find(i => i.id === route) || { label: 'Dashboard' };
  document.getElementById('page-title').textContent = meta.label;
  document.getElementById('page-subtitle').textContent = currentUser.role === 'admin'
    ? 'Administrator & Property Manager Portal'
    : 'Tenant Self-Service Portal';

  const content = document.getElementById('content-area');
  if (currentUser.role === 'admin') {
    const views = {
      dashboard: renderAdminDashboard,
      properties: renderProperties,
      units: renderUnits,
      tenants: renderTenants,
      contracts: renderContracts,
      billing: renderBilling,
      payments: renderPayments,
      concerns: renderAdminConcerns,
      announcements: renderAnnouncements,
      notifications: renderNotificationsPage,
      reports: renderReports,
      settings: renderSettings
    };
    (views[route] || renderAdminDashboard)(content);
  } else {
    const views = {
      dashboard: renderTenantDashboard,
      'my-contract': renderTenantContract,
      'my-bills': renderTenantBills,
      'my-payments': renderTenantPayments,
      'raise-concern': renderRaiseConcern,
      'my-concerns': renderTenantConcerns,
      announcements: renderAnnouncements,
      notifications: renderNotificationsPage,
      profile: renderTenantProfile
    };
    (views[route] || renderTenantDashboard)(content);
  }
}

/* ==========================================================================
   ADMIN / MANAGER VIEWS
   ========================================================================== */
function renderAdminDashboard(el) {
  const totalProps = state.properties.length;
  const totalUnits = state.units.length;
  const occupiedUnits = state.units.filter(u => u.status === 'Occupied').length;
  const availableUnits = state.units.filter(u => u.status === 'Available').length;
  const billStats = state.bills.map(b => ({ bill: b, ...getBillMetrics(b) }));
  const paidCount = billStats.filter(b => b.status === 'Paid').length;
  const unpaidCount = billStats.filter(b => b.status === 'Unpaid' || b.status === 'Partially Paid').length;
  const overdueCount = billStats.filter(b => b.status === 'Overdue').length;
  const totalCollections = state.payments.filter(p => p.status === 'Verified').reduce((s, p) => s + Number(p.amount), 0);

  const expiringLeases = state.leases.filter(l => l.status === 'Expiring Soon');
  const openConcerns = state.concerns.filter(c => !['Resolved', 'Closed'].includes(c.status));

  el.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Total Collections</div><div class="kpi-value">${peso(totalCollections)}</div><div class="kpi-sub">Verified payments</div></div>
      <div class="kpi-card"><div class="kpi-label">Properties / Units</div><div class="kpi-value">${totalProps} / ${totalUnits}</div><div class="kpi-sub">${occupiedUnits} Occupied • ${availableUnits} Available</div></div>
      <div class="kpi-card"><div class="kpi-label">Total Tenants</div><div class="kpi-value">${state.tenants.length}</div><div class="kpi-sub">${state.leases.filter(l => ['Active','Expiring Soon'].includes(l.status)).length} Active leases</div></div>
      <div class="kpi-card"><div class="kpi-label">Paid / Unpaid Bills</div><div class="kpi-value">${paidCount} / ${unpaidCount}</div><div class="kpi-sub">${overdueCount} Overdue bill(s)</div></div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><h3 class="card-title">Monthly Collections (₱)</h3></div>
        <div class="card-body">
          <div class="bar-chart">
            ${[
              { m: 'Aug', v: 16500 },
              { m: 'Sep', v: 18200 },
              { m: 'Oct', v: 5000 },
              { m: 'Nov', v: totalCollections - 5000 > 0 ? totalCollections - 5000 : 3000 }
            ].map(d => `
              <div class="bar-col">
                <span class="bar-val">${peso(d.v).replace('.00','')}</span>
                <div class="bar-fill" style="height:${Math.min(100, Math.round((d.v / 22000) * 100))}%"></div>
                <span class="bar-lbl">${d.m}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3 class="card-title">Bill Status Distribution</h3></div>
        <div class="card-body">
          ${[
            { label: 'Paid', count: paidCount, color: '#1E7E34' },
            { label: 'Unpaid / Partially Paid', count: unpaidCount, color: '#B45309' },
            { label: 'Overdue', count: overdueCount, color: '#B91C1C' }
          ].map(row => {
            const pct = state.bills.length ? Math.round((row.count / state.bills.length) * 100) : 0;
            return `
              <div class="progress-row">
                <div class="progress-head"><span>${row.label}</span><strong>${row.count} (${pct}%)</strong></div>
                <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${row.color};"></div></div>
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Overdue & Unpaid Bills</h3>
          <button class="link-btn" onclick="navigate('billing')">View all</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Tenant</th><th>Period</th><th>Balance</th><th>Status</th></tr></thead>
            <tbody>
              ${billStats.filter(b => b.balance > 0).map(b => {
                const lease = getLease(b.bill.leaseId);
                const tenant = getTenant(lease?.tenantId);
                return `<tr>
                  <td>${tenant?.fullName || '—'}</td>
                  <td>${b.bill.billingPeriod}</td>
                  <td class="font-mono">${peso(b.balance)}</td>
                  <td>${statusBadge(b.status)}</td>
                </tr>`;
              }).join('') || `<tr><td colspan="4" class="empty-state">All bills are settled!</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Expiring Contracts & Open Concerns</h3>
          <button class="link-btn" onclick="navigate('concerns')">Open inbox</button>
        </div>
        <div class="card-body stack-md">
          <div>
            <strong style="font-size:12.5px;" class="muted">CONTRACTS EXPIRING SOON (${expiringLeases.length})</strong>
            ${expiringLeases.map(l => `
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
                <span>${getTenant(l.tenantId)?.fullName} • ${getUnit(l.unitId)?.name}</span>
                <span class="muted">Ends ${l.endDate}</span>
              </div>
            `).join('') || `<p class="muted">No contracts expiring soon.</p>`}
          </div>
          <div>
            <strong style="font-size:12.5px;" class="muted">NEWEST OPEN CONCERNS (${openConcerns.length})</strong>
            ${openConcerns.slice(0, 3).map(c => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">
                <span>${c.title} <small class="muted">(${c.category})</small></span>
                ${statusBadge(c.status)}
              </div>
            `).join('') || `<p class="muted">No open concerns.</p>`}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProperties(el) {
  el.innerHTML = `
    <div class="toolbar">
      <input type="search" id="prop-search" placeholder="Search properties..." />
      <button class="btn btn-primary" id="add-prop-btn">+ Add Property</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Property Name</th><th>Address</th><th>Units</th><th>Occupancy</th><th>Description</th></tr></thead>
          <tbody id="prop-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  const renderRows = (q = '') => {
    const filtered = state.properties.filter(p => (p.name + p.address).toLowerCase().includes(q.toLowerCase()));
    document.getElementById('prop-tbody').innerHTML = filtered.map(p => {
      const units = state.units.filter(u => u.propertyId === p.id);
      const occ = units.filter(u => u.status === 'Occupied').length;
      return `<tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.address}</td>
        <td>${units.length}</td>
        <td>${occ} / ${units.length} Occupied</td>
        <td class="muted">${p.description}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="5" class="empty-state">No properties found.</td></tr>`;
  };
  renderRows();

  document.getElementById('prop-search').addEventListener('input', e => renderRows(e.target.value));
  document.getElementById('add-prop-btn').addEventListener('click', () => {
    openModal('Add Property', `
      <form id="prop-form" class="stack-md">
        <div class="form-group"><label>Property Name <span class="req">*</span></label><input id="pf-name" required /></div>
        <div class="form-group"><label>Address <span class="req">*</span></label><input id="pf-address" required /></div>
        <div class="form-group"><label>Description</label><textarea id="pf-desc" rows="3"></textarea></div>
        <div class="btn-row"><button type="submit" class="btn btn-primary">Save Property</button><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button></div>
      </form>
    `);
    document.getElementById('prop-form').addEventListener('submit', e => {
      e.preventDefault();
      state.properties.push({
        id: uid('p'),
        name: document.getElementById('pf-name').value.trim(),
        address: document.getElementById('pf-address').value.trim(),
        description: document.getElementById('pf-desc').value.trim()
      });
      saveState();
      closeModal();
      showToast('Property added.');
      renderProperties(el);
    });
  });
}

function renderUnits(el) {
  el.innerHTML = `
    <div class="toolbar">
      <div class="toolbar-filters">
        <select id="unit-status-filter">
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
      </div>
      <button class="btn btn-primary" id="add-unit-btn">+ Add Unit</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Unit</th><th>Property</th><th>Type</th><th>Monthly Rent</th><th>Status</th><th>Notes</th></tr></thead>
          <tbody id="unit-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  const renderRows = (status = '') => {
    const list = state.units.filter(u => !status || u.status === status);
    document.getElementById('unit-tbody').innerHTML = list.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${getProperty(u.propertyId)?.name || '—'}</td>
        <td>${u.type}</td>
        <td class="font-mono">${peso(u.rent)}</td>
        <td>${statusBadge(u.status)}</td>
        <td class="muted">${u.notes || '—'}</td>
      </tr>
    `).join('') || `<tr><td colspan="6" class="empty-state">No units match the filter.</td></tr>`;
  };
  renderRows();

  document.getElementById('unit-status-filter').addEventListener('change', e => renderRows(e.target.value));
  document.getElementById('add-unit-btn').addEventListener('click', () => {
    openModal('Add Unit / Space', `
      <form id="unit-form" class="form-grid">
        <div class="form-group"><label>Property <span class="req">*</span></label>
          <select id="uf-prop" required>${state.properties.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Unit Name / No. <span class="req">*</span></label><input id="uf-name" placeholder="e.g., Unit 202" required /></div>
        <div class="form-group"><label>Unit Type</label><input id="uf-type" placeholder="Studio / 1-Bedroom" value="Studio" /></div>
        <div class="form-group"><label>Monthly Rent (₱) <span class="req">*</span></label><input type="number" id="uf-rent" min="0" required /></div>
        <div class="form-group"><label>Status</label>
          <select id="uf-status"><option>Available</option><option>Occupied</option><option>Under Maintenance</option></select>
        </div>
        <div class="form-group"><label>Notes</label><input id="uf-notes" /></div>
        <div class="form-group full btn-row"><button type="submit" class="btn btn-primary">Save Unit</button><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button></div>
      </form>
    `);
    document.getElementById('unit-form').addEventListener('submit', e => {
      e.preventDefault();
      state.units.push({
        id: uid('un'),
        propertyId: document.getElementById('uf-prop').value,
        name: document.getElementById('uf-name').value.trim(),
        type: document.getElementById('uf-type').value.trim(),
        rent: Number(document.getElementById('uf-rent').value),
        status: document.getElementById('uf-status').value,
        notes: document.getElementById('uf-notes').value.trim()
      });
      saveState();
      closeModal();
      showToast('Unit added.');
      renderUnits(el);
    });
  });
}

function renderTenants(el) {
  el.innerHTML = `
    <div class="toolbar">
      <input type="search" id="tenant-search" placeholder="Search tenants..." />
      <button class="btn btn-primary" id="add-tenant-btn">+ Add Tenant</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Full Name</th><th>Email</th><th>Contact</th><th>Google Account</th><th>Active Unit</th></tr></thead>
          <tbody id="tenant-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  const renderRows = (q = '') => {
    const list = state.tenants.filter(t => (t.fullName + t.email).toLowerCase().includes(q.toLowerCase()));
    document.getElementById('tenant-tbody').innerHTML = list.map(t => {
      const lease = state.leases.find(l => l.tenantId === t.id && ['Active', 'Expiring Soon'].includes(l.status));
      const unit = lease ? getUnit(lease.unitId)?.name : 'None';
      return `<tr>
        <td><strong>${t.fullName}</strong></td>
        <td>${t.email}</td>
        <td>${t.contact}</td>
        <td>${t.userId ? statusBadge('Active') : statusBadge('Pending')}</td>
        <td>${unit}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="5" class="empty-state">No tenants found.</td></tr>`;
  };
  renderRows();

  document.getElementById('tenant-search').addEventListener('input', e => renderRows(e.target.value));
  document.getElementById('add-tenant-btn').addEventListener('click', () => {
    openModal('Add Tenant', `
      <form id="tenant-form" class="form-grid">
        <div class="form-group"><label>Full Name <span class="req">*</span></label><input id="tf-name" required /></div>
        <div class="form-group"><label>Gmail Address <span class="req">*</span></label><input type="email" id="tf-email" placeholder="tenant@gmail.com" required /></div>
        <div class="form-group"><label>Contact Number <span class="req">*</span></label><input id="tf-contact" required /></div>
        <div class="form-group"><label>Emergency Contact</label><input id="tf-emergency" /></div>
        <div class="form-group full"><label>Address</label><input id="tf-address" /></div>
        <div class="form-group full btn-row"><button type="submit" class="btn btn-primary">Save Tenant</button><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button></div>
      </form>
    `);
    document.getElementById('tenant-form').addEventListener('submit', e => {
      e.preventDefault();
      state.tenants.push({
        id: uid('t'), userId: null,
        fullName: document.getElementById('tf-name').value.trim(),
        email: document.getElementById('tf-email').value.trim(),
        contact: document.getElementById('tf-contact').value.trim(),
        emergencyContact: document.getElementById('tf-emergency').value.trim(),
        address: document.getElementById('tf-address').value.trim()
      });
      saveState();
      closeModal();
      showToast('Tenant record created.');
      renderTenants(el);
    });
  });
}

function renderContracts(el) {
  el.innerHTML = `
    <div class="toolbar">
      <span class="muted">Historical leases are preserved; renewals create new records.</span>
      <button class="btn btn-primary" id="add-lease-btn">+ Create Contract</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Tenant</th><th>Property / Unit</th><th>Term</th><th>Duration</th><th>Monthly Rent</th><th>Deposit</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${state.leases.map(l => {
              const unit = getUnit(l.unitId);
              const prop = getProperty(unit?.propertyId);
              return `<tr>
                <td><strong>${getTenant(l.tenantId)?.fullName || '—'}</strong></td>
                <td>${prop?.name || ''} — ${unit?.name || ''}</td>
                <td>${l.startDate} to ${l.endDate}</td>
                <td>${l.durationMonths} mos</td>
                <td class="font-mono">${peso(l.agreedRent)}</td>
                <td class="font-mono">${peso(l.deposit)}</td>
                <td>${statusBadge(l.status)}</td>
                <td>
                  ${['Active','Expiring Soon'].includes(l.status)
                    ? `<button class="btn btn-danger btn-sm" onclick="terminateLease('${l.id}')">Terminate</button>`
                    : '<span class="muted">—</span>'}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('add-lease-btn').addEventListener('click', () => {
    const availUnits = state.units.filter(u => u.status === 'Available');
    openModal('Create Lease Contract', `
      <form id="lease-form" class="form-grid">
        <div class="form-group"><label>Tenant <span class="req">*</span></label>
          <select id="lf-tenant" required>${state.tenants.map(t => `<option value="${t.id}">${t.fullName}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Available Unit <span class="req">*</span></label>
          <select id="lf-unit" required>${availUnits.length ? availUnits.map(u => `<option value="${u.id}">${getProperty(u.propertyId)?.name} - ${u.name} (${peso(u.rent)})</option>`).join('') : '<option value="">No available units</option>'}</select>
        </div>
        <div class="form-group"><label>Start Date <span class="req">*</span></label><input type="date" id="lf-start" value="${todayISO()}" required /></div>
        <div class="form-group"><label>Duration (Months) <span class="req">*</span></label>
          <select id="lf-dur"><option value="1">1 Month</option><option value="3">3 Months</option><option value="6">6 Months</option><option value="12" selected>12 Months</option></select>
        </div>
        <div class="form-group"><label>Agreed Monthly Rent (₱) <span class="req">*</span></label><input type="number" id="lf-rent" value="${availUnits[0]?.rent || 4000}" required /></div>
        <div class="form-group"><label>Security Deposit (₱)</label><input type="number" id="lf-dep" value="${(availUnits[0]?.rent || 4000) * 2}" /></div>
        <div class="form-group full btn-row"><button type="submit" class="btn btn-primary" ${availUnits.length ? '' : 'disabled'}>Create Contract</button><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button></div>
      </form>
    `);
    document.getElementById('lease-form').addEventListener('submit', e => {
      e.preventDefault();
      const unitId = document.getElementById('lf-unit').value;
      if (!unitId) return;
      const start = document.getElementById('lf-start').value;
      const dur = Number(document.getElementById('lf-dur').value);
      const endObj = new Date(start);
      endObj.setMonth(endObj.getMonth() + dur);
      const endDate = endObj.toISOString().slice(0, 10);

      state.leases.unshift({
        id: uid('l'),
        tenantId: document.getElementById('lf-tenant').value,
        unitId,
        startDate: start,
        endDate,
        durationMonths: dur,
        agreedRent: Number(document.getElementById('lf-rent').value),
        deposit: Number(document.getElementById('lf-dep').value || 0),
        status: 'Active',
        notes: ''
      });
      const unit = getUnit(unitId);
      if (unit) unit.status = 'Occupied';
      saveState();
      closeModal();
      showToast('Lease contract created.');
      renderContracts(el);
    });
  });
}

window.terminateLease = (leaseId) => {
  if (!confirm('Are you sure you want to terminate this lease contract?')) return;
  const lease = getLease(leaseId);
  if (lease) {
    lease.status = 'Terminated';
    const unit = getUnit(lease.unitId);
    if (unit) unit.status = 'Available';
    saveState();
    showToast('Contract terminated and unit marked Available.');
    navigate('contracts');
  }
};

function renderBilling(el) {
  el.innerHTML = `
    <div class="toolbar">
      <div class="toolbar-filters">
        <select id="bill-status-filter">
          <option value="">All Statuses</option>
          <option>Paid</option><option>Partially Paid</option><option>Unpaid</option><option>Overdue</option>
        </select>
      </div>
      <button class="btn btn-primary" id="add-bill-btn">+ Generate Bill</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Tenant / Unit</th><th>Period</th><th>Due Date</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
          <tbody id="bill-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  const renderRows = (filter = '') => {
    const rows = state.bills.map(b => ({ bill: b, ...getBillMetrics(b) }))
      .filter(x => !filter || x.status === filter);
    document.getElementById('bill-tbody').innerHTML = rows.map(x => {
      const lease = getLease(x.bill.leaseId);
      const tenant = getTenant(lease?.tenantId);
      const unit = getUnit(lease?.unitId);
      return `<tr>
        <td><strong>${tenant?.fullName || '—'}</strong><br><small class="muted">${unit?.name || ''}</small></td>
        <td>${x.bill.billingPeriod}</td>
        <td>${x.bill.dueDate}</td>
        <td class="font-mono">${peso(x.total)}</td>
        <td class="font-mono">${peso(x.paid)}</td>
        <td class="font-mono"><strong>${peso(x.balance)}</strong></td>
        <td>${statusBadge(x.status)}</td>
        <td><button class="btn btn-outline btn-sm" onclick="viewBillDetail('${x.bill.id}')">Statement</button></td>
      </tr>`;
    }).join('') || `<tr><td colspan="8" class="empty-state">No bills found.</td></tr>`;
  };
  renderRows();

  document.getElementById('bill-status-filter').addEventListener('change', e => renderRows(e.target.value));
  document.getElementById('add-bill-btn').addEventListener('click', () => {
    const activeLeases = state.leases.filter(l => ['Active', 'Expiring Soon'].includes(l.status));
    openModal('Generate Recurring Bill', `
      <form id="bill-form" class="stack-md">
        <div class="form-grid">
          <div class="form-group"><label>Active Lease <span class="req">*</span></label>
            <select id="bf-lease" required>${activeLeases.map(l => `<option value="${l.id}">${getTenant(l.tenantId)?.fullName} — ${getUnit(l.unitId)?.name} (${peso(l.agreedRent)})</option>`).join('')}</select>
          </div>
          <div class="form-group"><label>Billing Period <span class="req">*</span></label><input type="month" id="bf-period" value="2026-12" required /></div>
          <div class="form-group"><label>Due Date <span class="req">*</span></label><input type="date" id="bf-due" value="2026-12-10" required /></div>
        </div>
        <div class="stack-sm">
          <label style="font-weight:600;font-size:13px;">Additional Charges (Rent is added automatically)</label>
          <div id="extra-items" class="stack-sm">
            <div class="form-grid">
              <input placeholder="Description (e.g., Electricity)" class="ei-desc" value="Electricity" />
              <input type="number" placeholder="Amount (₱)" class="ei-amt" value="500" />
            </div>
            <div class="form-grid">
              <input placeholder="Description (e.g., Water)" class="ei-desc" value="Water" />
              <input type="number" placeholder="Amount (₱)" class="ei-amt" value="200" />
            </div>
          </div>
          <button type="button" class="btn btn-outline btn-sm" id="add-line-item-btn">+ Add Custom Charge</button>
        </div>
        <div class="btn-row"><button type="submit" class="btn btn-primary">Publish Bill</button><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button></div>
      </form>
    `);

    document.getElementById('add-line-item-btn').addEventListener('click', () => {
      const row = document.createElement('div');
      row.className = 'form-grid';
      row.innerHTML = `<input placeholder="Charge description" class="ei-desc" /><input type="number" placeholder="Amount (₱)" class="ei-amt" />`;
      document.getElementById('extra-items').appendChild(row);
    });

    document.getElementById('bill-form').addEventListener('submit', e => {
      e.preventDefault();
      const lease = getLease(document.getElementById('bf-lease').value);
      const items = [{ description: 'Monthly Rent', category: 'Rent', amount: lease.agreedRent }];
      const descs = document.querySelectorAll('.ei-desc');
      const amts = document.querySelectorAll('.ei-amt');
      descs.forEach((d, idx) => {
        const amt = Number(amts[idx].value);
        if (d.value.trim() && amt > 0) items.push({ description: d.value.trim(), category: 'Other Charges', amount: amt });
      });

      const bill = {
        id: uid('b'),
        leaseId: lease.id,
        billingPeriod: document.getElementById('bf-period').value,
        issueDate: todayISO(),
        dueDate: document.getElementById('bf-due').value,
        items
      };
      state.bills.unshift(bill);
      const tenant = getTenant(lease.tenantId);
      notifyUser(tenant?.userId, 'New Bill Published', `Statement for ${bill.billingPeriod} is now available.`, 'bill', 'my-bills');
      saveState();
      closeModal();
      showToast('Bill published and tenant notified.');
      renderBilling(el);
    });
  });
}

window.viewBillDetail = (billId) => {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) return;
  const lease = getLease(bill.leaseId);
  const tenant = getTenant(lease?.tenantId);
  const unit = getUnit(lease?.unitId);
  const m = getBillMetrics(bill);

  openModal(`Bill Statement — ${bill.billingPeriod}`, `
    <div class="stack-md">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <div><strong>${tenant?.fullName || '—'}</strong><br><span class="muted">${unit?.name || ''} • Due ${bill.dueDate}</span></div>
        <div>${statusBadge(m.status)}</div>
      </div>
      <table class="breakdown-table">
        <thead><tr><th>Charge Description</th><th class="text-right">Amount</th></tr></thead>
        <tbody>
          ${bill.items.map(i => `<tr><td>${i.description}</td><td class="text-right font-mono">${peso(i.amount)}</td></tr>`).join('')}
          <tr class="breakdown-total"><td>Total Amount</td><td class="text-right font-mono">${peso(m.total)}</td></tr>
          <tr><td>Verified Payments</td><td class="text-right font-mono">${peso(m.paid)}</td></tr>
          <tr><td><strong>Outstanding Balance</strong></td><td class="text-right font-mono"><strong>${peso(m.balance)}</strong></td></tr>
        </tbody>
      </table>
      <div class="btn-row">
        <button class="btn btn-primary btn-sm" onclick="window.print()">Print Statement</button>
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
};

function renderPayments(el) {
  el.innerHTML = `
    <div class="toolbar">
      <span class="muted">Partial payments are allocated to bills without overwriting original totals.</span>
      <button class="btn btn-primary" id="record-pay-btn">+ Record Payment</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Tenant</th><th>Bill Period</th><th>Amount</th><th>Method / Ref</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${state.payments.map(p => {
              const bill = state.bills.find(b => b.id === p.billId);
              return `<tr>
                <td>${p.date}</td>
                <td><strong>${getTenant(p.tenantId)?.fullName || '—'}</strong></td>
                <td>${bill?.billingPeriod || '—'}</td>
                <td class="font-mono">${peso(p.amount)}</td>
                <td>${p.method}<br><small class="muted">${p.reference}</small></td>
                <td>${statusBadge(p.status)}</td>
                <td>
                  ${p.status === 'Pending Verification' ? `
                    <div class="btn-row">
                      <button class="btn btn-primary btn-sm" onclick="verifyPayment('${p.id}','Verified')">Verify</button>
                      <button class="btn btn-danger btn-sm" onclick="verifyPayment('${p.id}','Rejected')">Reject</button>
                    </div>
                  ` : `<span class="muted">—</span>`}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('record-pay-btn').addEventListener('click', () => {
    const openBills = state.bills.filter(b => getBillMetrics(b).balance > 0);
    openBills.length ? openModal('Record Tenant Payment', `
      <form id="pay-form" class="form-grid">
        <div class="form-group full"><label>Target Bill <span class="req">*</span></label>
          <select id="py-bill" required>${openBills.map(b => {
            const l = getLease(b.leaseId);
            const m = getBillMetrics(b);
            return `<option value="${b.id}">${getTenant(l?.tenantId)?.fullName} — ${b.billingPeriod} (Bal: ${peso(m.balance)})</option>`;
          }).join('')}</select>
        </div>
        <div class="form-group"><label>Amount (₱) <span class="req">*</span></label><input type="number" id="py-amt" min="1" required /></div>
        <div class="form-group"><label>Payment Date <span class="req">*</span></label><input type="date" id="py-date" value="${todayISO()}" required /></div>
        <div class="form-group"><label>Method</label><select id="py-method"><option>GCash</option><option>Bank Transfer</option><option>Cash</option></select></div>
        <div class="form-group"><label>Reference No.</label><input id="py-ref" placeholder="e.g., GC-102938" /></div>
        <div class="form-group full btn-row"><button type="submit" class="btn btn-primary">Save & Verify Payment</button><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button></div>
      </form>
    `) : showToast('All bills are already fully paid.');

    const form = document.getElementById('pay-form');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const bill = state.bills.find(b => b.id === document.getElementById('py-bill').value);
        const lease = getLease(bill.leaseId);
        state.payments.unshift({
          id: uid('pay'),
          tenantId: lease.tenantId,
          billId: bill.id,
          amount: Number(document.getElementById('py-amt').value),
          date: document.getElementById('py-date').value,
          method: document.getElementById('py-method').value,
          reference: document.getElementById('py-ref').value.trim() || 'CASH',
          status: 'Verified',
          notes: 'Recorded by manager'
        });
        saveState();
        closeModal();
        showToast('Payment recorded and allocated.');
        renderPayments(el);
      });
    }
  });
}

window.verifyPayment = (payId, status) => {
  const pay = state.payments.find(p => p.id === payId);
  if (!pay) return;
  pay.status = status;
  const tenant = getTenant(pay.tenantId);
  notifyUser(tenant?.userId, `Payment ${status}`, `Your payment of ${peso(pay.amount)} (${pay.reference}) was ${status.toLowerCase()}.`, 'payment', 'my-payments');
  saveState();
  showToast(`Payment marked as ${status}.`);
  navigate('payments');
};

function renderAdminConcerns(el) {
  el.innerHTML = `
    <div class="toolbar">
      <select id="concern-status-filter">
        <option value="">All Statuses</option>
        <option>Pending</option><option>Acknowledged</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
      </select>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Title</th><th>Tenant / Unit</th><th>Category</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody id="concern-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  const renderRows = (status = '') => {
    const list = state.concerns.filter(c => !status || c.status === status);
    document.getElementById('concern-tbody').innerHTML = list.map(c => `
      <tr>
        <td><strong>${c.title}</strong></td>
        <td>${getTenant(c.tenantId)?.fullName || '—'}<br><small class="muted">${getUnit(c.unitId)?.name || ''}</small></td>
        <td>${c.category}</td>
        <td>${c.createdAt}</td>
        <td>${statusBadge(c.status)}</td>
        <td><button class="btn btn-outline btn-sm" onclick="openConcernThread('${c.id}')">Open Thread</button></td>
      </tr>
    `).join('') || `<tr><td colspan="6" class="empty-state">No concerns found.</td></tr>`;
  };
  renderRows();
  document.getElementById('concern-status-filter').addEventListener('change', e => renderRows(e.target.value));
}

window.openConcernThread = (concernId) => {
  const c = state.concerns.find(x => x.id === concernId);
  if (!c) return;
  const isAdmin = currentUser.role === 'admin';

  openModal(c.title, `
    <div class="stack-md">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <span class="muted">${c.category} • Reported ${c.createdAt}</span>
        ${statusBadge(c.status)}
      </div>
      <p>${c.description}</p>
      ${isAdmin ? `
        <div class="form-group">
          <label>Update Status</label>
          <select id="ct-status">
            ${['Pending','Acknowledged','In Progress','Resolved','Closed'].map(s => `<option ${c.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      ` : ''}
      <div class="thread-list">
        ${c.messages.map(m => `
          <div class="thread-msg ${m.senderRole}">
            <div class="thread-meta"><strong>${m.senderName}</strong> • ${m.sentAt}</div>
            <div>${m.text}</div>
          </div>
        `).join('')}
      </div>
      <form id="reply-form" class="stack-sm">
        <textarea id="ct-reply" rows="2" placeholder="Write a reply..." required></textarea>
        <div class="btn-row">
          <button type="submit" class="btn btn-primary btn-sm">Send Reply</button>
          <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Close</button>
        </div>
      </form>
    </div>
  `);

  if (isAdmin) {
    document.getElementById('ct-status').addEventListener('change', e => {
      c.status = e.target.value;
      const tenant = getTenant(c.tenantId);
      notifyUser(tenant?.userId, 'Concern Status Updated', `"${c.title}" is now ${c.status}.`, 'concern', 'my-concerns');
      saveState();
      showToast(`Concern status updated to ${c.status}.`);
      renderSidebar();
      navigate(currentRoute);
      openConcernThread(concernId);
    });
  }

  document.getElementById('reply-form').addEventListener('submit', e => {
    e.preventDefault();
    const text = document.getElementById('ct-reply').value.trim();
    if (!text) return;
    c.messages.push({
      senderRole: isAdmin ? 'manager' : 'tenant',
      senderName: currentUser.name,
      text,
      sentAt: new Date().toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    if (isAdmin) {
      const tenant = getTenant(c.tenantId);
      notifyUser(tenant?.userId, 'Manager Replied to Concern', `${currentUser.name} replied on "${c.title}".`, 'concern', 'my-concerns');
    } else {
      notifyUser('u1', 'Tenant Replied to Concern', `${currentUser.name} replied on "${c.title}".`, 'concern', 'concerns');
    }
    saveState();
    openConcernThread(concernId);
  });
};

function renderAnnouncements(el) {
  const isAdmin = currentUser.role === 'admin';
  let list = state.announcements;
  if (!isAdmin) {
    const lease = state.leases.find(l => l.tenantId === currentUser.tenantId && ['Active', 'Expiring Soon'].includes(l.status));
    const unit = lease ? getUnit(lease.unitId) : null;
    list = state.announcements.filter(a => a.audienceType === 'all' || a.targetPropertyId === unit?.propertyId || a.targetTenantId === currentUser.tenantId);
  }

  el.innerHTML = `
    ${isAdmin ? `<div class="toolbar"><span class="muted">Published announcements notify target tenants automatically.</span><button class="btn btn-primary" id="add-ann-btn">+ New Announcement</button></div>` : ''}
    <div class="stack-md">
      ${list.map(a => `
        <div class="announcement-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <strong style="font-size:15px;color:var(--dark-accent);">${a.title}</strong>
            <div class="btn-row">${statusBadge(a.priority)} <span class="badge badge-gray">${a.category}</span></div>
          </div>
          <p>${a.description}</p>
          <div class="announcement-meta">
            <span>Published: ${a.publishDate}</span>
            <span>•</span>
            <span>Audience: ${a.audienceType === 'all' ? 'All Tenants' : getProperty(a.targetPropertyId)?.name || 'Selected Property'}</span>
          </div>
        </div>
      `).join('') || `<div class="card empty-state">No announcements to display.</div>`}
    </div>
  `;

  if (isAdmin) {
    document.getElementById('add-ann-btn').addEventListener('click', () => {
      openModal('Publish Announcement', `
        <form id="ann-form" class="form-grid">
          <div class="form-group full"><label>Title <span class="req">*</span></label><input id="af-title" required /></div>
          <div class="form-group"><label>Category</label><select id="af-cat"><option>General Update</option><option>Maintenance</option><option>Electricity</option><option>Payment Reminder</option><option>Emergency</option></select></div>
          <div class="form-group"><label>Priority</label><select id="af-pri"><option>Normal</option><option>High</option></select></div>
          <div class="form-group full"><label>Target Audience</label>
            <select id="af-aud">
              <option value="all">All Tenants</option>
              ${state.properties.map(p => `<option value="prop:${p.id}">Property: ${p.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group full"><label>Message <span class="req">*</span></label><textarea id="af-desc" rows="3" required></textarea></div>
          <div class="form-group full btn-row"><button type="submit" class="btn btn-primary">Publish</button><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button></div>
        </form>
      `);
      document.getElementById('ann-form').addEventListener('submit', e => {
        e.preventDefault();
        const aud = document.getElementById('af-aud').value;
        const ann = {
          id: uid('a'),
          title: document.getElementById('af-title').value.trim(),
          category: document.getElementById('af-cat').value,
          priority: document.getElementById('af-pri').value,
          description: document.getElementById('af-desc').value.trim(),
          publishDate: todayISO(),
          audienceType: aud === 'all' ? 'all' : 'property',
          targetPropertyId: aud.startsWith('prop:') ? aud.split(':')[1] : null,
          targetTenantId: null
        };
        state.announcements.unshift(ann);
        state.users.filter(u => u.role === 'tenant').forEach(u => {
          notifyUser(u.id, 'New Announcement', ann.title, 'announcement', 'announcements');
        });
        saveState();
        closeModal();
        showToast('Announcement published.');
        renderAnnouncements(el);
      });
    });
  }
}

function renderNotificationsPage(el) {
  const list = state.notifications.filter(n => n.userId === currentUser.id);
  el.innerHTML = `
    <div class="toolbar">
      <span class="muted">${list.filter(n => !n.isRead).length} unread notification(s)</span>
      <button class="btn btn-outline btn-sm" id="page-mark-read">Mark all as read</button>
    </div>
    <div class="card">
      ${list.map(n => `
        <div class="notif-item ${n.isRead ? '' : 'unread'}" onclick="openNotification('${n.id}')">
          <div style="display:flex;justify-content:space-between;">
            <strong>${n.title}</strong>
            <small class="muted">${n.createdAt}</small>
          </div>
          <span class="muted">${n.message}</span>
        </div>
      `).join('') || `<div class="empty-state">No notifications yet.</div>`}
    </div>
  `;
  document.getElementById('page-mark-read').addEventListener('click', () => {
    state.notifications.filter(n => n.userId === currentUser.id).forEach(n => n.isRead = true);
    saveState();
    renderNotificationBell();
    renderSidebar();
    renderNotificationsPage(el);
  });
}

window.openNotification = (nid) => {
  const n = state.notifications.find(x => x.id === nid);
  if (n) {
    n.isRead = true;
    saveState();
    renderNotificationBell();
    renderSidebar();
    navigate(n.targetRoute);
  }
};

function renderReports(el) {
  const verifiedTotal = state.payments.filter(p => p.status === 'Verified').reduce((s, p) => s + Number(p.amount), 0);
  const outstandingTotal = state.bills.reduce((s, b) => s + getBillMetrics(b).balance, 0);

  el.innerHTML = `
    <div class="toolbar">
      <span class="muted">Summary derived from live billing, payment, and occupancy records.</span>
      <button class="btn btn-primary btn-sm" id="export-csv-btn">Export Billing CSV</button>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Verified Collections</div><div class="kpi-value">${peso(verifiedTotal)}</div></div>
      <div class="kpi-card"><div class="kpi-label">Outstanding Receivables</div><div class="kpi-value">${peso(outstandingTotal)}</div></div>
      <div class="kpi-card"><div class="kpi-label">Occupancy Rate</div><div class="kpi-value">${Math.round((state.units.filter(u => u.status === 'Occupied').length / state.units.length) * 100)}%</div></div>
    </div>
    <div class="card">
      <div class="card-header"><h3 class="card-title">Property Occupancy Summary</h3></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Property</th><th>Total Units</th><th>Occupied</th><th>Available</th><th>Maintenance</th></tr></thead>
          <tbody>
            ${state.properties.map(p => {
              const u = state.units.filter(x => x.propertyId === p.id);
              return `<tr>
                <td><strong>${p.name}</strong></td>
                <td>${u.length}</td>
                <td>${u.filter(x => x.status === 'Occupied').length}</td>
                <td>${u.filter(x => x.status === 'Available').length}</td>
                <td>${u.filter(x => x.status === 'Under Maintenance').length}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('export-csv-btn').addEventListener('click', () => {
    const rows = [['Bill ID', 'Tenant', 'Period', 'Due Date', 'Total', 'Paid', 'Balance', 'Status']];
    state.bills.forEach(b => {
      const m = getBillMetrics(b);
      const l = getLease(b.leaseId);
      rows.push([b.id, getTenant(l?.tenantId)?.fullName || '', b.billingPeriod, b.dueDate, m.total, m.paid, m.balance, m.status]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rentflow-billing-report.csv';
    a.click();
    showToast('CSV report exported.');
  });
}

function renderSettings(el) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header"><h3 class="card-title">Account & Application Settings</h3></div>
      <div class="card-body stack-md">
        <div><strong>Signed in as:</strong> ${currentUser.name} (${currentUser.email})</div>
        <div><strong>Currency:</strong> Philippine Peso (₱)</div>
        <div><strong>Authentication Policy:</strong> Gmail-only (@gmail.com)</div>
        <div style="padding-top:10px;border-top:1px solid var(--border);">
          <button class="btn btn-danger btn-sm" id="reset-demo-btn">Reset Demo Data</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('reset-demo-btn').addEventListener('click', () => {
    if (!confirm('Reset all demo data to initial defaults?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(INITIAL_DATA);
    showToast('Demo data reset.');
    navigate('dashboard');
  });
}

/* ==========================================================================
   TENANT PORTAL VIEWS
   ========================================================================== */
function getMyLease() {
  return state.leases.find(l => l.tenantId === currentUser.tenantId && ['Active', 'Expiring Soon'].includes(l.status));
}

function renderTenantDashboard(el) {
  const lease = getMyLease();
  const unit = lease ? getUnit(lease.unitId) : null;
  const prop = unit ? getProperty(unit.propertyId) : null;
  const myBills = state.bills.filter(b => b.leaseId === lease?.id).map(b => ({ bill: b, ...getBillMetrics(b) }));
  const totalBalance = myBills.reduce((s, b) => s + b.balance, 0);
  const nextDue = myBills.find(b => b.balance > 0)?.bill.dueDate || 'None';
  const myOpenConcerns = state.concerns.filter(c => c.tenantId === currentUser.tenantId && !['Resolved', 'Closed'].includes(c.status));
  const latestAnn = state.announcements[0];

  el.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Current Unit</div><div class="kpi-value">${unit?.name || '—'}</div><div class="kpi-sub">${prop?.name || ''}</div></div>
      <div class="kpi-card"><div class="kpi-label">Agreed Monthly Rent</div><div class="kpi-value">${peso(lease?.agreedRent || 0)}</div><div class="kpi-sub">${lease ? statusBadge(lease.status) : ''}</div></div>
      <div class="kpi-card"><div class="kpi-label">Current Balance</div><div class="kpi-value">${peso(totalBalance)}</div><div class="kpi-sub">Next due: ${nextDue}</div></div>
      <div class="kpi-card"><div class="kpi-label">Open Concerns</div><div class="kpi-value">${myOpenConcerns.length}</div><div class="kpi-sub"><button class="link-btn" onclick="navigate('raise-concern')">+ Raise a concern</button></div></div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><h3 class="card-title">Latest Announcement</h3><button class="link-btn" onclick="navigate('announcements')">All announcements</button></div>
        <div class="card-body">
          ${latestAnn ? `<strong>${latestAnn.title}</strong><p class="muted" style="margin-top:6px;">${latestAnn.description}</p>` : '<p class="muted">No announcements.</p>'}
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3 class="card-title">Recent Bills</h3><button class="link-btn" onclick="navigate('my-bills')">View all</button></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Period</th><th>Due Date</th><th>Balance</th><th>Status</th></tr></thead>
            <tbody>
              ${myBills.map(b => `<tr>
                <td>${b.bill.billingPeriod}</td>
                <td>${b.bill.dueDate}</td>
                <td class="font-mono">${peso(b.balance)}</td>
                <td>${statusBadge(b.status)}</td>
              </tr>`).join('') || `<tr><td colspan="4" class="empty-state">No bills yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderTenantContract(el) {
  const lease = getMyLease();
  if (!lease) {
    el.innerHTML = `<div class="card empty-state">No active contract found.</div>`;
    return;
  }
  const unit = getUnit(lease.unitId);
  const prop = getProperty(unit?.propertyId);

  el.innerHTML = `
    <div class="card">
      <div class="card-header"><h3 class="card-title">Active Lease Agreement</h3>${statusBadge(lease.status)}</div>
      <div class="card-body form-grid">
        <div><span class="muted">Property</span><br><strong>${prop?.name}</strong></div>
        <div><span class="muted">Unit</span><br><strong>${unit?.name} (${unit?.type})</strong></div>
        <div><span class="muted">Start Date</span><br><strong>${lease.startDate}</strong></div>
        <div><span class="muted">End Date</span><br><strong>${lease.endDate} (${lease.durationMonths} months)</strong></div>
        <div><span class="muted">Agreed Monthly Rent</span><br><strong>${peso(lease.agreedRent)}</strong></div>
        <div><span class="muted">Security Deposit</span><br><strong>${peso(lease.deposit)}</strong></div>
        <div class="full"><span class="muted">Notes</span><br><p>${lease.notes || '—'}</p></div>
      </div>
    </div>
  `;
}

function renderTenantBills(el) {
  const lease = getMyLease();
  const myBills = state.bills.filter(b => b.leaseId === lease?.id).map(b => ({ bill: b, ...getBillMetrics(b) }));
  el.innerHTML = `
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Billing Period</th><th>Due Date</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${myBills.map(b => `<tr>
              <td><strong>${b.bill.billingPeriod}</strong></td>
              <td>${b.bill.dueDate}</td>
              <td class="font-mono">${peso(b.total)}</td>
              <td class="font-mono">${peso(b.paid)}</td>
              <td class="font-mono"><strong>${peso(b.balance)}</strong></td>
              <td>${statusBadge(b.status)}</td>
              <td><button class="btn btn-outline btn-sm" onclick="viewBillDetail('${b.bill.id}')">Breakdown</button></td>
            </tr>`).join('') || `<tr><td colspan="7" class="empty-state">No bills available.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTenantPayments(el) {
  const myPays = state.payments.filter(p => p.tenantId === currentUser.tenantId);
  const lease = getMyLease();
  const openBills = state.bills.filter(b => b.leaseId === lease?.id && getBillMetrics(b).balance > 0);

  el.innerHTML = `
    <div class="toolbar">
      <span class="muted">Submit payment proof for manager verification.</span>
      <button class="btn btn-primary" id="submit-pay-btn">+ Submit Payment</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Bill Period</th><th>Amount</th><th>Method</th><th>Reference</th><th>Status</th></tr></thead>
          <tbody>
            ${myPays.map(p => `<tr>
              <td>${p.date}</td>
              <td>${state.bills.find(b => b.id === p.billId)?.billingPeriod || '—'}</td>
              <td class="font-mono">${peso(p.amount)}</td>
              <td>${p.method}</td>
              <td>${p.reference}</td>
              <td>${statusBadge(p.status)}</td>
            </tr>`).join('') || `<tr><td colspan="6" class="empty-state">No payment history yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('submit-pay-btn').addEventListener('click', () => {
    if (!openBills.length) return showToast('You have no unpaid bills.');
    openModal('Submit Payment Record', `
      <form id="tpay-form" class="form-grid">
        <div class="form-group full"><label>Select Bill <span class="req">*</span></label>
          <select id="tp-bill">${openBills.map(b => `<option value="${b.id}">${b.billingPeriod} (Balance: ${peso(getBillMetrics(b).balance)})</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Amount Paid (₱) <span class="req">*</span></label><input type="number" id="tp-amt" min="1" required /></div>
        <div class="form-group"><label>Payment Method</label><select id="tp-method"><option>GCash</option><option>Bank Transfer</option><option>Cash</option></select></div>
        <div class="form-group full"><label>Reference Number <span class="req">*</span></label><input id="tp-ref" required placeholder="e.g., GC-998877" /></div>
        <div class="form-group full btn-row"><button type="submit" class="btn btn-primary">Submit for Verification</button><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button></div>
      </form>
    `);
    document.getElementById('tpay-form').addEventListener('submit', e => {
      e.preventDefault();
      const amount = Number(document.getElementById('tp-amt').value);
      state.payments.unshift({
        id: uid('pay'),
        tenantId: currentUser.tenantId,
        billId: document.getElementById('tp-bill').value,
        amount,
        date: todayISO(),
        method: document.getElementById('tp-method').value,
        reference: document.getElementById('tp-ref').value.trim(),
        status: 'Pending Verification',
        notes: 'Submitted by tenant'
      });
      notifyUser('u1', 'Payment Pending Verification', `${currentUser.name} submitted ${peso(amount)} for verification.`, 'payment', 'payments');
      saveState();
      closeModal();
      showToast('Payment submitted for manager verification.');
      renderTenantPayments(el);
    });
  });
}

function renderRaiseConcern(el) {
  const lease = getMyLease();
  const unit = lease ? getUnit(lease.unitId) : null;
  el.innerHTML = `
    <div class="card" style="max-width:680px;">
      <div class="card-header"><h3 class="card-title">Submit a Maintenance Request or Concern</h3></div>
      <div class="card-body">
        <form id="raise-concern-form" class="stack-md">
          <div class="form-group"><label>Category <span class="req">*</span></label>
            <select id="rc-cat">
              <option>Water</option><option>Electricity</option><option>Internet</option><option>Plumbing</option>
              <option>Room/Unit Maintenance</option><option>Security</option><option>Noise</option><option>Facility</option><option>Other</option>
            </select>
          </div>
          <div class="form-group"><label>Title <span class="req">*</span></label><input id="rc-title" placeholder="Brief summary of the issue" required /></div>
          <div class="form-group"><label>Description <span class="req">*</span></label><textarea id="rc-desc" rows="4" placeholder="Describe the concern in detail..." required></textarea></div>
          <div class="form-group"><label>Optional Photo Attachment</label><input type="file" id="rc-file" accept="image/*" /></div>
          <div><button type="submit" class="btn btn-primary">Submit Concern</button></div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('raise-concern-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('rc-title').value.trim();
    const desc = document.getElementById('rc-desc').value.trim();
    const file = document.getElementById('rc-file').files[0]?.name || '';
    state.concerns.unshift({
      id: uid('c'),
      tenantId: currentUser.tenantId,
      propertyId: unit?.propertyId || 'p1',
      unitId: unit?.id || 'un1',
      category: document.getElementById('rc-cat').value,
      title,
      description: desc,
      attachment: file,
      status: 'Pending',
      assignedTo: 'Unassigned',
      createdAt: todayISO(),
      messages: [{ senderRole: 'tenant', senderName: currentUser.name, text: desc, sentAt: todayISO() }]
    });
    notifyUser('u1', 'New Tenant Concern', `${currentUser.name} submitted "${title}".`, 'concern', 'concerns');
    saveState();
    showToast('Concern submitted!');
    navigate('my-concerns');
  });
}

function renderTenantConcerns(el) {
  const list = state.concerns.filter(c => c.tenantId === currentUser.tenantId);
  el.innerHTML = `
    <div class="toolbar">
      <span class="muted">Track your submitted concerns and manager replies.</span>
      <button class="btn btn-primary btn-sm" onclick="navigate('raise-concern')">+ Raise a Concern</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Title</th><th>Category</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${list.map(c => `<tr>
              <td><strong>${c.title}</strong></td>
              <td>${c.category}</td>
              <td>${c.createdAt}</td>
              <td>${statusBadge(c.status)}</td>
              <td><button class="btn btn-outline btn-sm" onclick="openConcernThread('${c.id}')">View Thread (${c.messages.length})</button></td>
            </tr>`).join('') || `<tr><td colspan="5" class="empty-state">You have not raised any concerns yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTenantProfile(el) {
  const t = getTenant(currentUser.tenantId);
  el.innerHTML = `
    <div class="card" style="max-width:640px;">
      <div class="card-header"><h3 class="card-title">My Profile</h3></div>
      <div class="card-body form-grid">
        <div><span class="muted">Full Name</span><br><strong>${t?.fullName || currentUser.name}</strong></div>
        <div><span class="muted">Linked Google Account</span><br><strong>${currentUser.email}</strong></div>
        <div><span class="muted">Contact Number</span><br><strong>${t?.contact || '—'}</strong></div>
        <div><span class="muted">Emergency Contact</span><br><strong>${t?.emergencyContact || '—'}</strong></div>
        <div class="full"><span class="muted">Home Address</span><br><strong>${t?.address || '—'}</strong></div>
      </div>
    </div>
  `;
}

/* ---------- Mobile Drawer & Global Listeners ---------- */
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mobile-backdrop').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  initAuth();

  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.addEventListener('keydown', e => {
    const overlay = document.getElementById('modal-overlay');
    if (overlay.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = overlay.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  document.getElementById('open-sidebar-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('mobile-backdrop').classList.remove('hidden');
  });
  document.getElementById('close-sidebar-btn').addEventListener('click', closeMobileSidebar);
  document.getElementById('mobile-backdrop').addEventListener('click', closeMobileSidebar);

  document.getElementById('notif-bell-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notif-dropdown').classList.toggle('hidden');
  });
  document.addEventListener('click', () => document.getElementById('notif-dropdown').classList.add('hidden'));
  document.getElementById('notif-dropdown').addEventListener('click', e => e.stopPropagation());

  document.getElementById('mark-all-read-btn').addEventListener('click', () => {
    state.notifications.filter(n => n.userId === currentUser.id).forEach(n => n.isRead = true);
    saveState();
    renderNotificationBell();
    renderSidebar();
  });
  document.getElementById('view-all-notifs-btn').addEventListener('click', () => {
    document.getElementById('notif-dropdown').classList.add('hidden');
    navigate('notifications');
  });
});