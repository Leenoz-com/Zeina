<?php

namespace leenoz\zeina\acp;

/**
 * Zeina ACP module info.
 */
class main_info
{
	public function module()
	{
		return array(
			'filename'	=> '\leenoz\zeina\acp\main_module',
			'title'		=> 'ACP_ZEINA_TITLE',
			'modes'		=> array(
				'settings'	=> array(
					'title'	=> 'ACP_ZEINA_TITLE',
					'auth'	=> 'ext_leenoz/zeina && acl_a_board',
					'cat'	=> array('ACP_ZEINA_TITLE'),
				),
			),
		);
	}
}
