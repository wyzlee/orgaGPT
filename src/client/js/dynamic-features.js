// dynamic-features.js - Fonctionnalités interactives et dynamiques

class DynamicOrgaGPT {
    constructor(app) {
        this.app = app;
        this.charts = {};
        this.initDynamicFeatures();
    }

    initDynamicFeatures() {
        // Charger Chart.js si disponible
        this.loadChartJS();
        
        // Initialiser les fonctionnalités
        this.initDragAndDrop();
        this.initProgressAnimations();
        this.initDataVisualization();
        this.initRealTimeUpdates();
        this.initGestures();
        this.initKeyboardShortcuts();
        this.initNotifications();
        this.initThemeToggle();
    }

    loadChartJS() {
        // Vérifier si Chart.js est disponible
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => this.initCharts();
            document.head.appendChild(script);
        } else {
            this.initCharts();
        }
    }

    initCharts() {
        // Graphique de productivité
        this.createProductivityChart();
        // Graphique de distribution des tâches
        this.createTaskDistributionChart();
        // Graphique d'évolution temporelle
        this.createTimelineChart();
    }

    createProductivityChart() {
        const canvas = document.createElement('canvas');
        canvas.id = 'productivityChart';
        canvas.style.maxHeight = '300px';
        
        // Ajouter le canvas au dashboard
        const container = document.querySelector('.progress-section .card__body');
        if (container) {
            container.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            this.charts.productivity = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.generateTimeLabels(),
                    datasets: [{
                        label: 'Productivité',
                        data: this.generateProductivityData(),
                        borderColor: 'rgb(33, 128, 141)',
                        backgroundColor: 'rgba(33, 128, 141, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => `${context.parsed.y}% de productivité`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: (value) => value + '%'
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }
    }

    createTaskDistributionChart() {
        const canvas = document.createElement('canvas');
        canvas.id = 'taskDistributionChart';
        canvas.style.maxWidth = '200px';
        canvas.style.margin = '0 auto';
        
        // Créer un conteneur pour le graphique
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        chartContainer.innerHTML = '<h4>Distribution des Tâches</h4>';
        chartContainer.appendChild(canvas);
        
        const analyticsView = document.getElementById('analyticsView');
        if (analyticsView) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = '<div class="card__body"></div>';
            card.querySelector('.card__body').appendChild(chartContainer);
            analyticsView.querySelector('.analytics-grid').appendChild(card);
            
            const ctx = canvas.getContext('2d');
            this.charts.distribution = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Urgent & Important', 'Important', 'Urgent', 'Autres'],
                    datasets: [{
                        data: this.calculateQuadrantDistribution(),
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(107, 114, 128, 0.8)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1500
                    }
                }
            });
        }
    }

    createTimelineChart() {
        const canvas = document.createElement('canvas');
        canvas.id = 'timelineChart';
        canvas.style.maxHeight = '200px';
        
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container mt-16';
        chartContainer.innerHTML = '<h4>Évolution de la Semaine</h4>';
        chartContainer.appendChild(canvas);
        
        const container = document.querySelector('.analytics-grid');
        if (container) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = '<div class="card__body"></div>';
            card.querySelector('.card__body').appendChild(chartContainer);
            container.appendChild(card);
            
            const ctx = canvas.getContext('2d');
            this.charts.timeline = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
                    datasets: [{
                        label: 'Tâches complétées',
                        data: [8, 12, 15, 10, 14],
                        backgroundColor: 'rgba(33, 128, 141, 0.6)',
                        borderColor: 'rgb(33, 128, 141)',
                        borderWidth: 1
                    }, {
                        label: 'Heures de focus',
                        data: [3.5, 4.2, 5.1, 3.8, 4.5],
                        backgroundColor: 'rgba(94, 82, 64, 0.3)',
                        borderColor: 'rgba(94, 82, 64, 0.8)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    animation: {
                        duration: 1000,
                        delay: (context) => context.dataIndex * 100
                    }
                }
            });
        }
    }

    generateTimeLabels() {
        const labels = [];
        for (let i = 8; i <= 18; i++) {
            labels.push(`${i}:00`);
        }
        return labels;
    }

    generateProductivityData() {
        // Simuler des données de productivité
        return [
            65, 72, 78, 85, 82, 75, 88, 92, 87, 83, 79
        ];
    }

    calculateQuadrantDistribution() {
        const distribution = [0, 0, 0, 0];
        this.app.tasks.forEach(task => {
            if (task.quadrant >= 1 && task.quadrant <= 4) {
                distribution[task.quadrant - 1]++;
            }
        });
        return distribution;
    }

    initDragAndDrop() {
        // Activer le drag and drop pour les tâches
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-item')) {
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.innerHTML);
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-item')) {
                e.target.classList.remove('dragging');
            }
        });

        // Gérer le drop dans les quadrants
        document.querySelectorAll('.quadrant-content').forEach(quadrant => {
            quadrant.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                quadrant.classList.add('drag-over');
            });

            quadrant.addEventListener('dragleave', () => {
                quadrant.classList.remove('drag-over');
            });

            quadrant.addEventListener('drop', (e) => {
                e.preventDefault();
                quadrant.classList.remove('drag-over');
                
                // Logique pour déplacer la tâche
                const taskElement = document.querySelector('.dragging');
                if (taskElement) {
                    quadrant.appendChild(taskElement);
                    this.animateTaskMove(taskElement);
                }
            });
        });

        // Rendre les tâches draggables
        this.makeTasksDraggable();
    }

    makeTasksDraggable() {
        document.querySelectorAll('.task-item').forEach(task => {
            task.draggable = true;
            task.style.cursor = 'grab';
        });
    }

    animateTaskMove(element) {
        element.style.animation = 'bounceIn 0.5s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    initProgressAnimations() {
        // Observer pour animer les statistiques quand elles deviennent visibles
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStats(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Observer tous les éléments de statistiques
        document.querySelectorAll('.stat-value').forEach(stat => {
            observer.observe(stat);
            stat.setAttribute('data-animation', 'count-up');
        });
    }

    animateStats(element) {
        const finalValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const start = 0;
        const increment = finalValue / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(timer);
            }
            
            if (element.textContent.includes('%')) {
                element.textContent = Math.round(current) + '%';
            } else if (element.textContent.includes('h')) {
                element.textContent = Math.round(current) + 'h';
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    initDataVisualization() {
        // Créer des barres de progression animées
        this.createProgressBars();
        
        // Animer les timeline items
        this.animateTimeline();
    }

    createProgressBars() {
        const tasksCompleted = this.app.tasks.filter(t => t.completed).length;
        const totalTasks = this.app.tasks.length;
        const completionRate = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

        // Créer une barre de progression globale
        const progressContainer = document.createElement('div');
        progressContainer.className = 'global-progress';
        progressContainer.innerHTML = `
            <h4>Progression Globale</h4>
            <div class="progress-bar">
                <div class="progress-fill" style="--progress-width: ${completionRate}%"></div>
            </div>
            <div class="progress-labels">
                <span>${tasksCompleted} / ${totalTasks} tâches</span>
                <span>${Math.round(completionRate)}%</span>
            </div>
        `;

        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.insertBefore(progressContainer, dashboardView.querySelector('.dashboard-grid'));
        }
    }

    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    initRealTimeUpdates() {
        // Mettre à jour l'horloge chaque seconde
        setInterval(() => {
            this.updateDigitalClock();
        }, 1000);

        // Mettre à jour les graphiques toutes les 30 secondes
        setInterval(() => {
            this.updateCharts();
        }, 30000);

        // Animations périodiques
        setInterval(() => {
            this.pulseImportantElements();
        }, 5000);
    }

    updateDigitalClock() {
        const now = new Date();
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            
            // Créer un affichage plus dynamique
            timeElement.innerHTML = `
                <span class="time-hour">${hours}</span>
                <span class="time-separator">:</span>
                <span class="time-minute">${minutes}</span>
                <span class="time-second">${seconds}</span>
            `;
        }
    }

    updateCharts() {
        // Mettre à jour les données des graphiques
        if (this.charts.productivity) {
            const newData = this.generateProductivityData();
            this.charts.productivity.data.datasets[0].data = newData;
            this.charts.productivity.update('active');
        }

        if (this.charts.distribution) {
            const newDistribution = this.calculateQuadrantDistribution();
            this.charts.distribution.data.datasets[0].data = newDistribution;
            this.charts.distribution.update('active');
        }
    }

    pulseImportantElements() {
        // Faire pulser les éléments importants
        const urgentTasks = document.querySelectorAll('.priority-high');
        urgentTasks.forEach(task => {
            task.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                task.style.animation = '';
            }, 1000);
        });
    }

    initGestures() {
        // Swipe pour naviguer entre les vues
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Double tap pour marquer une tâche comme terminée
        let lastTap = 0;
        document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                if (e.target.closest('.task-item')) {
                    const taskItem = e.target.closest('.task-item');
                    const completeBtn = taskItem.querySelector('.task-complete');
                    if (completeBtn) completeBtn.click();
                }
            }
            lastTap = currentTime;
        });
    }

    handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            const methods = ['dashboard', 'eisenhower', 'pomodoro', 'timeblocking', 'analytics'];
            const currentIndex = methods.indexOf(this.app.currentView);
            
            if (swipeDistance > 0 && currentIndex > 0) {
                // Swipe vers la droite - vue précédente
                this.app.switchView(methods[currentIndex - 1]);
            } else if (swipeDistance < 0 && currentIndex < methods.length - 1) {
                // Swipe vers la gauche - vue suivante
                this.app.switchView(methods[currentIndex + 1]);
            }
        }
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N : Nouvelle tâche
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.getElementById('addTaskBtn').click();
            }
            
            // Ctrl/Cmd + P : Démarrer Pomodoro
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                this.app.startFocusSession();
            }
            
            // Ctrl/Cmd + 1-5 : Changer de vue
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const methods = ['dashboard', 'eisenhower', 'pomodoro', 'timeblocking', 'analytics'];
                this.app.switchView(methods[parseInt(e.key) - 1]);
            }
            
            // Esc : Fermer les modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }

    initNotifications() {
        // Demander la permission pour les notifications
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Notifications pour les pauses Pomodoro
        this.setupPomodoroNotifications();
        
        // Rappels de tâches
        this.setupTaskReminders();
    }

    setupPomodoroNotifications() {
        // Observer les changements du timer Pomodoro
        const timerObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.target.id === 'pomodoroTime') {
                    const time = mutation.target.textContent;
                    if (time === '00:00') {
                        this.showNotification(
                            '🍅 Pomodoro Terminé!',
                            'Bravo! Prenez une pause de 5 minutes.'
                        );
                    }
                }
            });
        });

        const timerElement = document.getElementById('pomodoroTime');
        if (timerElement) {
            timerObserver.observe(timerElement, { childList: true });
        }
    }

    setupTaskReminders() {
        // Rappeler les tâches importantes toutes les heures
        setInterval(() => {
            const urgentTasks = this.app.tasks.filter(t => 
                !t.completed && t.priority === 'high'
            );
            
            if (urgentTasks.length > 0) {
                this.showNotification(
                    '⚠️ Tâches Urgentes',
                    `Vous avez ${urgentTasks.length} tâche(s) importante(s) à traiter.`
                );
            }
        }, 3600000); // 1 heure
    }

    showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                vibrate: [200, 100, 200]
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            setTimeout(() => notification.close(), 5000);
        }
    }

    initThemeToggle() {
        // Ajouter un bouton pour basculer le thème
        const header = document.querySelector('.header__info');
        if (header) {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '🌙';
            themeToggle.title = 'Basculer le thème';
            themeToggle.addEventListener('click', () => this.toggleTheme());
            header.appendChild(themeToggle);
        }

        // Détecter le thème préféré
        this.applyPreferredTheme();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('preferred-theme', newTheme);
        
        // Animer le changement
        document.body.style.transition = 'all 0.3s ease';
        
        // Mettre à jour l'icône
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    applyPreferredTheme() {
        const preferredTheme = localStorage.getItem('preferred-theme');
        if (preferredTheme) {
            document.documentElement.setAttribute('data-color-scheme', preferredTheme);
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.innerHTML = preferredTheme === 'dark' ? '☀️' : '🌙';
            }
        }
    }

    // Méthode pour mettre à jour dynamiquement après l'ajout de tâches
    refreshDynamicElements() {
        this.makeTasksDraggable();
        this.updateCharts();
        this.createProgressBars();
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'application principale et l'API soient chargées
    setTimeout(() => {
        if (window.orgaGPT) {
            window.dynamicOrgaGPT = new DynamicOrgaGPT(window.orgaGPT);
            
            // Surcharger la méthode addTask pour rafraîchir les éléments dynamiques
            const originalAddTask = window.orgaGPT.addTask;
            window.orgaGPT.addTask = function() {
                originalAddTask.call(this);
                if (window.dynamicOrgaGPT) {
                    window.dynamicOrgaGPT.refreshDynamicElements();
                }
            };
        }
    }, 200);
});

// Styles additionnels pour les nouvelles fonctionnalités
const dynamicStyles = `
<style>
/* Digital Clock */
.time-hour, .time-minute {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
}

.time-second {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-left: 4px;
}

.time-separator {
    animation: blink 1s infinite;
    margin: 0 2px;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

/* Theme Toggle */
.theme-toggle {
    background: var(--color-secondary);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    transform: rotate(360deg);
    background: var(--color-primary);
}

/* Global Progress */
.global-progress {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-20);
    margin-bottom: var(--space-24);
    border: 1px solid var(--color-card-border);
    animation: slideInUp 0.5s ease-out;
}

.progress-labels {
    display: flex;
    justify-content: space-between;
    margin-top: var(--space-8);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

/* Chart Containers */
.chart-container {
    padding: var(--space-16);
}

.chart-container h4 {
    margin-bottom: var(--space-16);
    text-align: center;
    color: var(--color-text);
}

/* Drag Over Effect */
.drag-over {
    background: var(--color-secondary);
    border: 2px dashed var(--color-primary);
}

/* Notification Style */
.notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--color-error);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    animation: bounceIn 0.5s ease-out;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);