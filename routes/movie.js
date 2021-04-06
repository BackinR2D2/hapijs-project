const axios = require('axios');

module.exports = {
    getMovie: {
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            return res.file('index.html');
        }
    },
    postMovie: {
        method: 'POST',
        path: '/movie',
        handler: async function (req, res) {
            try {
                const movieSearch = req.payload.movie;
                const { data } = await axios.get(`http://www.omdbapi.com/?t=${movieSearch}&apikey=${process.env.API_KEY}`);
                if (data.Response === 'False') {
                    return res.file('error.html');
                }
                return res.view('name', { data });
            } catch (error) {
                return res.file('error.html');
            }
        }
    }
}