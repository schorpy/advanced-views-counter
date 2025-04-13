<?php

/**
 * AVC Routes
 *
 *
 * @package AVC\Routes
 */

namespace AVC\Routes;

if (! defined('ABSPATH')) {
	exit;
}

use AVC\Libs\API\Route;


Route::prefix(
	AVC_ROUTE_PREFIX,
	function (Route $route) {


		$route->get('/visit', [\AVC\App\Controllers\Visit::class, 'get_cid']);

		// $route->get('/reports', [\AVC\App\Controllers\Campaigns::class, 'get_targets'], 'admin');

		$route->get('/settings/counts', [\AVC\App\Controllers\Settings::class, 'get_counts'], 'admin');
		$route->get('/settings/display', [\AVC\App\Controllers\Settings::class, 'get_display'], 'admin');
		$route->put('/settings/counts/update/', [\AVC\App\Controllers\Settings::class, 'update_counts'], 'admin');
		$route->put('/settings/display/update/', [\AVC\App\Controllers\Settings::class, 'update_display'], 'admin');


		$route->get('/overview/chart', [\AVC\App\Controllers\Overview::class, 'get_chart'], 'admin');
		// $route->get('/overview/referers', [\AVC\App\Controllers\Overview::class, 'get_referers'], 'admin');
	}
);
