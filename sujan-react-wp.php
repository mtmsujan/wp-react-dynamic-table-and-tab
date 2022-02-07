<?php
/**
 * Plugin Name: Sujan React WP
 * Author: Md. Toriqul Mowla Sujan
 * Author URI: https://fiverr.com/developer_sujan
 * Version: 1.0.0
 * Description: Custom Plugin to connect react with wp
 * Text-Domain: react-wp
 */

if( ! defined( 'ABSPATH' ) ) : exit(); endif; // No direct access allowed.

/**
* Define Plugins Constants
*/
define ( 'PLUGIN_PATH', trailingslashit( plugin_dir_path( __FILE__ ) ) );
define ( 'PLUGIN_URL', trailingslashit( plugins_url( '/', __FILE__ ) ) );

/**
 * Loading Necessary Scripts
 */


register_activation_hook(__FILE__, function(){
    global $wpdb;

    $charset_collate = $wpdb->get_charset_collate();
    $table_name = $wpdb->prefix . "data_tables";

    $sql = "CREATE TABLE $table_name (
      id mediumint(9) NOT NULL AUTO_INCREMENT,
      user_id mediumint(9) NOT NULL,
      persons text NOT NULL,
      tabs text NOT NULL,
      tab_last_opened text NULL,
      PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
});




add_action( 'wp_enqueue_scripts', 'sujan_load_scripts' );
function sujan_load_scripts() {
    wp_enqueue_script( 'wp-react-sujan', PLUGIN_URL . 'build/index.js', [ 'jquery', 'wp-element' ], wp_rand(), true );
    wp_enqueue_style( 'wp-react-sujan', PLUGIN_URL . 'build/style-index.css' );
    wp_enqueue_style( 'modal-css', PLUGIN_URL . 'build/index.css' );
    wp_localize_script( 'wp-react-sujan', 'appLocalizer', [
        'apiUrl' => home_url( '/wp-json' ),
        'nonce' => wp_create_nonce( 'wp_rest' ),
        'user_id' => get_current_user_id()
    ] );
}

require_once PLUGIN_PATH . 'classes/class-create-shortcode.php';
require_once PLUGIN_PATH . 'classes/class-create-routes.php';