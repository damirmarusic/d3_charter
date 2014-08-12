var hyphenateClass = function (str) {
	var words = str.split(" ");
	return words.join("-");
};

function chart() {
	var margin = {top: 50, right: 40, bottom: 20, left: 40},
		width = 450,
		height = 400;
	var yScale = d3.scale.ordinal();
	var xScale = d3.scale.linear();
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.ticks(4)
		.orient('left');
	var title = 'Title Placeholder',
		subtitle = 'Subtitle Placeholder';
	var xFormatter = d3.format(',');
	var barFill = '#5d85b8';
	var keyPosition = 'bottom-left',
		keyOffsetX,
		keyOffsetY;


	function myBarChart(selection) {

		var calcWidth = width - margin.left - margin.right,
			calcHeight = height - margin.top - margin.bottom;

		var dataKeys;

		var chart = selection.append('svg')
			.attr('class', 'cls-' + selection.attr('id'))
			.attr('width', calcWidth + margin.left + margin.right)
			.attr('height', calcHeight + margin.top + margin.bottom);

		var titlearea = chart.append('text')
			.attr('y', '1.2em');
		
		titlearea.append('tspan')
			.attr('class', 'd3chart-title')
			.attr('x', (calcWidth + margin.left + margin.right)/2)
			.text(title);

		titlearea.append('tspan')
			.attr('class', 'd3chart-subtitle')
			.attr('dy', '1.2em')
			.attr('x', (calcWidth + margin.left + margin.right)/2)
			.text(subtitle);
		
		chart = chart.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
		
		selection.each(function(data) {

			dataKeys = d3.keys(data[0]);

			yScale
				.rangeRoundBands([0, calcHeight], 0.1)
				.domain(data.map(function(d) { return d[dataKeys[1]]; } ));

			xScale
				.range([0, calcWidth])
				.domain([0, d3.max(data, function(d) { return +d[dataKeys[0]]; })]);

			chart.append('g')
				.attr('class', 'y axis')
				.call(yAxis);

			var yAxisNodes = d3.select('#' + selection.attr('id') + ' .y.axis');

			yAxisNodes.selectAll('text').style({ 'font': '11px Lato' });
			yAxisNodes.selectAll('line').style({
				'fill': 'none',
				'stroke': '#000',
				'shape-rendering': 'crispEdges'
			});
			yAxisNodes.selectAll('path').style({
				'display': 'none',
				'fill': 'none',
				'stroke': '#000',
				'shape-rendering': 'crispEdges'
			});

			chart.selectAll('.bar')
				.data(data)
				.enter().append('rect')
				.attr('class', 'bar')
				.attr('y', function(d) { return yScale(d[dataKeys[1]]); })
				.attr('x', function(d) { return 0; })
				.attr('width', function(d) { return xScale(+d[dataKeys[0]]); })
				.attr('height', yScale.rangeBand())
				.attr('fill', barFill)
				.on('mouseover', function(d){
					var yPosition = parseFloat(d3.select(this).attr('y')) + yScale.rangeBand() / 2;
					var xPosition = parseFloat(d3.select(this).attr('x')) + d3.select(this).attr('width') - 14;
					chart.append('text')
						.attr('id', 'tooltip')
						.attr('alignment-baseline', 'middle')
						.attr('pointer-events', 'none')
						.attr('x', xPosition)
						.attr('y', yPosition)
						.attr('text-anchor', 'middle')
						.attr('font-family', 'Lato')
						.attr('font-size', '11px')
						.attr('fill', 'black')
						.text(xFormatter(+d[dataKeys[0]]));
					d3.select(this)
						.transition()
						.duration(100)
						.attr('fill', 'orange');
				})
				.on('mouseout', function(){
					d3.select('#tooltip').remove();
					d3.select(this)
						.transition()
						.duration(100)
						.attr('fill', barFill);
				});

		});

	}

	myBarChart.title = function(_) {
		if (!arguments.length) {
			return title;
		}
		title = _;
		return myBarChart;
	};

	myBarChart.subtitle = function(_) {
		if (!arguments.length) {
			return subtitle;
		}
		subtitle = _;
		return myBarChart;
	};

	myBarChart.width = function(_) {
		if (!arguments.length) {
			return width;
		}
		width = _;
		return myBarChart;
	};

	myBarChart.height = function(_) {
		if (!arguments.length) {
			return height;
		}
		height = _;
		return myBarChart;
	};

	myBarChart.marginLeft = function(_) {
		if (!arguments.length) {
			return margin.left;
		}
		margin.left = _;
		return myBarChart;
	};

	myBarChart.xFormat = function(_) {
		if (!arguments.length) {
			return xFormatter;
		}
		xFormatter = _;
		return myBarChart;
	};

	myBarChart.keyPosition = function(_) {
		if (!arguments.length) {
			return keyPosition;
		}
		keyPosition = _;
		return myBarChart;
	};

	return myBarChart;

}