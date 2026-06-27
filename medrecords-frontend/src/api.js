const API_BASE = process.env.REACT_APP_API_URL || "https://medrecordssystem-production.up.railway.app";

const getToken = () => localStorage.getItem("authToken");

const authHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
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
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("patientId", data.patient.id);
    localStorage.setItem("patientName", data.patient.name);
  }
  return data;
}

export async function registerPatient(name, email, password) {
  const res = await fetch(`${API_BASE}/patients/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("patientId", data.patient.id);
    localStorage.setItem("patientName", data.patient.name);
  }
  return data;
}

export async function getRecordsByPatient(patientId) {
  const res = await fetch(`${API_BASE}/records/patient/${patientId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const res = await fetch(`${API_BASE}/files/upload`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.text();
}

export async function addRecord(record) {
  const res = await fetch(`${API_BASE}/records/add`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function downloadFile(fileId) {
  const res = await fetch(`${API_BASE}/files/download/${fileId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}

export async function getAllRecords() {
  const res = await fetch(`${API_BASE}/records/all`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteRecord(recordId) {
  const res = await fetch(`${API_BASE}/records/delete/${recordId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("patientId");
  localStorage.removeItem("patientName");
}
