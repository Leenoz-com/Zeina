<?php

if (!defined('IN_PHPBB'))
{
	exit;
}

if (empty($lang) || !is_array($lang))
{
	$lang = [];
}

$lang = array_merge($lang, [
	'ACP_ZEINA_TITLE'	=> 'Zeina Panel',
	'ACP_ZEINA' => 'Theme Settings',
	'ACP_ZEINA_SETTING_SAVED' => 'Style settings has been successfully updated.',
	'LOG_ACP_STYLE_SETTINGS_CHANGED' 	=> '<strong>Style settings updated</strong><br />» %s',
	'ACP_UPLOAD_FAIL' => 'Oops, Failed to upload the %s',
	'ACP_UPLOAD_FAIL_EXT' => 'Oops, Failed to upload the %s check the file extension',
	'ACP_UPLOAD_FAIL_SIZE' => 'Oops, Failed to upload the %s check the file size',
	'ACP_PC' => 'PC',
	'ACP_TABLET' => 'Tablet',
	'ACP_MOBILE' => 'Mobile',
	'ACP_LOADING' => 'Loading...',
	'ACP_SAVE' => 'Save',

	/** Logo & Favicon Settings **/
	'ACP_LOGO_IMAGE' => 'Logo',
	'ACP_LOGO_SIZE' => 'Logo Size',
	'ACP_LOGO_SIZE_WIDTH' => 'Width',
	'ACP_LOGO_SIZE_HEIGHT' => 'Height',
	'ACP_FAVICON' => 'Favicon',

	/** General Settings **/
	'ACP_GENERAL_SETTINGS' => 'General Settings',
	'ACP_THEME_COLOR' => 'Theme Color',
  'ACP_FONT_AWESOME' => 'Allow Font Awesome Library?',

	/** Header Settings **/
	'ACP_HEADER_SETTINGS' => 'Header Settings',
	'ACP_HEADER_IMAGE' => 'Header Image',

	/** Panels Settings **/
	'ACP_PANELS_SETTINGS' => 'Panels Settings',
	'ACP_COLLAPSE_PANEL' => 'Collapsible Panel',
	'ACP_COLORFUL_PANEL' => 'Colorful Panel Head',
]);
