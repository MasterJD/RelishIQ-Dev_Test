"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* Using pLimit() to limit the amount of data promises fetched by the API request, in this case [25] - Task 1.3 */
/* Using express() to return promise when making a request to the given API's by RELISH */
const externalApiApp = (0, express_1.default)();
const API_URL = process.env.API_URL;
const calculateSizeInMB = (data) => {
    const jsonData = JSON.stringify(data);
    const bytes = Buffer.byteLength(jsonData, 'utf8'); // Measure the byte length of the JSON string
    const mb = bytes / (1024 * 1024); // Convert bytes to MB
    return mb;
};
const enrichPhotoData = (photo, albumsMap, usersMap) => __awaiter(void 0, void 0, void 0, function* () {
    const album = albumsMap.get(photo.albumId);
    const user = usersMap.get(album.userId);
    return Object.assign(Object.assign({}, photo), { album: Object.assign(Object.assign({}, album), { user }) });
});
/* Task 1.1 - External API Endpoint to provide the photo info, ex. /externalapi/photos/1 - COMPLETE */
externalApiApp.get('/externalapi/photos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idValue = req.params.id;
    try {
        const photoIdResponse = yield axios_1.default.get(`${API_URL}/photos/${idValue}`);
        const photoIdData = photoIdResponse.data;
        const albumIdResponse = yield axios_1.default.get(`${API_URL}/albums/${photoIdData.albumId}`);
        const albumIdData = albumIdResponse.data;
        const userIdResponse = yield axios_1.default.get(`${API_URL}/users/${albumIdData.userId}`);
        const userIdData = userIdResponse.data;
        const externalAPIData = Object.assign(Object.assign({}, photoIdData), { albumIdData: Object.assign(Object.assign({}, albumIdData), { userIdData }) });
        const dataSizeInMB = calculateSizeInMB(externalAPIData);
        console.log(`Fetched data size: ${dataSizeInMB.toFixed(2)} MB`);
        res.json(externalAPIData);
    }
    catch (error) {
        console.error('Error fetching photo information:', error);
        res.status(500).json({ error: 'Error getting the photo information.' });
    }
}));
/* Task 1.2 - The Filtering, implement filters for title, album.title, album.user.email - COMPLETE */
/* Task 1.3 - The Pagination, restrict the amount of data being requested to the API - COMPLETE */
/* TODO: .ENV file with variables - COMPLETE */
externalApiApp.get('/externalapi/photos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const pLimit = (await import('p-limit')).default;
    //const requestLimit = pLimit(5);
    const { 'title': titleId } = req.query;
    const { 'album.title': albumTitleId } = req.query;
    const { 'album.user.email': albumUserEmailId } = req.query;
    const { 'limit': limit } = req.query;
    const { 'offset': offset } = req.query;
    /* Setting the limits for limit and offset as indicated in Task 1.3 */
    let limitValue = parseInt(String(limit), 10);
    let offsetValue = parseInt(String(offset), 0);
    try {
        if (!limitValue && limitValue !== 0) {
            limitValue = 25;
        }
        if (!offsetValue && offsetValue !== 0) {
            offsetValue = 0;
        }
        const [photos, albums, users] = yield Promise.all([
            axios_1.default.get(`${API_URL}/photos`).then(res => res.data),
            axios_1.default.get(`${API_URL}/albums`).then(res => res.data),
            axios_1.default.get(`${API_URL}/users`).then(res => res.data)
        ]);
        /* After investigating slow get request times optep for Map to group requests (Older version was pretty slow) */
        const albumsMap = new Map(albums.map((album) => [album.id, album]));
        const usersMap = new Map(users.map((user) => [user.id, user]));
        let filteredPhotos = photos;
        if (titleId) {
            filteredPhotos = filteredPhotos.filter((photo) => photo.title.includes(titleId));
            console.log(`Filtered photos by title, remaining count: ${filteredPhotos.length}`);
            const enrichedDataSizeInMB = calculateSizeInMB(filteredPhotos);
            console.log(`Enriched data size: ${enrichedDataSizeInMB.toFixed(2)} MB`);
        }
        else if (albumTitleId) {
            const matchingAlbumIds = albums
                .filter((album) => album.title.includes(albumTitleId))
                .map((album) => album.id);
            filteredPhotos = filteredPhotos.filter((photo) => matchingAlbumIds.includes(photo.albumId));
            console.log(`Filtered photos by album title, remaining count: ${filteredPhotos.length}`);
            const enrichedDataSizeInMB = calculateSizeInMB(filteredPhotos);
            console.log(`Enriched data size: ${enrichedDataSizeInMB.toFixed(2)} MB`);
        }
        else if (albumUserEmailId) {
            const matchingUserIds = users
                .filter((user) => user.email === albumUserEmailId)
                .map((user) => user.id);
            const matchingAlbumIds = albums
                .filter((album) => matchingUserIds.includes(album.userId))
                .map((album) => album.id);
            filteredPhotos = filteredPhotos.filter((photo) => matchingAlbumIds.includes(photo.albumId));
            console.log(`Filtered photos by album user email, remaining count: ${filteredPhotos.length}`);
            const enrichedDataSizeInMB = calculateSizeInMB(filteredPhotos);
            console.log(`Enriched data size: ${enrichedDataSizeInMB.toFixed(2)} MB`);
        }
        const paginatedPhotos = filteredPhotos.slice(offsetValue, offsetValue + limitValue);
        const enrichedPhotosPromises = paginatedPhotos.map((photo) => enrichPhotoData(photo, albumsMap, usersMap));
        const enrichedPhotos = yield Promise.all(enrichedPhotosPromises);
        res.json(enrichedPhotos);
    }
    catch (error) {
        console.error('Error fetching or processing photos:', error);
        res.status(500).json({ error: 'Error getting the photo information.' });
    }
}));
exports.default = externalApiApp;
