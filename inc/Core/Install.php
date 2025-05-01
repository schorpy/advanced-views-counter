<?php

namespace Advico\Core;

if (! defined('ABSPATH')) {
	exit;
}


use Advico\App\Traits\Singleton;

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
		// advico_install_page(
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

		global $wpdb;

		// Views table
		$views_table = $wpdb->prefix . 'advico_views';
		$referer_table = $wpdb->prefix . 'advico_referers';

		$charset_collate = $wpdb->get_charset_collate();

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

		// Create views table
		$sql_views = "CREATE TABLE $views_table (
		id BIGINT(20) UNSIGNED NOT NULL,
		type TINYINT(1) UNSIGNED NOT NULL,
		period VARCHAR(8) NOT NULL,
		count BIGINT(20) UNSIGNED DEFAULT 1,
		PRIMARY KEY (type, period, id),
		UNIQUE KEY unique_combo (id, type, period),
		KEY type_period_count (type, period, count)
	) $charset_collate;";

		// Create referers table
		$sql_referers = "CREATE TABLE $referer_table (
		id BIGINT(20) UNSIGNED NOT NULL,
		type TINYINT(1) UNSIGNED NOT NULL,
		referer_hash CHAR(32) NOT NULL,
		referer_url TEXT NOT NULL,
		period VARCHAR(8) NOT NULL,
		count BIGINT(20) UNSIGNED DEFAULT 1,
		PRIMARY KEY (id, type, referer_hash, period)
	) $charset_collate;";

		dbDelta($sql_views);
		dbDelta($sql_referers);
	}

	/**
	 * Insert data to the tables
	 *
	 * @return void
	 */
	private function insert_data()
	{
		// Insert data to the tables.

		if (!get_option('advico_settings')) {
			$default_settings = [
				'post_types' => ['post', 'page'],
				'page_types' => ['home'],
				'display_styles' => ['icon', 'label'],
				'views_label' => 'Views:',
				'position' => 'after',
				'user_types' => ['crawlers']
			];

			update_option('advico_settings', wp_json_encode($default_settings));
		}

		// Settings Count
		if (!get_option('advico_settings_count')) {
			$default_settings = [
				'post_types' => ['post', 'page'],
				'exclude_visitors' => ['crawlers'],
				'interval_count' => '24',
				'interval_unit' => 'hours',
			];

			update_option('advico_settings_count', wp_json_encode($default_settings));
		}
	}
	private function register_shortcode()
	{
		// \Advico\Libs\Utils\Shortcode::add()
		// 	->tag('avc-views')
		// 	->attrs(['title', 'class'])
		// 	->render(function ($atts, $content) {
		// 		post_views_shortcode
		// 		return "<div class='{$atts['class']}'><h3>{$atts['title']}</h3><p>{$content}</p></div>";
		// 	});
	}
}
