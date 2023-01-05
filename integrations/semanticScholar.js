const axios = require('axios');

const baseURLSemantic = 'https://api.semanticscholar.org';

async function searchPaperById(paperId, fields = "paperId,externalIds,url,title,abstract,venue,year,referenceCount,citationCount,influentialCitationCount,isOpenAccess,openAccessPdf,fieldsOfStudy,publicationTypes,publicationDate,journal,citationStyles,authors,tldr,references") {
    const getReq = baseURLSemantic + '/graph/v1/paper/' + paperId;
    var result = { "status": 200, "data": null, "fields": fields }
    await axios({
        method: 'get',
        url: getReq,
        headers: { 'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY },
        params: { 'fields': fields }
    })
        .then((response) => result.data = response.data)
        .catch((err) => {
            console.log(err);
            result.status = err.response.status;
            result.data = err.message;
    });
    return result;
};
exports.searchPaperById = searchPaperById

async function searchPaperIdByKeywoard(query, fields ="title,paperId") {
    const getReq = baseURLSemantic + '/graph/v1/paper/search/';
    var result = { "status": 200, "data": null }
    await axios({
        method: 'get',
        params: { "query": query, "fields": fields },
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