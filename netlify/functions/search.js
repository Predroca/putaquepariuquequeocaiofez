// resumo_js/netlify/functions/search.js
const axios = require('axios'); 
// Sua URL da SheetDB:
const SHEETDB_API_URL = "https://sheetdb.io/api/v1/zjcub9as3o06n";

exports.handler = async (event) => {
    const query = event.queryStringParameters.q || '';

    if (!query.trim()) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Por favor, forneça um termo de busca." }),
        };
    }

    try {
        const response = await axios.get(SHEETDB_API_URL, {
            params: {
                search: query 
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ results: response.data }),
        };

    } catch (error) {
        console.error("Erro na SheetDB API:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro ao comunicar com a API de dados.", details: error.message }),
        };
    }
};
