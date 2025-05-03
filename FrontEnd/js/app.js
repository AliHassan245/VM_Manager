const API_BASE = 'http://127.0.0.1:8000/vms';

document.addEventListener('DOMContentLoaded', async () => {
  await loadVMs();
});

async function loadVMs() {
  const vmContainer = document.getElementById('vmContainer');
  vmContainer.innerHTML = '';

  const vms = await fetchVMs();

  if (vms.length === 0) {
    vmContainer.innerHTML = '<p class="text-muted">No VMs available.</p>';
    return;
  }

  vms.forEach(vm => {
    const card = createVMCard(vm);
    vmContainer.appendChild(card);
  });
}

async function fetchVMs() {
  try {
    const response = await fetch(API_BASE);
    return await response.json();
  } catch (err) {
    console.error('Error fetching VMs:', err);
    return [];
  }
}

function createVMCard(vm) {
  const col = document.createElement('div');
  col.className = 'col';

  const card = document.createElement('div');
  card.className = 'card h-100 shadow-sm border-0';

  // Name strip (header area)
  const header = document.createElement('div');
  header.className = 'card-header-strip text-white fw-bold px-3 py-2';
  header.textContent = vm.name;

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const statusClass = vm.is_active ? 'text-success' : 'text-danger';
  const statusText = vm.is_active ? 'Running' : 'Stopped';

  cardBody.innerHTML = `
    <p class="card-text mb-2">
      <strong>CPU:</strong> ${vm.cpu_count}<br>
      <strong>Memory:</strong> ${vm.memory_mb} MB<br>
      <strong>Status:</strong> <span class="${statusClass} fw-bold">${statusText}</span>
    </p>
    <div class="d-flex justify-content-between mt-3">
      <button class="btn btn-outline-primary btn-sm" onclick="toggleVM(${vm.id})">🔄 Toggle</button>
      <a href="pages/edit.html?id=${vm.id}" class="btn btn-outline-warning btn-sm">✏️ Edit</a>
      <button class="btn btn-outline-danger btn-sm" onclick="deleteVM(${vm.id})">❌ Delete</button>
    </div>
  `;

  card.appendChild(header);
  card.appendChild(cardBody);
  col.appendChild(card);
  return col;
}

async function toggleVM(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}/toggle`, { method: 'PATCH' });
    if (!res.ok) throw new Error("Failed to toggle VM");
    await loadVMs();
  } catch (err) {
    console.error("Toggle error:", err);
  }
}

async function deleteVM(id) {
  if (!confirm("Are you sure you want to delete this VM?")) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Failed to delete VM");
    await loadVMs();
  } catch (err) {
    console.error("Delete error:", err);
  }
}

// Make functions accessible globally
window.toggleVM = toggleVM;
window.deleteVM = deleteVM;
