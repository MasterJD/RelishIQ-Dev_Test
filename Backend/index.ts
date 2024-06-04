/* Development-Test - Javier Donado - 2024 */
/* Backend code for "Part 1: The API Endpoint" assignment */
/*
    https://jsonplaceholder.typicode.com/users
    https://jsonplaceholder.typicode.com/albums
    https://jsonplaceholder.typicode.com/photos
*/
import express from 'express';
import axios from 'axios';
//import pLimit from 'p-limit';

/* Using pLimit() to limit the amount of data promises fetched by the API request, in this case [25] - Task 1.3 */
/* Using express() to return promise when making a request to the given API's by RELISH */
const externalApiApp = express();

/* Task 1.1 - External API Endpoint to provide the photo info, ex. /externalapi/photos/1 - COMPLETE */
externalApiApp.get('/externalapi/photos/:id', async (req, res) => {
    const idValue = req.params.id;

    try {
        const photoIdResponse = await axios.get(`https://jsonplaceholder.typicode.com/photos/${idValue}`);
        const photoIdData = photoIdResponse.data;

        const albumIdResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums/${photoIdData.albumId}`);
        const albumIdData = albumIdResponse.data;

        const userIdResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${albumIdData.userId}`);
        const userIdData = userIdResponse.data;

        const externalAPIData = { ...photoIdData, albumIdData: { ...albumIdData, userIdData } };

        res.json(externalAPIData);
    } catch (error) {
        res.status(500).json({ error: 'Error getting the photo information.' });
    }
});
/* Task 1.2 - The Filtering, implement filters for title, album.title, album.user.email - COMPLETE */
/* Task 1.3 - The Pagination, restrict the amount of data being requested to the API */

/* TODO: .ENV file with variables */

externalApiApp.get('/externalapi/photos', async (req, res) => {
    const pLimit = (await import('p-limit')).default;
    const requestLimit = pLimit(5);

    const {'title' : titleId} = req.query;
    const {'album.title' : albumTitleId} = req.query;
    const {'album.user.email' : albumUserEmailId} = req.query;
    const {'limit' :  limit} = req.query;
    const {'offset' : offset} = req.query;

    try{
        /* Setting the limits for limit and offset as indicated in Task 1.3 */
        let limitValue = parseInt(String(limit), 10);
        let offsetValue = parseInt(String(offset), 0);

        if (!limitValue && limitValue !== 0) {
            limitValue = 25;
        }
        if (!offsetValue && offsetValue !== 0) {
            offsetValue = 0;
        }

        const photoIdResponse = await axios.get('https://jsonplaceholder.typicode.com/photos');
        let photoIdData = photoIdResponse.data;

        const albumRequestPromise = photoIdData.map((photo: { albumId: any; }) => requestLimit(() =>  axios.get(`https://jsonplaceholder.typicode.com/albums/${photo.albumId}`)));
        const albumData = await Promise.all(albumRequestPromise);

        albumData.forEach((albumResponse, i) => {
            photoIdData[i].album = albumResponse.data; 
        });

        const userRequesPromise = albumData.map(albumResponse => requestLimit(() => axios.get(`https://jsonplaceholder.typicode.com/users/${albumResponse.data.userId}`)));
        const userData = await Promise.all(userRequesPromise);

        userData.forEach((userResponse, i) => {
            photoIdData[i].album.user = userResponse.data; 
        });

        if(titleId){
            photoIdData = photoIdData.filter((photo: { title: any }) => photo.title.includes(titleId));
        }
        else if(albumTitleId){
            photoIdData = photoIdData.filter((photo: { album: any, title: any }) => photo.album.title.includes(albumTitleId));
        }
        else if(albumUserEmailId){
            photoIdData = photoIdData.filter((photo: { album: any, user: any }) => photo.album.user.email === albumUserEmailId);   
        }


        res.json(photoIdData.slice(offsetValue, offsetValue + limitValue));
    }
    catch (error){
        res.status(500).json({ error: 'Error getting the photo information.' });
    }
});
export default externalApiApp;
