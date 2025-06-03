# OrgaGPT - Votre Copilote de Productivité IA

OrgaGPT est une application web conçue pour vous aider à organiser vos tâches, optimiser votre temps et améliorer votre productivité globale en s'appuyant sur des méthodologies éprouvées et l'assistance d'une intelligence artificielle.

## Table des Matières

1.  [Introduction](#introduction)
2.  [Structure du Projet](#structure-du-projet)
3.  [Fonctionnalités Clés](#fonctionnalités-clés)
4.  [Description des Fichiers Principaux](#description-des-fichiers-principaux)
5.  [Fonctionnement Général et Workflow](#fonctionnement-général-et-workflow)
    * [Initialisation](#initialisation)
    * [Interaction Utilisateur](#interaction-utilisateur)
    * [Flux d'Interaction IA](#flux-dinteraction-ia)
    * [Fonctionnalités Dynamiques](#fonctionnalités-dynamiques)
6.  [Stratégie d'Intégration IA](#stratégie-dintégration-ia)
7.  [Installation et Configuration](#installation-et-configuration)
8.  [Contributions](#contributions)
9.  [Licence](#licence)

## Configuration des Variables d'Environnement

Pour utiliser les fonctionnalités de recherche web, vous devez configurer les variables d'environnement suivantes :

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez les variables suivantes :

```env
# Configuration du serveur
PORT=3000

# Clés API pour la recherche web
GOOGLE_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
SERPAPI_KEY=your_serpapi_key_here

# Autres configurations
NODE_ENV=development
```

### Obtenir les clés API

1. **Google Search API** :
   - Allez sur [Google Cloud Console](https://console.cloud.google.com)
   - Créez un nouveau projet
   - Activez l'API Custom Search
   - Créez une clé API
   - Créez un moteur de recherche personnalisé sur [Google Programmable Search](https://programmablesearchengine.google.com)
   - Copiez l'ID du moteur de recherche

2. **SerpApi** :
   - Inscrivez-vous sur [SerpApi](https://serpapi.com)
   - Obtenez votre clé API dans le tableau de bord

### Installation des Dépendances

```bash
npm install express cors axios dotenv
```

### Démarrer le Serveur

```bash
node server.js
```

## 1. Introduction

OrgaGPT combine des techniques de gestion de productivité reconnues (Matrice d'Eisenhower, Pomodoro, Time Blocking) avec un copilote IA interactif. L'objectif est de fournir un outil complet pour la planification, l'exécution et l'analyse des tâches quotidiennes, en s'inspirant des meilleures pratiques des grands cabinets de conseil.

## 2. Structure du Projet

Voici un aperçu des fichiers et dossiers principaux du projet :

```
orga-gpt/
├── src/
│   ├── client/
│   │   ├── js/
│   │   │   ├── app.js                    # Logique principale de l'application
│   │   │   ├── api-service.js            # Service pour la gestion des appels API
│   │   │   ├── dynamic-features.js       # Fonctionnalités dynamiques et interactives
│   │   │   ├── ollama-service.js         # Service d'intégration avec Ollama
│   │   │   └── real-ai-integration.js    # Module d'intégration IA avancée
│   │   ├── css/
│   │   │   ├── style.css                 # Styles CSS principaux
│   │   │   ├── dynamic-styles.css        # Styles pour les fonctionnalités dynamiques
│   │   │   └── ollama-styles.css         # Styles pour l'intégration Ollama
│   │   └── index.html                    # Fichier HTML principal
│   └── server/
│       └── server.js                     # Serveur Express pour la recherche web
├── .env.example                          # Exemple de configuration des variables d'environnement
├── package.json                          # Configuration du projet et dépendances
└── README.md                             # Documentation du projet
```

## 3. Fonctionnalités Clés

* **Gestion des Tâches :** Création, modification, suppression et suivi de l'état d'avancement des tâches.
* **Méthodes de Productivité :**
    * **Tableau de Bord :** Vue d'ensemble des tâches prioritaires, planning du jour et statistiques de progression.
    * **Matrice d'Eisenhower :** Classification des tâches selon leur urgence et leur importance.
    * **Technique Pomodoro :** Minuteur pour les sessions de travail focus et les pauses.
    * **Time Blocking :** Organisation visuelle du temps en blocs dédiés à des tâches spécifiques.
* **Copilote IA :**
    * **Chat Interactif :** Posez des questions, demandez des conseils, et interagissez avec l'IA pour optimiser votre productivité.
    * **Suggestions IA :** Recevez des recommandations contextuelles basées sur vos tâches et votre niveau d'énergie.
    * **Gestion de Tâches par IA :** L'IA peut créer, lister, compléter et mettre à jour des tâches via des commandes spécifiques.
* **Analytics :** Visualisation des performances, distribution des tâches, et insights basés sur les données.
* **Personnalisation :**
    * Indicateur de niveau d'énergie pour des recommandations adaptées.
    * Thème clair/sombre.
* **Fonctionnalités Dynamiques :**
    * Graphiques interactifs (productivité, distribution des tâches).
    * Drag & drop pour réorganiser les tâches.
    * Animations pour une expérience utilisateur améliorée.
    * Notifications pour les rappels et les fins de session Pomodoro.

## 4. Description des Fichiers Principaux

* **`index.html`**:
    * Structure la page web avec les différentes sections (header, sidebars, contenu principal, modales).
    * Inclut les liens vers les fichiers CSS et les scripts JavaScript.
    * Contient les éléments HTML de base pour chaque vue de l'application.

* **`style.css`**:
    * Définit l'apparence générale de l'application : couleurs, typographie, espacements, mise en page.
    * Utilise des variables CSS pour une personnalisation facile (thèmes clair/sombre).
    * Gère la responsivité de l'interface.

* **`app.js` (Classe `OrgaGPT`)**:
    * Cœur de l'application.
    * Gère l'état global : liste des tâches, vue actuelle, timer Pomodoro, etc.
    * Initialise l'application, charge les données par défaut.
    * Met en place les écouteurs d'événements pour l'interaction utilisateur.
    * Contient la logique pour :
        * Changer de vue (Dashboard, Eisenhower, etc.).
        * Afficher/cacher la modale d'ajout de tâche.
        * Ajouter, compléter, et gérer les tâches.
        * Mettre à jour l'interface utilisateur (Dashboard, Matrice Eisenhower, Timeline, etc.).
        * Gérer le minuteur Pomodoro.
        * Générer les blocs de temps pour le Time Blocking.
        * Gérer l'envoi de messages au chat IA (cette méthode est souvent surchargée par les modules d'intégration IA plus spécifiques).
        * Afficher les suggestions IA.

* **`api-service.js` (Classe `OrgaGPTAPI` et `EnhancedOrgaGPT`)**:
    * **`OrgaGPTAPI`**:
        * Conçu initialement pour interagir avec l'API OpenAI.
        * Contient une base de connaissances intégrée sur les cabinets de conseil (Deloitte, McKinsey, etc.) pour enrichir les prompts et fournir des réponses de secours.
        * Méthodes pour rechercher dans la base de connaissances, construire un contexte enrichi pour l'IA, et appeler l'API OpenAI.
        * Fonctions d'analyse de listes de tâches et de génération de rapports de productivité.
    * **`EnhancedOrgaGPT`**:
        * Surcharge `app.js` pour améliorer l'interaction avec l'IA.
        * Remplace `sendChatMessage` pour utiliser `OrgaGPTAPI`.
        * Ajoute des fonctionnalités comme l'explorateur de sources, le panneau d'insights en temps réel, et la reconnaissance vocale.

* **`dynamic-features.js` (Classe `DynamicOrgaGPT`)**:
    * Ajoute des améliorations visuelles et interactives à l'application.
    * Charge et utilise Chart.js pour créer des graphiques (productivité, distribution des tâches).
    * Implémente le drag & drop pour les tâches dans la matrice d'Eisenhower.
    * Anime les statistiques et les barres de progression.
    * Gère les mises à jour en temps réel (horloge, graphiques).
    * Ajoute la gestion des gestes (swipe pour la navigation) et des raccourcis clavier.
    * Implémente les notifications navigateur (ex: fin de Pomodoro).
    * Ajoute un bouton pour basculer entre les thèmes clair et sombre.

* **`dynamic-styles.css`**:
    * Contient les styles CSS spécifiques aux animations et aux éléments visuels introduits par `dynamic-features.js`.
    * Exemples : animations de chargement, effets de survol, transitions, styles pour les graphiques, indicateur de frappe.

* **`ollama-service.js`**:
    * Module d'intégration directe pour utiliser un LLM local via Ollama (par exemple, `gemma3:1b` ou `mistral`).
    * Surcharge la méthode `sendChatMessage` de `app.js` pour envoyer les requêtes directement à l'API locale d'Ollama.
    * Construit un prompt enrichi avec le contexte de l'utilisateur.
    * Gère les erreurs de connexion à Ollama et propose un fallback.

* **`ollama-styles.css`**:
    * Styles pour l'indicateur de frappe, les messages système/erreur liés à Ollama, et le rendu Markdown de base dans le chat.

* **`real-ai-integration.js` (Classe `RealAIOrgaGPT`)**:
    * Module d'intégration IA le plus avancé, conçu pour être flexible et utiliser plusieurs fournisseurs d'IA.
    * Tente de désactiver les autres intégrations IA (`EnhancedOrgaGPT`, `ollama-service.js`) pour éviter les conflits.
    * **Détection et Configuration :**
        * Permet de configurer des clés API pour OpenAI, Hugging Face, Cohere, Gemini.
        * Vérifie la disponibilité d'Ollama localement.
        * Ajoute une interface utilisateur pour configurer et tester les options IA.
    * **Surcharge de `sendChatMessage`**:
        * Construit un prompt détaillé incluant le contexte utilisateur et des instructions spécifiques pour l'IA, y compris comment exécuter des actions.
        * Tente d'appeler les fournisseurs d'IA configurés dans un ordre de priorité.
    * **Gestion d'Actions IA :**
        * Définit un format `[ACTION:{"intent": "...", "parameters": {...}}]` que l'IA peut utiliser dans ses réponses pour déclencher des actions dans l'application (créer une tâche, lister des tâches, etc.).
        * Extrait et exécute ces actions.
    * **Rendu Markdown Amélioré :** Ajoute des styles pour un meilleur affichage du Markdown dans le chat.
    * **Fallback Intelligent :** Si aucun service IA n'est disponible, il utilise une logique locale pour analyser l'intention de l'utilisateur et générer une réponse contextuelle.

## 5. Fonctionnement Général et Workflow

### Initialisation

1.  **Chargement HTML (`index.html`)**: Le navigateur charge la structure de la page.
2.  **Chargement CSS**: `style.css`, `dynamic-styles.css`, et `ollama-styles.css` sont appliqués.
3.  **Chargement JavaScript**:
    * Les bibliothèques externes (Marked.js, DOMPurify, Chart.js) sont chargées.
    * `app.js` est exécuté : L'instance `OrgaGPT` est créée. L'événement `DOMContentLoaded` déclenche `orgaGPT.init()`.
        * Chargement des tâches par défaut et des suggestions IA.
        * Mise en place des écouteurs d'événements principaux.
        * Mise à jour de l'horloge et du tableau de bord initial.
    * Les modules d'extension/intégration sont ensuite initialisés :
        * `api-service.js` (`EnhancedOrgaGPT`) peut s'initialiser et surcharger des méthodes de `orgaGPT`.
        * `dynamic-features.js` (`DynamicOrgaGPT`) s'initialise et ajoute ses fonctionnalités.
        * `ollama-service.js` peut s'initialiser et surcharger `orgaGPT.sendChatMessage`.
        * `real-ai-integration.js` (`RealAIOrgaGPT`) s'initialise en dernier et est conçu pour prendre le contrôle des interactions IA, désactivant potentiellement les surcharges précédentes. Il modifie `orgaGPT.sendChatMessage` pour utiliser sa propre logique multi-fournisseurs.

### Interaction Utilisateur

* **Navigation :** L'utilisateur clique sur les boutons du menu latéral (`.method-btn`) pour changer de vue. `app.js` gère le changement de classe `.active` sur les vues et charge le contenu spécifique à chaque vue (ex: `updateEisenhowerMatrix()`).
* **Ajout de Tâche :**
    1.  Clic sur "Nouvelle Tâche" (`#addTaskBtn`).
    2.  `app.js` affiche la modale (`#taskModal`).
    3.  L'utilisateur remplit le formulaire et soumet.
    4.  `app.js` (`addTask()`) récupère les données, crée un nouvel objet tâche, l'ajoute au tableau `this.tasks`, met à jour l'interface (dashboard, matrice), et ferme la modale.
    5.  Si `dynamicOrgaGPT` est actif, `refreshDynamicElements()` est appelé pour mettre à jour les éléments dynamiques.
* **Démarrer Pomodoro :** L'utilisateur clique sur "Démarrer" dans la vue Pomodoro. `app.js` (`startPomodoro()`) lance le minuteur et met à jour l'affichage.
* **Chat avec l'IA :**
    1.  L'utilisateur tape un message dans `#chatInput` et clique sur "Envoyer" ou appuie sur Entrée.
    2.  La méthode `sendChatMessage` (celle qui est active, probablement de `real-ai-integration.js`) est appelée.

### Flux d'Interaction IA (principalement via `real-ai-integration.js`)

1.  **Message Utilisateur :** L'utilisateur envoie un message via l'interface de chat.
2.  **Capture et Affichage :** Le message est ajouté à l'interface utilisateur. Un indicateur de chargement ("typing indicator") s'affiche.
3.  **Construction du Contexte et du Prompt :**
    * `real-ai-integration.js` (`buildContext()`) collecte des informations pertinentes sur l'état actuel de l'application (tâches, énergie, vue actuelle, etc.).
    * `buildPrompt()` assemble ces informations avec le message de l'utilisateur et des instructions spécifiques pour l'IA, y compris le format pour les `ACTION`s.
4.  **Appel à l'IA :**
    * `getAIResponse()` tente d'appeler les fournisseurs d'IA configurés (Ollama, Hugging Face, Cohere, Gemini, OpenAI) dans un ordre de priorité.
    * La requête est envoyée au premier fournisseur disponible et configuré.
5.  **Réception et Traitement de la Réponse :**
    * La réponse brute de l'IA est reçue.
    * `extractActionsAndCleanResponse()` :
        * Recherche les commandes `[ACTION:{...}]` dans la réponse.
        * Parse le JSON de chaque action et les stocke.
        * Nettoie la réponse textuelle en supprimant les commandes d'action.
    * La réponse textuelle nettoyée est rendue en Markdown (via `marked.js` et `DOMPurify.sanitize`) et affichée dans le chat.
6.  **Exécution des Actions (si présentes) :**
    * `executeAIActions()` parcourt les actions extraites.
    * Pour chaque action, la méthode correspondante est appelée (ex: `executeCreateTask()`, `executeListTasks()`).
    * Ces méthodes interagissent avec `app.js` pour modifier l'état de l'application (ajouter une tâche, etc.) et mettre à jour l'interface. L'IA informe l'utilisateur de l'action effectuée.
7.  **Fallback :** Si aucun fournisseur d'IA n'est joignable, `getSmartFallback()` est utilisé pour générer une réponse locale basée sur une analyse d'intention simple et le contexte.

### Fonctionnalités Dynamiques (`dynamic-features.js`)

* **Graphiques :** Utilise Chart.js pour afficher des visualisations de données (productivité, distribution des tâches) qui se mettent à jour périodiquement ou lors de changements de données.
* **Drag & Drop :** Permet de réorganiser les tâches, par exemple entre les quadrants de la matrice d'Eisenhower.
* **Animations et Micro-interactions :** Améliorent l'expérience utilisateur avec des transitions fluides, des indicateurs de progression animés, etc. (définis dans `dynamic-styles.css`).
* **Notifications :** Utilise l'API de Notification du navigateur pour les alertes (ex: fin de session Pomodoro).
* **Thèmes :** Gère la bascule entre les thèmes clair et sombre en modifiant l'attribut `data-color-scheme` sur l'élément `<html>` et en sauvegardant la préférence dans `localStorage`.

## 6. Stratégie d'Intégration IA

Le projet a évolué avec plusieurs approches pour l'intégration de l'IA, ce qui peut entraîner des surcharges de fonctionnalités si tous les scripts sont actifs simultanément. Voici l'ordre de "priorité" ou de surcharge typique :

1.  **`app.js` (Méthode `generateAIResponse`)**:
    * Fournit une logique de réponse IA très basique, basée sur des mots-clés, utilisée en dernier recours si aucune autre intégration n'est active.

2.  **`api-service.js` (Classe `EnhancedOrgaGPT`)**:
    * **Surcharge `app.js.sendChatMessage`**.
    * Utilise `OrgaGPTAPI` pour interagir avec OpenAI (si configuré) et une base de connaissances interne.
    * Introduit des fonctionnalités IA plus avancées comme l'analyse de tâches et les rapports.

3.  **`ollama-service.js`**:
    * **Surcharge `app.js.sendChatMessage`** (ou potentiellement celle de `EnhancedOrgaGPT` si chargé après).
    * Conçu pour une intégration directe et simple avec un LLM local via Ollama.
    * Moins de fonctionnalités que `EnhancedOrgaGPT` mais focus sur l'IA locale.

4.  **`real-ai-integration.js` (Classe `RealAIOrgaGPT`)**:
    * **Conçu pour être le gestionnaire IA principal et surcharger toute méthode `sendChatMessage` précédente.**
    * Tente de désactiver les conflits avec `EnhancedOrgaGPT` et `ollama-service.js`.
    * Offre une flexibilité maximale en permettant de choisir/configurer plusieurs fournisseurs d'IA (Ollama, services cloud).
    * Implémente le système d'**ACTIONS IA**, permettant à l'IA de contrôler directement certaines fonctionnalités de l'application.
    * Utilise un système de prompt plus sophistiqué et un fallback intelligent local.

**Comportement attendu :** Si `real-ai-integration.js` est correctement chargé et initialisé, il devrait prendre en charge toutes les interactions de chat IA. Les autres services IA (comme `api-service.js` pour ses fonctions d'analyse de rapport ou sa base de connaissances) pourraient encore être utilisés pour des fonctionnalités spécifiques non liées au chat direct, si `RealAIOrgaGPT` est conçu pour les appeler.

## 7. Installation et Configuration

1.  **Cloner le dépôt (si applicable) ou télécharger les fichiers.**
2.  **Ouvrir `index.html` dans un navigateur web moderne.**

### Configuration de l'IA

* **Ollama (Recommandé pour une utilisation locale et gratuite) :**
    1.  Téléchargez et installez Ollama depuis [ollama.ai](https://ollama.ai).
    2.  Exécutez `ollama serve` dans votre terminal pour démarrer le serveur Ollama.
    3.  Téléchargez un modèle, par exemple Mistral : `ollama pull mistral` (ou `gemma3:1b`).
    4.  L'application (via `real-ai-integration.js` ou `ollama-service.js`) tentera de se connecter à `http://localhost:11434`.

* **Services IA Cloud (OpenAI, Hugging Face, Cohere, Gemini) :**
    * Ces services nécessitent des clés API.
    * Dans `real-ai-integration.js`, vous pouvez configurer ces clés via l'interface utilisateur ("⚙️ Configuration IA") qui les sauvegardera dans `localStorage`.
    * Alternativement, vous pouvez les définir directement dans l'objet `this.config` des fichiers `api-service.js` ou `real-ai-integration.js` (non recommandé pour la production).

        ```javascript
        // Exemple dans real-ai-integration.js
        this.config = {
            openai: { apiKey: 'VOTRE_CLE_OPENAI', /* ... */ },
            huggingface: { apiKey: 'VOTRE_CLE_HUGGINGFACE', /* ... */ },
            // ... autres configurations
        };
        ```

## 8. Contributions

Les contributions sont les bienvenues ! Veuillez suivre les étapes suivantes :
1.  Forker le projet.
2.  Créer une nouvelle branche (`git checkout -b feature/amelioration-X`).
3.  Effectuer vos modifications.
4.  Commit vos changements (`git commit -m 'Ajout de fonctionnalité X'`).
5.  Push vers la branche (`git push origin feature/amelioration-X`).
6.  Ouvrir une Pull Request.

## 9. Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` (s'il existe) pour plus de détails.
