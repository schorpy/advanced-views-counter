<?php

namespace Advico\Core;

if (! defined('ABSPATH')) {
	exit;
}

use Advico\App\Traits\Singleton;
use Advico\Libs\API\Config;

/**
 * Class API
 *
 * Initializes and configures the API for the Popzy.
 *
 * @package Advico\Core
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
		Config::set_route_file(ADVICO_PLUGIN_DIR . '/inc/Routes/Api.php')
			->set_namespace('Advico\Api')
			->init();
	}
}
