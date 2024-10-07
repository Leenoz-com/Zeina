<?php

namespace leenoz\zeina\controller;

/**
 * Zeina ACP controller.
 */
class acp_controller
{
	/** @var \phpbb\config\db_text */
	protected $config_text;

	/** @var \phpbb\language\language */
	protected $language;

	/** @var \phpbb\log\log */
	protected $log;

	/** @var \phpbb\request\request */
	protected $request;

	/** @var \phpbb\template\template */
	protected $template;

	/** @var \phpbb\user */
	protected $user;

	/** @var \phpbb\db\driver\driver_interface */
	protected $db;

	/** @var string Theme dir */
	protected $theme_path;

	/** @var array Theme colors */
	protected $colors_array;

	/** @var string Custom form action */
	protected $u_action;

	/**
	 * Constructor.
	 *
	 * @param \phpbb\config\db_text			$config_text	Config object
	 * @param \phpbb\language\language	$language			Language object
	 * @param \phpbb\log\log						$log					Log object
	 * @param \phpbb\request\request		$request			Request object
	 * @param \phpbb\template\template	$template			Template object
	 * @param \phpbb\user								$user					User object
	 * @param \phpbb\db\driver\driver_interface $db
	 */
	public function __construct(
    \phpbb\config\db_text $config_text, 
    \phpbb\language\language $language, 
    \phpbb\log\log $log, 
    \phpbb\request\request $request, 
    \phpbb\template\template $template, 
    \phpbb\user $user,
    \phpbb\db\driver\driver_interface $db
  )
	{
		global $phpbb_root_path;

		$this->config_text	= $config_text;
		$this->language			= $language;
		$this->log					= $log;
		$this->request			= $request;
		$this->template			= $template;
		$this->user					= $user;
		$this->db					  = $db;
		$this->theme_path   = $phpbb_root_path . "styles/zeina/theme/";
		$this->colors_array = array(
			"blue_theme" 		=> array("37, 99, 235"),
			"red_theme" 		=> array("185, 28, 28"),
			"green_theme" 	=> array("21, 128, 61"),
			"teal_theme" 		=> array("15, 118, 110"),
			"orange_theme" 	=> array("194, 65, 12"),
			"indigo_theme" 	=> array("79, 70, 229"),
			"fuchsia_theme" => array("182, 30, 201"),
			"pink_theme" 		=> array("205, 35, 110"),
		);
	}

	/**
	 * Display the options a user can configure for this extension.
	 *
	 * @return void
	 */
	public function display_options()
	{
		// Add our common language file
		$this->language->add_lang("common", "leenoz/zeina");

		// Create a form key for preventing CSRF attacks
		add_form_key("leenoz_zeina_acp");

		// Create an array to collect errors that will be output to the user
		$errors = array();

		// Is the form being submitted to us?
		if ($this->request->is_ajax() && $this->request->is_set_post('submit'))
		{
			$json_response = new \phpbb\json_response();

			// Test if the submitted form is valid
			if (!check_form_key("leenoz_zeina_acp"))
			{
				http_response_code(400);
				$errors['MESSAGE'] = $this->language->lang("FORM_INVALID");
				return $json_response->send($errors);
			}

			// Get the old data
			$old_data = unserialize($this->config_text->get("zeina_config"));

			// Set the options the user configured
			$data = $this->request->get_super_global();
				
			foreach (array("submit", "creation_time", "form_token", "i", "sid", "mode") as $ignore)
				unset($data[$ignore]);

			// Convert any number from string to integer
			foreach (array_keys($data) as $i) {
				if (is_numeric($data[$i])) {
					$data[$i] = (int)$data[$i];
				}
			}

			// Set the theme color
			if (isset($data["theme_color"])) {
				$data["primary_color"] = $this->colors_array[$data["theme_color"]][0];
				$data["panel_head_color"] = 'rgb(' . $this->colors_array[$data["theme_color"]][0] . ')';
			}

			// Upload folder
			$dir = "images/";
     
			// Upload logo, header image and favicon icon
			foreach (array("logo_image", "header_image", "favicon") as $file)
			{
				$_file = $this->request->file($file);
				if ($_file["name"] && $_file["error"] == UPLOAD_ERR_OK)
				{
					// Remove old image
					$this->removeImage($old_data, $file . "_location");

					// Allow file extension
					$allowed_extension = array("jpg", "jpeg", "png", "gif", "svg", "webp", "ico");

					// Get the file extension
					$file_extension = pathinfo($_file["name"], PATHINFO_EXTENSION);

					// Maximum size allowed
					$max_size_allowed = ((int) ini_get("upload_max_filesize")) * 1000000;

					// Check if image extension is allowed
					if (!in_array($file_extension, $allowed_extension, true)) {
						$errors['MESSAGE'] = $this->user->lang("ACP_UPLOAD_FAIL_EXT", str_replace("_", " ", $file));
					}
					// Check if image size is allowed
					elseif ($_file["size"] > $max_size_allowed) {
						$errors['MESSAGE'] = $this->user->lang("ACP_UPLOAD_FAIL_SIZE", str_replace("_", " ", $file));
					}
					else {
						// Upload the new one
						if ($this->upload($_file, $this->theme_path . $dir)) {
							$data[$file . "_location"] = $dir . $_file["name"];
						} else {
							$errors['MESSAGE'] = $this->user->lang("ACP_UPLOAD_FAIL", str_replace("_", " ", $file));
						}
					}

					// If there is an error uploading the file
					if (!empty($errors)) {
						http_response_code(400);
						return $json_response->send($errors);		
					}
				}
				else if ($data[$file . "_location"] !== $old_data[$file . "_location"]) {
					$this->removeImage($old_data, $file . "_location");
				}
			}

			// Set the options the user configured
			$this->config_text->set("zeina_config", serialize($data));

			// Add option settings change action to the admin log
			$this->log->add("admin", $this->user->data["user_id"], $this->user->ip, "LOG_ACP_STYLE_SETTINGS_CHANGED", false, array("leenoz/zeina"));

			// Option settings have been updated and logged
			$ajax_data = array(
				'MESSAGE' => $this->user->lang('ACP_ZEINA_SETTING_SAVED')
			);
			return $json_response->send($ajax_data);
		}

		// Set output variables for display in the template
		$data = unserialize($this->config_text->get("zeina_config"));


		$this->template->assign_vars([
			"U_ACTION" => $this->u_action,
      "STYLE_ID" => $this->getStyleID(),
			"T_THEME_PATH" => $this->theme_path,
			"colors_array" => $this->colors_array,
			"zeina" => $data,
		]);
	}

  /**
   * Get style ID
   * @return integer
   */
  protected function getStyleID()
  {
    $sql = 'SELECT style_id
			FROM ' . STYLES_TABLE . '
      WHERE style_path = "zeina"';

		$result = $this->db->sql_query($sql);

		$rows = $this->db->sql_fetchrow($result);
		$this->db->sql_freeresult($result);

    return $rows && isset($rows['style_id']) ? (int)$rows['style_id'] : null;
  }

	/**
	 * Remove an image from server
	 *
	 * @param string $image_path 	image Path
	 */
	protected function removeImage($data, $image)
	{
		if (isset($data[$image]) && is_file($this->theme_path . $data[$image]))
			unlink($this->theme_path . $data[$image]);
	}

	/**
	 * Upload file
	 *
	 * @param array  $file      					file data
	 * @param string $path 								file Path
	 * @param array  $allowed_extension  	extension
	 * @return bool
	 */
	protected function upload($file, $path)
	{
		$location = $path . basename($file["name"]);
		if (@move_uploaded_file($file["tmp_name"], $location))
		{
			return true;
		}
		else return false;
	}

	/**
	 * Set custom form action.
	 *
	 * @param string	$u_action	Custom form action
	 * @return void
	 */
	public function set_page_url($u_action)
	{
		$this->u_action = $u_action;
	}
}
