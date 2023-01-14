const SemanticScholarApi = require('../integrations/semanticScholar.js');

async function parseReferencesToD3Json(paperId, paperTitle, references) {
    let nodesIds = [paperId];
    let ret = {
        "nodes": [{ "id": paperId, "group": 1, "title": paperTitle }],
        "links": []
    }

    for (const element of references) {
        let id = element.paperId;
        if (id == undefined) {
            id = element.title;
        }
        ret.nodes.push({ "id": id, "group": 2, "title": element.title });
        ret.links.push({ "source": paperId, "target": id, "group": 2, "distance": 50 })
        nodesIds.push(id);
    }
    const citations = await SemanticScholarApi.searchPaperIdCitations(paperId);
    for (const citedPaper of citations.data) {
        let id = citedPaper.citingPaper.paperId;
        if (id == undefined) {
            id = citedPaper.citingPaper.title;
        }

        if (nodesIds.includes(id)) {
            ret.links.push({ "source": id, "target": paperId, "group": 2, "distance": 100 })
        }
    }
    return ret;
}

exports.parseReferencesToD3Json = parseReferencesToD3Json