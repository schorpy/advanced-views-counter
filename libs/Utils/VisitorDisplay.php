<?php

namespace Advico\Libs\Utils;

if (! defined('ABSPATH')) exit;

use Advico\Libs\Utils\Cache;

class VisitorDisplay
{
    protected array $settings;
    protected int $postId;

    public function __construct(int $postId)
    {
        $this->settings = is_array(Cache::get_cache("advico_settings"))
            ? Cache::get_cache("advico_settings")
            : [];

        $this->postId = $postId;
    }

    public function shouldExclude(): bool
    {
        return (
            $this->isInvalidPostType() ||
            $this->isBot() ||
            $this->isGuest() ||
            $this->isAuthor() ||
            $this->isEditor() ||
            $this->isContributor() ||
            $this->isSubscriber() ||
            $this->isAdmin()
        );
    }

    protected function isInvalidPostType(): bool
    {
        $allowed = $this->settings['post_types'] ?? ['post'];
        $postType = get_post_type($this->postId);
        return !in_array($postType, $allowed);
    }

    protected function isBot(): bool
    {

        $exclude = $this->settings['user_types'] ?? [];
        $ua = isset($_SERVER['HTTP_USER_AGENT'])
            ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT']))
            : '';

        return (
            (in_array('crawlers', $exclude) || in_array('bots', $exclude)) &&
            preg_match('/bot|crawl|slurp|spider/i', $ua)
        );
    }

    protected function isGuest(): bool
    {
        $exclude = $this->settings['user_types'] ?? [];
        return in_array('guest', $exclude) && !is_user_logged_in();
    }

    protected function isAuthor(): bool
    {
        $exclude = $this->settings['user_types'] ?? [];
        if (!in_array('author', $exclude) || !is_user_logged_in()) return false;

        $user = wp_get_current_user();
        return in_array('author', $user->roles);
    }
    protected function isEditor(): bool
    {
        $exclude = $this->settings['user_types'] ?? [];
        if (!in_array('editor', $exclude) || !is_user_logged_in()) return false;

        $user = wp_get_current_user();
        return in_array('editor', $user->roles);
    }

    protected function isContributor(): bool
    {
        $exclude = $this->settings['user_types'] ?? [];
        if (!in_array('contributor', $exclude) || !is_user_logged_in()) return false;

        $user = wp_get_current_user();
        return in_array('contributor', $user->roles);
    }

    protected function isSubscriber(): bool
    {
        $exclude = $this->settings['user_types'] ?? [];
        if (!in_array('subscriber', $exclude) || !is_user_logged_in()) return false;

        $user = wp_get_current_user();
        return in_array('subscriber', $user->roles);
    }

    protected function isAdmin(): bool
    {
        $exclude = $this->settings['user_types'] ?? [];
        if (!in_array('administrator', $exclude) || !is_user_logged_in()) return false;

        $user = wp_get_current_user();
        return in_array('administrator', $user->roles);
    }

    protected function isIP(): bool
    {
        $ip_address = $this->get_client_ip();
        $exclude = $this->settings['exclude_ip'] ?? [];
        if (!in_array($ip_address, $exclude)) return false;
        return true;
    }

    private function get_client_ip()
    {
        // Unsash and sanitize HTTP_CLIENT_IP if it's set
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return sanitize_text_field(wp_unslash($_SERVER['HTTP_CLIENT_IP']));
        }
        // Unsash and sanitize HTTP_X_FORWARDED_FOR if it's set
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return explode(',', sanitize_text_field(wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR'])))[0];
        }
        // Return REMOTE_ADDR with fallback for unslash and sanitize
        else {
            return sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'));
        }
    }
    // 🛑 Cek User-Agent Bot
    private function is_bot($user_agent)
    {
        $bot_keywords = ['bot', 'crawl', 'spider', 'fetch', 'slurp', 'mediapartners'];
        foreach ($bot_keywords as $bot) {
            if (stripos($user_agent, $bot) !== false) {
                return true;
            }
        }
        return false;
    }
}
