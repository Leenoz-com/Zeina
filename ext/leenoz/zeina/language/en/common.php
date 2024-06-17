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
	// -------------------- Global -------------------- //
	'BREADCRUMBS' => 'Navigation menu',
	'THEME_MODE' => 'Light/Dark Mode',
	'INFO' => 'Information',
	'FOLLOW_US' => 'Follow Us',
	'SCROLL_TOP_TOP' => 'Scroll to top',
	'DESIGNED_BY' => 'Designed by',
	// ------------- Login & Register Page ------------ //
	'OR' => 'or',
	'SIGN_WITH' => 'Sign in with',
	'REGISTER_WITH' => 'Sign up with',
	'SHOW_PASSWORD' => 'Show/hide password',
	'NOT_MEMBER' => 'Not a member?',
	'IS_MEMBER' => 'Member?',
]);
