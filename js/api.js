class ApiConnection {
    constructor() {
        this.apiUrl = 'http://31.129.57.26/api/';
    }

    async registerUser(login, email, password) {
        try {
            const response = await fetch(`${this.apiUrl}user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, email, password })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            return `Error connecting to API: ${error.message}`;
        }
    }
    

async passwordRequest(email) {
    try {
        const response = await fetch(`${this.apiUrl}pwdchange`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(email), // Передаем email напрямую
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log(responseData); // Данные ответа
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
}

    async passwordRecovery() {
        try {
            const email = document.getElementById('forgotPasswordEmail').value;
            const code = document.getElementById('codeInput').value;
            const url = (`${this.apiUrl}pwdchange/verify-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Возвращаем объект ответа, чтобы его можно было использовать в обработчике события
            return response;
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            throw error; // Перебрасываем ошибку, чтобы её можно было обработать вызывающему коду
        }
    }

    async changePassword() {
        try {
            const email = document.getElementById('forgotPasswordEmail').value;
            const newPassword = document.getElementById('newPassword').value;
            const url = `${this.apiUrl}user/change-password`;
    
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }), // Передаем данные в теле запроса в формате JSON
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Возвращаем объект ответа, чтобы его можно было использовать в обработчике события
            return response;
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            throw error; // Перебрасываем ошибку, чтобы её можно было обработать вызывающему коду
        }
    }
    

    

    async passwordUpdate(id, user, password) {
        try {
            user.password = password;
            const response = await fetch(`${this.apiUrl}user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return `Error connecting to API: ${error.message}`;
        }   
    }

    async authenticateUser(login, password) {
        const userCredentials = {
            login: login,
            password: password
        };
    
        try {
            const response = await fetch(`${this.apiUrl}user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userCredentials)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            sessionStorage.setItem('id_user', data.id_user);
            return `User authenticated successfully. User ID: ${data.id_user}`;
        } catch (error) {
            return `Error connecting to API: ${error.message}`;
        }
    }
    

    async getUserProjects(id_user) {
        try {
            const response = await fetch(`${this.apiUrl}project/user/${id_user}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            return data.map(projectData => {
                // Предполагаем, что у каждого проекта есть хотя бы одна роль в rolesInProject
                const role = projectData.rolesInProject[0].role;
                return new Project(projectData.id, projectData.name, role.name); // Передаем имя роли
            });
        } catch (error) {
            return `Error connecting to API: ${error.message}`;
        }
    }
    

    
    async createProjectWithRole(id_user, project_name) {
        try {
            const url = `${this.apiUrl}project/create?id_user=${id_user}&project_name=${project_name}`;
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({}) // Пустое тело запроса, так как параметры передаются через URL
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            return `Error connecting to API: ${error.message}`;
        }
    }
    
    async deleteProject(id) {
        try {
            const response = await fetch(`${this.apiUrl}project/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            console.log('Project deleted successfully');
            return true; // Возвращаем true, чтобы указать, что удаление прошло успешно
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }
    
    async updateProjectName(id, newName) {
        const project = {
            Id: id,
            Name: newName
        };
    
        try {
            const response = await fetch(`${this.apiUrl}project/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(project)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            console.log('Project name updated successfully');
            return true; // Возвращаем true, чтобы указать, что обновление прошло успешно
        } catch (error) {
            console.error('Error updating project name:', error);
            throw error;
        }
    }

    
    async updateProjectName(id, newName) {
        const url = `${this.apiUrl}project/${id}?newName=${encodeURIComponent(newName)}`;
    
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            console.log('Project name updated successfully');
            return true; // Возвращаем true, чтобы указать, что обновление прошло успешно
        } catch (error) {
            console.error('Error updating project name:', error);
            throw error;
        }
    }


    async getKanbanDataByProjectId(projectId) {
        try {
            // Получаем группы по проекту
            const groupResponse = await fetch(`${this.apiUrl}group/project/${projectId}`);
            if (!groupResponse.ok) {
                throw new Error(`HTTP error! Status: ${groupResponse.status}`);
            }
    
            const groupData = await groupResponse.json();
    
            // Получаем задачи по группам
            const tasksData = [];
            for (const group of groupData) {
                try {
                    const tasksResponse = await fetch(`${this.apiUrl}task/group/${group.id}`);
                    if (!tasksResponse.ok) {
                        throw new Error(`HTTP error! Status: ${tasksResponse.status}`);
                    }
    
                    const tasksJson = await tasksResponse.json();
                    tasksData.push(...tasksJson);
                } catch (tasksError) {
                    
                }
            }
    
            // Преобразуем данные в объекты KanbanColumn и KanbanTask
            const kanbanColumns = groupData.map(group => {
                const groupTasks = tasksData
                    .filter(task => task.id_group === group.id)
                    .map(task => ({
                        id: task.id,
                        title: task.name,
                        description: task.description
                    }));
    
                return {
                    id: group.id,
                    name: group.name,
                    tasks: groupTasks.length > 0 ? groupTasks : []
                };
            });
    
            return kanbanColumns;
        } catch (error) {
            throw new Error(`Error fetching Kanban data: ${error.message}`);
        }
    }
    

    async postGroup(id_project, name_project) {
        try {
            const groupDto = {
                Id_project: id_project,
                Name: name_project
            };
    
            const response = await fetch(`${this.apiUrl}group`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(groupDto)
            });
    
            if (response.status === 201) {
                console.log('Группа успешно создана');
                const data = await response.json();
                return data;
            } else {
                throw new Error(`Ошибка при создании группы: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error.message);
            throw error;
        }
    }
    

    async postTask(description, id_group) {
        try {
            const taskDto = {
                description: description,
                id_group: id_group
            };
    
            const response = await fetch(`${this.apiUrl}task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskDto)
            });
    
            if (response.status === 201) {
                console.log('Задача успешно создана');
                const data = await response.json();
                return data;
            } else {
                throw new Error('Ошибка при создании задачи: ${response.statusText}');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error.message);
            throw error;
        }
    }

    

    async patchTask(id, newName, newDescription) {
        if (!newName || !newDescription) {
            console.error("Both newName and newDescription parameters are required.");
            return;
        }
    
        const url = `${this.apiUrl}task/${id}?newName=${encodeURIComponent(newName)}&newDescription=${encodeURIComponent(newDescription)}`;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // Добавьте заголовок авторизации, если это необходимо
                // 'Authorization': 'Bearer your_token_here'
            }
        };
    
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Если сервер возвращает только статус, не пытайтесь парсить JSON
            console.log('Task updated successfully');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }
    
    
    
    

    async postTask(name, description, id_group) {
        if (!name || !description || !id_group) {
            console.error("Неверные данные задачи");
            return;
        }

        const url = (`${this.apiUrl}task`);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                Name: name,
                Description: description,
                Id_group: id_group
            })
        };
    
        try {
            const response = await fetch(url, options);
            if (response.status === 201) {
                const data = await response.json();
                console.log('Задача успешно создана:', data);
                return data;
            } else {
                throw new Error(`Ошибка при создании задачи: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error.message);
            throw error;
        }
    }
    


    async deleteTask(id) {
        const url = `${this.apiUrl}task/${id}`;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        };
    
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
    

    async updateGroupName(id, name) {
        try {

            const response = await fetch(`${this.apiUrl}group/${id}?name=${name}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            console.log('Group name updated successfully');
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
    

    async deleteGroup(id) {
        try {

            const response = await fetch(`${this.apiUrl}group/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Добавьте другие необходимые заголовки, такие как авторизация
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            console.log('Group deleted successfully');
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
    

    async  getRoles() {
        const url = `${this.apiUrl}Role`;
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const roles = await response.json();
            console.log('Roles:', roles);
            return roles;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    

    async postLoginRoleInProject(userLogin, id, roleId) {
        const url = `${this.apiUrl}RoleInProject/login?userLogin=${userLogin}&id=${id}&roleId=${roleId}`;

        try {
            console.log('Posting login role in project:', url);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const roleInProjectDto = await response.json();
            console.log('RoleInProjectDto:', roleInProjectDto);
            return roleInProjectDto;
        } catch (error) {
            console.error('Error posting login role in project:', error);
        }
    }
    


}


class Project {
    constructor(id_project, name_project, role) {
        this.id_project = id_project;
        this.name_project = name_project;
        this.role = role;
    }
}

class KanbanColumn {
    constructor(id, name, tasks) {
        this.id = id;
        this.name = name;
        this.tasks = tasks;
    }
}

class KanbanTask {
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
}

export default ApiConnection;
