<?php
/**
 * This file will create shortcode
 */

class Sujan_Create_Shortcode {

    public function __construct() {
        add_shortcode( 'data-tables', [ $this, 'create_table' ] );
    }

    public function create_table() {
        ob_start(); 
        ?>
            <div class="sujan-wrapper">
                <div id="sujan-tables">
                    
                </div>
            </div>
        <?php return ob_get_clean();
    }



}
new Sujan_Create_Shortcode();