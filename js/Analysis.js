 /*  ------------------------------------------------------------------------------  **
 **                                    Projet Squaro                                 **
 **  ------------------------------------------------------------------------------  **
 **  Logique propositionnelle et logique du premier ordre appliqué au jeu du Squaro  **
 **                 			JACOB Julien et HECKMANN Victor		                 **
 **  ------------------------------------------------------------------------------  **
 **   Analyse d'une exécution de squaro                                              **
 **  ------------------------------------------------------------------------------  */

var GS = new squaroGrid();

function actualiserSquaro() {
	var largeur 	= parseInt(document.getElementById("largeur").value)	|| 0; 
	var hauteur 	= parseInt(document.getElementById("hauteur").value)	|| 0; 
	var densite		= parseInt(document.getElementById("densite").value)	|| 50; 
	var generateSolvableGrid = document.getElementById("genererGrilleSolvable").checked;
	randomBool_density = document.getElementById("densite").value;

	GS = new squaroGrid(hauteur, largeur, "GS", generateSolvableGrid);
	GS.printGrid("grilleGenerer", true);

	// Mises à jour des informations 
	document.getElementById("nombreDeCases").innerHTML 			= GS.countCases();
	document.getElementById("nombreDeRonds").innerHTML 			= GS.countCheckbox();
	document.getElementById("nombreDeRondeSolution").innerHTML 	= GS.arrayCheckSolutionCountChecked();
	document.getElementById("sommeDesValeur").innerHTML 		= GS.sumValue();

	document.getElementById("nombreDe0").innerHTML = GS.countCasesIs(0);
	document.getElementById("nombreDe1").innerHTML = GS.countCasesIs(1);
	document.getElementById("nombreDe2").innerHTML = GS.countCasesIs(2);
	document.getElementById("nombreDe3").innerHTML = GS.countCasesIs(3);
	document.getElementById("nombreDe4").innerHTML = GS.countCasesIs(4);

	actualiserTaxboxDimacs();
	
}


function lancerWalkSat() {
	WalkSatOptions["clauseUnitaire"]                = document.getElementById("WalkSatOption1").checked;
	WalkSatOptions["eliminationClausesDoubles"]     = document.getElementById("WalkSatOption2").checked;
	WalkSatOptions["ContradictionClausesUnitaires"] = document.getElementById("WalkSatOption3").checked;
	WalkSatOptions["SauvegardeAssignationsTestees"] = document.getElementById("WalkSatOption4").checked;
	WalkSat_nbIterartionsMax = parseInt(document.getElementById("nombreIterationsMax").value)	|| 25000; 
	walksat_seuil = parseInt(document.getElementById("WalkSatSeuil").value)	|| 50;
	
	document.getElementById("logDuWalkSat").innerHTML       = "Travail en cours ...";
	document.getElementById("grilleSolutionSAT").innerHTML  = "";

	//updateArrayCheckSolution("grilleGenerer");
	squaro_getSatSolution(GS);

	var log = "";
    log += "<table>";
    log += "<tr><td>Nombre d'itérations : </td><td>"+ WalkSatLOG["iterationWalkSat"] +"</td></tr>";
    log += "<tr><td>Temps d'exécution en Ms : </td><td>"+ WalkSatLOG["tempsExecution"] +"</td></tr>";
    log += "<tr><td>Message d'erreur : </td><td>"+ WalkSatLOG["messageErreur"] +"</td></tr>";
    log += "</table>";
    

	if (GS.arrayCheckSolutionSAT != "Unsolvable") {
		GS.printGenerateSolutionSAT("grilleSolutionSAT");
	}
	document.getElementById("logDuWalkSat").innerHTML = log;
}

function actualiserTaxboxDimacs() {
  GS.useArrayImposeCheck = false; //document.getElementById('prendreEnCompteRondsCoches').checked;
  document.getElementById("pDimacs").innerHTML = "<textarea rows='10' class='form-control'>" + GS.dimacs() + "</textarea>";
}



function afficherMasquer(divName) {
	if (document.getElementById(divName).style.display == "none") {
		document.getElementById(divName).style.display = "block";
	} else {
		document.getElementById(divName).style.display="none";
	}
}
