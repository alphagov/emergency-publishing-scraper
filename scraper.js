var url   = require("../node_modules/url");
var utils = require("utils");

var casper = require('casper').create({
    verbose: true,
});

var env  = casper.cli.get('env');
var help = casper.cli.get('h') || casper.cli.get('help');
var givenPaths = casper.cli.get('paths');

if (help != undefined) {
    console.log("Usage:\t--h\t\tfor this help\n\t--env=env\tchoose staging,production...")
    exit();
} else if (env == undefined || env == 'environment') {
    console.log("You need to tell me which environment to run.\nuse --env=enviroment")
    exit();
}

console.log('About to run on ' + env + ', please wait...');

var defaultPaths = [
    '/',
    '/financial-help-disabled',
    '/jobsearch',
    '/check-uk-visa',
    '/check-vehicle-tax',
    '/get-information-about-a-company',
    '/government/organisations/hm-revenue-customs',
    '/government/organisations/hm-revenue-customs',
    '/government/organisations/companies-house',
    '/search',
    '/state-pension-age',
    '/vehicle-tax',
];

var getPaths = function() {
    if (givenPaths != undefined) {
        return givenPaths.split(',');
    }

    return defaultPaths
}

var normalisePathName = function(link) {
    var path = url.parse(link).pathname;

    if (path == '/') { return 'homepage'; }

    return path.replace(/\//g, '-').slice(1, -1);
}

var cacheBust = function() {
    return '?' + Math.floor(( Math.random()) * new Date);
};

var linksWithEnvironment = function(paths) {
    var url;

    if (env == 'production') {
        url = 'https://www.gov.uk'
    }
    else {
        url = 'https://www-origin.'+ env + '.publishing.service.gov.uk';
    }

    var pathsWithEnv = paths.map(function (path) {
        return url + path + cacheBust();
    })

    return pathsWithEnv;
};

casper.start();

casper.each(linksWithEnvironment(getPaths()), function(self, link) {
    self.thenOpen(link, function(response) {
        console.log("Inspecting... \n-- " + link);
        console.log(response["status"])

        if (response["status"] == 429) {
            return console.log("ERROR: Too many requests, try again later.");
        }

        if (response["status"] == null || response["status"] == "null") {
            return console.log("ERROR: Failed to communicate with the server, please ensure the url is correct.");
        }

        this.capture('screenshots/'+ normalisePathName(link) +'.png', {
            top: 0,
            left: 0,
            width: 700,
            height: 600
        });

        if (this.exists('#campaign')) {
            var colour      = this.getElementAttribute('div[id="campaign"]', 'class');
            var heading     = this.fetchText('.campaign-inner h1');
            var description = this.fetchText('.campaign-inner p');
            var hasLink     = this.exists('.campaign-inner a');

            var linkPhrase = hasLink ? '----' : 'ERROR: ---- *not*';

            console.log('SUCCESS: ---- found banner colour: ' + colour);
            console.log('---- found heading: ' + heading);
            console.log('---- found description: ' + description);
            console.log(linkPhrase + ' found "more information" link.');
        }
        else if (this.exists('.govuk-emergency-banner')) {
            var campaign    = this.getElementAttribute('.govuk-emergency-banner', 'class')
                                  .split(/\s+/)
                                  .filter(function(item) {
                                    return item !== 'govuk-emergency-banner'
                                  });
            var heading     = this.fetchText('.govuk-emergency-banner div h2');
            var description = this.fetchText('.govuk-emergency-banner div p');
            var hasLink     = this.exists('.govuk-emergency-banner div a');

            var linkPhrase = hasLink ? '----' : 'ERROR: ---- *not*';

            console.log('SUCCESS: ---- found banner campaign: ' + campaign);
            console.log('---- found heading: ' + heading);
            console.log('---- found description: ' + description);
            console.log(linkPhrase + ' found "more information" link.');
        }
        else {
            console.log("ERROR: ---- banner was not found.")
        }
    });
});

casper.run();
