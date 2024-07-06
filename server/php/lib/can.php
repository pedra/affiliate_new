<?php
/*
 * CAN - Código Alfa Numérico
 * Classe para converter um valor numérico em CAN e de volta à numérico.
 * @copyright   Bill Rocha - https://billrocha.netlify.app
 * @license     MIT & GLP2
 * @author      Bill Rocha - prbr@ymail.com
 * @version     0.0.1
 * @access      public
 * @since       0.0.4
 * @date        2015/08/30-19:00:00


	dígitos      -      resolução

	1  =                        64
	2  =                     4.096
	3  =                   262.144
	4  =                16.777.216
	5  =             1.073.741.824
	6  =            68.719.476.736 ( 68 bilhões )
	7  =         4.398.046.511.104
	8  =       281.474.976.710.656
	9  =    18.014.398.509.481.984
	10 = 1.152.921.504.606.846.976 ( 1 quinquilhão )


	Exemplo:

	$can = new Can();
	$can->encode(50000) => "ntW"
	$can->decode("ntW") => 50000

	Para gerar uma NOVA chave aleatória:
	\Lib\Can::createKeys('<path>/<file>.keys') >> salva no arquivo indicado.
	

*/

namespace Lib;

class Can
{

	private $number = 0;
	private $can = '';
	private $resolution = 10;
	private $useExtra = false;
	private $expoent = 64;


	static $base = ['I', 'u', 'h', '5', 'B', 'A', 'r', 'i', '7', '9', 'z', 'd', 'n', 't', 'F', '2', 'W', 'X', 'f', 'e', 'x', 'v', '_', '8', 'm', 'T', 'N', 'R', 'L', 'c', '6', 'P', 'k', 'Q', 'q', 'j', 'Y', 'M', '4', 'S', 'G', 'o', '0', '$', 'K', 's', 'g', 'H', 'E', 'b', 'a', 'J', 'U', 'Z', 'l', '1', 'O', '3', 'y', 'p', 'V', 'D', 'C', 'w'];
	static $extra_base = ['$', '!', '#', '%', '&', '*', '+', '-', '?', '@', '(', ')', '/', '\\', '[', ']', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

	/*
	 *
	 */

	function __construct($resolution = 10, $extra = false, $keyPath = '')
	{
		if ((0 + $resolution) > 0) {
			$this->resolution = 0 + $resolution;
		}

		if ($extra === true)
			$this->useExtra = true;

		$this->expoent = count($this->useExtra === true ? static::$extra_base : static::$base);

		//get "base" key OR use default
		if ($keyPath !== false && file_exists($keyPath)) {
			$base = file_get_contents($keyPath);
			static::$base = [];
			static::$extra_base = [];
			$base = explode("\n", $base);

			for ($i = 0; $i < strlen($base[0]); $i++) {
				static::$base[] = $base[0][$i];
			}
			for ($i = 0; $i < strlen($base[1]); $i++) {
				static::$extra_base[] = $base[1][$i];
			}
		}
	}

	/* Codifica um valor numérico em CAN ( ex.: 63.145 > GQT )
	 * Parâmetro forceWidth: true - completa com base[0] os campos com valor "0" à esquerda
	 *                       false - mostra somente os caracteres que fazem diferença.
	 * Ex.: encode(1)       => 'u'
	 *      encode(1, true) => 'IIIIIIIIIu';
	 *
	 */
	function encode($num = null, $forceWidth = false)
	{
		if ($num !== null && (0 + $num) >= 0)
			$this->number = 0 + $num;

		//overflow...
		if ($this->number >= $this->pow($this->expoent, $this->resolution))
			return false;

		$res = '';
		$num = $this->number;
		$himem = false;

		for ($i = $this->resolution; $i >= 1; $i--) {
			if ($num <= 0) {
				$res .= $this->useExtra === true ? static::$extra_base[0] : static::$base[0];
				continue;
			}
			$ind = $this->pow($this->expoent, $i - 1);
			$a = intval($num / $ind);
			if ($a > 0)
				$himem = true;
			$num = $num - ($a * $ind);
			if ($himem || $forceWidth)
				$res .= $this->useExtra === true ? static::$extra_base[$a] : static::$base[$a];
		}
		$this->can = $res;
		return $this->can;
	}

	//Decodifica uma string CAN para um valor numérico ( ex.: GQT > 63.145 )
	function decode($can = null)
	{
		if ($can != null && is_string($can))
			$this->can = $can;

		$len = strlen($this->can) - 1;
		$valor = 0;
		for ($i = $len; $i >= 0; $i--) {
			$peso = $this->pow($this->expoent, $i);
			$d = substr($this->can, $len - $i, 1);
			$c = array_search($d, $this->useExtra === true ? static::$extra_base : static::$base);

			if ($c === false)
				return false;
			$valor += $peso * $c;
		}

		$this->number = $valor;
		return $this->number;
	}

	//Create new Can keys
	static function createKeys($path = false)
	{
		if ($path === false)
			return false;
		shuffle(static::$base);
		shuffle(static::$extra_base);
		return file_put_contents($path, implode(static::$base) . "\n" . implode(static::$extra_base));
	}


	/* Equivalent a função bcpow do lib BCMATH do PHP, usando o sistema operacional (Linux) 
		-- Eleva um número de precisão arbitrária a outro
	*/
	function pow($b, $n)
	{
		return pow($b, $n);
		// return `echo '$b^$n' | bc`;
	}
}