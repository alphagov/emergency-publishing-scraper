var casper = require('casper').create();
var env  = casper.cli.get('env');
var help = casper.cli.get('h') || casper.cli.get('help');

if (help != undefined) {
    console.log("Usage:\t--h\t\tfor this help\n\t--env=env\tchoose integration,staging,production...")
    exit();
} else if (env == undefined || env == 'environment') {
    console.log("You need to tell me which environment to run.\nuse --env=enviroment")
    exit();
}

// TODO: use the provided enviroment
// TODO: add option for basic Auth username & password


console.log('About to run on ' + environment +', please wait...')

/// colors
var red   = "\033[31m";
var white = "\033[37m";
var green = "\033[32m";

var cacheBust = function() {
    return '?' + Math.floor(( Math.random()) * new Date);
}

// TODO: decide where the links can come from
//
// read links from options?
// read links from a configuration file?
// read links from json?
// read links from yaml?
var links = [
    'https://www.gov.uk/',
    'https://www.gov.uk/financial-help-disabled',
    'https://www.gov.uk/government/organisations/hm-revenue-customs',
    'https://www.gov.uk/search?q='
];

var linksWithCacheBust = links.map(function(link) {
    return link + cacheBust();
});

casper.start().each(linksWithCacheBust, function(self, link) {
    self.thenOpen(link, function() {
        console.log(white + "Inspecting... \n-- " + link);

        if (this.exists('#campaign')) {
            var colour      = this.getElementAttribute('div[id="campaign"]', 'class');
            var heading     = this.fetchText('.campaign-inner h1');
            var description = this.fetchText('.campaign-inner p');
            var hasLink     = this.exists('.campaign-inner a');

            var linkPhrase = hasLink ? '----' : red + '---- *not*';

            console.log(green + '---- found banner colour: ' + colour);
            console.log('---- found heading: ' + heading);
            console.log('---- found description: ' + description);

            console.log(linkPhrase + ' found "more information" link.');
        }
        else {
            console.log(red + "---- banner was not found.")
        }
    });
});

casper.run();