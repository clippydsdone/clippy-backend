/**
 * @version: 1.0
 * @description:    this program connects our web with semantic scholar API.
 *                  It has two main functions, search by paperID and search by title.
 *                  In search by paper ID, it comunicates if paper wesn't found. If it was found
 *                  references and citations are exported.
 *                  In search by title, it searchs and found if no results are returned (error)
 *                  If results returned doesn't match with the title, error.
 *                  If one result has the same title, takes its ID and search for it
 * 
 * @test:    I have tested manually with different titles and paperIDs
 */


 const https = require('https');
 
 const index = 'clippy.herokuapp.com/search-title'; //route to search from our server
 const baseURLSemantic = 'https://api.semanticscholar.org';
 let paperID = '649def34f8be52c8b66281af98ae884c09aef38b'; //example paper ID
 const title = 'A Bacterial Foraging Based Smart Offloading for IoT Sensors in Edge Computing'; //example title according to the
 const fields = 'references,citations'; //fields to return to use on graph
 
 //let getReq = baseURLSemantic + '/graph/v1/paper';
 
 //this is the route of the web
 const option = index.slice(20);
 //console.log(option);
 switch(option){
     case '/search-title':
        searchPaperbyTitle(title);
        break;

    case '/search-paper-ID':
        searchPaperbyId(paperID);
        break;
}
 
// function that searches for a paper by title
function searchPaperbyTitle (title){
    const getReq = baseURLSemantic + '/graph/v1/paper/search?query=' + title;
        https.get(getReq, (response) => {
            let data = ''; //will be a list of titles and ID
            response.on('data', (chunk) => {
                 data += chunk;
            })
 
            response.on('end', () => {
                const jsonObject = JSON.parse(data);
 
                if (jsonObject.total === 0){
                    console.log('No results to this title')
                    // TODO: comunnicate that no title founded
                } else {
                    //console.log(jsonObject.total);
                    //console.log(jsonObject.data);
                    const docs = jsonObject.data;
                    let founded = false;
                    let i = 0;
                    while (!founded && i < docs.length){
                        //console.log(docs[i].title);
                        if (title.localeCompare(docs[i].title) === 0){ //if it is exactly the title searched, return the paperID
                            console.log(docs[i].title);
                            //paperID = docs[i].paperId;
                            searchPaperbyId(docs[i].paperId);
                            founded = true;
                        }
                        i++;
                    }
                     if(!founded){
                        console.log('Title doesn\'t match with any of semantic');
                        //TODO: COMMUNICATE ERROR
                    }
                }
            })
        });
 
}



// function that search a paper by ID and returns its references and citation or error if not found
 function searchPaperbyId(paperID){
    const getReq = baseURLSemantic + '/graph/v1/paper/' + paperID;
    https.get(getReq + '?fields=' + fields, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
 
        response.on('end', () => {
            const jsonObject = JSON.parse(data);
            console.log(jsonObject.paperId);
 
            // not paper with that ID
            if (jsonObject.paperId === undefined){
                console.log(jsonObject.error);
                //TODO:  comunicate error paper not found
             } else { //export refences and citations
                //console.log(jsonObject.references);
                //console.log(jsonObject.citations);
                const references = jsonObject.references;
                const citations = jsonObject.citations;
 
                module.exports = {
                    references, citations
                };
            } 
         });
    })
    .on('error', (error) => {
         console.log(error);
    });
 }
 