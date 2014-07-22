## D3 Charter - Simple D3.js-powered Charts in Wordpress

This Wordpress plugin allows easy embedding of simple D3.js charts using shortcodes. Copy the folder into your plugins directory and activate it.

The shortcode interface in Wordpress:

    [d3chart title="Chart Title" 
            subtitle="Chart Subtitle"
            type="bar|barHoriz|line"
            margin_left="40"
            data="data-filename.csv"]

The simplicity of the plugin relies on the data files being formatted to the plugin's specifications:

1. The charts for now can only have one series. (Next update will allow for multiple series.)

2. The data must be in a comma separated file.

3. The first row must have column headings and those headings must be x and y, in that order. See the **data** directory of this repository for examples. Obviously, these correspond to the x and y axes. (Note that for horizontal bar charts, x and y are swapped. Again, look at the examples in the **data** folder.

4. If you are doing a line chart, the x column should be a time series. For now, the formatting of the data should be in the mm/dd/yy format. (Next updates will allow you to customize the date format.)

The data file needs to be uploaded into Wordpress's media library. Once uploaded, just make sure to enter the same filename into the *data* field in the shortcode. The plugin does the rest.

### To Do

1. Multi-series data for all three chart types.

2. Customize date formatting for time-series line charts through shortcode parameters.

3. Customize chart sizes through shortcode parameters.

4. Customize colors through shortcode parameters.

5. Configuration pane for plugin allowing to set defaults.

### Will Never Do

1. Pie charts.
