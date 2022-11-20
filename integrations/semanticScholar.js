
const baseURLSemantic = 'https://api.semanticscholar.org';
let paperID = '649def34f8be52c8b66281af98ae884c09aef38b'; //example paper ID
const title = 'A Bacterial Foraging Based Smart Offloading for IoT Sensors in Edge Computing'; //example title according to the
const fields = 'title,references,citations,tldr'; //fields to return to use on graph

const axios = require('axios');

async function searchPaperById(paperId) {
    const getReq = baseURLSemantic + '/graph/v1/paper/' + paperId;
    var result = {"status" : 200, "data": null}
    await axios({
        method: 'get',
        url: getReq,
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
    var result = {"status" : 200, "data": null}
    await axios({
        method: 'get',
        params: {"query": query},
        url: getReq
    })
    .then((response) => result.data = response.data.data)
    .catch((err) => {
        console.log(err.message);
        result.status = err.response.status;
        result.data = err.message;
    });
    return result;
};
exports.searchPaperIdByKeywoard = searchPaperIdByKeywoard