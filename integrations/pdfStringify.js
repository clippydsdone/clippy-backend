const axios = require('axios');

async function getPdfBase64(pdfUrl) {
    var result = { "status": 200, "data": null }
    await axios({
        method: 'get',
        url: pdfUrl,
        responseType: 'arraybuffer'
    })
        .then((response) => {
            result.status = 200;
            result.data = "data:application/pdf;base64," + Buffer.from(response.data, 'binary').toString('base64')
        })
        .catch((err) => {
            result.status = err.response.status;
            result.data = err.message;
        });
    return result;

}

exports.getPdfBase64 = getPdfBase64