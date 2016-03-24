# Emergency Publishing Scraper

When someone needs to bring the emergency publishing banner,
they need to make sure the banner is live in different pages across [GOV.UK](http://gov.uk)
website.

This tool aims to facilitate people's life by checking it automatically for them
and inform which pages might not have the banner.

---

### Setup

You have two options to install, one uses brew and the other uses npm

    $ brew install phantomjs2 casperjs

    $ npm install -g phantomjs casperjs


### Troubleshooting

Sometimes people are unfortunate to have what seems to be a broken installation of casperjs.

Let's double check if you happen to be one of them, please run the following:

    $ casperjs selftest

If you happen to receive the following:

    $ env: node\r: No such file or directory

#### Follow the steps

Open phantomjs executable with vim

    $ vim `which phantomjs`

Then type the following:

    :set ff=unix
    :x

And run casperjs again.

### Usage

    casperjs scrapper.js --env=environment_name
    casperjs scrapper.js --only-pages=/page-1,/page-2