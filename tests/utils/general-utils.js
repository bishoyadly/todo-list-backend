jest.mock('src/database');
const app = require('src/app');

function buildRequest(requestObj) {
    const {params = {}, body = {}, query = {}} = requestObj || {};
    const request = {
        get: function () {

        },
        params: params,
        body: body,
        query: query,
    };
    return request;
}

function buildResponse() {
    const response = {
        status: jest.fn(() => response).mockName('status'),
        send: jest.fn().mockName('send')
    };
    return response;
}

async function startServer() {
    return new Promise((resolve, reject) => {
        const server = app.listen(() => {
            resolve(server);
            console.log('Test Server listens on port ', server.address().port);
        })
    })
}

module.exports = {
    startServer, buildRequest, buildResponse
};