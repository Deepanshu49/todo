(function () {
    const STORAGE_KEY = 'mini_todo_tasks_v1';
    const input = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const tasksEl = document.getElementById('tasks');
    const countEl = document.getElementById('count');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const clearAllBtn = document.getElementById('clear-all');

    let tasks = load();

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    function load() { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch (e) { return [] } }

    function render() {
        tasksEl.innerHTML = '';
        tasks.forEach((t, idx) => {
            const li = document.createElement('li');
            li.className = 'task' + (t.done ? ' completed' : '');

            const chk = document.createElement('input');
            chk.type = 'checkbox'; chk.checked = !!t.done; chk.className = 'checkbox'; chk.addEventListener('change', () => {
                tasks[idx].done = chk.checked; save(); render();
            });

            const txt = document.createElement('div'); txt.className = 'text'; txt.textContent = t.text;

            const del = document.createElement('button'); del.className = 'icon'; del.innerHTML = '✕'; del.title = 'Delete'; del.addEventListener('click', () => { tasks.splice(idx, 1); save(); render(); });

            li.appendChild(chk); li.appendChild(txt); li.appendChild(del);
            tasksEl.appendChild(li);
        });

        const total = tasks.length; const remaining = tasks.filter(t => !t.done).length;
        countEl.textContent = total === 0 ? 'No tasks' : `${remaining} / ${total} remaining`;
    }

    function addTask(text) { if (!text || !text.trim()) return; tasks.unshift({ text: text.trim(), done: false }); save(); render(); }

    addBtn.addEventListener('click', () => { addTask(input.value); input.value = ''; input.focus(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { addTask(input.value); input.value = ''; } });

    clearCompletedBtn.addEventListener('click', () => { tasks = tasks.filter(t => !t.done); save(); render(); });
    clearAllBtn.addEventListener('click', () => { if (!confirm('Clear all tasks?')) return; tasks = []; save(); render(); });

    render();
})();
