function parseReferencesToD3Json(paperId, paperTitle, references) {
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
    }

    return ret;
}

exports.parseReferencesToD3Json = parseReferencesToD3Json