require('dotenv').config();
const axios = require('axios');
const axiosInstance = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`
});

const server = require('../../../src/app');
afterAll(async () => {
    server.close();
});


test('sign in process', async () => {
    let response;
    try {
        response = await axiosInstance.post('/api/v1/login');
    } catch (error) {
        response = error.response;
    }
    expect(response.status).toEqual(200);
});