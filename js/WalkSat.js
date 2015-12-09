 /*  ------------------------------------------------------------------------------  **
 **                                    Projet Squaro                                 **
 **  ------------------------------------------------------------------------------  **
 **  Logique propositionnelle et logique du premier ordre appliqué au jeu du Squaro  **
 **                 		JACOB Julien et HECKMANN Victor                  		 **
 **  ------------------------------------------------------------------------------  **
 **   									- WALK SAT -      							 **
 **  ------------------------------------------------------------------------------  */


var WalkSat_nbIterartionsMax = 25000;
var WalkSatOptions = { 
	"clauseUnitaire" 				: true, 
	"eliminationClausesDoubles"		: true, 
	"ContradictionClausesUnitaires" : true,
	"SauvegardeAssignationsTestees"	: true
};

var WalkSatLOG = {
	"iterationAssignation"	: 0,
	"iterationWalkSat" 		: 0,
	"tempsExecution" 		: 0,
	"messageErreur" 		: ""
};
var assignationPrecedentes = new Array();

function WalkSat(dimacs) {
 	WalkSatLOG["iterationAssignation"] = 0;
 	WalkSatLOG["iterationWalkSat"] = 0;
 	WalkSatLOG["tempsExecution"] = 0;
 	WalkSatLOG["messageErreur"] = "";
 	assignationPrecedentes = new Array();

 	var dateDebut = Date.now();
 	var clauses = mise_En_Forme_Clausale(dimacs);

 	// La 1ere ligne du tableau contient l'entete 
 	if ((clauses[0][0] != "p") || (clauses[0][1]) != "cnf") {
 		WalkSatLOG["messageErreur"] = "Forme normale conjonctive attendu.";
 		return "Unsolvable";
 	}
 	var nbVariables = clauses[0][2];
 	var nbClauses = clauses[0][3];

 	clauses.splice(0, 1);

	var modeleFound = false;
 	var assignation = creer_assignation(nbVariables, clauses);
 	if (WalkSatLOG["SauvegardeAssignationsTestees"]) { assignationPrecedentes.push(assignation); }

 	// Unsolvable si des clauses unitaires se contredisent
 	if (assignation === false) { return "Unsolvable"; }

	var estDansUnitaire = assignation["estDansUnitaire"];
	assignation = assignation["assignation"];

 	WalkSatLOG["iterationWalkSat"] = 0;
 	for (var i = 0; (i < WalkSat_nbIterartionsMax) && !estModele(assignation, clauses); i++) {
 		// Resortir un ensemble de clauses invalide de l'ensemble de clauses globale
 		// Choisir au hasard une clause dans ce sous ensemble
 		var tempClause = clauseInvalide(clauses, assignation);
 		if (walksat_randomBool_seuil()) {
		// Choisir une variable de maniere deterministe
			// On choisit la variable qui a la plus d'occurences en négatif ou en positif dans l'ens' de clauses
			var tempVariable = variableMeilleurScore(tempClause, dimacs, assignation, estDansUnitaire);
 		} else {
		// Choisir une variable de maniere aléatoire
			var tempVariable = tempClause[rand(0, tempClause.length-1)];	
 		}
 		// Inversement de la valeur de tempVariable dans assignation
 		assignation[Math.abs(tempVariable)-1] = !assignation[Math.abs(tempVariable)-1];
 		if (WalkSatLOG["SauvegardeAssignationsTestees"]) { assignationPrecedentes.push(assignation); }
 		WalkSatLOG["iterationWalkSat"] = i;
 	}

	WalkSatLOG["tempsExecution"] = Date.now() - dateDebut;

	return estModele(assignation, clauses) ? assignation : "Unsolvable";
}


function variableMeilleurScore(clause, dimacs, assignation, estDansUnitaire) {
	var idVariableRes = 0;
	var scoreCur, scoreMax = 0;
	// Pour chaque variable de la clause
	for (var i = 0; i < clause.length; i++) {
		// Si on gère les clauses unaires
		if (WalkSatOptions["clauseUnitaire"]) {
		// AMELIORATION : Clause Unitaire
			// Si elle n'est pas dans une clause unitaires
			if (!estDansUnitaire[Math.abs(clause[i])-1]) {
				scoreCur		= score(clause[i], assignation, dimacs);
				scoreMax		= (scoreCur > scoreMax) ? scoreCur : scoreMax;
				idVariableRes	= (scoreCur > scoreMax) ? i : idVariableRes;
			}
		// FIN AMELIORATION : Clause Unitaire
		} else {
			scoreCur		= score(clause[i], assignation, dimacs);
			scoreMax		= (scoreCur > scoreMax) ? scoreCur : scoreMax;
			idVariableRes	= (scoreCur > scoreMax) ? i : idVariableRes;
		}
		if (WalkSatLOG["SauvegardeAssignationsTestees"]) {
			var tempAssignation = assignation;
			tempAssignation[clause[idVariableRes]] = !tempAssignation[clause[idVariableRes]];
			if (assignationPrecedentes.indexOf(tempAssignation) === -1)
			{
				return clause[idVariableRes];
			}
		}
	}
	return clause[idVariableRes];
}


function score(variable, assignation, dimacs) {
	var regEx1 = new RegExp("-" + Math.abs(variable), "g"); // Negatif
	var regEx2 = new RegExp(""  + Math.abs(variable), "g"); // Positif
	var occNeg = dimacs.match(regEx1).length;
	var occPos = dimacs.match(regEx2).length - occNeg;
	if (assignation[Math.abs(variable)-1]) {
		return occNeg - occPos;
	} else {
		return occPos - occNeg;
	}
}


function clauseInvalide(clauses, assignation) {
	var x = rand(0, clauses.length-1);
	if (WalkSatOptions["clauseUnitaire"]) {
		while (estValide(clauses[x], assignation) || clauses.length == 1) {
			x = rand(0, clauses.length-1);
		}
	} else {
		while (estValide(clauses[x], assignation)) {
			x = rand(0, clauses.length-1);
		}
	}
	return clauses[x];
}


function estValide(clause, assignation) {
	var est_Valide = false;
	for (var x = 0; (x < clause.length) && (!est_Valide); x++) {
		if (clause[x] > 0) {
			est_Valide = est_Valide || (assignation[clause[x]-1]);
		} else {
			est_Valide = est_Valide || (!assignation[Math.abs(clause[x])-1]);
		}
	}
	return est_Valide;
}


function creer_assignation(nb_var, clauses) {
	var tab_assignation = new Array();
	var tab_unitaire = new Array();
	
	// AMELIORATION : Clause Unitaire
	if (WalkSatOptions["clauseUnitaire"]) {
		// Pour chaque clause
		for (var i = 0; i < clauses.length; i++) {
			// Si elle ne contient qu'une variable
			if (clauses[i].length == 1) {
				// Cette variable est dans une clause unitaire
				tab_unitaire[(Math.abs(clauses[i][0])-1)] = true;

				if (WalkSatOptions["ContradictionClausesUnitaires"]) {
				// AMELIORATION : Contradictions des Clauses Unitaires
					if (tab_assignation[(Math.abs(clauses[i][0])-1)] === undefined) {
					// Si la variable n'a pas encore eu de valeur
						tab_assignation[(Math.abs(clauses[i][0])-1)] = (clauses[i][0] > 0);
					} else {
					// Si elle a deja une valeur
						// Si la valeur de la variable est differente que celle deja enregistre
						if (tab_assignation[(Math.abs(clauses[i][0])-1)] != (clauses[i][0] > 0)) {
							// Des clauses unitaires se contredisent
							WalkSatLOG["messageErreur"] = "Contradiction de clauses unitaires.";
							return false;	// L'ensembles de clauses n'a aucune solution
						} // else il y a des clauses unitaires en double
					}
				// FIN AMELIORATION : Contradictions des Clauses Unitaires
				} else {
				// Sinon si on ne gere pas les clauses contradictoires
					// La valeur de la clause est choisit en fonction du signe de la variable
					tab_assignation[(Math.abs(clauses[i][0])-1)] = (clauses[i][0] > 0);
				}
			}
		}
	}
	// FIN AMELIORATION : Clause Unitaire
	
	// Pour chaque variable de l'assignation
	for (var i = 0; i < nb_var; i++) {
		if (tab_assignation[i] === undefined) {
		// Si cette variable n'est pas encore définit
			// On lui donne une valeur aléatoire
			tab_assignation[i] = walksat_randomBool();
			
			if (WalkSatOptions["clauseUnitaire"]) {
				tab_unitaire[i] = false; }
			else {
				tab_unitaire[i] = undefined; }
		} // Sinon cette variable était présente dans une clause unitaire
	}
	var x = [];
	x["assignation"] = tab_assignation;
	x["estDansUnitaire"] = tab_unitaire;

	return x;
}


function mise_En_Forme_Clausale(dimacs) {
	dimacs = dimacs.trim();
 	var clauses = new Array();
 	while (dimacs.indexOf("\n\n") > 0) { dimacs = dimacs.replace("\n\n", "\n"); }
 	while (dimacs.indexOf("  ") > 0) { dimacs = dimacs.replace("  ", " "); }
 	clauses = dimacs.split("\n");

 	// AMELIORATION : Eliminatation des Clauses en Doubles
 	if (WalkSatOptions["eliminationClausesDoubles"]) {
 		clauses = cleanArray(clauses);
 	}
 	
 	for (var x = 0; x < clauses.length; x++) {
 		clauses[x] = clauses[x].trim(); // Permet d'enlever les espaces en trop dans le string de la clause x
 		// clauses[x] = une ligne du fichier dimacs en string
 		var y = 0; // indice deplacement dans temp_str
 		var z = 0; // indice deplacement dans clauses[x]
 		var temp_string = clauses[x];
 		clauses[x] = new Array();
		
 		while ((temp_string[y] != "/n") && (y < temp_string.length)) {
 			while ((temp_string[y] == " ") && (y < temp_string.length)) { y++; }
 			clauses[x][z] = "";
 			while (((temp_string[y] != " " ) && (temp_string[y] != "\n")) && (y < temp_string.length)) {
				clauses[x][z] += "" + temp_string[y];
				y++;
			}
			z++;
 		}
 		// clauses[x] = tableau des variables de la ligne du fichier dimacs
 	}
 	return clauses;
 } 


function estModele(assignation, clauses) {
	var est_Modele = true;
	for (var x = 0; x < clauses.length && est_Modele; x++) {
		est_Modele = false || estValide(clauses[x], assignation);
	}
	return est_Modele;
}

var walksat_seuil = 50;
function walksat_randomBool_seuil()   { return parseInt(Math.random() * 100) <= walksat_seuil; }
function walksat_randomBool()   { return parseInt(Math.random() * 100) <= 50; }
function rand(min, max) { return parseInt(Math.random() * ((max+1) - min) + min); }


//cleanArray removes all duplicated elements
function cleanArray(array) {
  var i, j, len = array.length, out = [], obj = {};
  for (i = 0; i < len; i++) {
    obj[array[i]] = 0;
  }
  for (j in obj) {
    out.push(j);
  }
  return out;
}
