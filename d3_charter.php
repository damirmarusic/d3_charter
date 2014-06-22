<?php
/*
Plugin Name: Simple D3 Chart Shortcodes
Plugin URI: https://github.com/damirmarusic/d3_charter
Description: Allows easy embedding of simple D3.js charts using shortcodes.
Version: 1.0
Author: Damir Marusic
Author URI: https://github.com/damirmarusic/
License: GPL2
*/

class D3_Charter_Plugin {

	private $defaults = array(
		'title' => 'Title Placeholder',
		'subtitle' => 'Subtitle Placeholder',
		'type' => 'bar',
		'data' => ''
	);

	function enable() {
		add_shortcode('d3chart', array($this, 'render'));
	}
	
	function disable() {
		remove_shortcode('d3chart');
	}

	function render($atts) {
		$params = shortcode_atts($this->defaults, $atts); // Defaults or user-provided

		if ($params['data'] == '') {

			return 'No Data File Supplied.';

		} else {

			// Stylesheet
			$plugindir = plugin_dir_url(__FILE__);
			$html = '<link rel="stylesheet" type="text/css" href="'.$plugindir.'css/style.css">';

			// Create Divs and Include D3 script from Bostock.
			$divname = preg_replace("/[^\w]+/", "-", strtolower($params['title'])); // (hopefully) unique name for div			
			$html .= '<div class="d3chart" id="'.$divname.'"></div>';
			$html .= '<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>';

			// Pick a chart type
			switch ($params['type']) {
				case 'bar':
					$html .= '<script src="'.$plugindir.'scripts/bar.min.js" charset="utf-8"></script>';
					break;
				case 'barHoriz':
					$html .= '<script src="'.$plugindir.'scripts/barHoriz.min.js" charset="utf-8"></script>';
					break;
				case 'line':
					$html .= '<script src="'.$plugindir.'scripts/line.min.js" charset="utf-8"></script>';
					break;
				default:
					$html .= '<script src="'.$plugindir.'scripts/bar.min.js" charset="utf-8"></script>';
			}

			// Add the code calling the chart drawing Javascript
			$chart_var = preg_replace("/[^\w]+/", "", strtolower($params['title'])); // (hopefully) unique name for js vars
			$uploaddir = wp_upload_dir();
			$datafile = $uploaddir['url'].'/'.$params['data'];
			$html .= <<<EOT
			<script type="text/javascript">
				var $chart_var = chart()
					.title('$params[title]')
					.subtitle('$params[subtitle]');	
				d3.csv('$datafile', function(error, data){
					d3.select('#$divname')
						.datum(data)
						.call($chart_var);
				});
			</script>
EOT;
			return $html;
		}
	}
}

$d3_charter = new D3_Charter_Plugin;

$d3_charter->enable();

?>
