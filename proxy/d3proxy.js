function parseReferencesToD3Json(paperId, paperTitle, references) {
    var ret = {
        "nodes": [{ "id": paperId, "group": 1, "title": paperTitle}],
        "links": []
    }

    for (var i = 0; i < references.length; i++) {
        ret.nodes.push({ "id": references[i].paperId, "group": 2, "title": references[i].title  });
        ret.links.push({ "source": paperId, "target": references[i].paperId, "value": 2, "distance": 50})
    }

    return ret;
}

exports.parseReferencesToD3Json = parseReferencesToD3Json