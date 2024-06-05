/* Development-Test - Javier Donado - 2024 */
/* Backend code for "Part 1: The API Endpoint" assignment */
/*
    https://jsonplaceholder.typicode.com/users
    https://jsonplaceholder.typicode.com/albums
    https://jsonplaceholder.typicode.com/photos
*/
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


/* Using pLimit() to limit the amount of data promises fetched by the API request, in this case [25] - Task 1.3 */
/* Using express() to return promise when making a request to the given API's by RELISH */
const externalApiApp = express();
const API_URL = process.env.API_URL;

const calculateSizeInMB = (data: any): number => {
    const jsonData = JSON.stringify(data);
    const bytes = Buffer.byteLength(jsonData, 'utf8'); // Measure the byte length of the JSON string
    const mb = bytes / (1024 * 1024); // Convert bytes to MB
    return mb;
};
const enrichPhotoData = async (photo: any, albumsMap: Map<number, any>, usersMap: Map<number, any>) => {
    const album = albumsMap.get(photo.albumId);
    const user = usersMap.get(album.userId);

    return { ...photo, album: { ...album, user }};
};
/* Task 1.1 - External API Endpoint to provide the photo info, ex. /externalapi/photos/1 - COMPLETE */
externalApiApp.get('/externalapi/photos/:id', async (req, res) => {
    const idValue = req.params.id;

    try {
        const photoIdResponse = await axios.get(`${API_URL}/photos/${idValue}`);
        const photoIdData = photoIdResponse.data;

        const albumIdResponse = await axios.get(`${API_URL}/albums/${photoIdData.albumId}`);
        const albumIdData = albumIdResponse.data;

        const userIdResponse = await axios.get(`${API_URL}/users/${albumIdData.userId}`);
        const userIdData = userIdResponse.data;

        const externalAPIData = { ...photoIdData, albumIdData: { ...albumIdData, userIdData } };

        const dataSizeInMB = calculateSizeInMB(externalAPIData);
        console.log(`Fetched data size: ${dataSizeInMB.toFixed(2)} MB`);

        res.json(externalAPIData);
    } catch (error) {
        console.error('Error fetching photo information:', error);
        res.status(500).json({ error: 'Error getting the photo information.' });
    }
});
/* Task 1.2 - The Filtering, implement filters for title, album.title, album.user.email - COMPLETE */
/* Task 1.3 - The Pagination, restrict the amount of data being requested to the API - COMPLETE */

/* TODO: .ENV file with variables - COMPLETE */

externalApiApp.get('/externalapi/photos', async (req, res) => {
    //const pLimit = (await import('p-limit')).default;
    //const requestLimit = pLimit(5);

    const {'title' : titleId} = req.query;
    const {'album.title' : albumTitleId} = req.query;
    const {'album.user.email' : albumUserEmailId} = req.query;
    const {'limit' :  limit} = req.query;
    const {'offset' : offset} = req.query;
    /* Setting the limits for limit and offset as indicated in Task 1.3 */
    let limitValue = parseInt(String(limit), 10);
    let offsetValue = parseInt(String(offset), 0);

    try{
        if (!limitValue && limitValue !== 0) {
            limitValue = 25;
        }
        if (!offsetValue && offsetValue !== 0) {
            offsetValue = 0;
        }
        const [photos, albums, users] = await Promise.all([
            axios.get(`${API_URL}/photos`).then(res => res.data),
            axios.get(`${API_URL}/albums`).then(res => res.data),
            axios.get(`${API_URL}/users`).then(res => res.data)
        ]);
        /* After investigating slow get request times optep for Map to group requests (Older version was pretty slow) */
        const albumsMap = new Map<number, any>(albums.map((album: any) => [album.id, album]));
        const usersMap = new Map<number, any>(users.map((user: any) => [user.id, user]));
        let filteredPhotos = photos;

        if(titleId){
            filteredPhotos = filteredPhotos.filter((photo: { title: string }) => photo.title.includes(titleId as string));
            
            console.log(`Filtered photos by title, remaining count: ${filteredPhotos.length}`);
            const enrichedDataSizeInMB = calculateSizeInMB(filteredPhotos);
            console.log(`Enriched data size: ${enrichedDataSizeInMB.toFixed(2)} MB`);
        }
        else if(albumTitleId){
            const matchingAlbumIds = albums
                .filter((album: { title: string }) => album.title.includes(albumTitleId as string))
                .map((album: { id: number }) => album.id);
            filteredPhotos = filteredPhotos.filter((photo: { albumId: number }) => matchingAlbumIds.includes(photo.albumId));
            
            console.log(`Filtered photos by album title, remaining count: ${filteredPhotos.length}`);
            const enrichedDataSizeInMB = calculateSizeInMB(filteredPhotos);
            console.log(`Enriched data size: ${enrichedDataSizeInMB.toFixed(2)} MB`);
        }
        else if(albumUserEmailId){
            const matchingUserIds = users
                .filter((user: { email: string }) => user.email === albumUserEmailId)
                .map((user: { id: number }) => user.id);
            const matchingAlbumIds = albums
                .filter((album: { userId: number }) => matchingUserIds.includes(album.userId))
                .map((album: { id: number }) => album.id);

            filteredPhotos = filteredPhotos.filter((photo: { albumId: number }) => matchingAlbumIds.includes(photo.albumId)); 
            console.log(`Filtered photos by album user email, remaining count: ${filteredPhotos.length}`);
            const enrichedDataSizeInMB = calculateSizeInMB(filteredPhotos);
            console.log(`Enriched data size: ${enrichedDataSizeInMB.toFixed(2)} MB`);
        }

        const paginatedPhotos = filteredPhotos.slice(offsetValue, offsetValue + limitValue);
        const enrichedPhotosPromises = paginatedPhotos.map((photo: any) => enrichPhotoData(photo, albumsMap, usersMap));
        const enrichedPhotos = await Promise.all(enrichedPhotosPromises);

        res.json(enrichedPhotos);
    }
    catch (error){
        console.error('Error fetching or processing photos:', error);
        res.status(500).json({ error: 'Error getting the photo information.' });
    }
});
export default externalApiApp;
