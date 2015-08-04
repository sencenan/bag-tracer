'use strict';

require('tough-cookie');

var
	_ = require('lodash'),
	debug = require('debug')('bag-tracer:index'),
	request = require('request'),
	cheerio = require('cheerio'),
	AsciiTable = require('ascii-table'),
	url = require('url');

var
	ENTRY_URL = 'https://wtrweb.worldtracer.aero/WTRInternet/pax.do',
	FORM_URL = 'https://wtrweb.worldtracer.aero/WTRInternet/wtwflowinternet.do';

var
	opt = {
		headers: {
			'Accept': '*/*',
			'Accept-Language': 'en-US,en;q=0.8',
			'User-Agent':
`Mozilla/5.0 (X11; Linux x86_64)
AppleWebKit/537.36 (KHTML, like Gecko)
Chrome/43.0.2357.124 Safari/537.36`
		},
		jar: true
	};

var trace = (airlineCode, fileRef, name, cb) => {
	if (!airlineCode || !fileRef || !name) {
		cb && cb('Missing input');
	}

	request(
		_.assign(
			{
				uri: ENTRY_URL
			},
			opt
		),
		(error, response, body) => {
			if (error) {
				debug(error);
				process.exit(-1);
			}

			let
				$ = cheerio.load(body),
				flowKey = $('input[name="_flowExecutionKey"]').val();

			request(
				_.assign(
					{
						method: 'post',
						uri: FORM_URL,
						qs: {
							_flowExecutionKey: flowKey
						},
						formData: {
							internetRecordReference: fileRef,
							'delayedBagRecord.passenger.names[0]': name.toUpperCase(),
							_eventId: 'display',
							_flowExecutionKey: flowKey
						},
						followRedirect: true
					},
					opt
				),
				(error, response, body) => {
					// output
					debug(response.statusCode);

					var outputTable = new AsciiTable('Result');

					outputTable.addRow('airline code', airlineCode);
					outputTable.addRow('name', name);

					let
						$ = cheerio.load(body),
						resTable = $('#DisplayDelayedBagStatusInternet #tab1Div');

					resTable.find('td').each((idx, elem) => {
						let txt = $(elem).text().trim().toLowerCase();

						if (txt === 'tag number(s)') {
							let tagNum = $(elem)
								.nextAll('td')
								.find('strong')
								.text()
								.trim();

							outputTable.addRow('tag number', tagNum);
						}

						if (txt === 'reference number') {
							let refNum = $(elem)
								.nextAll('td')
								.find('strong')
								.text()
								.trim();

							outputTable.addRow('ref number', refNum);
						}

						if (txt === 'bag delivery status') {
							let
								statusElem = $(elem).nextAll('td').find('span'),
								statusTitle = statusElem.attr('title'),
								status = statusElem.text().trim();

							outputTable.addRow('status title', statusTitle);
							outputTable.addRow('status', status);
						}
					});

					var output = outputTable.toString();
					console.log(output);
					cb && cb(output);
				}
			)
		}
	);
};

//TODO: babel needs to do this file by file
module.exports = trace;

if (
	require.main === module
		&& process.argv[2]
		&& process.argv[3]
		&& process.argv[4]
) {
	trace(
		process.argv[2],
		process.argv[3],
		process.argv[4]
	);
}
