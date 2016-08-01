<?php
/*
Class sql de Triton :D (23/08/2012)

Exemples :

Insertion d'une entrée dans la table joueurs :
	Sql::insert('joueurs', 'tom', 45);
	Sql::insert('joueurs', array('prenom' => 'tom', 'age' => 45));

Suppression d'entrées dans la table joueurs :
	Sql::delete('joueurs', 'nombre = ?', 45);

Mise à jour d'entrées dans la table joueurs :
	Sql::update('joueurs', array('nombre' => 69), 'nombre = ?', 45);

Selection d'entrées dans la table joueurs :
	print_r(Sql::selectOne('joueurs', 'id = ?', 1));

	Sql::select('joueurs', 'nombre = ?', 45);
	while ($data = Sql::getData())
	{
		print_r($data);
	}

Comptage d'entrées dans la table joueurs :
	$nombre = Sql::count('joueurs', 'nombre = ?', 45);
*/
$GLOBALS['sqlDebugMode'] = false;

class Sql
{
	public static function generateQuery($arguments, $currentArgument)
	{
		$query = $arguments[$currentArgument];
		$currentArgument++;
		
		$position = 0;
		while (count($arguments) > $currentArgument && (($position = @strpos($query, '?', $position)) !== false))
		{
			$argument = $arguments[$currentArgument];
			$currentArgument++;
			
			if (is_string($argument))
				$argument = Sql::rc()->quote($argument);
			
			$query = substr_replace($query, $argument, $position, 1);
			$position += strlen($argument);
		}
		return $query;
	}
	
	
	public static function insert()//table, values ---------- Exemple : Sql::insert('joueurs', 'tom', 45);
	{
		$arguments = func_get_args();
		
		$table = $arguments[0];
		
		$query = 'INSERT INTO '.$table;
		
		if (is_array($arguments[1]))
		{
			$query .= ' (';
			$first = true;
			foreach ($arguments[1] as $field => $value)
			{
				if (!$first)
					$query .= ', ';
				$first = false;
				
				$query .= $field;
			}
			$query .= ')';
		}
		
		$query .= ' VALUES(';
		
		if (is_array($arguments[1]))
			$arguments = array_merge(array(''), array_values($arguments[1]));
			
		for ($i = 1; $i < count($arguments); $i++)
		{
			if ($i > 1)
				$query .= ', ';
				
			if (is_string($arguments[$i]))
				$query .= Sql::rc()->quote($arguments[$i]);
			else
				$query .= intval($arguments[$i]);
		}
		
		$query .= ')';
		
		Sql::displayDebug($query);

		Sql::rc()->query($query);
	}
	
	public static function delete()//table, request, values ---------- Exemple : Sql::delete('joueurs', 'nombre = ?', 45);
	{
		$arguments = func_get_args();
		
		$table = $arguments[0];
		
		$query = 'DELETE FROM '.$table;
		
		if (count($arguments) > 1)
		{
			$query .= ' WHERE ';
			$query .= Sql::generateQuery($arguments, 1);
		}
		
		Sql::displayDebug($query);

		Sql::rc()->query($query);
	}
	
	public static function update()//table, newValues, request, values ---------- Exemple : Sql::update('joueurs', array('nombre' => 69), 'nombre = ?', 45);
	{
		$arguments = func_get_args();
		
		$table = $arguments[0];
		$newValues = array_values($arguments[1]);
		$newValuesKeys = array_keys($arguments[1]);
		
		$query = 'UPDATE '.$table.' SET ';
		
		for ($i = 0; $i < count($newValues); $i++)
		{
			if ($i > 0)
				$query .= ', ';
				
			$query .= $newValuesKeys[$i].' = ';
			
			if (is_string($newValues[$i]))
				$query .= Sql::rc()->quote($newValues[$i]);
			else
				$query .= intval($newValues[$i]);
		}
		
		if (count($arguments) > 2)
		{
			$query .= ' WHERE ';
			$query .= Sql::generateQuery($arguments, 2);
		}
		
		Sql::displayDebug($query);

		Sql::rc()->query($query);
	}
	
	public static function select()//table, request, values, select ---------- Exemple : Sql::select('joueurs', 'nombre = ?', 45); AND Sql::getData()
	{
		$arguments = func_get_args();
		
		$table = $arguments[0];
		
		if (count($arguments) > 2 && count($arguments) - 2 > substr_count($arguments[1], '?'))
			$select = $arguments[count($arguments) - 1];
		else
			$select = '*';
		
		$query = 'SELECT '.$select.' FROM '.$table;
		
		if (count($arguments) > 1)
		{
			$query .= ' WHERE ';
			$query .= Sql::generateQuery($arguments, 1);
		}
		
		Sql::displayDebug($query);

		$GLOBALS['queries'][] = Sql::rc()->query($query);
		$GLOBALS['lastSelectId'] = count($GLOBALS['queries']) - 1;
		return count($GLOBALS['queries']) - 1;
	}
	
	public static function selectOne()//table, request, values, select ---------- Exemple : $data = Sql::select('joueurs', 'id = ?', 10);
	{
		forward_static_call_array(array('Sql', 'select'), func_get_args());
		return Sql::getData();
	}
	
	public static function count()//table, request, values ---------- Exemple : Sql::count('joueurs', 'nombre = ?', 45); AND Sql::getData()
	{
		$arguments = func_get_args();
		
		$table = $arguments[0];
		
		$query = 'SELECT COUNT(*) AS number FROM '.$table;
		
		if (count($arguments) > 1)
		{
			$query .= ' WHERE ';
			$query .= Sql::generateQuery($arguments, 1);
		}
		
		Sql::displayDebug($query);

		$GLOBALS['queries'][] = Sql::rc()->query($query);
		$data = Sql::getData(count($GLOBALS['queries']) - 1);
		return $data['number'];
	}
	
	public static function query()//request, values
	{
		$arguments = func_get_args();
		
		$query = '';
		$query .= Sql::generateQuery($arguments, 0);
		
		Sql::displayDebug($query);

		$GLOBALS['queries'][] = Sql::rc()->query($query);
		return count($GLOBALS['queries']) - 1;
	}
	
	public static function getData($queryId = -1)//Exemple : while ($data = Sql::getData()) { print_r($data); }
	{
		if ($queryId == -1)
			$queryId = $GLOBALS['lastSelectId'];
		return $GLOBALS['queries'][$queryId]->fetch(PDO::FETCH_ASSOC);
	}
	
	public static function getLastInsertId()
	{
		return Sql::rc()->lastInsertId();
	}
	
	public static function displayDebug($query)
	{
		if (Sql::isDebugMode())
			echo '<strong style="color:red;">[SQL DEBUG MODE] </strong>'.$query.' <strong style="color:red;">[END]</strong>';
	}
	
	public static function setDebugMode($value)
	{
		$GLOBALS['sqlDebugMode'] = $value;
		if ($value)
			$GLOBALS['db']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		else
			$GLOBALS['db']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
	}
	
	public static function isDebugMode()
	{
		return $GLOBALS['sqlDebugMode'];
	}
	
	public static function protect($v, $html = false)
	{
		if ($html)
			$v = html($v);
		return Sql::rc()->quote($v);
	}
	
	public static function rc()
	{
		return $GLOBALS['db'];
	}
	
	public static function init($host = 'localhost', $database, $login, $pass)
	{
		$bdd = new PDO("mysql:host=" .$host.";dbname=" .$database."", "".$login."", "".$pass."");
		$bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
		$bdd->query("SET NAMES 'utf8'");
		$GLOBALS['db'] = $bdd;
	}
}
?>
