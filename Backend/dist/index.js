"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Development-Test - Javier Donado - 2024 */
/* Backend code for "Part 1: The API Endpoint" assignment */
/*
    https://jsonplaceholder.typicode.com/users
    https://jsonplaceholder.typicode.com/albums
    https://jsonplaceholder.typicode.com/photos
*/
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
/* Using express() to return promise when making a request to the given API's by RELISH */
const externalApiApp = (0, express_1.default)();
/* Task 01 - External API Endpoint to provide the photo info, ex. /externalapi/photos/1 */
externalApiApp.get('/externalapi/photos/:id', async (req, res) => {
    const idValue = req.params.id;
    try {
        const photoIdResponse = await axios_1.default.get(`https://jsonplaceholder.typicode.com/photos/${idValue}`);
        const photoIdData = photoIdResponse.data;
        const albumIdResponse = await axios_1.default.get(`https://jsonplaceholder.typicode.com/albums/${photoIdData.albumId}`);
        const albumIdData = albumIdResponse.data;
        const userIdResponse = await axios_1.default.get(`https://jsonplaceholder.typicode.com/users/${albumIdData.userId}`);
        const userIdData = userIdResponse.data;
        const externalAPIData = { ...photoIdData, albumIdData: { ...albumIdData, userIdData } };
        res.json(externalAPIData);
    }
    catch (error) {
        res.status(500).json({ error: 'Error getting the photo information.' });
    }
});
exports.app = externalApiApp;
