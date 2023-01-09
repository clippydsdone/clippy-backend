const SemanticScholarApi = require('../integrations/semanticScholar.js');

async function parseReferencesToD3Json(paper) {
    const paperId = paper.data.paperId;
    let nodeIds = [];
    let ret = {
        "nodes": [{ "id": paperId, "group": 1, "data": paper.data.title }],
        "links": []
    }
    nodeIds.push(paperId);

    for (const element of paper.data.references) {
        let id = element.paperId;
        if (id == undefined) {
            continue;
        }
        ret.links.push({ "source": paperId, "target": id, "group": 2, "distance": 50 })
        nodeIds.push(id);
    }

    let dataRef = await SemanticScholarApi.getPaperReferences(paperId);
    for (const element of dataRef.data) {
        let id = element.citedPaper.paperId;
        if (id == undefined) {
            continue;
        }

        if (nodeIds.includes(id)) {
            ret.nodes.push({ "id": id, "group": 2, "data": element.citedPaper.title });
            ret.links.push({ "source": paperId, "target": id, "group": 2, "distance": 25 });
        }
    }
    console.log(ret);
    return ret;
}

exports.parseReferencesToD3Json = parseReferencesToD3Json