const SemanticScholarApi = require('../integrations/semanticScholar.js');

jest.setTimeout(30 * 1000);

describe('Semantic Scholar API testing', () => {
    test('Semantic Scholar Serach: Paper is null', async () => {
        const result = await SemanticScholarApi.searchPaperById(null);
        expect(result.status).toBe(404);
        expect.stringContaining("Request failed");
    });

    test('Semantic Scholar Serach: Selected paper', async () => {
        const result = await SemanticScholarApi.searchPaperById("204e3073870fae3d05bcbc2f6a8e263d9b72e776");
        console.log(result);
        expect(result.status).toBe(200);
        expect(result.data.title).toBe("Attention is All you Need");
    });
});