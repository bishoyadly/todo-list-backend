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

module.exports = {
    buildRequest, buildResponse
};