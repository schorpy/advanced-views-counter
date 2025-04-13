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
 * Class Frontend
 *
 * Handles frontend functionalities for the avc.
 *
 * @package AVC\Assets
 */
class Frontend
{

	use Singleton;

	/**
	 * Script handle for avc.
	 */
	const HANDLE = 'avc-frontend';

	/**
	 * JS Object name for avc.
	 */
	const OBJ_NAME = 'avcFrontend';

	/**
	 * Development script path for avc.
	 */
	const DEV_SCRIPT = 'resources/js/frontend/main.jsx';

	/**
	 * List of allowed screens for script enqueue.
	 *
	 * @var array
	 */
	private $allowed_screens = array(
		'avc',
	);

	/**
	 * Frontend bootstrapper.
	 *
	 * @return void
	 */
	public function bootstrap()
	{
		add_action('wp_enqueue_scripts', array($this, 'enqueue_script'));
		add_action('wp_footer', array($this, 'render_frontend_container'), 5);
		add_action('wp_enqueue_scripts', array($this, 'enqueue_avc_script'));
	}

	/**
	 * Enqueue WhatsApp chat script and data.
	 */
	public function enqueue_avc_script()
	{
		$allowed_urls = [
			'/hello-world',
			'/page-2',
		];

		$current_url = '';

		if (isset($_SERVER['REQUEST_URI'])) {
			$current_url = sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI']));
		}
		$show_button = false;

		// Cek apakah URL saat ini mengandung salah satu dari allowed URLs
		foreach ($allowed_urls as $url) {
			if (strpos($current_url, $url) !== false) {
				$show_button = true;
				break;
			}
		}



		// Enqueue script sebelum menggunakan wp_localize_script
		wp_register_script('avc-js', AVC_PLUGIN_ASSETS_URL . '/frontend.min.js', ['wp-element'], AVC_VERSION, true);
		wp_enqueue_script('avc-js');

		// Kirim data ke JavaScript
		// wp_localize_script('avc-chat', 'avcData', [
		// 	'baseUrl' => get_site_url(),
		// 	'pluginApiUrl' => rest_url() . avc_ROUTE_PREFIX,
		// 	'showButton' => $show_button,
		// 	'position' => '', //left, default right
		// 	'contacts' => $contact_data,
		// 	'texts' => [
		// 		'buttonText' => 'Hubungi Via WhatsApp',
		// 		'boxHeaderTitle' => 'Chat WhatsApp',
		// 		'boxHeaderDesc' => 'Silahkan chat marketing kami.',
		// 		'boxFooter' => 'Konsultasi Gratis!',
		// 	],
		// 	'nonce'     => wp_create_nonce('wp_rest'),
		// ]);
	}




	/**
	 * Render the frontend container div.
	 */
	public function render_frontend_container()
	{
		echo '<div id="avc-app" class="avc-app"></div>';
	}
	/**
	 * Enqueue script based on the current screen.
	 *
	 * @param string $screen The current screen.
	 */
	public function enqueue_script($screen)
	{
		$current_screen     = $screen;
		$template_file_name = Template::FRONTEND_TEMPLATE;


		// if (! is_admin()) {
		// 	$template_slug = get_page_template_slug();
		// 	if ($template_slug) {

		// 		if ($template_slug === $template_file_name) {
		// 			array_push($this->allowed_screens, $template_file_name);
		// 			$current_screen = $template_file_name;
		// 		}
		// 	}
		// }

		// if ( in_array( $current_screen, $this->allowed_screens, true ) ) {
		// 	Assets\enqueue_asset(
		// 		WPB_DIR . '/assets/frontend/dist',
		// 		self::DEV_SCRIPT,
		// 		$this->get_config()
		// 	);
		// 	wp_localize_script( self::HANDLE, self::OBJ_NAME, $this->get_data() );
		// }
		Assets\enqueue_asset(
			AVC_PLUGIN_DIR . '/assets/frontend/dist',
			self::DEV_SCRIPT,
			$this->get_config()
		);
		wp_localize_script(self::HANDLE, self::OBJ_NAME, $this->get_data());
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
			'isAdmin'   => is_admin(),
			'apiUrl'    => rest_url(),
			'userInfo'  => $this->get_user_data(),
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
