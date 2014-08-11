var hyphenateClass = function (str) {
	var words = str.split(" ");
	return words.join("-");
};

function chart() {
	var margin = {top: 50, right: 40, bottom: 40, left: 40},
		width = 450,
		height = 480;
	var dataKeys,
		seriesData = [];
	var xScale = d3.time.scale();
	var xScaleDomain = [];
	var yScale = d3.scale.linear();
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.ticks(5)
		.orient('bottom');
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.ticks(4)
		.orient('left');
	var keyPosition = 'bottom-left',
		keyOffsetX,
		keyOffsetY;
	var title = 'Title Placeholder',
		subtitle = 'Subtitle Placeholder';
	var line = d3.svg.line()
		.x(function(d) { return xScale(d.x); })
		.y(function(d) { return yScale(d.y); });
	var xFormatter = d3.time.format('%-m/%-d/%y').parse;
	var yFormatter = d3.format(',');
	var color = d3.scale.ordinal()
          .range(['#5d85b8','#D0021B','#D8D118','#616B31','#96DAD8']);

	function myLineChart(selection) {

		var calcWidth = width - margin.left - margin.right,
			calcHeight = height - margin.top - margin.bottom;

		var svg = selection.append('svg')
			.attr('class', 'cls-' + selection.attr('id'))
			.attr('width', calcWidth + margin.left + margin.right)
			.attr('height', calcHeight + margin.top + margin.bottom);

		var titlearea = svg.append('text')
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
		
		selection.each(function(data) {

			dataKeys = d3.keys(data[0]).filter(function(key){ return key !== 'Date'; });

			color.domain(dataKeys);

			seriesData = dataKeys.map(function(name) {
				return {
					name: name,
					values: data.map(function(d){
						return {
							x: xFormatter(d.Date),
							y: +d[name]
						};
					})
				};
			});

			data.map(function(d) { xScaleDomain.push(xFormatter(d.Date)); });
			
			xScale
				.range([0, calcWidth])
				.domain(d3.extent(xScaleDomain));

			yScale
				.range([calcHeight, 0])
				.domain([0, d3.max(seriesData, function(d) {
					return d3.max(d.values, function(c) {
						return c.y;
					});
				})]);

		});

		switch (keyPosition) {
			case 'bottom-right':
				keyOffsetX = 3*(calcWidth + margin.left + margin.right)/4;
				keyOffsetY = calcHeight;
				break;
			case 'bottom-left':
				keyOffsetX = (calcWidth + margin.left + margin.right)/4;
				keyOffsetY = calcHeight;
				break;
			case 'top-right':
				keyOffsetX = 3*(calcWidth + margin.left + margin.right)/4;
				keyOffsetY = calcHeight - (calcHeight/1.2);
				break;
			case 'top-left':
				keyOffsetX = (calcWidth + margin.left + margin.right)/4;
				keyOffsetY = calcHeight - (calcHeight/1.2);
				break;
			default:
				keyOffsetX = 3*(calcWidth + margin.left + margin.right)/4;
				keyOffsetY = calcHeight;
				break;
		}

		console.log(keyPosition);

		var key = svg.append('g')
			.attr('class', 'key');

		var chartkey = key.append('text')
			.attr('y', keyOffsetY)
			.attr('class', 'd3chart-key');

		dataKeys.forEach(function(series, i){
			key.append('rect')
				.attr('y', keyOffsetY + (i * 15))
				.attr('x', keyOffsetX - 15)
				.attr('height', 10)
				.attr('width', 10)
				.style('fill', color(series));

			chartkey.append('tspan')
				.attr('alignment-baseline', 'hanging')
				.attr('x', keyOffsetX)
				.attr('dy', i * 15)
				.attr('class', series + '-key key')
				.text(series);
		});

		plot = svg.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		yAxis.tickFormat(yFormatter);

		plot.append('g')
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
		
		plot.append('g')
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

		var series = plot.selectAll('.series')
			.data(seriesData)
			.enter().append('g')
			.attr('class', 'series');

		series.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function (d) { return color(d.name); });

		// To Do: Restore mouseover functionality in line chart.
		//var focus = plot.append("g")
		//    .attr("class", "d3focus")
		//    .style("display", "none");
		//focus.append("circle")
		//    .attr("r", 3.5);
		//focus.append("text")
		//	.style({ 'font': '11px Lato' })
		//    .attr("x", 9)
		//    .attr("dy", ".35em");
		//plot.append("rect")
		//    .attr("class", "d3overlay")
		//    .attr("width", calcWidth)
		//    .attr("height", calcHeight)
		//    .on("mouseover", function() { focus.style("display", null); })
		//    .on("mouseout", function() { focus.style("display", "none"); })
		//    .on("mousemove", mousemove);
		//function mousemove() {
		//  var x0 = xScale.invert(d3.mouse(this)[0]),
		//      i = bisectX(data, x0, 1),
		//      d0 = data[i - 1],
		//      d1 = data[i],
		//      d = x0 - d0.x > d1.x - x0 ? d1 : d0;
		//  focus.attr("transform", "translate(" + xScale(d.x) + "," + yScale(d.y) + ")");
		//  focus.select("text").text(yFormatter(d.y));
		//}
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

	myLineChart.keyPosition = function(_) {
		if (!arguments.length) {
			return keyPosition;
		}
		keyPosition = _;
		return myLineChart;
	};

	return myLineChart;


}