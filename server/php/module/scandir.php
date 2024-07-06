<?php

namespace Module;

class Scandir {

	private $dir = null;
	private $path = null;

	public function __construct() {
		$this->path = ROOT . '/';
	}

	public function get($params)
	{
		$out = false;
		$this->dir = $this->path . urldecode(($params[0] ?? '/'));
		if(is_dir($this->dir)) $out = $this->scan();
		return $out; 
	}

	public function scan() {
		$dd = [];
		$df = [];
		$s = scandir($this->dir);
		foreach ($s as $d) {
			if (in_array($d, IGNORE))
				continue;

			if (is_dir($this->dir . '/' . $d)) {
				array_push($dd, $d);
			} else {
				array_push($df, [
					"name" => $d,
					"size" => human_filesize(filesize($this->dir . '/' . $d)),
					"ext" => strtolower(pathinfo($this->dir . '/' . $d)['extension'] ?? '')
				]);
			}
		}

		return [
			"path" => str_replace($this->path, '', $this->dir),
			"dir" => $dd,
			"file" => $df
		];
	}
}