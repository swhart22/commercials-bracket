import sheetsy from 'sheetsy';
const {urlToKey, getWorkbook, getSheet } = sheetsy;
import desktop from './desktop.js';
import mobile from './mobile.js';
import polls from './polls.js';

//change this to the appropriate spreadsheet url
const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1Ez8zzUBfeI5qIcYs-e1VRCE5lDYe5jh6AVCwTDNTsjQ/edit#gid=0";

const key = urlToKey(SPREADSHEET_URL);

//specify whether bracket is 16 or 32

//32 NOT SUPPORTED YET!
const size = 16;

const metadata = {
	key: key,
	size: size
};

//grabs the data, then draws the chart, then draws the polls
getWorkbook(metadata['key']).then(workbook => {
	console.log(workbook['sheets']);

	const SHEET1ID = workbook['sheets'][0]['id'];
	const SHEET2ID = workbook['sheets'][1]['id'];

	getSheet(metadata['key'], SHEET1ID).then((stuff) => {
		console.log(stuff);
		var data = [];
		
		stuff.rows.forEach((d, i) => {
			var o = {};
			o['Seed'] = d['seed'];

			o['Competitor - Round 1'] = d['competitor-round1'];
			o['Poll ID - Round 1'] = d['pollid-round1'];
			o['Result - Round 1'] = d['result-round1'];

			o['Competitor - Round 2'] = d['competitor-round2'];
			o['Poll ID - Round 2'] = d['pollid-round2'];
			o['Result - Round 2'] = d['result-round2'];

			o['Competitor - Round 3'] = d['competitor-round3'];
			o['Poll ID - Round 3'] = d['pollid-round3'];
			o['Result - Round 3'] = d['result-round3'];

			o['Competitor - Round 4'] = d['competitor-round4'];
			o['Poll ID - Round 4'] = d['pollid-round4'];
			o['Result - Round 4 (winner)'] = d['result-round4winner'];

			o['WINNER'] = d['winner'];
			
			data.push(o);
		});
		
		return data;

	}).then((data) => {
		//once data is loaded, execute draw and polls functions
		//from ./draw.js
		var container = document.querySelector("#container");
		var wWidth = container.offsetWidth;

		getSheet(metadata['key'], SHEET2ID).then((stuff2) => {
			console.log(stuff2);

			var keys = [];

			stuff2.rows.forEach(s => {
				var o = {};
				o['slug'] = s['slug'];
				o['year'] = s['year'];
				o['url'] = s['url'];
				o['description'] = s['description'];
				keys.push(o)
			});
			
			if (wWidth >= 400){
				desktop(data, keys);
			}
			else{
				mobile(data, keys);
			}

			//from ./polls.js
			polls(data, keys);
			xtalk.signalIframe();
		});
	});
});
export default metadata;