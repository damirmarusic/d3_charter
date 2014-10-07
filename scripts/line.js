var hyphenateClass = function (str) {
	var words = str.split(" ");
	return words.join("-");
};

function chart() {
	var margin = {top: 50, right: 40, bottom: 30, left: 40},
		width = 400,
		height = 310;
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
	var title = '',
		subtitle = '';
	var bisectDate = d3.bisector(function(d) { return d.Date; }).left;
	var line = d3.svg.line()
		.defined(function(d) { return !isNaN(d.y); }) // Allow for discontinuous data
		.x(function(d) { return xScale(d.x); })
		.y(function(d) { return yScale(d.y); });
	var xFormatter = d3.time.format('%-m/%-d/%y').parse;
	var yFormatter = d3.format('d');
	var color = d3.scale.ordinal()
    	.range(['#5d85b8','#D0021B','#D8D118','#616B31','#96DAD8']);
    var chartCredit = '',
    	yAxisLabel = '',
    	yAxisLabelPosition = 'top';

	function myLineChart(selection) {
		margin.top = title === '' ? 0 : 35;

		width = width - margin.left - margin.right;
		height = height - margin.top - margin.bottom;

		var svg = selection.append('svg')
			.attr('class', 'cls-' + selection.attr('id'))
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);

		var titlearea = svg.append('text')
			.attr('y', '1.2em')
			.attr('class', 'd3chart-title')
			.attr('x', margin.left)
			.text(title);

		selection.append('span')
			.attr('class', 'd3chart-subtitle')
			.style('margin-left', margin.left+'px')
			.text(subtitle);

		switch (keyPosition) {
			case 'bottom-right':
				keyOffsetX = 3*width/4;
				keyOffsetY = height - (height/6);
				break;
			case 'bottom-left':
				keyOffsetX = width/6;
				keyOffsetY = height - (height/6);
				break;
			case 'top-right':
				keyOffsetX = 3*width/4;
				keyOffsetY = height - (5*height/6);
				break;
			case 'top-left':
				keyOffsetX = width/6;
				keyOffsetY = height - (5*height/6);
				break;
			default:
				keyOffsetX = 3*width/4;
				keyOffsetY = height - (height/6);
				break;
		}
		
		selection.each(function(data) {

			data.forEach(function(d) {
                d.Date = xFormatter(d.Date);
            });

			dataKeys = d3.keys(data[0]).filter(function(key){ return key !== 'Date'; });

			color.domain(dataKeys);

			seriesData = dataKeys.map(function(name) {
				return {
					name: name,
					values: data.map(function(d){
						return {
							x: d.Date,
							y: +d[name]
						};
					})
				};
			});

			data.map(function(d) { xScaleDomain.push(d.Date); });
			
			xScale
				.range([0, width])
				.domain(d3.extent(xScaleDomain));

			yScale
				.range([height, 0])
				.domain([d3.min(seriesData, function(d) {
					return d3.min(d.values, function(c) {
						return c.y;
					});
				}), d3.max(seriesData, function(d) {
					return d3.max(d.values, function(c) {
						return c.y;
					});
				})]).nice();

			plot = svg.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			var key = plot.append('g')
				.attr('class', 'key');

			var chartkey = key.append('text')
				.attr('y', keyOffsetY - 15)
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
					.attr('dy', 15)
					.attr('class', series + '-key key')
					.text(series);
			});
	
			yAxis.tickFormat(yFormatter);
	
			plot.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + height + ')')
				.call(xAxis);
			
			var yAxisRendered = plot.append('g')
				.attr('class', 'y axis')
				.call(yAxis);

			if (yAxisLabel) {
				var xAttributer = yAxisLabelPosition === 'top' ? 0 : -height + 10;
				var textOrienter = yAxisLabelPosition === 'top' ? 'end' : 'start';
				yAxisRendered.append("text")
                	.attr("transform", "rotate(-90)")
                	.attr("y", 6)
                	.attr("x", xAttributer)
                	.attr("dy", ".71em")
                	.style("text-anchor", textOrienter)
                	.text(yAxisLabel);
			}
	
			var series = plot.selectAll('.series')
				.data(seriesData)
				.enter().append('g')
				.attr('class', 'series');
	
			series.append("path")
				.attr("class", "line")
				.attr("d", function(d) { return line(d.values); })
				.style("stroke", function (d) { return color(d.name); });
	
			var focus = plot.selectAll(".focus")
			    .data(dataKeys)
			    .enter().append("g")
			    .attr("class", "focus")
			    .style("display", "none");
	
			focus.append("circle")
				.attr("r", 4.5);
	
			focus.append("text")
				.attr("x", 9)
				.attr("dy", ".35em");
	
			function mousemove() {
			    var x0 = xScale.invert(d3.mouse(this)[0]),
			        i = bisectDate(data, x0, 1),
			        d0 = data[i - 1],
			        d1 = data[i],
			        d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
			    focus.attr("transform", function(dataKeys) {
			        return "translate(" + xScale(d.Date) + "," + yScale(d[dataKeys]) + ")" ;
			    });
			    focus.select("text").text(function(dataKeys){
			        return yFormatter(d[dataKeys]);
			    });
			}
	
			plot.append("rect")
			    .attr("class", "overlay")
			    .attr("width", width)
			    .attr("height", height)
			    .on("mouseover", function() { focus.style("display", null); })
			    .on("mouseout", function() { focus.style("display", "none"); })
			    .on("mousemove", mousemove);


			if (chartCredit) {
				svg.append("g")
				    .attr("class", "d3credit")
				    .append("text")
				    .attr("y", height + margin.top + margin.bottom)
				    .attr("x", width + margin.left + margin.right)
				    .attr("text-anchor", "end")
				    .text(chartCredit);
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

	myLineChart.marginBottom = function(_) {
		if (!arguments.length) {
			return margin.bottom;
		}
		margin.bottom = _;
		return myLineChart;
	};

	myLineChart.yFormat = function(_) {
		if (!arguments.length) {
			return yFormatter;
		}
		yFormatter = d3.format(_);
		return myLineChart;
	};

	myLineChart.dateFormat = function(_) {
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

	myLineChart.chartCredit = function(_) {
		if (!arguments.length) {
			return chartCredit;
		}
		chartCredit = _;
		return myLineChart;
	};

	myLineChart.yAxisLabel = function(_) {
		if (!arguments.length) {
			return yAxisLabel;
		}
		yAxisLabel = _;
		return myLineChart;
	};

	myLineChart.yAxisLabelPosition = function(_) {
		if (!arguments.length) {
			return yAxisLabelPosition;
		}
		yAxisLabelPosition = _;
		return myLineChart;
	};

	return myLineChart;


}