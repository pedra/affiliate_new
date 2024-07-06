<?php

namespace Module;

class File {

	private $assetPath = '';
	private $rootPath = '';

	public function __construct() 
	{
		$this->assetPath = PATH_ROOT . '/public/';
		$this->rootPath = ROOT . '/';
	}

	public function asset($params) 
	{
		$file = $this->assetPath . urldecode($params[0]);
		if (is_file($file))
			return download($file, false);
		
		header('Location: /');
		exit;
	}

	public function download($params) 
	{
		if (!isset($params[0]))	return false;

		$file = $this->rootPath . urldecode($params[0]);
		if (is_file($file))	download($file);

		header('Location: /');
		exit;
	}

	public function stream ($params)
	{
		if (!isset($params[0])) return false;

		$file = $this->rootPath . urldecode($params[0]);
		if (is_file($file)) {
			$stm = new \Lib\Stream($file);
			$stm->start();
		}
		exit;
	}
}