
var hapi = require('hapi'),
    twitter = require('twitter'),
    rotten = require('rotten-api'),
    async = require('async'),
    js2xmlparser = require('js2xmlparser'),
    yaml = require('js-yaml'),
    credentials = require('./credentials.json'),

    server = hapi.createServer(
        'localhost',
        8000,
        {
            views: {
                engines: {html: 'handlebars'},
                path: __dirname + '/templates'
            }
        }
    ),
    twit = new twitter(credentials.twitter),
    rot = rotten(credentials.rotten.api_key);

// Index page
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index', {});
    }
});


function handle_movie_request (request, reply) {
    // NOTE: a period in the search will break this
    var parts = request.params.movie.split('.'),
        movie = parts[0],
        format = parts[1] || 'json';

    async.parallel(
        {
            twitter: function (callback) {
                twit.search(movie, {count: 10}, function (res) {
                    console.log('twitter callback called');
                    callback(null, res.statuses);
                })
            },
            rotten: function (callback) {
                rot.search(movie, function (err, res) {
                    if (!err) {
                        console.log('rotten non error callback called');
                        callback(err, res.movies)
                    } else {
                        console.log('rotten error callback called');
                        callback(err, res);
                    }
                })
            }
        },
        function (err, res) {
            switch (format) {
                case 'json':
                    console.log('in json');
                    reply(JSON.stringify(res))
                        .type('application/json');
                    break;
                case 'xml':
                    console.log('in xml');
                    reply(js2xmlparser('root', res))
                        .type('application/xml');
                    break;
                case 'yml':
                case 'yaml':
                    console.log('in yaml');
                    reply(yaml.safeDump(res))
                        .type('application/x-yaml');
                    break;
            }
        }
    );
    console.log('Request for "' + movie + '" in "' + format + '" format.');
}

// Search
server.route({
    method: 'GET',
    path: '/movie/{movie}',
    handler: handle_movie_request
});

// Start the server
server.start();
