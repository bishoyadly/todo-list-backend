jest.mock('src/database');
const app = require('src/app');

function buildRequest(requestObj) {
    const {params = {}, body = {}, query = {}, headers = {}} = requestObj || {};
    const request = {
        get: function () {

        },
        params: params,
        body: body,
        query: query,
        headers: headers
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

function buildNext() {
    return jest.fn().mockName('next');
}

module.exports = {
    buildRequest, buildResponse, buildNext
};