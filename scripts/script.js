let taskData = {};
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];
let dragElement = null;

/* =====================================================
   FUNCTION: CREATE A NEW TASK ELEMENT
   ===================================================== */
function createTask(title, desc) {
  const div = document.createElement('div');
  div.classList.add('task');
  div.setAttribute('draggable', 'true');

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="delete-btn">Delete</button>
  `;

  // Drag event
  div.addEventListener('dragstart', () => {
    dragElement = div;
  });

  // Delete event
  div.querySelector(".delete-btn").addEventListener("click", () => {
    div.remove();
    saveTasks();
  });

  return div;
}

/* =====================================================
   FUNCTION: SAVE ALL TASKS TO LOCALSTORAGE
   ===================================================== */
function saveTasks() {
  columns.forEach(col => {
    const tasks = col.querySelectorAll('.task');
    const count = col.querySelector('.right');

    taskData[col.id] = Array.from(tasks).map(t => ({
      title: t.querySelector('h2').innerText,
      desc: t.querySelector('p').innerText
    }));

    count.innerText = tasks.length;
  });

  localStorage.setItem('tasks', JSON.stringify(taskData));
}

/* =====================================================
   FUNCTION: LOAD TASKS FROM LOCALSTORAGE
   ===================================================== */
function loadTasks() {
  const data = JSON.parse(localStorage.getItem('tasks')) || {};
  
  for (const col in data) {
    const column = document.querySelector(`#${col}`);

    data[col].forEach(task => {
      const taskEl = createTask(task.title, task.desc);
      column.appendChild(taskEl);
    });

    column.querySelector('.right').innerText = data[col].length;
  }
}

/* =====================================================
   DRAG EVENTS FOR COLUMNS
   ===================================================== */
function addDragEvents(column) {
  column.addEventListener('dragenter', e => {
    e.preventDefault();
    column.classList.add('hover-over');
  });

  column.addEventListener('dragleave', () => {
    column.classList.remove('hover-over');
  });

  column.addEventListener('dragover', e => e.preventDefault());

  column.addEventListener('drop', () => {
    column.appendChild(dragElement);
    column.classList.remove('hover-over');
    saveTasks();
  });
}

columns.forEach(addDragEvents);

/* =====================================================
   LOAD EXISTING TASKS ON PAGE LOAD
   ===================================================== */
if (localStorage.getItem('tasks')) {
  loadTasks();
}

/* =====================================================
   MODAL LOGIC
   ===================================================== */
const toggleModalButton = document.querySelector('#toggle-modal');
const modalBg = document.querySelector('.modal .bg');
const modal = document.querySelector('.modal');
const addTaskButton = document.querySelector('#add-new-task');

toggleModalButton.addEventListener('click', () => {
  modal.classList.toggle('active');
});

modalBg.addEventListener('click', () => {
  modal.classList.remove('active');
});

/* =====================================================
   ADD TASK BUTTON (FROM MODAL)
   ===================================================== */
addTaskButton.addEventListener('click', () => {
  const title = document.querySelector('#task-title-input').value;
  const desc = document.querySelector('#task-desc-input').value;

  if (!title.trim()) return;

  const taskEl = createTask(title, desc);
  todo.appendChild(taskEl);

  saveTasks();
  document.querySelector('#task-title-input').value = "";
  document.querySelector('#task-desc-input').value = "";
  modal.classList.remove('active');
});
