import * as d3 from 'd3';

function embed(id) {
	return '<iframe src="https://p.excitem.com/s/play/'+id+'?e=1" allowtransparency="true" frameborder="0" width="100%" height="250px" style="padding:0;border:0;" class="excitemInfo" scrolling="no"></iframe>';
}
function yout(link){
	link = link.replace('watch?v=', 'embed/')
	return '<iframe width="300" height="169" class="yout-embed" src="'+link+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
}

function polls(data, keys){
	console.log(data);
	console.log(keys);
	var round1polls = d3.nest().key(d => {return d['Poll ID - Round 1'];}).entries(data);
	
	var round2polls = d3.nest().key(d => {return d['Poll ID - Round 2'];}).entries(data);

	var round3polls = d3.nest().key(d => {return d['Poll ID - Round 3'];}).entries(data);

	var round4polls = d3.nest().key(d => {return d['Poll ID - Round 4'];}).entries(data);
	
	function checkRound(){
		if (round1polls.length == 8 && round2polls.length <= 1){
			return {
				'meta':'Competitor - Round 1',
				'round':'Round 1',
				'polls':round1polls
			};
		}
		else if (round2polls.length >= 2 && round3polls.length <= 1){
			return {
				'meta':'Competitor - Round 2',
				'round':'Round 2',
				'polls':round2polls
			};
		}
		else if (round3polls.length >= 2 && round4polls.length <= 1){
			return {
				'meta':'Competitor - Round 3',
				'round':'Semifinals',
				'polls':round3polls
			};
		}
		else if (round4polls.length >= 2){
			return {
				'meta':'Competitor - Round 4',
				'round':'Finals',
				'polls':round4polls
			};
		}
	};

	var currentPolls = checkRound();
	var competitorRound = currentPolls['meta'];

	var pollsTitle = d3.select("#polls")
		.append('div')
		.attr("id",'polls-round-title')
		.html('<p>Vote for your favorites: ' + currentPolls['round'] + '</p>');

	console.log(currentPolls);

	currentPolls['polls'].filter(p => {return p.key != ''}).forEach(p => {
		//console.log(p);
		
		var url1;
		var url2;
		var desc1;
		var desc2;
		
		keys.forEach(k => {
			if (k['slug'] == p['values'][0][competitorRound]){
				url1 = k['url'];
				desc1 = k['description'];
			}
			else if (k['slug'] == p['values'][1][competitorRound]){
				url2 = k['url'];
				desc2 = k['description'];
			}
		});

		var row = d3.select('#polls')
			.append('div')
			.attr('class','poll-row');

		var col1 = row.append('div')
			.attr('class','poll-col-1')
			.html(() => {
				if(url1){
					return '<p class="poll-title">'+p['values'][0][competitorRound]+'</p>'+yout(url1);
				}
				else{
					return '<p id="vid-error">Error: could not display video</p>';
				}
			});

		col1.append('div')
			.attr('class','poll-item-desc')
			.html('<p>' + desc1 + '</p>')

		row.append('div')
			.attr('class','excitemInfo')
			.html(() => { return embed(p.key) });

		var col2 = row.append('div')
			.attr('class','poll-col-2')
			.html(() => {
				if(url2){
					return '<p class="poll-title">'+p['values'][1][competitorRound]+'</p>'+yout(url2);
				}
				else{
					return '<p id="vid-error">Error: could not display video</p>';
				}
			});

		col2.append('div')
			.attr('class','poll-item-desc')
			.html('<p>' + desc2 + '</p>');
	});

	
}
export default polls;