const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('leave_portal_token');
}

export function setToken(token) {
  localStorage.setItem('leave_portal_token', token);
}

export function clearToken() {
  localStorage.removeItem('leave_portal_token');
}

export function isLoggedIn() {
  return !!getToken();
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export async function apiLogin(email, password, role) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
  setToken(data.token);
  return data;
}

export async function apiRegister(userData) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  setToken(data.token);
  return data;
}

export async function apiGetProfile() {
  return request('/users/profile');
}

export async function apiGetMyLeaveRequests() {
  return request('/leave-requests/my');
}

export async function apiGetPendingLeaves() {
  return request('/leave-requests/pending');
}

export async function apiGetAllLeaves() {
  return request('/leave-requests/all');
}

export async function apiSubmitLeave(formData) {
  return request('/leave-requests', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
}

export async function apiApproveLeave(id) {
  return request(`/leave-requests/${id}/approve`, {
    method: 'PUT'
  });
}

export async function apiRejectLeave(id, reviewComment) {
  return request(`/leave-requests/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reviewComment })
  });
}

export function apiLogout() {
  clearToken();
}

export async function apiParentSendOTP(mobile) {
  return request('/parents/send-otp', {
    method: 'POST',
    body: JSON.stringify({ mobile })
  });
}

export async function apiParentVerifyOTP(mobile, otp) {
  const data = await request('/parents/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ mobile, otp })
  });
  setToken(data.token);
  return data;
}

export async function apiGetParentWards() {
  return request('/parents/wards');
}

export async function apiGetParentLeaves() {
  return request('/parents/ward-leaves');
}

export async function apiGetParentNotifications() {
  return request('/parents/notifications');
}

export async function apiMarkNotificationRead(id) {
  return request(`/parents/notifications/${id}/read`, { method: 'PUT' });
}

export async function apiMarkAllNotificationsRead() {
  return request('/parents/notifications/read-all', { method: 'PUT' });
}
