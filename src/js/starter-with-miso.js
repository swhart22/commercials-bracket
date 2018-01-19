

var ds;
var totalEntries;
var allData = [];


function init() {
	//console.log("ready");

	loadData(1);

		
}


function loadData(which) {

	//LOAD DATA WITH MISO
	ds = new Miso.Dataset({
  		importer : Miso.Dataset.Importers.GoogleSpreadsheet,
  		parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
  		//key : "1sXZ17-t702XuFOGj_OusfhgyW5Kj-o5_OCVJgNOXlzI", //CHANGE TO YOUR KEY HERE
  		key : '1R8A_X3mQl872Cwroc947SAtFyw7xyqW3m_BJNU3sLjM',
  		worksheet : which
	});

	ds.fetch({ 
	  success : function() {
	     console.log("So say we all!");
	     parseData();
	  },
	  error : function() {
	   //console.log("What the frak?");
	  }
	});

}

function parseData() {
	var $len = ds.column("Seed").data.length;
	totalEntries = $len;
	
	//LOOP THRU GOOGLE DATA AND PUT INTO OBJECT
	for (var j=0; j<$len; j++) {
		var counter = ds.column("Seed").data[j];
		allData[counter] = {
								seed: ds.column("Seed").data[j],
								competitor: ds.column("Competitor").data[j],
								pollid: ds.column("Poll ID").data[j],
								res16: ds.column("Result Final 16").data[j],
								res8: ds.column("Result Final 8").data[j],
								res4: ds.column("Result Final 4").data[j],
								res2: ds.column("Result Final 2").data[j],
								res1: ds.column("Result Winner").data[j]
						    };
	}

	//do something 
	console.log(allData);

	if (allData.length >= 17 && allData.length < 33) {
		allData = allData.slice(1, 17);
		render16(allData);
	}
	else if (allData.length >= 33){
		allData = allData.slice(1, 33)
		render32(allData);
	}
	
}	

function render16(allData){
	//console.log(allData);

	render(allData);
};
function render32(allData){
	//console.log(allData);
};
function render(allData){
	console.log(allData);
	var width = parseInt(d3.select('#container').style("width"));
	var height = parseInt(d3.select('#container').style("height"));
	var margin = {left:10, top:10, right:10, bottom:10};
	var cHeight = height - margin.top - margin.bottom;
	var cWidth = width - margin.left - margin.right;
	var svg = d3.select("#container")
		.append('svg')
		.attr("width",width)
		.attr('height',height);

	var g = svg
		.append('g')
		.attr('transform','translate('+margin.left+','+margin.top+')');

	var chunk = cHeight / (allData.length / 2);
	var padding = 25;

	var seeds = g
		.selectAll('.seed')
		.data(allData)
		.enter()
		.append('g')
		.attr('class','seed')
		.attr('transform',(d,i)=> {
			
			var ypos = chunk * (i % (allData.length / 2));
			if (i < (allData.length / 2)){
				return 'translate(0,' + ypos + ')';
			}
			else{
				return 'translate('+(cWidth - 50) + ',' + ypos + ')';
			}
		});

	seeds.append('circle')
		.attr('r', (chunk - padding) / 2)
		.attr('cx', 25)
		.attr('cy', 25)
		.attr('stroke','#000')
		.attr('stroke-width',3)
		.attr('fill','none');

	seeds.append('text')
		.attr('x', ((chunk - padding)) + 8)
		.attr('y', (chunk - padding) / 2)
		.attr('class','seedname')
		.text(d => {return d['competitor'];});

};

$(document).ready(function(){
	init();
});