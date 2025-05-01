<?php

declare(strict_types=1);

namespace Advico\Assets;

if (! defined('ABSPATH')) {
	exit;
}

use Advico\Core\Template;
use Advico\App\Traits\Singleton;
use Advico\Libs\Assets;

/**
 * Class Frontend
 *
 * Handles frontend functionalities for the avc.
 *
 * @package Advico\Assets
 */
class Frontend
{

	use Singleton;

	/**
	 * Script handle for avc.
	 */
	const HANDLE = 'advico-frontend';

	/**
	 * JS Object name for avc.
	 */
	const OBJ_NAME = 'advicoFrontend';

	/**
	 * Development script path for avc.
	 */
	const DEV_SCRIPT = 'resources/js/frontend/index.jsx';

	/**
	 * Production script path for avc.
	 */
	const PROD_SCRIPT = 'resources/js/frontend/index.jsx';

	/**
	 * List of allowed screens for script enqueue.
	 *
	 * @var array
	 */
	// private $allowed_screens = array(
	// 	'avc',
	// );

	/**
	 * Frontend bootstrapper.
	 *
	 * @return void
	 */
	public function bootstrap()
	{
		add_action('wp_enqueue_scripts', array($this, 'enqueue_script'));
		// add_action('wp_footer', array($this, 'render_frontend_container'), 5);
		add_action('wp_enqueue_scripts', array($this, 'enqueue_avc_script'));
		add_filter('the_content', array($this, 'render_frontend_counter'));
	}

	/**
	 * Enqueue avc script and data.
	 */
	public function enqueue_avc_script()
	{


		// Enqueue script sebelum menggunakan wp_localize_script
		// wp_register_script('avc-js', Advico_PLUGIN_ASSETS_URL . '/frontend/visit.js', ['wp-element'], Advico_VERSION, true);
		// wp_enqueue_script('avc-js');


		// wp_localize_script('avc-chat', 'avcData', [
		// 	'baseUrl' => get_site_url(),
		// 	'pluginApiUrl' => rest_url() . Advico_ROUTE_PREFIX,

		// 	'nonce'     => wp_create_nonce('wp_rest'),
		// ]);
	}

	public function render_frontend_counter($content)
	{
		$settings = json_decode(get_option('advico_settings') ?: '{}', true);
		$display = false;

		// Check if we're on a valid post type
		if (!empty($settings['post_types'])) {
			$display = is_singular($settings['post_types']);
		}

		// Check page type visibility
		if (!empty($settings['page_types'])) {
			foreach ($settings['page_types'] as $page_type) {
				switch ($page_type) {
					case 'home':
						if (is_home() || is_front_page()) {
							$display = true;
						}
						break;
					case 'archive':
						if (is_archive()) {
							$display = true;
						}
						break;
					case 'single':
						if (is_singular()) {
							$display = true;
						}
						break;
				}
			}
		}

		if (!$display) {
			return $content;
		}
		// if (in_the_loop()) {
		// 	return $content;
		// }
		// Generate views counter HTML
		$views_html = '<div class="avc-views-counter flex items-center">';

		// Handle display styles
		if (!empty($settings['display_styles'])) {
			if (in_array('icon', $settings['display_styles'])) {
				$views_html .= '<span class="avc-views-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></span>';
			}
			if (in_array('label', $settings['display_styles'])) {
				$views_html .= '<span class="avc-views-label">' . esc_html($settings['views_label']) . '</span>';
			}
		}

		// Add the view count
		$views_html .= '<span id="advico-views-count" class="advico-views-count">' . esc_html(get_post_meta(get_the_ID(), 'avc_views', true) ?? '0') . '</span>';
		$views_html .= '</div>';

		$position = $settings['position'] ?? 'after';

		switch ($position) {
			case 'before':
				return $views_html . $content;
			case 'after':
				return $content . $views_html;
			case 'manual':
			default:
				return $content;
		}
	}


	/**
	 * Enqueue script based on the current screen.
	 *
	 * @param string $screen The current screen.
	 */
	public function enqueue_script($screen)
	{
		// $current_screen     = $screen;
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

		// if ( in_array( $current_screen, $this->allowed_screens, true ) ) {
		// 	Assets\enqueue_asset(
		// 		WPB_DIR . '/assets/frontend/dist',
		// 		self::DEV_SCRIPT,
		// 		$this->get_config()
		// 	);
		// 	wp_localize_script( self::HANDLE, self::OBJ_NAME, $this->get_data() );
		// }
		$script = $this->is_dev_mode()
			? self::DEV_SCRIPT
			: ($this->get_asset_from_manifest(self::PROD_SCRIPT)['file'] ?? null);

		if (! $script) return;

		Assets\enqueue_asset(
			ADVICO_PLUGIN_DIR . '/assets/frontend/dist',
			$script,
			$this->get_config()
		);
		wp_localize_script(self::HANDLE, self::OBJ_NAME, $this->get_data());
	}

	public function is_dev_mode()
	{
		return defined('ADVICO_DEV_MODE') && ADVICO_DEV_MODE === true;
	}

	public function get_asset_from_manifest($entry)
	{
		$path = ADVICO_PLUGIN_DIR . '/assets/frontend/dist/assets/manifest.json';

		if (! file_exists($path)) {
			return null;
		}

		$manifest = json_decode(file_get_contents($path), true);

		return $manifest[$entry] ?? null;
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
			'apiUrl'    => rest_url() . ADVICO_ROUTE_PREFIX,
			'postId' 	=> get_the_ID(),
			'userInfo'  => $this->get_user_data(),
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
			// 'avatar'    => $avatar_url,
			'user_role' => $user_role,
		);
	}
}
