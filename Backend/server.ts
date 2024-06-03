import externalApiApp from './index';

const port = process.env.PORT || 3000;

externalApiApp.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
