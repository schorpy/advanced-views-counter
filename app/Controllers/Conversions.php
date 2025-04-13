<?php

/**
 * Posts Controller
 *
 * This file is used to register all actions for the Posts Controller.
 *
 * @since 1.0.0
 */

namespace AVC\App\Controllers;

if (! defined('ABSPATH')) {
	exit;
}


class Conversions
{

	/**
	 * Get all Conversions.
	 */
	public function get_all() {}

	public function get_by(\WP_REST_Request $request)
	{
		$post = Posts::find($request->get_param('id'));
		return $post;
	}
	public function update_by(\WP_REST_Request $request)
	{
		$post = Posts::find($request->get_param('id'));
		return $post;
	}
	public function delete_by(\WP_REST_Request $request)
	{
		$post = Posts::find($request->get_param('id'));
		return $post;
	}
}
