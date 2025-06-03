const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis le répertoire racine
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis le répertoire client
app.use(express.static(path.join(__dirname, '../client')));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Configuration des API de recherche
const searchConfig = {
    google: {
        apiKey: process.env.GOOGLE_SEARCH_API_KEY,
        searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
        endpoint: 'https://www.googleapis.com/customsearch/v1'
    },
    serpapi: {
        apiKey: process.env.SERPAPI_KEY,
        endpoint: 'https://serpapi.com/search'
    }
};

// Route pour la recherche web
app.post('/api/search', async (req, res) => {
    try {
        const { query, provider = 'google' } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        let results;
        switch (provider) {
            case 'google':
                results = await performGoogleSearch(query);
                break;
            case 'serpapi':
                results = await performSerpApiSearch(query);
                break;
            default:
                return res.status(400).json({ error: 'Invalid search provider' });
        }

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed', details: error.message });
    }
});

// Fonction pour effectuer une recherche Google
async function performGoogleSearch(query) {
    const { apiKey, searchEngineId, endpoint } = searchConfig.google;
    
    if (!apiKey || !searchEngineId) {
        throw new Error('Google Search API configuration is missing');
    }

    const response = await axios.get(endpoint, {
        params: {
            key: apiKey,
            cx: searchEngineId,
            q: query
        }
    });

    return formatGoogleResults(response.data);
}

// Fonction pour effectuer une recherche via SerpApi
async function performSerpApiSearch(query) {
    const { apiKey, endpoint } = searchConfig.serpapi;
    
    if (!apiKey) {
        throw new Error('SerpApi configuration is missing');
    }

    const response = await axios.get(endpoint, {
        params: {
            api_key: apiKey,
            q: query,
            engine: 'google'
        }
    });

    return formatSerpApiResults(response.data);
}

// Formater les résultats Google
function formatGoogleResults(data) {
    return {
        provider: 'google',
        results: data.items?.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet
        })) || []
    };
}

// Formater les résultats SerpApi
function formatSerpApiResults(data) {
    return {
        provider: 'serpapi',
        results: data.organic_results?.map(result => ({
            title: result.title,
            link: result.link,
            snippet: result.snippet
        })) || []
    };
}

// Démarrer le serveur
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
}); 