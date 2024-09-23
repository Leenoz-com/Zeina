<?php

namespace leenoz\zeina\migrations;

class install_acp_module extends \phpbb\db\migration\migration
{
	public function effectively_installed()
	{
		return isset($this->config_text['zeina_config']);
	}
	public static function depends_on()
	{
		return array('\phpbb\db\migration\data\v320\v320');
	}
	public function update_data()
	{
		return array(
			array('config_text.add', array('zeina_config',
				// Default values
				serialize(array(
					'logo_image_location' => '',
					'favicon_location' => '',

          // General settings
					'theme_color' => 'blue_theme',

					// Header settings
					'header_image_location' => '',

					// Panels settings
					'colorful_panel' => 0,
					'collapse_panel' => 1,
					'profile_view' => 'simple',
				))
			)),
			array('module.add', array(
				'acp',
				0,
				'ACP_ZEINA_TITLE'
			)),
			array('module.add', array(
				'acp',
				'ACP_ZEINA_TITLE',
				array(
					'module_basename'	=> '\leenoz\zeina\acp\main_module',
					'modes'	=> array('settings')
				),
			)),
		);
	}
}
