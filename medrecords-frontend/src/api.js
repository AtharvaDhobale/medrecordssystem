const API_BASE = "http://localhost:8080";

// Get JWT token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Get headers with authentication
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

export async function loginPatient(email, password) {
  const res = await fetch(`${API_BASE}/patients/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  
  if (res.ok && data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('patientId', data.patient.id);
    localStorage.setItem('patientName', data.patient.name);
  }
  
  return data;
}

export async function getRecordsByPatient(patientId) {
  const res = await fetch(`${API_BASE}/records/patient/${patientId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}/files/upload`, { 
    method: "POST", 
    body: formData,
    headers: token ? { "Authorization": `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.text(); // Returns the file ID directly
}

export async function addRecord(record) {
  const res = await fetch(`${API_BASE}/records/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function downloadFile(fileId) {
  const res = await fetch(`${API_BASE}/files/download/${fileId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}

export async function getAllRecords() {
  const res = await fetch(`${API_BASE}/records/all`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteRecord(recordId) {
  const res = await fetch(`${API_BASE}/records/delete/${recordId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export async function registerPatient(name, email, password) {
  const res = await fetch(`${API_BASE}/patients/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  
  if (res.ok && data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('patientId', data.patient.id);
    localStorage.setItem('patientName', data.patient.name);
  }
  
  return data;
}

// Logout function
export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('patientId');
  localStorage.removeItem('patientName');
}
