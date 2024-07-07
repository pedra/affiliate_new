<?php
/*
 * @copyright   Bill Rocha - https://billrocha.netlify.app
 * @license     MIT & GLP2
 * @author      Bill Rocha - prbr@ymail.com

	$NuTSy = new NuTSy();
	$NuTSy->enc(50000) => "ntW"
	$NuTSy->dec("ntW") => 50000

	$NuTSy->mask(50000) => "nWntW" (is partially random)

	$NuTSy->gen() => Generates a new "pool" and displays it on the screen.
*/

namespace Lib;

class NuTSy
{
	private $exponent = 0;
	private $resolution = 10;
	private $salt = 315;

	static $symbols = ['$', '!', '#', '%', '*', '+', '-', '@', '_'];
	static $numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	static $alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	static $pool = ['n', '%', 'u', 'd', 's', 'q', '-', 'k', 'r', '6', '$', 'j', 'f', '*', 'b', 'a', '4', '!', '_', 't', 'z', 'e', '#', 'p', '9', 'c', '5', 'w', '@', '8', '3', '+', 'l', '7', 'h', 'i', '0', 'm', 'x', '1', 'g', 'y', 'o', 'v', '2'];

	function __construct($resolution = 10, $extra = false, $keyPath = '')
	{
		$this->exponent = count(static::$pool);
	}

	/**
	 * Encodes a number into a short string.
	 *  + Adds a random salt and a fixed salt.
	 *  + Useful for shortening links, masking IDs, and more.
	 *
	 * @param integer $uid
	 * @return string
	 */
	public function mask($uid)
	{
		$enc = $this->enc(($uid + 0) + $this->salt);
		return $this->enc(random_int(0, count(static::$pool))) . $enc;
	}

	public function enc ($num)
	{
		$num += 0;
		if($num == 0 || $num >= pow($this->exponent, $this->resolution)) return false;

		$res = '';
		$h = false;

		for ($i = $this->resolution; $i >= 1; $i--) {
			if ($num <= 0) {
				$res .= static::$pool[0];
				continue;
			}
			$ind = pow($this->exponent, $i - 1);
			$a = intval($num / $ind);
			if ($a > 0)	$h = true;
			$num = $num - ($a * $ind);
			if ($h) $res .= static::$pool[$a];
		}
		return $res;		
	}

	function dec ($str)
	{
		$len = strlen($str) - 1;
		$v = 0;
		for ($i = $len; $i >= 0; $i--) {
			$p = pow($this->exponent, $i);
			$d = substr($str, $len - $i, 1);
			$c = array_search($d, static::$pool);

			if ($c === false) return false;
			$v += $p * $c;
		}
		return $v;
	}

	/**
	 * Generate and show a new static::$pool 
	 */
	public function gen()
	{
		shuffle(static::$symbols);
		shuffle(static::$numbers);
		shuffle(static::$alpha);

		static::$pool = array_merge(
			static::$symbols,
			static::$numbers,
			static::$alpha
		);

		shuffle(static::$pool);

		$o = '<div style="font-family:monospace,sans-serif">Replace line 59 with the following code:<br><br>static $pool = [';
		foreach (static::$pool as $p) {
			if ($p == "\\")
				$p = "\\\\";
			$o .= "'$p',";
		}
		$o = substr($o, 0, -1) . '];</div>';

		exit($o);
	}
}