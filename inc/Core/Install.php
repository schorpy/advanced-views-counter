<?php

namespace AVC\Core;

if (! defined('ABSPATH')) {
	exit;
}


use AVC\App\Traits\Singleton;

/**
 * This class is responsible for the functionality
 * which is required to set up after activating the plugin
 */
class Install
{


	use Singleton;

	/**
	 * Initialize the class
	 *
	 * @return void
	 */
	public function init()
	{

		$this->install_pages();
		$this->install_tables();
		$this->insert_data();
		$this->register_shortcode();
	}

	/**
	 * Install the pages
	 *
	 * @return void
	 */
	private function install_pages()
	{
		// ctz_install_page(
		// 	Template::FRONTEND_TEMPLATE_NAME,
		// 	Template::FRONTEND_TEMPLATE_SLUG,
		// 	Template::FRONTEND_TEMPLATE
		// );
	}

	/**
	 * Install the tables
	 *
	 * @return void
	 */
	private function install_tables()
	{
		// Accounts::up();
		global $wpdb;

		$table_name = $wpdb->prefix . 'avc_views';

		$charset_collate = $wpdb->get_charset_collate();

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

		$sql = "CREATE TABLE $table_name (
		id BIGINT(20) UNSIGNED NOT NULL,
		type TINYINT(1) UNSIGNED NOT NULL,
		period VARCHAR(8) NOT NULL,
		count BIGINT(20) UNSIGNED DEFAULT 1,
		PRIMARY KEY  (type, period, id),
		UNIQUE KEY unique_combo (id, type, period),
		KEY type_period_count (type, period, count)
	) $charset_collate;";

		dbDelta($sql); //Gunakan dbDelta() agar update struktur tabel tetap aman saat plugin diupdate
	}

	/**
	 * Insert data to the tables
	 *
	 * @return void
	 */
	private function insert_data()
	{
		// Insert data to the tables.
		// SeedersAccounts::run();
		// $default_settings = [
		// 	'enabled'     => true,
		// 	'track_users' => false,
		// 	'track_bots'  => false,
		// 	'period'      => 7,
		// 	'show_views'  => true,
		// ];

		// update_option('avc_settings_count', $default_settings);
	}
	private function register_shortcode()
	{
		\AVC\Libs\Utils\Shortcode::add()
			->tag('avc-views')
			->attrs(['title', 'class'])
			->render(function ($atts, $content) {
				return "<div class='{$atts['class']}'><h3>{$atts['title']}</h3><p>{$content}</p></div>";
			});
	}
}
