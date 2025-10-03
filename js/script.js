// Initialize todos from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let filterMode = 'pending';

// Render todos to the DOM
function renderTodos() {
    const todoList = document.getElementById('todoList');
    
    // Filter todos based on current filter mode
    let filteredTodos = todos;
    if (filterMode === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    } else if (filterMode === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    // Show empty state if no todos
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">No task found</div>';
        return;
    }

    // Clear and render todos
    todoList.innerHTML = '';
    filteredTodos.forEach((todo, index) => {
        const actualIndex = todos.indexOf(todo);
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
            <div class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</div>
            <div class="todo-date">${formatDate(todo.date)}</div>
            <div>
                <span class="status-badge ${todo.completed ? 'completed' : 'pending'}">
                    ${todo.completed ? 'Completed' : 'Pending'}
                </span>
            </div>
            <div class="actions">
                ${!todo.completed ? `<button class="action-btn complete-btn" onclick="toggleComplete(${actualIndex})">✓</button>` : ''}
                <button class="action-btn delete-btn" onclick="deleteTodo(${actualIndex})">×</button>
            </div>
        `;
        todoList.appendChild(todoItem);
    });
}

// Format date to readable format
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

// Add new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const dateInput = document.getElementById('dateInput');
    const text = input.value.trim();
    const date = dateInput.value;

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    todos.push({
        text: text,
        date: date,
        completed: false
    });

    input.value = '';
    dateInput.value = '';
    saveTodos();
    renderTodos();
}

// Toggle todo completion status
function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// Delete a todo
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// Delete all todos
// Replace the existing deleteAll function with these new functions
function deleteAll() {
    if (todos.length === 0) return;
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'flex';
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
}

function confirmDeleteAll() {
    todos = [];
    saveTodos();
    renderTodos();
    closeDeleteModal();
}

// Filter todos (cycle through all, pending, completed)
function filterTodos() {
    const modes = ['all', 'pending', 'completed'];
    const currentIndex = modes.indexOf(filterMode);
    filterMode = modes[(currentIndex + 1) % modes.length];
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}


function addTodo() {
    const input = document.getElementById('todoInput');
    const dateInput = document.getElementById('dateInput');
    const todoError = document.getElementById('todoError');
    const dateError = document.getElementById('dateError');
    const text = input.value.trim();
    const date = dateInput.value;

    // Reset error messages
    todoError.textContent = '';
    dateError.textContent = '';

    // Validation
    let isValid = true;

    if (text === '') {
        todoError.textContent = 'Please enter a task!';
        isValid = false;
    }

    if (date === '') {
        dateError.textContent = 'Please select a date!';
        isValid = false;
    }

    if (!isValid) return;

    todos.push({
        text: text,
        date: date,
        completed: false
    });

    input.value = '';
    dateInput.value = '';
    saveTodos();
    renderTodos();
}


// Add this event listener to handle clicking outside modal
document.addEventListener('click', function(event) {
    const modal = document.getElementById('deleteModal');
    if (event.target === modal) {
        closeDeleteModal();
    }
});

// Allow Enter key to add todo
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Initial render when page loads
renderTodos();