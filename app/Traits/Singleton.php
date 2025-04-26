<?php

namespace Advico\App\Traits;

if (! defined('ABSPATH')) {
    exit;
}
/**
 * Trait Singleton
 *
 * Provides a trait with a singleton pattern for obtaining an instance.
 *
 * @package Advico\Trait
 */
trait Singleton
{

    /**
     * The singleton instance.
     *
     * @var mixed
     */
    private static $instance;

    /**
     * Retrieves the singleton instance. If it does not exist, creates a new instance.
     *
     * @return mixed The singleton instance.
     */
    public static function getInstance()
    {
        if (! self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }
}
