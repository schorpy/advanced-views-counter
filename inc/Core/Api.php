<?php

namespace AVC\Core;

if (! defined('ABSPATH')) {
	exit;
}

use AVC\App\Traits\Singleton;
use AVC\Libs\API\Config;

/**
 * Class API
 *
 * Initializes and configures the API for the Popzy.
 *
 * @package AVC\Core
 */
class API
{

	use Singleton;

	/**
	 * Initializes the API for the Popzy.
	 *
	 * @return void
	 */
	public function init()
	{
		Config::set_route_file(AVC_PLUGIN_DIR . '/inc/Routes/Api.php')
			->set_namespace('AVC\Api')
			->init();
	}
}
