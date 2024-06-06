<?php

namespace leenoz\zeina\acp;

/**
 * Zeina ACP module.
 */
class main_module
{
	public $page_title;
	public $tpl_name;
	public $u_action;

	/**
	 * Main ACP module
	 *
	 * @param int    $id   The module ID
	 * @param string $mode The module mode (for example: manage or settings)
	 * @throws \Exception
	 */
	public function main($id, $mode)
	{
		global $phpbb_container;

		/** @var \leenoz\zeina\controller\acp_controller $acp_controller */
		$acp_controller = $phpbb_container->get('leenoz.zeina.controller.acp');

		// Load a template from adm/style for our ACP page
		$this->tpl_name = 'acp_zeina_body';

		// Set the page title for our ACP page
		$this->page_title = 'ACP_ZEINA_TITLE';

		// Make the $u_action url available in our ACP controller
		$acp_controller->set_page_url($this->u_action);

		// Load the display options handle in our ACP controller
		$acp_controller->display_options();
	}
}
