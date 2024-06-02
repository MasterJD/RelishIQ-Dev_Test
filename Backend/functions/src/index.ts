/* Development-Test - Javier Donado - 2024 */
/* Backend code for "Part 1: The API Endpoint" assignment */
/*
    https://jsonplaceholder.typicode.com/users
    https://jsonplaceholder.typicode.com/albums
    https://jsonplaceholder.typicode.com/photos
*/
import express from 'express';
import axios from 'axios';

/* Using express() to return promise when making a request to the given API's by RELISH */
const externalApiApp = express();

/* Task 01 - External API Endpoint to provide the photo info, ex. /externalapi/photos/1 */
externalApiApp.get('/externalapi/photos/:id', async (req, res) => {
    const idValue = req.params.id;

    try{
        const photoIdResponse = await axios.get(`https://jsonplaceholder.typicode.com/photos/${idValue}`)
        const photoIdData = photoIdResponse.data;

        const albumIdResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums/${photoIdData.albumId}`)
        const albumIdData = albumIdResponse.data;

        const userIdResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${albumIdData.userId}`)
        const userIdData = userIdResponse.data;

        const externalAPIData = {...photoIdData, albumIdData: {...albumIdData, userIdData}};

        res.json(externalAPIData);
    }
    catch (error){
        res.status(500).json({ error: 'Error getting the photo information.' });
    }
});
exports.app = externalApiApp;
