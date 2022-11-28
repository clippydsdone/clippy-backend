const axios = require('axios');

const baseURLSemantic = 'https://api.semanticscholar.org';
const fields = 'title,references,tldr';

async function searchPaperById(paperId) {
    const getReq = baseURLSemantic + '/graph/v1/paper/' + paperId;
    var result = { "status": 200, "data": null }
    await axios({
        method: 'get',
        url: getReq,
        headers: { 'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY },
        params: { 'fields': fields }
    })
        .then((response) => result.data = response.data)
        .catch((err) => {
            result.status = err.response.status;
            result.data = err.message;
        });
    return result;
};
exports.searchPaperById = searchPaperById
    
async function searchPaperIdByKeywoard(query) {
    const getReq = baseURLSemantic + '/graph/v1/paper/search/';
    var result = { "status": 200, "data": null }
    await axios({
        method: 'get',
        params: { "query": query },
        headers: { 'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY },
        url: getReq
    })
        .then((response) => {
            result.data = response.data.data
        })
        .catch((err) => {
            result.status = err.response.status;
            result.data = err.message;
        });
    return result;
};
exports.searchPaperIdByKeywoard = searchPaperIdByKeywoard