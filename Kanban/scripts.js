import ApiConnection from '../../js/api.js';

document.addEventListener('DOMContentLoaded', function () {
    const api = new ApiConnection();
    const addProjectButton = document.getElementById('addProjectButton');
    const projectNameTextBox = document.getElementById('projectNameTextBox');
    const projectsList = document.getElementById('projectsList');
    const projectModal = document.getElementById('projectModal');
    const closeProjectModal = document.getElementById('closeProjectModal');
    const editProjectName = document.getElementById('editProjectName');
    const saveChangesButton = document.getElementById('saveChangesButton');
    const backToProjectsButton = document.getElementById('backToProjectsButton');
    const kanbanWindow = document.getElementById('kanbanWindow');

    // Task modal elements
    const taskModal = document.getElementById('task-modal');
    const closeTaskModal = document.getElementById('close-task-modal');
    const taskForm = document.getElementById('task-form');
    const taskIdInput = document.getElementById('task-id');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskLaneSelect = document.getElementById('task-lane');
    const deleteTaskBtn = document.getElementById('delete-task-btn');
    const taskCreateBtn = document.getElementById('taskcreate');
    let currentTask = null;
    let currentProject = null;

    // Edit modal elements
    const editModal = document.getElementById('edit-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const editForm = document.getElementById('edit-form');
    const editTaskIdInput = document.getElementById('edit-task-id');
    const editTaskTitleInput = document.getElementById('edit-task-title');
    const editTaskDescInput = document.getElementById('edit-task-desc');
    const editTaskLaneSelect = document.getElementById('edit-task-lane');
    const editTaskSaveBtn = document.getElementById('edit-task-save');
    const deleteEditTaskBtn = document.getElementById('delete-edit-task-btn');

    var modal = document.getElementById('name-modal');
    var closeModalButton = document.getElementById('close-name-modal');
    const nameCreateButton = document.getElementById('namecreate');
    const deleteNameButton = document.getElementById('delete-name-btn'); // Новый элемент
    const addUsersBtn = document.getElementById('add-users-btn');
    const usersModal = document.getElementById('users-modal');
    const closeUsersModal = document.getElementById('close-users-modal');
    const deleteUsersBtn = document.getElementById('delete-users-btn');
    const deleteUsersModal = document.getElementById('deleteusers-modal');
    const closeDeleteUsersModal = document.getElementById('close-deleteusers-modal');
    const cancelDeleteUsersBtn = document.getElementById('cancel-deleteusers-btn');

    document.getElementById('adduserscreate').addEventListener('click', async () => {
        const roleId = document.getElementById('users-roles').value;
        const userLogin = document.getElementById('users-title').value;
        const id = sessionStorage.getItem('id_project');

        if (roleId && userLogin && id) {
            await api.postLoginRoleInProject(userLogin, id, roleId);
        } else {
            console.error('Missing required information.');
        }
    });


    document.getElementById('add-users-btn').addEventListener('click', async () => {
        const roles = await api.getRoles();
        if (roles) {
            populateDropdown(roles);
        }
    });

    function populateDropdown(roles) {
        const dropdown = document.getElementById('users-roles');
        dropdown.innerHTML = ''; // Clear any existing options

        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id_role;
            option.textContent = role.name_role;
            dropdown.appendChild(option);
        });
    }


    deleteUsersBtn.addEventListener('click', () => {
        deleteUsersModal.style.display = 'block';
    });

    closeDeleteUsersModal.addEventListener('click', () => {
        deleteUsersModal.style.display = 'none';
    });

    cancelDeleteUsersBtn.addEventListener('click', () => {
        deleteUsersModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === deleteUsersModal) {
            deleteUsersModal.style.display = 'none';
        }
    });
    
    addUsersBtn.addEventListener('click', () => {
        usersModal.style.display = 'block';
    });

    closeUsersModal.addEventListener('click', () => {
        usersModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === usersModal) {
            usersModal.style.display = 'none';
        }
    });



    deleteNameButton.addEventListener('click', async function () {
        const swimLaneId = document.querySelector('.swim-lane').dataset.id; // Предполагаем, что swim-lane уже существует и имеет id
    
        try {
            await api.deleteGroup(swimLaneId);
            loadAndDisplaySwimLanesAndTasks(sessionStorage.getItem('id_project'));
        } catch (error) {
            console.error('Ошибка при удалении группы:', error);
            alert('Произошла ошибка при удалении группы. Пожалуйста, попробуйте снова.');
        }
    });
    


    nameCreateButton.addEventListener('click', async function () {
        const swimLaneId = document.querySelector('.swim-lane').dataset.id; // Предполагаем, что swim-lane уже существует и имеет id
        const groupName = document.getElementById('name-title').value.trim();
    
        if (!groupName) {
            alert('Group name cannot be empty.');
            return;
        }
    
        try {
            await api.updateGroupName(swimLaneId, groupName);
            loadAndDisplaySwimLanesAndTasks(sessionStorage.getItem('id_project'));
        } catch (error) {
            console.error('Ошибка при обновлении имени группы:', error);
            alert('Произошла ошибка при обновлении имени группы. Пожалуйста, попробуйте снова.');
        }
    });
    

    // Open modal when a dynamically created heading is clicked
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('heading')) {
            modal.style.display = 'block';
        }
    });

    // Close modal when the close button is clicked
    closeModalButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    nameCreateButton.addEventListener('click', async function(event) {
        event.preventDefault();
        
        const id = document.getElementById('name-id').value;
        const name = document.getElementById('name-title').value;
    
        if (id && name) {
            await apiConnection.updateGroupName(id, name);
        } else {
            console.error('ID and Name must be provided');
        }
    });
    


    editTaskSaveBtn.addEventListener('click', async function (event) {
        event.preventDefault();
        const taskId = editTaskIdInput.value.trim();
        const taskTitle = editTaskTitleInput.value.trim();
        const taskDesc = editTaskDescInput.value.trim();
    
        if (!taskTitle || !taskDesc) {
            alert('Both title and description are required.');
            return;
        }
    
        try {
            await api.patchTask(taskId, taskTitle, taskDesc);
            if (currentTask) {
                currentTask.querySelector('h3').textContent = taskTitle;
                currentTask.querySelector('p').textContent = taskDesc;
            }
            editModal.style.display = 'none';
            const projectId = sessionStorage.getItem('id_project');
            loadAndDisplaySwimLanesAndTasks(projectId)
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task. Please try again.');
        }
    });
    
    deleteEditTaskBtn.addEventListener('click', async function () {
        if (currentTask) {
            const taskId = currentTask.dataset.id;
            try {
                await api.deleteTask(taskId);
                // Удаляем задачу из DOM до того, как установить currentTask в null
                if (currentTask && currentTask.parentNode) {
                    currentTask.parentNode.removeChild(currentTask);
                }
                currentTask = null;
                editModal.style.display = 'none';
                console.log('Task deleted successfully');
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Error deleting task. Please try again.');
            }
        }
    });
    

    // Get userId from sessionStorage
    const userId = sessionStorage.getItem('id_user');

    if (userId) {
        console.log('User ID:', userId);
    } else {
        console.log('User ID not found');
    }

    const projects = api.getUserProjects(userId);
    console.log(projects);

    loadAndDisplayProjects();

    async function loadAndDisplayProjects() {
        const projects = await api.getUserProjects(userId);
        projectsList.innerHTML = ''; // Clear current list
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.dataset.id = project.id_project;
            projectItem.dataset.role = project.role;
            projectItem.innerHTML = `
                <span class="project-title">${project.name_project}</span>
                <span class="project-actions">
                    <button class="button edit-project">Редактировать</button>
                    <button class="button open-project">Открыть</button>
                    <span class="delete-project">&times;</span>
                </span>
            `;

            projectsList.appendChild(projectItem);

            // Attach functions to buttons
            const openProjectButton = projectItem.querySelector('.open-project');
            openProjectButton.addEventListener('click', () => {
                loadAndDisplaySwimLanesAndTasks(project.id_project);
            });

            projectItem.querySelector('.edit-project').addEventListener('click', function () {
                currentProject = projectItem;
                editProjectName.value = projectItem.querySelector('.project-title').textContent;
                projectModal.style.display = 'block';
            });

            projectItem.querySelector('.project-title').addEventListener('click', function () {
                projectNameTextBox.value = project.name_project;
                document.querySelector('#mainWindow').style.display = 'none';
                kanbanWindow.style.display = 'block';
            });

// Обработчик удаления проекта
        projectItem.querySelector('.delete-project').addEventListener('click', async function () {
            const confirmation = confirm("Вы уверены, что хотите удалить проект?");
            if (confirmation) {
                const projectId = projectItem.dataset.id;
                await api.deleteProject(projectId); // Ждем, пока проект будет удален на сервере
                projectsList.removeChild(projectItem); // Удаляем элемент из DOM
            }
            
        });

            projectItem.querySelector('.open-project').addEventListener('click', function () {
                projectNameTextBox.value = project.name_project;
                document.querySelector('#mainWindow').style.display = 'none';
                kanbanWindow.style.display = 'block';
                sessionStorage.setItem('id_project', project.id_project);
            });

            projectsList.appendChild(projectItem);
        });
    
    }

    async function loadAndDisplaySwimLanesAndTasks(projectId) {
        const lanesContainer = document.getElementById('lanes');
        lanesContainer.innerHTML = ''; // Clear current list

        const kanbanColumns = await api.getKanbanDataByProjectId(projectId);

        kanbanColumns.forEach(column => {
            const swimLane = document.createElement('div');
            swimLane.className = 'swim-lane';
            swimLane.dataset.id = column.id;

            const heading = document.createElement('div');
            heading.className = 'heading';
            heading.textContent = column.name;

            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'cards';

            const addTaskBtn = document.createElement('button');
            addTaskBtn.className = 'add-task-btn';
            addTaskBtn.textContent = 'Add Task +';
            addTaskBtn.addEventListener('click', function () {
                openTaskModal(swimLane);
            });

            swimLane.appendChild(heading);
            swimLane.appendChild(addTaskBtn);
            swimLane.appendChild(cardsContainer);

            column.tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'card';
                taskItem.style.position = 'relative';
                taskItem.dataset.id = task.id;

                taskItem.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <button class="edit-task-btn">Edit</button>
                `;

                taskItem.querySelector('.edit-task-btn').addEventListener('click', function () {
                    openEditModal(swimLane, taskItem);
                });

                cardsContainer.appendChild(taskItem);
            });

            lanesContainer.appendChild(swimLane);
        });
    }

    function openTaskModal(lane, task = null) {
        currentTask = task;
        taskIdInput.value = task ? task.dataset.id : '';
        taskTitleInput.value = task ? task.querySelector('h3').textContent : '';
        taskDescInput.value = task ? task.querySelector('p').textContent : '';
        taskLaneSelect.innerHTML = '';
        const lanes = document.querySelectorAll('.swim-lane');
        lanes.forEach(l => {
            const option = document.createElement('option');
            option.value = l.dataset.id;
            option.textContent = l.querySelector('.heading').textContent;
            taskLaneSelect.appendChild(option);
        });
        taskLaneSelect.value = lane.dataset.id;
        taskModal.style.display = 'block';
    }

    function openEditModal(lane, task) {
        currentTask = task;
        editTaskIdInput.value = task.dataset.id;
        editTaskTitleInput.value = task.querySelector('h3').textContent;
        editTaskDescInput.value = task.querySelector('p').textContent;
        editTaskLaneSelect.innerHTML = '';
        const lanes = document.querySelectorAll('.swim-lane');
        lanes.forEach(l => {
            const option = document.createElement('option');
            option.value = l.dataset.id;
            option.textContent = l.querySelector('.heading').textContent;
            editTaskLaneSelect.appendChild(option);
        });
        editTaskLaneSelect.value = lane.dataset.id;
        editModal.style.display = 'block';
    }

    closeTaskModal.addEventListener('click', function () {
        taskModal.style.display = 'none';
    });

    closeEditModal.addEventListener('click', function () {
        editModal.style.display = 'none';
    });

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskTitle = taskTitleInput.value.trim();
        const taskDesc = taskDescInput.value.trim();
        const taskLane = taskLaneSelect.value;
        if (taskTitle) {
            if (currentTask) {
                currentTask.querySelector('h3').textContent = taskTitle;
                currentTask.querySelector('p').textContent = taskDesc;
            } else {
                const taskCard = document.createElement('div');
                taskCard.className = 'card';
                taskCard.style.position = 'relative';
                taskCard.innerHTML = `
                    <h3>${taskTitle}</h3>
                    <p>${taskDesc}</p>
                    <button class="edit-task-btn">Edit</button>
                `;

                taskCard.querySelector('.edit-task-btn').addEventListener('click', function () {
                    openTaskModal(taskCard.closest('.swim-lane'), taskCard);
                });

                const targetLane = Array.from(document.querySelectorAll('.swim-lane')).find(l => l.dataset.id === taskLane);
                if (targetLane) {
                    const cardsContainer = targetLane.querySelector('.cards');
                    if (cardsContainer) {
                        cardsContainer.appendChild(taskCard);
                    } else {
                        console.error('Cards container not found in target lane:', taskLane);
                        alert('Ошибка: Не удалось найти контейнер для задач в целевой дорожке.');
                    }
                } else {
                    console.error('Target lane not found for task:', taskLane);
                    alert('Ошибка: Не удалось найти целевую дорожку для задачи.');
                }
            }
            taskModal.style.display = 'none';
        }
    });

    editForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskId = editTaskIdInput.value.trim();
        const taskTitle = editTaskTitleInput.value.trim();
        const taskDesc = editTaskDescInput.value.trim();
        const taskLane = editTaskLaneSelect.value;
        if (taskTitle) {
            if (currentTask) {
                currentTask.querySelector('h3').textContent = taskTitle;
                currentTask.querySelector('p').textContent = taskDesc;
            }
            // Дополнительная логика для сохранения изменений на сервере может быть добавлена здесь
            editModal.style.display = 'none';
        }
    });

    taskCreateBtn.addEventListener('click', async function () {
        const name = taskTitleInput.value.trim();
        const description = taskDescInput.value.trim();
        const id_group = taskLaneSelect.value;
        if (description === '') {
            alert('Task description cannot be empty.');
            return;
        }

        try {
            const newTask = await api.postTask(name, description, id_group);
            console.log('Задача успешно создана:', newTask);

            const targetLane = Array.from(document.querySelectorAll('.swim-lane')).find(l => l.dataset.id === id_group);
            if (targetLane) {
                const taskCard = document.createElement('div');
                taskCard.className = 'card';
                taskCard.style.position = 'relative';
                taskCard.dataset.id = newTask.id;

                taskCard.innerHTML = `
                    <h3>${newTask.title}</h3>
                    <p>${newTask.description}</p>
                    <button class="edit-task-btn">Edit</button>
                `;

                taskCard.querySelector('.edit-task-btn').addEventListener('click', function () {
                    openEditModal(targetLane, taskCard);
                });

                const cardsContainer = targetLane.querySelector('.cards');
                if (cardsContainer) {
                    cardsContainer.appendChild(taskCard);
                } else {
                    console.error('Cards container not found in target lane:', id_group);
                    alert('Ошибка: Не удалось найти контейнер для задач в целевой дорожке.');
                }
            } else {
                console.error('Target lane not found for task:', id_group);
                alert('Ошибка: Не удалось найти целевую дорожку для задачи.');
            }

            const projectId = sessionStorage.getItem('id_project');
            loadAndDisplaySwimLanesAndTasks(projectId)

        } catch (error) {
            console.error('Ошибка при создании задачи:', error.message);
            alert('Произошла ошибка при создании задачи. Пожалуйста, попробуйте снова.');
        }
    });

    deleteTaskBtn.addEventListener('click', function () {
        if (currentTask) {
            currentTask.parentNode.removeChild(currentTask);
            currentTask = null;
            taskModal.style.display = 'none';
        }
    });

    deleteEditTaskBtn.addEventListener('click', function () {
        if (currentTask) {
            currentTask.parentNode.removeChild(currentTask);
            currentTask = null;
            editModal.style.display = 'none';
        }
    });

    groupcreate.addEventListener('click', async () => {
        const groupName = document.getElementById('lane-title').value;
        const id_project = sessionStorage.getItem('id_project');
        if (groupName.trim() === '') {
            alert('Group name cannot be empty.');
            return;
        }

        try {
            await api.postGroup(id_project, groupName, 0);
            loadAndDisplaySwimLanesAndTasks(id_project);
        } catch (error) {
            console.error('Ошибка при добавлении новой группы:', error.message);
            alert('Произошла ошибка при добавлении новой группы. Пожалуйста, попробуйте снова.');
        }
    });

    addProjectButton.addEventListener('click', async () => {
        const projectName = document.getElementById('projectNameTextBox').value;

        if (projectName.trim() === '') {
            alert('Project name cannot be empty.');
            return;
        }

        try {
            await api.createProjectWithRole(userId, projectName);
            await loadAndDisplayProjects();
        } catch (error) {
            console.error(error);
            alert('Error creating project.');
        }
    });

    closeProjectModal.addEventListener('click', function () {
        projectModal.style.display = 'none';
    });

    saveChangesButton.addEventListener('click', async function () {
        if (currentProject) {
            const projectId = currentProject.dataset.id;
            const newName = editProjectName.value;

            try {
                await api.updateProjectName(projectId, newName);
                const projectTitle = currentProject.querySelector('.project-title');
                projectTitle.textContent = newName;
                currentProject = null;
                projectModal.style.display = 'none';
            } catch (error) {
                console.error('Error updating project name:', error);
                alert('Error updating project name.');
            }
        }
    });

    backToProjectsButton.addEventListener('click', function () {
        kanbanWindow.style.display = 'none';
        document.querySelector('#mainWindow').style.display = 'block';
    });

    window.onclick = function (event) {
        if (event.target === projectModal) {
            projectModal.style.display = 'none';
        }
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    };
});

export default ApiConnection;
