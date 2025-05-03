// edit.js
const API_BASE = 'http://127.0.0.1:8000/vms';
const urlParams = new URLSearchParams(window.location.search);
const vmId = urlParams.get('id');

const form = document.getElementById('editForm');
const nameInput = document.getElementById('name');
const cpuInput = document.getElementById('cpu_count');
const memInput = document.getElementById('memory_mb');

let originalName = "";

async function loadVM() {
  if (!vmId) {
    alert("VM ID missing from URL.");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/${vmId}`);
    if (!res.ok) throw new Error("VM not found");
    const vm = await res.json();

    originalName = vm.name;
    nameInput.value = vm.name;
    cpuInput.value = vm.cpu_count;
    memInput.value = vm.memory_mb;
  } catch (err) {
    console.error("Failed to load VM:", err);
    alert("Failed to load VM data");
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updatedData = {
    name: nameInput.value.trim(),
    cpu_count: parseInt(cpuInput.value),
    memory_mb: parseInt(memInput.value),
    is_active: true  // keep same for compatibility
  };

  try {
    const res = await fetch(`${API_BASE}/${vmId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Server error:", error);
      alert("Failed to update VM: " + error.detail);
      return;
    }

    window.location.href = '../index.html';
  } catch (err) {
    console.error("Update error:", err);
    alert("Failed to update VM");
  }
});

window.addEventListener('DOMContentLoaded', loadVM);
