Simple Node.js application to look up information about a movie

To run this application check it out:

    $ git clone git@github.com:wweaver/movie-info.git

Then run the following to install the dependencies:

    $ npm install

Then create a `lib/credentials.json` file with your rotten tomatoes
and twitter api credentials in the following form:

    {
        "twitter": {
            "consumer_key": "<CONSUMER KEY>",
            "consumer_secret": "<CONSUMER SECRET>",
            "access_token_key": "<ACCESS TOKEN KEY>",
            "access_token_secret": "<ACCESS TOKEN SECRET>"
        },
        "rotten": {
            "api_key": "<API KEY>"
        }
    }

Lastly you should just be able to start the service by running:

    $ node lib/index.js

To test it you can go into a browser at
[http://localhost:8000/](http://localhost:8000) and submit a request for
a movie. There are I'm sure some bugs but for most cases it should work
for you.

The responses will contain 10 result from twitter that contain the movie
title and all results from rotten tomatoes with that title.
