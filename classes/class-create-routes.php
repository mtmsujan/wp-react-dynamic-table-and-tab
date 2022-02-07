<?php
/**
 * This file will create Custom Rest API End Points.
 */
class WP_React_Tables_Rest_Route {

    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'create_rest_routes' ] );
    }

    public function create_rest_routes() {
        register_rest_route( 'sujan/v1', '/tables', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_settings' ],
            'permission_callback' => [ $this, 'get_settings_permission' ]
        ] );
        register_rest_route( 'sujan/v1', '/tables', [
            'methods' => 'POST',
            'callback' => [ $this, 'save_settings' ],
            'permission_callback' => [ $this, 'save_settings_permission' ]
        ] );


    }



    public function get_settings($req) {

        global $wpdb;
        $table = $wpdb->prefix.'data_tables';
        $user_id =  $req['user_id'];
        $response = $wpdb->get_results( "SELECT * FROM {$table} WHERE user_id = {$user_id}", OBJECT );

        return rest_ensure_response( $response );

    }

    public function get_settings_permission() {
        return true;
    }

    public function save_settings( $req ) {

        if(is_user_logged_in()){
            global $wpdb;
            $table = $wpdb->prefix.'data_tables';
            $user_count = $wpdb->get_var( "SELECT COUNT(*) FROM $table" );
            
            $data = array('user_id' => $req['user_id'], 'persons' => $req['persons'], 'tabs' => $req['tabs'], 'tab_last_opened' => $req['tab_last_opened']);
            $format = array('%d','%s', '%s', '%s');
            if($user_count == 0){
                $wpdb->insert($table,$data,$format);
            }else {
                $wpdb->update( $table, $data, array( 'user_id' => $req['user_id'] ), $format );
            }
            
    
            return rest_ensure_response( 'success' );
        }else{
            return rest_ensure_response( 'unauthorized' );
        }


    }

    public function save_settings_permission() {
        return true;
    }
}
new WP_React_Tables_Rest_Route();