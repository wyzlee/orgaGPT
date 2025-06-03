// ollama-service.js - Service direct pour l'intégration d'Ollama
// Ce fichier remplace directement la méthode sendChatMessage pour utiliser Ollama

(function() {
    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', () => {
        // Attendre que orgaGPT soit initialisé (500ms devrait suffire)
        setTimeout(() => {
            if (!window.orgaGPT) {
                console.error('❌ Impossible de trouver orgaGPT');
                return;
            }

            console.log('🚀 Initialisation du service Ollama...');
            
            // Ajouter un indicateur visuel dans l'interface
            const aiTitle = document.querySelector('.sidebar__section h3');
            if (aiTitle && aiTitle.textContent.includes('Copilote IA')) {
                aiTitle.innerHTML = '🤖 Copilote IA <span style="color: green; font-size: 0.8em; background: rgba(0,255,0,0.1); padding: 2px 6px; border-radius: 10px;">✓ OLLAMA ACTIF</span>';
            }
            
            // Ajouter un indicateur dans le chat
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                const statusMessage = document.createElement('div');
                statusMessage.className = 'ai-message system-message';
                statusMessage.innerHTML = `<strong>Système:</strong> IA Ollama (gemma3:1b) activée. Posez vos questions!`;
                chatMessages.appendChild(statusMessage);
                
                // Scroll to bottom
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 100);
            }
            
            // Remplacer complètement la méthode sendChatMessage
            window.orgaGPT.sendChatMessage = async function() {
                const input = document.getElementById('chatInput');
                const message = input.value.trim();
                
                if (!message || !input) return;

                // Ajouter le message utilisateur
                this.addUserMessage(message);
                input.value = '';
                
                // Créer l'indicateur de chargement
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'ai-message typing-indicator';
                loadingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
                chatMessages.appendChild(loadingDiv);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                try {
                    console.log('🔄 Envoi de la requête à Ollama...');
                    
                    // Construire un contexte riche pour l'IA
                    const context = {
                        tasks: this.tasks,
                        completedTasks: this.tasks.filter(t => t.completed).length,
                        totalTasks: this.tasks.length,
                        currentView: this.currentView,
                        energyLevel: document.getElementById('energyLevel')?.value || 'medium',
                        pomodoroCount: this.pomodoroCount,
                        focusTime: Math.round(this.totalFocusTime / 60)
                    };
                    
                    // Créer un prompt riche
                    const prompt = `Tu es OrgaGPT, un assistant de productivité expert basé sur les recherches des grands cabinets de conseil (McKinsey, Deloitte, BCG, KPMG).

Contexte actuel de l'utilisateur:
- ${context.totalTasks} tâches dont ${context.completedTasks} complétées
- Vue actuelle: ${context.currentView}
- Niveau d'énergie: ${context.energyLevel}
- Sessions Pomodoro: ${context.pomodoroCount}
- Temps de focus: ${context.focusTime}h

Question: ${message}

Réponds de manière concise et actionnable. Utilise des émojis pertinents et cite les sources quand tu mentionnes des statistiques.`;

                    // Appel à Ollama
                    const response = await fetch('http://localhost:11434/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: 'gemma3:1b',
                            prompt: prompt,
                            stream: false
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    // Supprimer l'indicateur de chargement
                    loadingDiv.remove();
                    
                    // Ajouter la réponse de l'IA
                    this.addAIMessage(data.response);
                    console.log('✅ Réponse IA reçue avec succès!');
                    
                } catch (error) {
                    console.error('❌ Erreur avec Ollama:', error);
                    
                    // Supprimer l'indicateur de chargement
                    loadingDiv.remove();
                    
                    // Message d'erreur
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'ai-message error-message';
                    errorDiv.innerHTML = `<strong>Erreur de connexion à Ollama:</strong> ${error.message}<br><br>Assurez-vous qu'Ollama est bien lancé avec:<br><code>ollama serve</code><br><br>Je vais utiliser une réponse locale en attendant.`;
                    chatMessages.appendChild(errorDiv);
                    
                    // Fallback vers la méthode originale après un délai
                    setTimeout(() => {
                        const fallbackResponse = this.generateAIResponse(message);
                        this.addAIMessage(fallbackResponse + '\n\n[Note: Réponse générée localement]');
                    }, 1500);
                }
            };
            
            // Styles pour les indicateurs
            const styles = `
            <style>
                .typing-indicator {
                    display: flex;
                    align-items: center;
                    column-gap: 4px;
                }
                
                .typing-indicator span {
                    animation: blink 1s infinite;
                    font-size: 20px;
                }
                
                .typing-indicator span:nth-child(2) {
                    animation-delay: 0.2s;
                }
                
                .typing-indicator span:nth-child(3) {
                    animation-delay: 0.4s;
                }
                
                @keyframes blink {
                    0% { opacity: 0.2; }
                    20% { opacity: 1; }
                    100% { opacity: 0.2; }
                }
                
                .system-message {
                    background-color: rgba(0, 128, 255, 0.1);
                    border-left: 3px solid #0080ff;
                }
                
                .error-message {
                    background-color: rgba(255, 0, 0, 0.1);
                    border-left: 3px solid #ff0000;
                }
                
                code {
                    background: rgba(0,0,0,0.1);
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-family: monospace;
                }
            </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
            
            console.log('✅ Service Ollama initialisé avec succès!');
        }, 500);
    });
})();
