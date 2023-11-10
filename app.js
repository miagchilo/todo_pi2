document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submitButton');
    const taskInput = document.getElementById('task');
    const descriptionInput = document.getElementById('description');
    const priorityInput = document.getElementById('priority');
    const dueDateInput = document.getElementById('dueDate');
    const taskTypeInputs = document.getElementsByName('taskType');
    const urgentCheckbox = document.getElementById('urgent');
    const categoryInput = document.getElementById('category');
    const colorInput = document.getElementById('color');
    const form = document.getElementById('taskForm');
    const taskContainer = document.getElementById('taskContainer');

    // Load tasks from local storage on page load
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => {
        createTaskElement(task);
    });

    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Determine the selected task type
        let selectedTaskType;
        taskTypeInputs.forEach((input) => {
            if (input.checked) {
                selectedTaskType = input.value;
            }
        });

        // Create a new task and append it to the task container
        const newTaskData = {
            task: taskInput.value,
            description: descriptionInput.value,
            dueDate: dueDateInput.value,
            priority: priorityInput.value,
            taskType: selectedTaskType || 'Not specified',
            urgent: urgentCheckbox.checked,
            category: categoryInput.value || 'Not specified',
            color: colorInput.value || 'transparent',
            likes: 0
        };

        createTaskElement(newTaskData);

        // Save tasks to local storage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(newTaskData);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        form.reset(); // Clears the form inputs after submit
    });

    function createTaskElement(taskData) {
        const newTask = document.createElement("div");
        newTask.classList.add('task');
        newTask.setAttribute('data-task', taskData.task);
        newTask.style.backgroundColor = taskData.color;
        newTask.innerHTML = `
            <h3>${taskData.task}</h3>
            <p>Description: ${taskData.description}</p>
            <p>Due Date: ${taskData.dueDate}</p>
            <p>Priority: ${taskData.priority}</p>
            <p>Task Type: ${taskData.taskType}</p>
            <p>Urgent: ${taskData.urgent ? 'Yes' : 'No'}</p>
            <p>Category: ${taskData.category}</p>
            <p>Likes: <span id="likeCount_${taskData.task}">${taskData.likes}</span></p>
            <div class="task-actions">
                <button class="delete-button" onclick="deleteTask('${taskData.task}')">Delete</button>
                <button class="like-button" onclick="likeTask('${taskData.task}')">Like</button>
            </div>
        `;

        taskContainer.appendChild(newTask);
    }

    // Function to delete a task
    window.deleteTask = function(taskName) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.task !== taskName);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        // Remove the task element from the DOM
        const taskElement = document.querySelector(`.task[data-task="${taskName}"]`);
        if (taskElement) {
            taskElement.remove();
        }
    };

    // Function to like a task
    window.likeTask = function(taskName) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.map(task => {
            if (task.task === taskName) {
                task.likes += 1;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        // Update the like count in the DOM
        const likeCountElement = document.getElementById(`likeCount_${taskName}`);
        if (likeCountElement) {
            likeCountElement.textContent = updatedTasks.find(task => task.task === taskName).likes;
        }
    };
});
