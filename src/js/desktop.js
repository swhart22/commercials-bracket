//import _ from 'lodash';
import '../css/nbcotsbase.css';
import * as d3 from 'd3';
import colors from './colors.js';
import lines from './lines.js';
import sheetsy from 'sheetsy';
const {urlToKey, getWorkbook, getSheet } = sheetsy;
import metadata from './proj-config.js';
import SVG from './assets/ots-bracket-tool.svg';
import SVG from './assets/ots-bracket-tool.svg';

function desktop(data, keys){
	
	//the actual graphic
	var width = parseInt(d3.select('#container').style("width"));
	var height = parseInt(d3.select('#container').style("height"));
	var margin = {left:20, top:20, right:10, bottom:10};
	var cHeight = height - margin.top - margin.bottom;
	var cWidth = width - margin.left - margin.right;
	var container = d3.select('#container');
	var colWidth = cWidth / 7;

	var svg2 = container
		.append('svg')
		.attr("width",width)
		.attr('height',height);

	var g2 = svg2
		.append('g')
		.attr('transform','translate('+margin.left+','+margin.top+')');

	var imgsvg = g2.append('svg:image')
		.attr('xlink:href', SVG)
		.attr('width',width)
		.attr('height',height)
		.attr('x',10)
		.attr('y',10);

	var chunk = cHeight / (data.length / 2);
	var padding = 60;

	var polls16 = d3.nest()
		.key(d => {return 'poll16-' + d['Poll ID - Round 1']})
		.entries(data);

	var round1competitors = d3.nest()
		.key(d => {return d['Competitor - Round 1']})
		.entries(data);

	var round2competitors = d3.nest()
		.key(d => {return d['Competitor - Round 2']})
		.entries(data.filter(d => {return d['Competitor - Round 2'] != ''}));

	var round3competitors = d3.nest()
		.key(d => {return d['Competitor - Round 3']})
		.entries(data.filter(d => {return d['Competitor - Round 3'] != ''}));

	var round4competitors = d3.nest()
		.key(d => {return d['Competitor - Round 4']})
		.entries(data.filter(d => {return d['Competitor - Round 4'] != ''})); 

	var winnerRound = d3.nest()
		.key(d => {return d['Result - Round 4 (winner)']})
		.entries(data.filter(d => {return d['Result - Round 4 (winner)'] != ''}));

	var drawLine = d3.line()
		.curve(d3.curveBundle.beta(1))
		.x(d => {return d.x})
		.y(d => {return d.y});

	var lineWidth = 150;

	var scaleFactor = colWidth / lineWidth;

	var fx = chunk / 2;

	function round1(){

		container.selectAll('.round1-labels')
			.data(d3.nest().key(d => {return d['Competitor - Round 1']}).entries(data))
			.enter()
			.append('div')
			.attr('class', d => {
				if(d['values'][0]['Result - Round 1'] == 'LOSE'){
					return 'labels round1-labels loselabel';
				}
				else if (d['values'][0]['Result - Round 1'] == 'WIN'){
					return 'labels round1-labels winlabel';
				}
				else {
					return 'labels round1-labels loselabel';
				}
			})
			.style('top', (d, i) => {
				var ypos = chunk * (i % (data.length / 2)) + 25;
				return ypos + 'px';
			})
			.style('left',(d, i) => {
				if (i <= 7){
					return 0 + 'px';
				}
				else{
					return 'auto';
				}
			})
			.style('right', (d, i) => {
				if (i <= 7){
					return 'auto';
				}
				else{
					return '10px';
				}
			})
			.style('border-color',colors['black']['003'])
			.html(d => {return '<span class="label-pos">'+ d.key + '</span>';});

	};

	function labelclass(d){
				if(d == 'LOSE'){
					return 'labels round2-labels loselabel';
				}
				else if (d == 'WIN'){
					return 'labels round2-labels winlabel';
				}
				else {
					return 'labels round2-labels loselabel';
				}

			};
	function round2(){
		round1();
		
		var round2data = round2competitors;
		
		//LENGTH OF COLUMN 'Round 2 - Competitors' MUST == 8 FOR ROUND 2 TO ACTIVATE
		var round2labels = container.selectAll('.round2-label')
			.data(round2data)
			.enter()
			.append("div")
			.text(d => {return d['key']})
			//.text(d => {return d['Result - Round 2']})
			.attr('class', d=> {return labelclass(d['values'][0]['Result - Round 2'])})
			.style('top', (d, i) => {
				var ypos = (chunk * 2) * (i % (round2data.length / 2)) + 15 + (chunk / 2);
				return ypos + 'px';
			})
			.style('left',(d, i) => {
				if (i < (round2data.length / 2)){
					return colWidth + 'px';
				}
				else{
					return 'auto';
				}
			})
			.style('right', (d, i) => {
				if (i < (round2data.length / 2)){
					return 'auto';
				}
				else{
					return colWidth + 'px';
				}
			});
	};
	function round3(){
		//round1();
		round2();
		var round3data = round3competitors;

		console.log(round2competitors);
		
		//LENGTH OF COLUMN 'Round 3 - Competitors' MUST == 8 FOR ROUND 3 TO ACTIVATE
		container.selectAll('.round3-label')
			.data(round3data)
			.enter()
			.append("div")
			.text(d => {return d['key']})
			.attr('class',d=> {return labelclass(d['values'][0]['Result - Round 3'])})
			.style('top', (d, i) => {
				var ypos = (chunk * 4) * (i % (round3data.length / 2)) + 18 + ((3*chunk) / 2);
				return ypos + 'px';
			})
			.style('left',(d, i) => {
				if (i < (round3data.length / 2)){
					return (colWidth * 2) + 'px';
				}
				else{
					return 'auto';
				}
			})
			.style('right', (d, i) => {
				if (i < (round3data.length / 2)){
					return 'auto';
				}
				else{
					return (colWidth * 2) + 'px';
				}
			});

	};
	function round4(){
		round3();
		var round4data = round4competitors;

		container.selectAll('.round4-label')
			.data(round4data)
			.enter()
			.append("div")
			.text(d => {return d['key']})
			.attr('class', d => {
				if(d['values'][0]['Result - Round 4 (winner)'] == 'LOSE'){
					return 'labels round3-labels loselabel';
				}
				else if (d['values'][0]['Result - Round 4 (winner)'] == 'WIN'){
					return 'labels round3-labels winlabel';
				}
				else {
					return 'labels round3-labels loselabel';
				}
			})
			.style('top', (d, i) => {
				var ypos = cHeight / 2;
				if (i == 0){
					return (ypos - 50) + 'px';
				}
				else {
					return ypos + 30 + 'px';
				}
				
			})
			.style('left',(d, i) => {
				if (i < (round4data.length / 2)){
					return ((colWidth * 3)- 50)+ 'px';
				}
				else{
					return 'auto';
				}
			})
			.style('right', (d, i) => {
				if (i < (round4data.length / 2)){
					return 'auto';
				}
				else{
					return ((colWidth * 3) - 50) + 'px';
				}
			});

	};
	function winner(){
		round4();
		container.selectAll('.winner-label')
			.data(winnerRound.filter(w => {return w.key == 'WIN'}))
			.enter()
			.append('div')
			.text(d => {return d.values[0]['Competitor - Round 4']})
			.attr('class','labels winnerlabel')
			.style('top', 80 + 'px')
			.style('left', 408 + 'px');

	};
	function checkRound(){
		
		if (round2competitors.length == 8 && round3competitors.length != 4){
			round2();
		}
		else if (round3competitors.length == 4 && round4competitors.length != 2){
			round3();
			
		}
		else if (round4competitors.length == 2 && winnerRound.length != 2){
			round4();
		}
		else if (winnerRound.length == 2){
			winner();
		}
		else{
			round1();
		}
	}
	
	checkRound();

d3.selectAll('.winpath')
		.style('stroke', colors['black']['003'])
		.style('stroke-dasharray','2,2')
		.style('stroke-width',0.5);

	d3.selectAll('.losepath')
		.style('stroke', colors['black']['003'])
		.style('stroke-dasharray','2,2')
		.style('stroke-width',0.5);

	d3.selectAll('.winlabel')
		.style('font-weight', 700)
		//.style('border-style', 'solid')
		.style('color', colors['blue']['001'])
		.style('border-color', colors['blue']['001']);

	d3.selectAll('.winnerlabel')
		.style('font-weight', 700)
		//.style('border-style', 'solid')
		.style('color', colors['blue']['001'])
		.style('border-color', colors['blue']['002']);

	d3.selectAll('.loselabel')
		.style('color', colors['black']['003'])
		.style('border-color', colors['black']['005']);	
};

export default desktop;
