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

/* Task 1 - External API Endpoint to provide the photo info, ex. /externalapi/photos/1 - Complete*/
/* Task 1.2 - The Filtering, implement filters for title, album.title, album.user.email */
externalApiApp.get('/externalapi/photos', async (req, res) => {
    //const idValue = req.params.id;
    const {'title' : titleId} = req.query;
    const {'album.title' : albumTitleId} = req.query;
    const {'album.user.email' : albumUserId} = req.query;

    try{
        const photoIdResponse = await axios.get('https://jsonplaceholder.typicode.com/photos');
        let photoIdData = photoIdResponse.data;

        //const albumIdResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums/${photoIdData.albumId}`)
        //const albumIdData = albumIdResponse.data;
        const albumRequestPromise = photoIdData.map((photo: { albumId: any; }) => axios.get(`https://jsonplaceholder.typicode.com/albums/${photo.albumId}`));
        const albumData = await Promise.all(albumRequestPromise);

        albumData.forEach((albumResponse, i) => {
            photoIdData[i].album = albumResponse.data; 
        });

        const userIdResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${albumIdData.userId}`)
        const userIdData = userIdResponse.data;

        const externalAPIData = {...photoIdData, albumIdData: {...albumIdData, userIdData}};

        res.json(externalAPIData);
    }
    catch (error){
        res.status(500).json({ error: 'Error getting the photo information.' });
    }
});
export default externalApiApp;
