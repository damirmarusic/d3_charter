var hyphenateClass = function (str) {
	var words = str.split(" ");
	return words.join("-");
};

function chart() {
	var margin = {top: 50, right: 40, bottom: 20, left: 40},
		width = 450,
		height = 400;
	var xScale = d3.time.scale();
	var yScale = d3.scale.linear();
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.ticks(5)
		.orient('bottom');
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.ticks(4)
		.orient('left');
	var title = 'Title Placeholder',
		subtitle = 'Subtitle Placeholder';
	var lineStroke1 = '#5d85b8';
	var line = d3.svg.line()
		.x(function(d) { return xScale(d.x); })
		.y(function(d) { return yScale(d.y); });
	var xFormatter = d3.time.format('%-m/%-d/%y').parse;
	var yFormatter = d3.format(',');

	function myLineChart(selection) {

		var calcWidth = width - margin.left - margin.right,
			calcHeight = height - margin.top - margin.bottom;

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

			data.forEach(function (d) {
				d.x = xFormatter(d.x);
				d.y = +d.y;
			});

			xScale
				.range([0, calcWidth])
				.domain(d3.extent(data, function(d) { return d.x; }));

			yScale
				.range([calcHeight, 0])
				.domain([0, d3.max(data, function(d) { return d.y; })]);

			yAxis.tickFormat(yFormatter);

			var bisectX = d3.bisector(function(d) { return d.x; }).left;

			chart.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + calcHeight + ')')
				.call(xAxis);

			var xAxisNodes = d3.select('#' + selection.attr('id') +' .x.axis');

			xAxisNodes.selectAll('text').style({ 'font': '11px Lato' });
			xAxisNodes.selectAll('line').style({
				'fill': 'none',
				'stroke': '#000',
				'shape-rendering': 'crispEdges'
			});
			xAxisNodes.selectAll('path').style({
				'fill': 'none',
				'stroke': '#000',
				'shape-rendering': 'crispEdges'
			});
			
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
				'fill': 'none',
				'stroke': '#000',
				'shape-rendering': 'crispEdges'
			});
			
			chart.append('path')
				.datum(data)
				.attr('class', 'line')
				.attr('d', line);

			d3.select('.line').style({
				'fill': 'none',
				'stroke': lineStroke1,
				'stroke-width': '2.5px'
			});

			var focus = chart.append("g")
			    .attr("class", "d3focus")
			    .style("display", "none");

			focus.append("circle")
			    .attr("r", 3.5);

			focus.append("text")
				.style({ 'font': '11px Lato' })
			    .attr("x", 9)
			    .attr("dy", ".35em");

			chart.append("rect")
			    .attr("class", "d3overlay")
			    .attr("width", calcWidth)
			    .attr("height", calcHeight)
			    .on("mouseover", function() { focus.style("display", null); })
			    .on("mouseout", function() { focus.style("display", "none"); })
			    .on("mousemove", mousemove);

			function mousemove() {
			  var x0 = xScale.invert(d3.mouse(this)[0]),
			      i = bisectX(data, x0, 1),
			      d0 = data[i - 1],
			      d1 = data[i],
			      d = x0 - d0.x > d1.x - x0 ? d1 : d0;
			  focus.attr("transform", "translate(" + xScale(d.x) + "," + yScale(d.y) + ")");
			  focus.select("text").text(yFormatter(d.y));
			}
		});
	}

	myLineChart.title = function(_) {
		if (!arguments.length) {
			return title;
		}
		title = _;
		return myLineChart;
	};

	myLineChart.subtitle = function(_) {
		if (!arguments.length) {
			return subtitle;
		}
		subtitle = _;
		return myLineChart;
	};

	myLineChart.width = function(_) {
		if (!arguments.length) {
			return width;
		}
		width = _;
		return myLineChart;
	};

	myLineChart.height = function(_) {
		if (!arguments.length) {
			return height;
		}
		height = _;
		return myLineChart;
	};

	myLineChart.marginLeft = function(_) {
		if (!arguments.length) {
			return margin.left;
		}
		margin.left = _;
		return myLineChart;
	};

	myLineChart.yFormat = function(_) {
		if (!arguments.length) {
			return yFormatter;
		}
		yFormatter = _;
		return myLineChart;
	};

	myLineChart.xFormat = function(_) {
		if (!arguments.length) {
			return xFormatter;
		}
		xFormatter = d3.time.format(_).parse;
		return myLineChart;
	};

	return myLineChart;


}