const API = 'http://localhost:8000/tasks';
const form = document.getElementById('task-form');
const list = document.getElementById('task-list');
const filters = document.querySelectorAll('.filters button');

let editId = null;

// Load & render
async function loadTasks(status = '') {
  const url = status ? `${API}?status=${status}` : API;
  const res = await fetch(url);
  const tasks = await res.json();
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="task-info">
        <strong>${t.title}</strong> (${t.priority})<br>
        ${t.description} — ${t.due_date || '-'} [${t.status}]
      </div>
      <div class="task-actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>`;
    li.querySelector('.edit').onclick = () => startEdit(t);
    li.querySelector('.delete').onclick = () => deleteTask(t.id);
    list.append(li);
  });
}

// Create or Update
form.onsubmit = async e => {
  e.preventDefault();
  const body = {
    title: form.title.value,
    description: form.description.value,
    due_date: form.due_date.value,
    status: form.status.value,
    category: form.category.value,
    priority: form.priority.value
  };
  if (editId) {
    await fetch(`${API}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    editId = null;
    form.querySelector('button').textContent = 'Add Task';
  } else {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }
  form.reset();
  loadTasks();
};

// Start editing
function startEdit(t) {
  editId = t.id;
  form.title.value = t.title;
  form.description.value = t.description;
  form.due_date.value = t.due_date;
  form.status.value = t.status;
  form.category.value = t.category;
  form.priority.value = t.priority;
  form.querySelector('button').textContent = 'Update Task';
}

// Delete
async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadTasks();
}

// Filter buttons
filters.forEach(btn => {
  btn.onclick = () => loadTasks(btn.dataset.status);
});

// Initial load
loadTasks();