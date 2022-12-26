const SemanticScholarApi = require('../integrations/semanticScholar.js');

jest.setTimeout(30 * 1000);

describe('Semantic Scholar API testing', () => {
    test('Semantic Scholar By ID: Paper is null', async () => {
        const result = await SemanticScholarApi.searchPaperById(null);
        expect(result.status).toBe(404);
        expect.stringContaining("Request failed");
    });

    test('Semantic Scholar By ID: Selected paper', async () => {
        const result = await SemanticScholarApi.searchPaperById("204e3073870fae3d05bcbc2f6a8e263d9b72e776");
        expect(result.status).toBe(200);
        expect(result.data.title).toBe("Attention is All you Need");
    });

    test('Semantic Scholar By ID: Selected paper field missing', async () => {
        const result = await SemanticScholarApi.searchPaperById("204e3073870fae3d05bcbc2f6a8e263d9b72e776", "paperId");
        expect(result.status).toBe(200);
        expect(result.data.title).not.toBe("Attention is All you Need");
    });

    test('Semantic Scholar By ID: Selected paper additional field', async () => {
        const result = await SemanticScholarApi.searchPaperById("204e3073870fae3d05bcbc2f6a8e263d9b72e776", "paperId,title,year");
        expect(result.status).toBe(200);
        expect(result.data.title).toBe("Attention is All you Need");
        expect(result.data.year).toBe(2017);
    });

    test('Semantic Scholar Serach: Serach paper title null', async () => {
        const result = await SemanticScholarApi.searchPaperIdByKeywoard(null);
        expect(result.status).toBe(400);
        expect.stringContaining("Request failed");
    });

    test('Semantic Scholar Serach: Serach paper by keywoard', async () => {
        const result = await SemanticScholarApi.searchPaperIdByKeywoard("Attention is All you Need");
        expect(result.status).toBe(200);
        expect(result.data[0].title).toBe("Attention is All you Need");
    });
});