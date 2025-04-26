<?php

/**
 * Advico Routes
 *
 *
 * @package Advico\Routes
 */

namespace Advico\Routes;

if (! defined('ABSPATH')) {
	exit;
}

use Advico\Libs\API\Route;


Route::prefix(
	ADVICO_ROUTE_PREFIX,
	function (Route $route) {


		// Allow public POST
		$route->post('/visit', [\Advico\App\Controllers\Visit::class, 'update_views'], true);
		$route->post('/views', [\Advico\App\Controllers\Visit::class, 'get_views'], true);

		// Only admins can access
		$route->get('/settings/counts', [\Advico\App\Controllers\Settings::class, 'get_counts'], 'admin');
		$route->get('/settings/display', [\Advico\App\Controllers\Settings::class, 'get_display'], 'admin');
		$route->put('/settings/counts/update/', [\Advico\App\Controllers\Settings::class, 'update_counts'], 'admin');
		$route->put('/settings/display/update/', [\Advico\App\Controllers\Settings::class, 'update_display'], 'admin');


		$route->get('/overview/chart', [\Advico\App\Controllers\Overview::class, 'get_chart'], 'admin');
		$route->get('/overview/posts', [\Advico\App\Controllers\Overview::class, 'get_posts'], 'admin');
		$route->get('/overview/referers', [\Advico\App\Controllers\Overview::class, 'get_referers'], 'admin');
	}
);
