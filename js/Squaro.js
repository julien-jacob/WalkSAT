 /*  ------------------------------------------------------------------------------  **
 **                                    Projet Squaro                                 **
 **  ------------------------------------------------------------------------------  **
 **  Logique propositionnelle et logique du premier ordre appliqué au jeu du Squaro  **
 **                 		JACOB Julien et HECKMANN Victor                  		 **
 **  ------------------------------------------------------------------------------  **
 **   Jeu de squaro et transformations en problème de logique propositionnelle       **
 **  ------------------------------------------------------------------------------  */


 function squaroGrid(width, height, name, solvable) {

	this.gridHeight				= width    || 0;
	this.gridWidth				= height   || 0;
	this.name					= name;

	solvable					= solvable;		// true : la grille générer a une solution
	this.useArrayImposeCheck	= true;					// true : les ronds sont imposer dans le dimacs

	this.arrayImposeCheck		= new Array();
	this.arrayValue				= new Array();
	this.arrayCheckSolution		= new Array();
	this.arrayCheckSolutionSAT	= new Array();

	this.dimacs                         = function() 				{ return squaro_dimacs(this); };
	
	// Creation et coloration de la grille 
	this.newSolvableGrid                = function() 		    	{ squaro_newSolvableGrid(this); };
	this.newRandomGrid                  = function()            	{ squaro_newRandomGrid(this); };
	this.updateArrayCheckSolution       = function(divName)     	{ squaro_readArrayImposeCheck(divName, this);}; 
	this.colorGrid	                    = function(divName) 		{ squaro_coloration(divName, this); };	
				

	// Valeurs numeriques 
	this.arrayCheckCountChecked 		= function()            	{ return squaro_countCheck(this.arrayImposeCheck); };
	this.arrayCheckSolutionCountChecked = function()            	{ return squaro_countCheck(this.arrayCheckSolution); };
	this.countCheckbox                  = function()            	{ return ((this.gridWidth+1) * (this.gridHeight+1)); };
	this.countCases                     = function()            	{ return ((this.gridWidth) * (this.gridHeight)); };
	this.countCasesIs                   = function(searchValue) 	{ return squaro_countCasesIs(this, searchValue); };
	this.sumValue                       = function()            	{ return squaro_sumValue(this);};

	// gestion graphiques
	this.printGrid 				        = function(divName, impose) { squaro_printGrid(divName, this, impose); this.colorGrid(divName); };
	this.printGenerateSolutionSAT 	    = function(divName)			{ this.printGrid(divName);squaro_printCheck(divName,this.arrayCheckSolutionSAT);this.colorGrid(divName); };

	this.printGenerateSolution 	        = function(divName)     	{ this.printGrid(divName);squaro_printCheck(divName,this.arrayCheckSolution); this.colorGrid(divName); };
	this.checkAllCheckboxs              = function(divName)     	{ squaro_checkAllCheckboxs(this, divName, true);  this.colorGrid(divName); };
	this.uncheckAllCheckboxs            = function(divName)     	{ squaro_checkAllCheckboxs(this, divName, false); this.colorGrid(divName); };

	/************************
	 **    CONSTRUCTION    **
	************************/

	// remplir arrayImposeCheck de false
	for (var x = 0; x <= this.gridHeight; x++) {
		this.arrayImposeCheck[x] = new Array();
		for (var y = 0; y <= this.gridWidth; y++) {
			this.arrayImposeCheck[x][y] = false;
		}
	}

	// Creer la grille lors de la construction
	if (solvable)   { this.newSolvableGrid(); } 
	else            { this.newRandomGrid();}

	// remplir arrayCheckSolutionSAT
	
	//alert(this.arrayCheckSolutionSAT);
	return true;
 }


 /*  ------------------------------------------------------------------------------  */
 function squaro_getSatSolution(sg) {
 	var sortieDimacs = WalkSat(sg.dimacs());
 	var comp = 0;
 	if (sortieDimacs != "Unsolvable") {
		for (var x = 0; x < sg.gridHeight+1; x++) {
			sg.arrayCheckSolutionSAT[x] = new Array();
			for (var y = 0; y < sg.gridWidth+1; y++) {
				sg.arrayCheckSolutionSAT[x][y] = sortieDimacs[comp];
				comp++;
			}
		}
	} else {
		sg.arrayCheckSolutionSAT = "Unsolvable";
	}
 }


 function squaro_sumValue(sg) {
	var sumValue = 0;
	for (var x = 0; x < sg.gridHeight; x++) {
		for (var y = 0; y < sg.gridWidth; y++) {
			sumValue += sg.arrayValue[x][y];
		}
	}
	return sumValue;
}

function squaro_countCasesIs(sg, searchValue) {
	var counterValue = 0;
	for (var x = 0; x < sg.gridHeight; x++) {
		for (var y = 0; y < sg.gridWidth; y++) {
			if (sg.arrayValue[x][y] == searchValue ) { counterValue++; } 
		}
	}
	return counterValue;
}


function squaro_dimacs(sg) {

	var nb_clauses = 0;
	var nb_var_dimacs = sg.countCheckbox();
	var dimacs = "";
	var modele = "";

	for (var x = 0; x < sg.gridHeight; x++) {
		for (var y = 0; y < sg.gridWidth; y++) {

			switch (sg.arrayValue[x][y]) {
				// -X1  .  -X2  . -X3   . -X4 
				case 0 : 
					nb_clauses += 4;
					modele = " -X1\n";
					modele +=" -X2\n";
					modele +=" -X3\n";
					modele +=" -X4\n";
				break;

				case 1 : 
					nb_clauses += 12;
					modele  =" -X1 -X2 -X3 -X4\n";
					modele +=" -X1 -X2 -X3  X4\n";
					modele +=" -X1 -X2  X3 -X4\n";
					modele +=" -X1 -X2  X3  X4\n";
					modele +=" -X1  X2 -X3 -X4\n";
					modele +=" -X1  X2 -X3  X4\n";
					modele +=" -X1  X2  X3 -X4\n";
					modele +="  X1 -X2 -X3 -X4\n";
					modele +="  X1 -X2 -X3  X4\n";
					modele +="  X1 -X2  X3 -X4\n";
					modele +="  X1  X2 -X3 -X4\n";
					modele +="  X1  X2  X3  X4\n";
				break;

				case 2 :
					nb_clauses += 10;
					modele = " -X1 -X2 -X3 -X4\n";
					modele +=" -X1 -X2 -X3  X4\n";
					modele +=" -X1 -X2  X3 -X4\n";
					modele +=" -X1  X2 -X3 -X4\n";
					modele +=" -X1  X2  X3  X4\n";
					modele +="  X1 -X2 -X3 -X4\n";
					modele +="  X1 -X2  X3  X4\n";
					modele +="  X1  X2 -X3  X4\n";
					modele +="  X1  X2  X3 -X4\n";
					modele +="  X1  X2  X3  X4\n";
				break;

				case 3 :
					nb_clauses += 12;
					modele = " -X1 -X2 -X3 -X4\n";
					modele +=" -X1 -X2  X3  X4\n";
					modele +=" -X1  X2 -X3  X4\n";
					modele +=" -X1  X2  X3 -X4\n";
					modele +=" -X1  X2  X3  X4\n";
					modele +="  X1 -X2 -X3  X4\n";
					modele +="  X1 -X2  X3 -X4\n";
					modele +="  X1 -X2  X3  X4\n";
					modele +="  X1  X2 -X3 -X4\n";
					modele +="  X1  X2 -X3  X4\n";
					modele +="  X1  X2  X3 -X4\n";
					modele +="  X1  X2  X3  X4\n";
				break;

				case 4 :
					nb_clauses += 4;
					modele  =" X1\n";
					modele +=" X2\n";
					modele +=" X3\n";
					modele +=" X4\n";
				break;

				default: modele = ""; nb_clauses = 0; break;
			}

			//alert(x + " - " + y);
			modele = modele.replace(/X1/g, (x*sg.gridWidth)+1 + y+x);
			modele = modele.replace(/X2/g, (x*sg.gridWidth)+1 + y+x + 1);
			modele = modele.replace(/X3/g, sg.gridWidth + (x*sg.gridWidth)+1 + y+x + 1);
			modele = modele.replace(/X4/g, sg.gridWidth + (x*sg.gridWidth)+1 + y+x + 2);

			dimacs += modele + "\n";
		} // fin du for y
	} // fin du for x

	if (sg.useArrayImposeCheck) {
		var comp = 1;
		for (var x = 0; x < sg.gridHeight+1; x++) {
			for (var y = 0; y < sg.gridWidth+1; y++) {
				if (sg.arrayImposeCheck[x][y]) { dimacs += " " + comp + " \n"; }
				comp++;
			}
		}
	}

	return " p cnf " + nb_var_dimacs + " " + nb_clauses + "\n" + dimacs;
}




 

 function squaro_readArrayImposeCheck(divName, sg) {
 	if (sg.useArrayImposeCheck) {
 		for (var x = 0; x < sg.gridHeight+1; x++) {
			sg.arrayImposeCheck[x] = new Array();
			for (var y = 0; y < sg.gridWidth+1; y++) {
				sg.arrayImposeCheck[x][y] = document.getElementById(divName+"C_"+x+"_"+y).checked ;
			}
		}
 	}

 }

 function squaro_coloration(divName, sg) {
	for (var x = 0; x < sg.gridHeight; x++) {
		for (var y = 0; y < sg.gridWidth; y++) {
			var check_par_case = 0;
			if (document.getElementById(divName+"C_"+x+"_"+ y).checked)         { check_par_case++; }
			if (document.getElementById(divName+"C_"+x+"_"+ (y+1)).checked)     { check_par_case++; }
			if (document.getElementById(divName+"C_"+(x+1)+"_"+ y).checked)     { check_par_case++; }
			if (document.getElementById(divName+"C_"+(x+1)+"_"+ (y+1)).checked) { check_par_case++; }
			
			if (check_par_case == sg.arrayValue[x][y]) {
				document.getElementById(divName+"S_"+x+"_"+y).style.color = "green";
			} else {
				document.getElementById(divName+"S_"+x+"_"+y).style.color = "red";
			}
		}
	}

 }

 function squaro_countCheck(arrayCheck) {
	var compteur = 0;
	for (var x = 0; x < arrayCheck.length; x++) {
		for (var y = 0; y < arrayCheck[x].length; y++) {
			if (arrayCheck[x][y]) { compteur++; }
		}
	}
	return compteur;
 }

 function squaro_printCheck(divName, arrayCheck) {
	for (var x = 0; x < arrayCheck.length; x++) {
		for (var y = 0; y < arrayCheck[x].length; y++) {
			document.getElementById(divName+"C_"+x+"_"+y).checked = arrayCheck[x][y];
		}
	}
 }

 function squaro_checkAllCheckboxs(sg, divName, checked) {
	for (var x = 0; x < sg.gridHeight+1; x++) {
		for (var y = 0; y < sg.gridWidth+1; y++) {
			//alert(x + " - " + y);
			document.getElementById(divName+"C_"+x+"_"+y).checked = checked;
		}
	}
 }


 function squaro_newSolvableGrid(sg) {	
	// Remplir arrayCheckSolution 
	for (var x = 0; x < sg.gridHeight+1; x++) {
		sg.arrayCheckSolution[x] = new Array();
		for (var y = 0; y < sg.gridWidth+1; y++) {
			sg.arrayCheckSolution[x][y] = randomBool();
		}
	}
	//remplir arrayValue
	var check_par_case = 0;
	for (var x = 0; x < sg.gridHeight; x++) {
		sg.arrayValue[x] = new Array();
		for (var y = 0; y < sg.gridWidth; y++) {
			check_par_case = 0;
			if (sg.arrayCheckSolution[x]   [y]	)    { check_par_case++; }
			if (sg.arrayCheckSolution[x]   [y+1])    { check_par_case++; }
			if (sg.arrayCheckSolution[x+1] [y]	)    { check_par_case++; }
			if (sg.arrayCheckSolution[x+1] [y+1])    { check_par_case++; }
			sg.arrayValue[x][y] = check_par_case;
		}
	}
 }

 function squaro_newRandomGrid(sg) {  
	// Remplir arrayCheckSolution de false
	for (var x = 0; x < sg.gridHeight+1; x++) {
		sg.arrayCheckSolution[x] = new Array();
		for (var y = 0; y < sg.gridWidth+1; y++) {
			sg.arrayCheckSolution[x][y] = false;
		}
	}
	//remplir arrayValue
	var check_par_case = 0;
	for (var x = 0; x < sg.gridHeight; x++) {
		sg.arrayValue[x] = new Array();
		for (var y = 0; y < sg.gridWidth; y++) { sg.arrayValue[x][y] = rand(0,4);}
	}
 }

function squaro_printGrid(divName, sg, impose) {
	var html = "<table>";
	for (var x = 0; x < sg.gridHeight; x++) {
		html += "<tr>";
		for (var y = 0; y < sg.gridWidth+1; y++) {
			html += "<th><input type='checkbox' onclick='";
			html += sg.name + ".colorGrid(\"" + divName + "\"); ";
			if (impose) { // la grille alctualisera ara arrayImposeCheck
				html += sg.name + ".updateArrayCheckSolution(\"" + divName + "\"); " ;
			}
			html += "' id='"+ divName+"C_"+x+"_"+y +"'></th> <th></th>";
		}
		html += "</tr><tr>";
		for (var y = 0; y < sg.gridWidth; y++) {
			html += "<th></th> <th><span id='"+ divName+"S_"+x+"_"+y +"'>" + sg.arrayValue[x][y];
			html += "</span></th> ";
		}
		html += "</tr>";
	}
	html += "<tr>";
	for (var y = 0; y < sg.gridWidth+1; y++) {
		html += "<th><input type='checkbox' onclick='";
		html += sg.name +".colorGrid(\"" + divName + "\");";
		html += "' id='"+ divName+"C_"+x+"_"+y +"'></th> <th></th>";
	}
	html += "</tr></table>";
	document.getElementById(divName).innerHTML = html;
}
  
var randomBool_density = 50;
function randomBool()   { return parseInt(Math.random() * 100) <= randomBool_density; }
function rand(min, max) { return parseInt(Math.random() * ((max+1) - min) + min); }
