<?php

namespace leenoz\zeina\event;

/**
 * @ignore
 */
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Zeina Event listener.
 */
class main_listener implements EventSubscriberInterface
{
	/** @var \phpbb\config\config */
	protected $config;

	/** @var \phpbb\config\db_text */
	protected $config_text;

	/** @var \phpbb\template\template */
	protected $template;

	/** @var array */
	protected $data;

	/**
	 * Constructor
	 *
	 * @param \phpbb\config\config                 $config      Config object
	 * @param \phpbb\config\db_text                $config_text DB text object
	 * @param \phpbb\template\template             $template    Template object
	 * @access public
	 */
	public function __construct(\phpbb\config\config $config, \phpbb\config\db_text $config_text, \phpbb\template\template $template)
	{
		$this->config = $config;
		$this->config_text = $config_text;
		$this->template = $template;
	}

	public static function getSubscribedEvents()
	{
		return array(
			'core.user_setup'	 => 'load_language_on_setup',
			'core.page_header' => 'load_style_settings_data',
		);
	}

	/**
	 * Load common language files during user setup
	 *
	 * @param \phpbb\event\data	$event	Event object
	 */
	public function load_language_on_setup($event)
	{
		$lang_set_ext = $event['lang_set_ext'];
		$lang_set_ext[] = array(
			'ext_name' => 'leenoz/zeina',
			'lang_set' => 'common',
		);
		$event['lang_set_ext'] = $lang_set_ext;
	}

	/**
	 * Load theme options
	 */
	public function load_style_settings_data()
	{
		global $request, $auth;

		$zeina_config = unserialize($this->config_text->get('zeina_config'));
		
		$zeina_config["enabled"] = 1;

		// Set default values for preview mode (Zeina Panel)
		if ($request->variable('preview_mode', 0) == 1 && $auth->acl_get('a_')) {
			if ($zeina_config["logo_image_location"] == '')
				$zeina_config["logo_image_location"] = "logo";
			
			$zeina_config["collapse_panel"] = 1;
		}

		$template_vars = array('zeina' => $zeina_config);
		$this->template->assign_vars($template_vars);
	}
}
