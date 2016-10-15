function applyCssMinification($dir)
{
	$Minifier = "C:\Program Files (x86)\Microsoft\Microsoft Ajax Minifier\AjaxMin.exe";
	get-childitem $dir -recurse -force -include *.css -exclude *.min.css | 
		foreach-object {&$Minifier $_.FullName -out $_.FullName -clobber}
}

function applyJsMinification($dir)
{
	$Minifier = "C:\Program Files (x86)\Microsoft\Microsoft Ajax Minifier\AjaxMin.exe";
	get-childitem $dir -recurse -force -include *.js -exclude *.min.js | 
		foreach-object {&$Minifier $_.FullName -out $_.FullName -clobber}
}

cat scripts/*.js, partials/*.js, app.js | sc app-bundle.js
cat styles/*.css | sc app-bundle.css

applyJsMinification "app-bundle.js"
applyCssMinification "app-bundle.css"