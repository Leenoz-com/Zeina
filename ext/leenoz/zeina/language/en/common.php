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
	'Follow Us' => 'Follow Us',
	'Design by' => 'Design by',
	// ------------- Login & Register Page ------------ //
	'or' => 'or',
	'Sign in with' => 'Sign in with',
	'Sign up with' => 'Sign up with',
	'Show Password' => 'Show Password',
	'Not a member?' => 'Not a member?',
	'Member?' => 'Member?',
]);