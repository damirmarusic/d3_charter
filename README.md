## D3 Charter - Simple D3.js-powered Charts in Wordpress

This Wordpress plugin allows easy embedding of simple D3.js charts using shortcodes. Copy the folder into your plugins directory and activate it.

The shortcode interface in WordPress:

    [d3chart title="Chart Title" 
            subtitle="Chart Subtitle"
            type="bar|barHoriz|line" 
            margin_left="40"
            chart_width="450"
            chart_height="400"
            data="data-filename.csv"]

The simplicity of the plugin relies on the data files being formatted to the plugin's specifications:

1. The bar charts for now can only have one series. Line charts can have multiple data series. (Multiple series in bar charts coming soon.)
2. The data must be in a comma separated file.
3. For bar charts, the first row must have column headings and those headings must be x and y, in that order. See the **data** directory of this repository for examples. Obviously, these correspond to the x and y axes. Note that for horizontal bar charts, x and y are swapped.
4. For line charts, the first row must have column headings, and the first column must be called 'Date' and include the time series information. The subsequent columns can be called whatever you like, and they represent subsequent data series. Again, look at the examples in the **data** folder. For now, the formatting of the data should be in the mm/dd/yy format. (A future updates will allow you to customize the date format with a shortcode.)
5. The data file needs to be uploaded into Wordpress's media library. Once uploaded, just make sure to enter the same filename into the 'data' field in the shortcode. The plugin does the rest. *Note: if you re-upload new data for an old post, the link may break. The plugin relies on the post's publish date to keep the data in sync.*
