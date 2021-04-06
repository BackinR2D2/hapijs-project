require('dotenv').config();
const Hapi = require('@hapi/hapi');
const path = require('path');
const axios = require('axios');
const PORT = process.env.PORT || 3000;

const { getMovie } = require('./routes/movie');
const { postMovie } = require('./routes/movie');

const init = async () => {

    const server = Hapi.server({
        port: PORT,
        // host: 'localhost',
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

    server.route(getMovie);
    server.route(postMovie);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();