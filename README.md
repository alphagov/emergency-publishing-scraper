# Emergency Publishing Scraper

This tool is meant to help people who need to verify that the Emergency Publishing Banner
is live in different pages across [GOV.UK](http://gov.uk) website.

It informs via screenshots and textual ouput which pages do not have the banner.

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

#### Run scrapper on default paths on a specific environment

    casperjs scrapper.js --env=environment_name

### Give a list of paths to run instead of default ones

    casperjs scrapper.js --env=environment_name --paths=/page-1,/page-2,...

### Write to a file

    casperjs scrapper.js --env=environment_name > report.txt


### License

MIT License

