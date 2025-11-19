async function uploadFile() {
  const patientId = document.getElementById("patientId").value;
  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files[0];

  if (!patientId || !file) {
    alert("Please enter Patient ID and choose a file!");
    return;
  }

  const formData = new FormData();
  formData.append("patientId", patientId);
  formData.append("file", file);

  const res = await fetch("/records/upload", { method: "POST", body: formData });
  if (res.ok) {
    alert("File uploaded successfully!");
    getRecords(patientId);
  } else {
    alert("Error uploading file");
  }
}

async function getRecords(patientId) {
  const res = await fetch(`/records/patient/${patientId}`);
  const data = await res.json();

  const recordsDiv = document.getElementById("records");
  recordsDiv.innerHTML = "";

  data.forEach((r) => {
    const div = document.createElement("div");
    div.classList.add("record-card");
    div.innerHTML = `<p><b>ID:</b> ${r.id}</p><p><b>File:</b> ${r.fileName}</p>`;
    recordsDiv.appendChild(div);
  });
}
