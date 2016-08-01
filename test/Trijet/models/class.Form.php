<?php
class Form
{
	public static function start($legend, $action = "", $method = 'post')
	{
?>
<form class="form-horizontal" method="<?php echo $method; ?>" action="<?php echo $action; ?>">
<fieldset>

<!-- Form Name -->
<legend><?php echo $legend; ?></legend>
<?php
	}
	
	public static function text($id, $label, $options = array())
	{
		if (!empty($options['value']) && !isset($_POST[$id]))
			$_POST[$id] = $options['value'];
?>
<div class="form-group"<?php if (!empty($options['blockStyle'])) echo ' style="'.$options['blockStyle'].'"'; ?>>
  <label class="col-md-4 control-label" for="<?php echo $id; ?>"><?php echo $label; ?></label>  
  <div class="col-md-4">
  <input id="<?php echo $id; ?>" name="<?php echo $id; ?>"<?php if (!empty($options['other'])) echo ' '.$options['other']; ?> value="<?php echo @$_POST[$id]; ?>" type="text" placeholder="<?php echo @$options['placeholder']; ?>" class="form-control input-md"<?php if (isset($options['required'])) echo ' required=""'; ?>>
  <?php if (!empty($options['help'])){ ?>
  <span class="help-block"><?php echo $options['help']; ?></span>  
  <?php } ?>
  </div>
</div>
<?php
	}
	
	public static function hidden($id, $value)
	{
?>
		<input type="hidden" name="<?php echo $id; ?>" id="<?php echo $id; ?>" value="<?php echo $value; ?>" />
<?php	
	}
	
	public static function email($id, $label, $options = array())
	{
		if (!empty($options['value']) && !isset($_POST[$id]))
			$_POST[$id] = $options['value'];
?>
<div class="form-group">
  <label class="col-md-4 control-label" for="<?php echo $id; ?>"><?php echo $label; ?></label>  
  <div class="col-md-4">
  <input id="<?php echo $id; ?>" name="<?php echo $id; ?>" value="<?php echo @$_POST[$id]; ?>" type="email" placeholder="" class="form-control input-md"<?php if (isset($options['required'])) echo ' required=""'; ?>>
  <?php if (!empty($options['help'])){ ?>
  <span class="help-block"><?php echo $options['help']; ?></span>  
  <?php } ?>
  </div>
</div>
<?php
	}
	
	public static function password($id, $label, $options = array())
	{
?>
<div class="form-group">
  <label class="col-md-4 control-label" for="<?php echo $id; ?>"><?php echo $label; ?></label>
  <div class="col-md-4">
    <input id="<?php echo $id; ?>" name="<?php echo $id; ?>" type="password" placeholder="" class="form-control input-md"<?php if (isset($options['required'])) echo ' required=""'; ?>>
  <?php if (!empty($options['help'])){ ?>
  <span class="help-block"><?php echo $options['help']; ?></span>  
  <?php } ?>
  </div>
</div>
<?php
	}
	
	public static function textarea($id, $label, $options = array())
	{
		if (!empty($options['value']) && !isset($_POST[$id]))
			$_POST[$id] = $options['value'];
?>
<div class="form-group">
  <label class="col-md-4 control-label" for="<?php echo $id; ?>"><?php echo $label; ?></label>
  <div class="col-md-4">                     
    <textarea class="form-control" rows="5" id="<?php echo $id; ?>" placeholder="<?php echo @$options['placeholder']; ?>" name="<?php echo $id; ?>"<?php if (isset($options['required'])) echo ' required=""'; ?>><?php echo @$_POST[$id]; ?></textarea>
  <?php if (!empty($options['help'])){ ?>
  <span class="help-block"><?php echo $options['help']; ?></span>  
  <?php } ?>
  </div>
</div>
<?php
	}
	
	public static function select($id, $label, $options = array())
	{
		if (!empty($options['value']) && !isset($_POST[$id]))
			$_POST[$id] = $options['value'];
		$GLOBALS['lastSelect'] = $id;
?>
<div class="form-group">
  <label class="col-md-4 control-label" for="<?php echo $id; ?>"><?php echo $label; ?></label>
  <div class="col-md-4">
    <select id="<?php echo $id; ?>" name="<?php echo $id; ?>" class="form-control">
<?php
	}
	
	public static function option($value, $text, $options = array())
	{
?>
      <option value="<?php echo $value; ?>"<?php if ((isset($_POST[$GLOBALS['lastSelect']]) && $_POST[$GLOBALS['lastSelect']] == $value) || isset($options['selected'])) echo ' selected="selected"'; ?><?php if (!empty($options['other'])) echo ' '.$options['other']; ?>><?php echo $text; ?></option>
<?php
	}
	
	public static function aselect()
	{
?>
    </select>
  </div>
</div>
<?php
	}
	
	public static function radios($id)
	{
		$GLOBALS['currentRadio'] = $id;
?>
			<div class="form-group">
			  <label class="col-md-4 control-label" for="status">Status</label>
			  <div class="col-md-4">
<?php
	}
	
	public static function radio($value, $label)
	{
?>
			  <div class="radio">
				<label for="<?php echo $GLOBALS['currentRadio']; ?>-<?php echo $value; ?>">
				  <input type="radio" name="<?php echo $GLOBALS['currentRadio']; ?>" id="<?php echo $GLOBALS['currentRadio']; ?>-<?php echo $value; ?>" value="<?php echo $value; ?>"<?php if (@$_POST[$GLOBALS['currentRadio']] == $value) echo ' checked="checked"'; ?>>
				  <?php echo $label; ?>
				</label>
				</div>
<?php
	}
	
	public static function aradios()
	{
?>
			  </div>
			</div>
<?php
	}
	
	public static function end($label)
	{
?>
<div class="form-group">
	<label class="col-md-4"></label>
  <div class="col-md-4">
    <button class="btn btn-primary"><?php echo $label; ?></button>
  </div>
</div>
</fieldset>
</form>
<?php
	}
	
	public static function exists()
	{
		return !empty($_POST);
	}
	
	public static function complete()
	{
		$arguments = func_get_args();
		
		foreach ($arguments as $a)
		{
			if (empty($_POST[$a]))
				return false;
		}
		return true;
	}
	
	public static function same($a, $b)
	{
		return !strcmp($a, $b);
	}
	
	public static function valid_email($e)
	{
		return filter_var($e, FILTER_VALIDATE_EMAIL);
	}
	
	
	/* AJOUT POUR LE SITE MICROGRID */
	
	public static function doubletextarea($id, $id2, $label, $options = array(), $options2 = array())
	{
?>
<div class="form-group">
  <label class="col-md-4 control-label" for="<?php echo $id; ?>"><?php echo $label; ?></label>
  <div class="col-md-4">                     
    <textarea class="form-control" rows="5" id="<?php echo $id; ?>" placeholder="<?php echo @$options['placeholder']; ?>" name="<?php echo $id; ?>"><?php echo @$_POST[$id]; ?></textarea>
  <?php if (!empty($options['help'])){ ?>
  <span class="help-block"><?php echo $options['help']; ?></span>  
  <?php } ?>
  </div>
  <div class="col-md-4">                     
    <textarea class="form-control" rows="5" id="<?php echo $id2; ?>" placeholder="<?php echo @$options2['placeholder']; ?>" name="<?php echo $id2; ?>"><?php echo @$_POST[$id2]; ?></textarea>
  <?php if (!empty($options2['help'])){ ?>
  <span class="help-block"><?php echo $options2['help']; ?></span>  
  <?php } ?>
  </div>
</div>
<?php
	}
}
?>
