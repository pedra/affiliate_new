<?php

namespace Module;

class Ping
{
    public function __construct()
    {
        
    }

	public function index($params, $queries, $post)
	{
		return ["pong" => true];
	}
}