const SemanticScholarApi = require('../integrations/semanticScholar.js');

async function parseReferencesToD3Json(paper) {
    const paperId = paper.data.paperId;
    let nodeIds = [];
    let ret = {
        "nodes": [{ "id": paperId, "group": 1, "title": paper.data.title }],
        "links": []
    }
    nodeIds.push(paperId);

    for (const element of paper.data.references) {
        let id = element.paperId;
        if (id == undefined) {
            continue;
        }
        ret.links.push({ "source": paperId, "target": id, "group": 2, "distance": 50 });
        ret.nodes.push({ "id": id, "group": 2, "title": element.title });
        nodeIds.push(id);
    }

    let dataRef = await SemanticScholarApi.getPaperReferences(paperId);
    for (const element of dataRef.data) {
        let currId = element.citingPaper.paperId;
        if (currId == undefined) {
            continue;
        }

        if (nodeIds.includes(currId)) {
            ret.links.push({ "source": currId, "target": paperId, "group": 2, "distance": 25 });
        }
    }
    return ret;
}

exports.parseReferencesToD3Json = parseReferencesToD3Json