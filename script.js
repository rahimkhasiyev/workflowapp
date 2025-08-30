// Workflow App - Main JavaScript File
class WorkflowApp {
    constructor() {
        this.projects = [];
        this.tasks = [];
        this.teamMembers = [];
        this.workflows = [];
        this.activities = [];
        this.currentUser = null;
        
        this.initializeApp();
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.loadSampleData(); // Only loads if no saved data exists
        this.checkLoginStatus();
        this.updateDashboard();
    }

    initializeApp() {
        // Initialize navigation
        this.setupNavigation();
        
        // Initialize search functionality
        this.setupSearch();
        
        // Initialize charts
        this.initializeCharts();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        const pageTitle = document.getElementById('page-title');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.getAttribute('data-section');
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Show target section
                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetSection) {
                        section.classList.add('active');
                    }
                });
                
                // Update page title
                const title = item.querySelector('span').textContent;
                pageTitle.textContent = title;
                
                // Update specific section data
                this.updateSectionData(targetSection);
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.performSearch(query);
        });
    }

    performSearch(query) {
        if (query.length < 2) {
            this.updateSectionData(this.getCurrentSection());
            return;
        }

        const results = {
            projects: this.projects.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            ),
            tasks: this.tasks.filter(t => 
                t.title.toLowerCase().includes(query) || 
                t.description.toLowerCase().includes(query)
            ),
            teamMembers: this.teamMembers.filter(m => 
                m.name.toLowerCase().includes(query) || 
                m.role.toLowerCase().includes(query)
            )
        };

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const currentSection = this.getCurrentSection();
        const container = document.getElementById(`${currentSection}-grid`) || 
                         document.getElementById(`${currentSection}-list`);

        if (!container) return;

        container.innerHTML = '';

        const allResults = [
            ...results.projects.map(item => ({ ...item, type: 'project' })),
            ...results.tasks.map(item => ({ ...item, type: 'task' })),
            ...results.teamMembers.map(item => ({ ...item, type: 'member' }))
        ];

        allResults.forEach(item => {
            const element = this.createSearchResultElement(item);
            container.appendChild(element);
        });
    }

    createSearchResultElement(item) {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        
        switch (item.type) {
            case 'project':
                div.innerHTML = `
                    <div class="project-card">
                        <div class="project-header">
                            <div>
                                <div class="project-title">${item.name}</div>
                                <div class="project-status status-${item.status}">${item.status}</div>
                            </div>
                        </div>
                        <div class="project-description">${item.description}</div>
                    </div>
                `;
                break;
            case 'task':
                div.innerHTML = `
                    <div class="task-item">
                        <div class="task-content">
                            <div class="task-title">${item.title}</div>
                            <div class="task-meta">
                                <span>${item.status}</span>
                                <span class="task-priority priority-${item.priority}">${item.priority}</span>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'member':
                div.innerHTML = `
                    <div class="team-member-card">
                        <img src="${item.avatar}" alt="${item.name}" class="member-avatar">
                        <div class="member-name">${item.name}</div>
                        <div class="member-role">${item.role}</div>
                    </div>
                `;
                break;
        }
        
        return div;
    }

    getCurrentSection() {
        const activeNav = document.querySelector('.nav-item.active');
        return activeNav ? activeNav.getAttribute('data-section') : 'dashboard';
    }

    updateSectionData(section) {
        switch (section) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'projects':
                this.renderProjects();
                break;
            case 'tasks':
                this.renderTasks();
                break;
            case 'team':
                this.renderTeam();
                break;
            case 'workflows':
                this.renderWorkflows();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
        }
    }

    loadSampleData() {
        // Only load sample data if no saved data exists
        if (this.projects.length > 0 || this.teamMembers.length > 0) {
            return; // Skip loading sample data if we already have data
        }
        
        // Sample Projects
        this.projects = [
            {
                id: 1,
                name: 'Website Redesign',
                description: 'Complete redesign of company website with modern UI/UX',
                status: 'active',
                progress: 75,
                startDate: '2024-01-15',
                endDate: '2024-03-30',
                manager: 'Sarah Johnson',
                team: ['John Doe', 'Mike Smith', 'Lisa Chen']
            },
            {
                id: 2,
                name: 'Mobile App Development',
                description: 'iOS and Android app for customer engagement',
                status: 'active',
                progress: 45,
                startDate: '2024-02-01',
                endDate: '2024-05-15',
                manager: 'David Wilson',
                team: ['Alex Brown', 'Emma Davis', 'Tom Lee']
            },
            {
                id: 3,
                name: 'Marketing Campaign',
                description: 'Q2 marketing campaign for new product launch',
                status: 'completed',
                progress: 100,
                startDate: '2024-01-01',
                endDate: '2024-03-31',
                manager: 'Jennifer Adams',
                team: ['Rachel Green', 'Chris Martin']
            }
        ];

        // Sample Tasks
        this.tasks = [
            {
                id: 1,
                title: 'Design Homepage Layout',
                description: 'Create wireframes and mockups for homepage',
                status: 'completed',
                priority: 'high',
                assignee: 'John Doe',
                project: 'Website Redesign',
                dueDate: '2024-02-15',
                completed: true
            },
            {
                id: 2,
                title: 'Implement User Authentication',
                description: 'Set up login and registration system',
                status: 'in-progress',
                priority: 'high',
                assignee: 'Mike Smith',
                project: 'Mobile App Development',
                dueDate: '2024-03-01',
                completed: false
            },
            {
                id: 3,
                title: 'Create Social Media Content',
                description: 'Design posts for Instagram and Facebook',
                status: 'todo',
                priority: 'medium',
                assignee: 'Lisa Chen',
                project: 'Marketing Campaign',
                dueDate: '2024-02-28',
                completed: false
            },
            {
                id: 4,
                title: 'API Integration',
                description: 'Integrate third-party payment APIs',
                status: 'review',
                priority: 'urgent',
                assignee: 'Alex Brown',
                project: 'Mobile App Development',
                dueDate: '2024-02-20',
                completed: false
            }
        ];

        // Sample Team Members
        this.teamMembers = [
            {
                id: 1,
                name: 'John Doe',
                role: 'Frontend Developer',
                email: 'john.doe@company.com',
                avatar: 'https://via.placeholder.com/80',
                department: 'Engineering',
                tasksCompleted: 24,
                currentTasks: 3
            },
            {
                id: 2,
                name: 'Sarah Johnson',
                role: 'Project Manager',
                email: 'sarah.johnson@company.com',
                avatar: 'https://via.placeholder.com/80',
                department: 'Management',
                tasksCompleted: 18,
                currentTasks: 5
            },
            {
                id: 3,
                name: 'Mike Smith',
                role: 'Backend Developer',
                email: 'mike.smith@company.com',
                avatar: 'https://via.placeholder.com/80',
                department: 'Engineering',
                tasksCompleted: 31,
                currentTasks: 2
            },
            {
                id: 4,
                name: 'Lisa Chen',
                role: 'UI/UX Designer',
                email: 'lisa.chen@company.com',
                avatar: 'https://via.placeholder.com/80',
                department: 'Design',
                tasksCompleted: 15,
                currentTasks: 4
            }
        ];

        // Sample Workflows
        this.workflows = [
            {
                id: 1,
                name: 'Content Approval Process',
                description: 'Standard workflow for content creation and approval',
                steps: [
                    { name: 'Content Creation', completed: true },
                    { name: 'Design Review', completed: true },
                    { name: 'Legal Review', completed: false },
                    { name: 'Final Approval', completed: false }
                ],
                activeInstances: 3
            },
            {
                id: 2,
                name: 'Bug Fix Workflow',
                description: 'Process for reporting and fixing bugs',
                steps: [
                    { name: 'Bug Report', completed: true },
                    { name: 'Investigation', completed: true },
                    { name: 'Fix Development', completed: false },
                    { name: 'Testing', completed: false },
                    { name: 'Deployment', completed: false }
                ],
                activeInstances: 7
            }
        ];

        // Sample Activities
        this.activities = [
            {
                id: 1,
                type: 'task_completed',
                title: 'Task Completed',
                description: 'John Doe completed "Design Homepage Layout"',
                timestamp: '2 hours ago',
                icon: 'fas fa-check'
            },
            {
                id: 2,
                type: 'project_updated',
                title: 'Project Updated',
                description: 'Website Redesign progress updated to 75%',
                timestamp: '4 hours ago',
                icon: 'fas fa-chart-line'
            },
            {
                id: 3,
                type: 'new_task',
                title: 'New Task Created',
                description: 'API Integration task assigned to Alex Brown',
                timestamp: '1 day ago',
                icon: 'fas fa-plus'
            }
        ];
    }

    updateDashboard() {
        // Update stats
        document.getElementById('total-projects').textContent = this.projects.length;
        document.getElementById('total-tasks').textContent = this.tasks.filter(t => !t.completed).length;
        document.getElementById('team-members').textContent = this.teamMembers.length;
        document.getElementById('overdue-tasks').textContent = this.tasks.filter(t => 
            new Date(t.dueDate) < new Date() && !t.completed
        ).length;

        // Update recent activity
        this.renderRecentActivity();

        // Update project progress
        this.renderProjectProgress();
    }

    renderRecentActivity() {
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = '';

        this.activities.slice(0, 5).forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description} • ${activity.timestamp}</p>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    renderProjectProgress() {
        const progressGrid = document.getElementById('project-progress');
        progressGrid.innerHTML = '';

        this.projects.slice(0, 4).forEach(project => {
            const progressItem = document.createElement('div');
            progressItem.className = 'project-progress-item';
            progressItem.innerHTML = `
                <h4>${project.name}</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <div class="progress-info">
                    <span>${project.progress}% Complete</span>
                    <span>${project.manager}</span>
                </div>
            `;
            progressGrid.appendChild(progressItem);
        });
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '';

        this.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-header">
                    <div>
                        <div class="project-title">${project.name}</div>
                        <div class="project-status status-${project.status}">${project.status}</div>
                    </div>
                </div>
                <div class="project-description">${project.description}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <div class="project-meta">
                    <span>${project.progress}% Complete</span>
                    <span>Due: ${project.endDate}</span>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    }

    renderTasks() {
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="app.toggleTaskComplete(${task.id})">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <span>${task.status}</span>
                        <span class="task-priority priority-${task.priority}">${task.priority}</span>
                        <span>${task.assignee}</span>
                        <span>Due: ${task.dueDate}</span>
                    </div>
                </div>
            `;
            tasksList.appendChild(taskItem);
        });
    }

    renderTeam() {
        const teamGrid = document.getElementById('team-grid');
        teamGrid.innerHTML = '';

        this.teamMembers.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'team-member-card';
            memberCard.innerHTML = `
                <img src="${member.avatar}" alt="${member.name}" class="member-avatar">
                <div class="member-name">${member.name}</div>
                <div class="member-role">${member.role}</div>
                <div class="member-stats">
                    <span>${member.tasksCompleted} Completed</span>
                    <span>${member.currentTasks} Active</span>
                </div>
            `;
            teamGrid.appendChild(memberCard);
        });
    }

    renderWorkflows() {
        const workflowsGrid = document.getElementById('workflows-grid');
        workflowsGrid.innerHTML = '';

        this.workflows.forEach(workflow => {
            const workflowCard = document.createElement('div');
            workflowCard.className = 'workflow-card';
            
            const stepsHtml = workflow.steps.map(step => `
                <div class="workflow-step">
                    <div class="step-icon ${step.completed ? 'completed' : ''}">
                        ${step.completed ? '<i class="fas fa-check"></i>' : '<i class="fas fa-circle"></i>'}
                    </div>
                    <span>${step.name}</span>
                </div>
            `).join('');

            workflowCard.innerHTML = `
                <h3>${workflow.name}</h3>
                <p>${workflow.description}</p>
                <div class="workflow-steps">
                    ${stepsHtml}
                </div>
                <div style="margin-top: 15px; font-size: 12px; color: #718096;">
                    ${workflow.activeInstances} active instances
                </div>
            `;
            workflowsGrid.appendChild(workflowCard);
        });
    }

    initializeCharts() {
        // Task Completion Rate Chart
        const completionCtx = document.getElementById('completion-chart');
        if (completionCtx) {
            new Chart(completionCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'In Progress', 'To Do'],
                    datasets: [{
                        data: [65, 20, 15],
                        backgroundColor: ['#48bb78', '#ed8936', '#e53e3e']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Project Timeline Chart
        const timelineCtx = document.getElementById('timeline-chart');
        if (timelineCtx) {
            new Chart(timelineCtx, {
                type: 'bar',
                data: {
                    labels: ['Website Redesign', 'Mobile App', 'Marketing Campaign'],
                    datasets: [{
                        label: 'Progress (%)',
                        data: [75, 45, 100],
                        backgroundColor: '#667eea'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        // Team Performance Chart
        const performanceCtx = document.getElementById('performance-chart');
        if (performanceCtx) {
            new Chart(performanceCtx, {
                type: 'radar',
                data: {
                    labels: ['Task Completion', 'On-time Delivery', 'Quality', 'Collaboration', 'Innovation'],
                    datasets: [{
                        label: 'Team Performance',
                        data: [85, 78, 92, 88, 75],
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        borderColor: '#667eea',
                        pointBackgroundColor: '#667eea'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        // Workload Distribution Chart
        const workloadCtx = document.getElementById('workload-chart');
        if (workloadCtx) {
            new Chart(workloadCtx, {
                type: 'pie',
                data: {
                    labels: ['Development', 'Design', 'Management', 'Marketing'],
                    datasets: [{
                        data: [40, 25, 20, 15],
                        backgroundColor: ['#667eea', '#ed8936', '#48bb78', '#e53e3e']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    updateAnalytics() {
        // Charts are already initialized, just ensure they're visible
        this.initializeCharts();
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.status = task.completed ? 'completed' : 'todo';
            this.renderTasks();
            this.updateDashboard();
        }
    }

    setupEventListeners() {
        // Task filters
        const statusFilter = document.getElementById('task-status-filter');
        const priorityFilter = document.getElementById('task-priority-filter');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterTasks());
        }
        if (priorityFilter) {
            priorityFilter.addEventListener('change', () => this.filterTasks());
        }

        // Form submission handlers
        this.setupFormHandlers();
    }

    setupFormHandlers() {
        // Handle form submissions when modals are shown
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'team-member-form') {
                e.preventDefault();
                this.addTeamMember(e.target);
            } else if (e.target.id === 'project-form') {
                e.preventDefault();
                this.addProject(e.target);
            } else if (e.target.id === 'task-form') {
                e.preventDefault();
                this.addTask(e.target);
            } else if (e.target.id === 'workflow-form') {
                e.preventDefault();
                this.addWorkflow(e.target);
            }
        });
    }

    addTeamMember(form) {
        const formData = new FormData(form);
        const newMember = {
            id: this.teamMembers.length + 1,
            name: form.querySelector('#member-name').value,
            email: form.querySelector('#member-email').value,
            role: form.querySelector('#member-role').value,
            department: form.querySelector('#member-department').value,
            avatar: 'https://via.placeholder.com/80',
            tasksCompleted: 0,
            currentTasks: 0
        };

        this.teamMembers.push(newMember);
        this.saveToLocalStorage();
        this.renderTeam();
        this.updateDashboard();
        closeModal();
        
        // Show success message
        this.showNotification('Team member added successfully!', 'success');
    }

    addProject(form) {
        const newProject = {
            id: this.projects.length + 1,
            name: form.querySelector('#project-name').value,
            description: form.querySelector('#project-description').value,
            manager: form.querySelector('#project-manager').value,
            startDate: form.querySelector('#project-start-date').value,
            endDate: form.querySelector('#project-end-date').value,
            status: 'active',
            progress: 0,
            team: []
        };

        this.projects.push(newProject);
        this.saveToLocalStorage();
        this.renderProjects();
        this.updateDashboard();
        closeModal();
        
        this.showNotification('Project created successfully!', 'success');
    }

    addTask(form) {
        const newTask = {
            id: this.tasks.length + 1,
            title: form.querySelector('#task-title').value,
            description: form.querySelector('#task-description').value,
            assignee: form.querySelector('#task-assignee').value,
            priority: form.querySelector('#task-priority').value,
            dueDate: form.querySelector('#task-due-date').value,
            status: 'todo',
            project: 'General',
            completed: false
        };

        this.tasks.push(newTask);
        this.saveToLocalStorage();
        this.renderTasks();
        this.updateDashboard();
        closeModal();
        
        this.showNotification('Task created successfully!', 'success');
    }

    addWorkflow(form) {
        const stepsText = form.querySelector('#workflow-steps').value;
        const steps = stepsText.split('\n').filter(step => step.trim()).map(step => ({
            name: step.trim(),
            completed: false
        }));

        const newWorkflow = {
            id: this.workflows.length + 1,
            name: form.querySelector('#workflow-name').value,
            description: form.querySelector('#workflow-description').value,
            steps: steps,
            activeInstances: 0
        };

        this.workflows.push(newWorkflow);
        this.saveToLocalStorage();
        this.renderWorkflows();
        this.updateDashboard();
        closeModal();
        
        this.showNotification('Workflow created successfully!', 'success');
    }

    saveToLocalStorage() {
        localStorage.setItem('workflowApp_projects', JSON.stringify(this.projects));
        localStorage.setItem('workflowApp_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('workflowApp_teamMembers', JSON.stringify(this.teamMembers));
        localStorage.setItem('workflowApp_workflows', JSON.stringify(this.workflows));
        localStorage.setItem('workflowApp_activities', JSON.stringify(this.activities));
    }

    loadFromLocalStorage() {
        const savedProjects = localStorage.getItem('workflowApp_projects');
        const savedTasks = localStorage.getItem('workflowApp_tasks');
        const savedTeamMembers = localStorage.getItem('workflowApp_teamMembers');
        const savedWorkflows = localStorage.getItem('workflowApp_workflows');
        const savedActivities = localStorage.getItem('workflowApp_activities');

        if (savedProjects) this.projects = JSON.parse(savedProjects);
        if (savedTasks) this.tasks = JSON.parse(savedTasks);
        if (savedTeamMembers) this.teamMembers = JSON.parse(savedTeamMembers);
        if (savedWorkflows) this.workflows = JSON.parse(savedWorkflows);
        if (savedActivities) this.activities = JSON.parse(savedActivities);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('workflowApp_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUserInterface();
        }
    }

    login(email, password) {
        // Find user by email
        const user = this.teamMembers.find(member => member.email === email);
        
        if (!user) {
            this.showNotification('User not found. Please check your email.', 'error');
            return false;
        }
        
        // Simple password check (in real app, this would be more secure)
        if (password !== '123') {
            this.showNotification('Incorrect password. Try: 123', 'error');
            return false;
        }
        
        this.currentUser = user;
        localStorage.setItem('workflowApp_currentUser', JSON.stringify(user));
        this.updateUserInterface();
        this.showNotification(`Welcome back, ${user.name}!`, 'success');
        return true;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('workflowApp_currentUser');
        this.updateUserInterface();
        this.showNotification('You have been logged out.', 'info');
    }

    updateUserInterface() {
        const userNameElement = document.getElementById('current-user-name');
        const userAvatarElement = document.getElementById('current-user-avatar');
        const logoutItem = document.getElementById('logout-item');
        
        if (this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
            userAvatarElement.src = this.currentUser.avatar;
            logoutItem.style.display = 'block';
        } else {
            userNameElement.textContent = 'Not Logged In';
            userAvatarElement.src = 'https://via.placeholder.com/40';
            logoutItem.style.display = 'none';
        }
    }

    filterTasks() {
        const statusFilter = document.getElementById('task-status-filter');
        const priorityFilter = document.getElementById('task-priority-filter');

        const status = statusFilter.value;
        const priority = priorityFilter.value;

        let filteredTasks = this.tasks;

        if (status !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === status);
        }

        if (priority !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.priority === priority);
        }

        this.renderFilteredTasks(filteredTasks);
    }

    renderFilteredTasks(tasks) {
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = '';

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="app.toggleTaskComplete(${task.id})">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <span>${task.status}</span>
                        <span class="task-priority priority-${task.priority}">${task.priority}</span>
                        <span>${task.assignee}</span>
                        <span>Due: ${task.dueDate}</span>
                    </div>
                </div>
            `;
            tasksList.appendChild(taskItem);
        });
    }
}

// Modal Management
function showModal(type) {
    const modal = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modal.classList.add('active');

    switch (type) {
        case 'new-project':
            modalTitle.textContent = 'Create New Project';
            modalBody.innerHTML = getProjectForm();
            break;
        case 'new-task':
            modalTitle.textContent = 'Create New Task';
            modalBody.innerHTML = getTaskForm();
            break;
        case 'new-team-member':
            modalTitle.textContent = 'Add Team Member';
            modalBody.innerHTML = getTeamMemberForm();
            break;
        case 'new-workflow':
            modalTitle.textContent = 'Create Workflow';
            modalBody.innerHTML = getWorkflowForm();
            break;
    }
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    modal.classList.remove('active');
}

function getProjectForm() {
    // Get current team members for the dropdown
    const teamMembers = app ? app.teamMembers : [];
    const managerOptions = teamMembers.map(member => 
        `<option value="${member.name}">${member.name}</option>`
    ).join('');

    return `
        <form id="project-form">
            <div class="form-group">
                <label for="project-name">Project Name</label>
                <input type="text" id="project-name" required>
            </div>
            <div class="form-group">
                <label for="project-description">Description</label>
                <textarea id="project-description" required></textarea>
            </div>
            <div class="form-group">
                <label for="project-manager">Project Manager</label>
                <select id="project-manager" required>
                    <option value="">Select Manager</option>
                    ${managerOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="project-start-date">Start Date</label>
                <input type="date" id="project-start-date" required>
            </div>
            <div class="form-group">
                <label for="project-end-date">End Date</label>
                <input type="date" id="project-end-date" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Project</button>
            </div>
        </form>
    `;
}

function getTaskForm() {
    // Get current team members for the dropdown
    const teamMembers = app ? app.teamMembers : [];
    const assigneeOptions = teamMembers.map(member => 
        `<option value="${member.name}">${member.name}</option>`
    ).join('');

    return `
        <form id="task-form">
            <div class="form-group">
                <label for="task-title">Task Title</label>
                <input type="text" id="task-title" required>
            </div>
            <div class="form-group">
                <label for="task-description">Description</label>
                <textarea id="task-description" required></textarea>
            </div>
            <div class="form-group">
                <label for="task-assignee">Assignee</label>
                <select id="task-assignee" required>
                    <option value="">Select Assignee</option>
                    ${assigneeOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="task-priority">Priority</label>
                <select id="task-priority" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>
            <div class="form-group">
                <label for="task-due-date">Due Date</label>
                <input type="date" id="task-due-date" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Task</button>
            </div>
        </form>
    `;
}

function getTeamMemberForm() {
    return `
        <form id="team-member-form">
            <div class="form-group">
                <label for="member-name">Full Name</label>
                <input type="text" id="member-name" required>
            </div>
            <div class="form-group">
                <label for="member-email">Email</label>
                <input type="email" id="member-email" required>
            </div>
            <div class="form-group">
                <label for="member-role">Role</label>
                <input type="text" id="member-role" required>
            </div>
            <div class="form-group">
                <label for="member-department">Department</label>
                <select id="member-department" required>
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Marketing">Marketing</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Member</button>
            </div>
        </form>
    `;
}

function getWorkflowForm() {
    return `
        <form id="workflow-form">
            <div class="form-group">
                <label for="workflow-name">Workflow Name</label>
                <input type="text" id="workflow-name" required>
            </div>
            <div class="form-group">
                <label for="workflow-description">Description</label>
                <textarea id="workflow-description" required></textarea>
            </div>
            <div class="form-group">
                <label for="workflow-steps">Steps (one per line)</label>
                <textarea id="workflow-steps" placeholder="Step 1&#10;Step 2&#10;Step 3" required></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Workflow</button>
            </div>
        </form>
    `;
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WorkflowApp();
    
    // Setup login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (app.login(email, password)) {
                closeLoginModal();
                loginForm.reset();
            }
        });
    }
});

// Close modal when clicking outside
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
        closeModal();
    }
});

// Global functions for login system
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('active');
}

function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.add('active');
    document.getElementById('login-email').focus();
}

function closeLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.remove('active');
}

function logout() {
    if (app) {
        app.logout();
    }
    toggleUserDropdown();
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('user-dropdown');
    
    if (!userMenu.contains(e.target) && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
    }
});
