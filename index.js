require('dotenv').config();
const Hapi = require('@hapi/hapi');
const path = require('path');
const axios = require('axios');
const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public'),
            }
        }
    });

    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));

    server.views({
        engines: {
            ejs: require('ejs')
        },
        relativeTo: __dirname,
        path: 'views',
    })

    server.route({
        method: 'POST',
        path: '/movie',
        handler: async function (req, res) {
            try {
                const movieSearch = req.payload.movie;
                const { data } = await axios.get(`http://www.omdbapi.com/?t=${movieSearch}&apikey=${process.env.API_KEY}`);
                return res.view('name', { data });
            } catch (error) {
                return res.file('error.html');
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            return res.file('index.html');
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();