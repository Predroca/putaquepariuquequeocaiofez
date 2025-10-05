// netlify/functions/summarize.js
const { GoogleGenAI } = require("@google/genai");

// A chave será lida da variável de ambiente GEMINI_API_KEY
const ai = new GoogleGenAI({}); // Inicialização corrigida para ler a variável global
const MODEL_NAME = "gemini-2.5-flash"; 

exports.handler = async (event) => {
    let url;
    
    try {
        // Tenta ler o corpo da requisição (que deve ser uma string JSON)
        const body = JSON.parse(event.body); 
        // Acessa a propriedade 'url' do objeto lido
        url = body.url; 
    } catch (e) {
        // Se a requisição não for JSON válido (erro de parse), a URL será 'undefined'
        console.error("Erro ao fazer parse do corpo da requisição:", e);
    }

    if (!url) {
        // Se a URL ainda for undefined ou nula, retorna a mensagem de erro
        return {
            statusCode: 400,
            body: JSON.stringify({ 
                summary: "Lamento, mas a URL fornecida está 'undefined', o que me impede de acessar qualquer conteúdo para gerar o resumo. Verifique o console do navegador para detalhes."
            }),
        };
    }

    try {
        const prompt = `Faça um resumo de 25 linhas em Português, sobre os pontos principais e mais importantes da seguinte URL, relacionando ao assunto geral. Mantenha o tom profissional e informativo: ${url}`;
        
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ summary: response.text }),
        };

    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ summary: `Erro ao gerar resumo pela IA. Detalhe: ${error.message}` }),
        };
    }
};
