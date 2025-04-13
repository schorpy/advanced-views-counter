<?php

declare(strict_types=1);

namespace AVC\Assets;

if (! defined('ABSPATH')) {
	exit;
}

use AVC\Core\Template;
use AVC\App\Traits\Singleton;
use AVC\Libs\Assets;

/**
 * Class Admin
 *
 * Handles admin functionalities for the avc.
 *
 * @package AVC\Admin
 */
class Admin
{

	use Singleton;

	/**
	 * Script handle for AVC.
	 */
	const HANDLE = 'avc-plugin';

	/**
	 * JS Object name for AVC.
	 */
	const OBJ_NAME = 'avc_plugin';

	/**
	 * Development script path for AVC.
	 */
	const DEV_SCRIPT = 'resources/js/admin/main.jsx';

	/**
	 * List of allowed screens for script enqueue.
	 *
	 * @var array
	 */
	private $allowed_screens = array(
		'toplevel_page_advanced-views-counter',
	);

	/**
	 * Frontend bootstrapper.
	 *
	 * @return void
	 */
	public function bootstrap()
	{
		add_action('admin_enqueue_scripts', array($this, 'enqueue_script'));
	}

	/**
	 * Enqueue script based on the current screen.
	 *
	 * @param string $screen The current screen.
	 */
	public function enqueue_script($screen)
	{
		$current_screen     = $screen;
		// $template_file_name = Template::FRONTEND_TEMPLATE;

		// if (! is_admin()) {
		// 	$template_slug = get_page_template_slug();
		// 	if ($template_slug) {

		// 		if ($template_slug === $template_file_name) {
		// 			array_push($this->allowed_screens, $template_file_name);
		// 			$current_screen = $template_file_name;
		// 		}
		// 	}
		// }

		if (in_array($current_screen, $this->allowed_screens, true)) {
			Assets\enqueue_asset(
				AVC_PLUGIN_DIR . '/assets/admin/dist',
				self::DEV_SCRIPT,
				$this->get_config()
			);
			wp_localize_script(self::HANDLE, self::OBJ_NAME, $this->get_data());
		}
	}

	/**
	 * Get the script configuration.
	 *
	 * @return array The script configuration.
	 */
	public function get_config()
	{
		return array(
			'dependencies' => array('react', 'react-dom'),
			'handle'       => self::HANDLE,
			'in-footer'    => true,
		);
	}

	/**
	 * Get data for script localization.
	 *
	 * @return array The localized script data.
	 */
	public function get_data()
	{

		return array(
			'pluginName' => AVC_NAME,
			'isAdmin'   => is_admin(),
			'apiUrl'    => rest_url(),
			'pluginApiUrl' => rest_url() . AVC_ROUTE_PREFIX,
			'userInfo'  => $this->get_user_data(),
			'logo'     => AVC_PLUGIN_ASSETS_URL,
			'nonce'     => wp_create_nonce('wp_rest'),

		);
	}

	/**
	 * Get user data for script localization.
	 *
	 * @return array The user data.
	 */
	private function get_user_data()
	{
		$username   = '';
		$avatar_url = '';
		$user_role  = '';

		if (is_user_logged_in()) {
			$current_user = wp_get_current_user();

			// Get username.
			$username = $current_user->user_login;

			// Get avatar URL.
			$avatar_url = get_avatar_url($current_user->ID);

			// Get the first role (if available).
			if (! empty($current_user->roles) && is_array($current_user->roles)) {
				$user_role = $current_user->roles[0];
			}
		}

		return array(
			'username'  => $username,
			'avatar'    => $avatar_url,
			'user_role' => $user_role,
		);
	}
}
