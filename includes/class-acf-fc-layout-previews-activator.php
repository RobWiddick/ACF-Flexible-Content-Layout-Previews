<?php

/**
 * Fired during plugin activation
 *
 * @link       https://robwiddick.com
 * @since      1.0.0
 *
 * @package    Acf_Fc_Layout_Previews
 * @subpackage Acf_Fc_Layout_Previews/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Acf_Fc_Layout_Previews
 * @subpackage Acf_Fc_Layout_Previews/includes
 * @author     Rob Widdick <rob@robwiddick.com>
 */
class Acf_Fc_Layout_Previews_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
        $upload = wp_upload_dir();
        $upload_dir = $upload['basedir'];
        $upload_dir = $upload_dir . '/acf-fc-layouts';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir);
        }
	}

}
