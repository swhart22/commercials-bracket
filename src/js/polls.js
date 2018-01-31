import * as d3 from 'd3';

function embed(id) {
	return '<iframe src="https://p.excitem.com/s/play/'+id+'?e=1" allowtransparency="true" frameborder="0" width="100%" height="400px" style="padding:0;border:0;" class="excitemInfo" scrolling="no"></iframe>';
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

	var round5 = d3.nest().key(d => {return d['WINNER']}).entries(data);

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
		else if (round4polls.length >= 2 && round5.length < 2){
			return {
				'meta':'Competitor - Round 4',
				'round':'Finals',
				'polls':round4polls
			};
		}
		else {
			return {
				'meta':'WINNER',
				'round':'Winner',
				'polls':round5
			}
		}
	};

	var currentPolls = checkRound();
	var competitorRound = currentPolls['meta'];

	var pollsTitle = d3.select("#polls")
		.append('div')
		.attr("id",'polls-round-title');

	var keyObj = d3.nest().key(k => {return k['slug']}).object(keys);

	currentPolls['polls'].filter(p => {return p.key != ''}).forEach(p => {
		
		if (currentPolls['meta'] == 'WINNER'){
			var competitor = p['values'][0][competitorRound]
			var url = keyObj[competitor][0]['url'];
			var desc = keyObj[competitor][0]['description'];
			
			pollsTitle.html('<p>The winner:</p>');
			var winrow = d3.select('#polls')
				.append('div')
				.attr('class','poll-col-1');

			winrow.append('div')
				.html(()=>{
					if(url){
					return '<p class="poll-title">'+p['values'][0][competitorRound] + '</p>' + yout(url)
					}
					else{
						return '<p id="vid-error">Error: could not display video</p>';
					}
				});

			winrow.append('div')
				.attr('class','poll-item-desc')
				.html('<p>' + desc + '</p>');

			d3.select('#polls')
				.append('div')
				.attr("id",'other-contenders')
				.html('<p>Other contenders:</p>');

			var ocf = d3.select('#polls')
				.append('div')
				.attr('id','other-contenders-flex');

			keys.filter(k => {return k['slug'] != p['values'][0][competitorRound]}).forEach(k => {
				var ocfCol = ocf.append('div')
					.attr('class','ocf-col');
				ocfCol.append('div').html('<p class="poll-title">' + k['slug'] + '</p>' + yout(k['url']));
				ocfCol.append('div').attr('class','poll-item-desc').html('<p>'+k['description'] + '</p>');
			})


		} else {
		
			pollsTitle.html('<p>Vote for your favorites: ' + currentPolls['round'] + '</p>');
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
			}
	});

	
}
export default polls;