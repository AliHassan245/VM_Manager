const API_BASE = 'http://127.0.0.1:8000/vms';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('vmForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      cpu_count: parseInt(document.getElementById('cpu_count').value),
      memory_mb: parseInt(document.getElementById('memory_mb').value),
      is_active: document.getElementById('is_active').checked,
    };

    // Basic validation
    if (!formData.name || isNaN(formData.cpu_count) || isNaN(formData.memory_mb)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response:", errorText);
        throw new Error('Failed to submit form');
      }

      window.location.href = '../index.html'; // Redirect to home
    } catch (err) {
      console.error('Form submit error:', err);
      alert('Failed to create VM. See console for details.');
    }
  });
});
