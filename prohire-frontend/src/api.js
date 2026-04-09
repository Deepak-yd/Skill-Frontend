const API_BASE_URL = import.meta.env.VITE_API_URL;

function toCurrency(value) {
  return `$${Number(value || 0).toFixed(0)}`;
}

function getToken() {
  return localStorage.getItem('token');
}

function normalizeRole(role) {
  const value = String(role || '').toUpperCase();
  if (value === 'ADMIN') return 'ADMIN';
  if (value === 'PROFESSIONAL') return 'PROFESSIONAL';
  return 'USER';
}

function shapeUser(user) {
  if (!user) return null;
  return {
    ...user,
    role: normalizeRole(user.role),
    profile: {
      phone: user.profile?.phone || '',
      location: user.profile?.location || '',
      company: user.profile?.company || '',
      website: user.profile?.website || '',
      bio: user.profile?.bio || '',
      avatar: user.profile?.avatar || '',
      linkedIn: user.profile?.linkedIn || '',
      github: user.profile?.github || '',
      twitter: user.profile?.twitter || '',
      portfolio: user.profile?.portfolio || '',
    },
  };
}

function shapeProfessional(pro) {
  if (!pro) return null;
  return {
    ...pro,
    id: String(pro.id),
    userId: String(pro.userId || ''),
    categoryId: pro.categoryId ? String(pro.categoryId) : null,
    category: pro.category || 'Uncategorized',
    rate: typeof pro.rate === 'string' ? pro.rate : toCurrency(pro.rateValue ?? pro.rate),
    skills: Array.isArray(pro.skills) ? pro.skills : [],
    reviewCount: Number(pro.reviewCount || 0),
  };
}

function shapeService(service) {
  return {
    ...service,
    id: String(service.id),
    professionalId: String(service.professionalId),
    price: Number(service.price || 0),
    priceLabel: service.priceLabel || toCurrency(service.price),
  };
}

function shapeHire(hire) {
  return {
    ...hire,
    id: String(hire.id),
    clientUserId: String(hire.clientUserId),
    professionalId: String(hire.professionalId),
    serviceId: hire.serviceId ? String(hire.serviceId) : null,
    amount: typeof hire.amount === 'string' ? hire.amount : toCurrency(hire.amountValue ?? hire.amount),
  };
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const rawText = await response.text();
  let data = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}

// AUTH
export async function login(data) {
  const session = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return { token: session.token, user: shapeUser(session.user) };
}

export async function register(data) {
  const payload = { ...data, role: normalizeRole(data?.role) };
  const session = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return { token: session.token, user: shapeUser(session.user) };
}

export async function getCurrentUser() {
  const user = await request('/auth/me');
  return shapeUser(user);
}

export async function updateMyProfile(payload) {
  const user = await request('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return shapeUser(user);
}

// USERS
export async function fetchUsers() {
  const users = await request('/users');
  return users.map(shapeUser);
}

export async function createUser(data) {
  const user = await request('/users', {
    method: 'POST',
    body: JSON.stringify({ ...data, role: normalizeRole(data?.role) }),
  });
  return shapeUser(user);
}

export async function updateUser(id, data) {
  const user = await request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, role: data?.role ? normalizeRole(data.role) : undefined }),
  });
  return shapeUser(user);
}

export async function deleteUser(id) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

// PROFESSIONALS
export async function fetchProfessionals() {
  const pros = await request('/professionals');
  return pros.map(shapeProfessional);
}

export async function fetchProfessionalById(id) {
  const pro = await request(`/professionals/${id}`);
  return shapeProfessional(pro);
}

export async function fetchMyProfessionalProfile() {
  const profile = await request('/professionals/me');
  return shapeProfessional(profile);
}

export async function updateProfessional(id, data) {
  const payload = { ...data };
  if (payload.skills !== undefined && !Array.isArray(payload.skills)) {
    payload.skills = String(payload.skills).split(',').map(s => s.trim()).filter(Boolean);
  }
  const pro = await request(`/professionals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return shapeProfessional(pro);
}

// CONNECTIONS
export async function fetchConnections() {
  const [sent, received] = await Promise.all([
    request('/connections/sent'),
    request('/connections/incoming')
  ]);
  return { sent, received };
}

export async function fetchAcceptedFriends() {
  return request('/connections/friends');
}

export async function updateConnectionStatus(id, status) {
  const path = status === 'accepted' ? `/connections/${id}/accept` : `/connections/${id}/reject`;
  return request(path, { method: 'PUT' });
}

export async function sendConnectionRequest(email) {
  return request('/connections', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// CATEGORIES
export async function fetchCategories() {
  return request('/categories');
}

export async function createCategory(data) {
  return request('/categories', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCategory(id, data) {
  return request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteCategory(id) {
  return request(`/categories/${id}`, { method: 'DELETE' });
}

// SERVICES
export async function fetchServices(professionalId) {
  const services = await request(`/professionals/${professionalId}/services`);
  return services.map(shapeService);
}

export async function createService(professionalId, data) {
  const service = await request(`/professionals/${professionalId}/services`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return shapeService(service);
}

export async function updateService(professionalId, serviceId, data) {
  const service = await request(`/professionals/${professionalId}/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return shapeService(service);
}

export async function deleteService(professionalId, serviceId) {
  return request(`/professionals/${professionalId}/services/${serviceId}`, { method: 'DELETE' });
}

// HIRES
export async function fetchHires() {
  const hires = await request('/hires');
  return hires.map(shapeHire);
}

export async function createHire(data) {
  const hire = await request('/hires', { method: 'POST', body: JSON.stringify(data) });
  return shapeHire(hire);
}

export async function updateHire(id, data) {
  const hire = await request(`/hires/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  return shapeHire(hire);
}

// DASHBOARD & ADMIN
export async function fetchDashboardMetrics() {
  return request('/dashboard/metrics');
}

export async function fetchReports() {
  return request('/reports');
}

export async function fetchPlatformSettings() {
  const list = await request('/settings');
  const obj = {};
  if (Array.isArray(list)) {
    list.forEach(i => obj[i.settingKey] = i.settingValue);
  }
  return obj;
}

export async function updatePlatformSettings(payload) {
  const list = Object.entries(payload).map(([k, v]) => ({ settingKey: k, settingValue: String(v) }));
  return request('/settings', { method: 'PUT', body: JSON.stringify(list) });
}

// JOBS
export async function fetchAllJobs() {
  return request('/jobs');
}

export async function fetchJobsByProfessional(professionalId) {
  return request(`/jobs/professional/${professionalId}`);
}

export async function createJob(data) {
  return request('/jobs', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateJob(jobId, data) {
  return request(`/jobs/${jobId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteJob(jobId) {
  return request(`/jobs/${jobId}`, { method: 'DELETE' });
}

// MESSAGES
export async function fetchMessages(userId) {
  return request(`/messages/${userId}`);
}

export async function sendMessage(receiverId, content) {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify({ receiverId, content }),
  });
}
