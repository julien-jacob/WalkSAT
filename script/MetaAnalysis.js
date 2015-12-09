 /*  ------------------------------------------------------------------------------  **
 **                                    Projet Squaro                                 **
 **  ------------------------------------------------------------------------------  **
 **  Logique propositionnelle et logique du premier ordre appliqué au jeu du Squaro  **
 **                 JACOB Julien, HECKMANN Victor 					                 **
 **  ------------------------------------------------------------------------------  **
 **   Analyse, comparaisons et statistiques sur une série d'exécutions de Squaro     **
 **  ------------------------------------------------------------------------------  */

 
	function lancerAnalyse () {

		var nombresDeRondsSolutionC	= 0;
		var sommeDesValeursCumules	= 0;
		var nombreDe0Cumules		= 0;
		var nombreDe1Cumules		= 0;
		var nombreDe2Cumules		= 0;
		var nombreDe3Cumules		= 0;
		var nombreDe4Cumules		= 0;
		var tempsExecutionCumules	= 0;
		var nombreSolvableCumules 	= 0;
		var nombreInsolvableCumules	= 0;
		var tempsExecutionMaximum	= 0;
		var  tempsExecutionMinimum	= 0;
		var nombreIterationsCumules = 0;

		var NombreDeTest 			= parseInt(document.getElementById('NombreDeTest').value);
		var largeur 				= parseInt(document.getElementById('largeur').value);
		var hauteur 				= parseInt(document.getElementById('hauteur').value);
		var generateSolvableGrid 	= document.getElementById("genererGrilleSolvable").checked;

		WalkSatOptions["clauseUnitaire"]                = document.getElementById("WalkSatOption1").checked;
		WalkSatOptions["eliminationClausesDoubles"]     = document.getElementById("WalkSatOption2").checked;
		WalkSatOptions["ContradictionClausesUnitaires"] = document.getElementById("WalkSatOption3").checked;
		WalkSatOptions["SauvegardeAssignationsTestees"] = document.getElementById("WalkSatOption4").checked;
		WalkSat_nbIterartionsMax = parseInt(document.getElementById("nombreIterationsMax").value)	|| 25000; 
		walksat_seuil = parseInt(document.getElementById("WalkSatSeuil").value)	|| 50; 


		var divResultatDetailles 	= "<table class='bigTable'><tr><th>Indice</th><th>Nb de ronds de la solution</th><th>Somme des valeurs</th><th>Nb de 0</th><th>Nb de 1</th><th>Nb de 2</th><th>Nb de 3</th><th>Nb de 4</th><th>Nb Itérations</th><th>temps</th><th>Solution</th></tr>";

		for (var i = 0; i < NombreDeTest; i++) {
			
			GS = new squaroGrid(hauteur, largeur, "GS", generateSolvableGrid);
			squaro_getSatSolution(GS);

			var resultat = "";
			if (GS.arrayCheckSolutionSAT == "Unsolvable") {
				resultat = "<font color='red'>Non résolu</font>";
				nombreInsolvableCumules ++;
			} else {
				resultat = "<font color='lime'>Résolu</font>";
				nombreSolvableCumules ++;
			}

			var nombresDeRondsSolution 	= parseInt(GS.arrayCheckSolutionCountChecked());
			var sommeDesValeurs 		= parseInt(GS.sumValue());
			var nombreDe0 				= parseInt(GS.countCasesIs(0));
			var nombreDe1 				= parseInt(GS.countCasesIs(1));
			var nombreDe2 				= parseInt(GS.countCasesIs(2));
			var nombreDe3 				= parseInt(GS.countCasesIs(3));
			var nombreDe4 				= parseInt(GS.countCasesIs(4));
			var tempsExecution 			= parseInt(WalkSatLOG['tempsExecution']);
			var nombreIterations 		= parseInt(WalkSatLOG['iterationWalkSat']);

			
			if (i == 1) {
				 tempsExecutionMinimum = tempsExecution;
			}

			nombresDeRondsSolutionC		+= parseInt(nombresDeRondsSolution);
			sommeDesValeursCumules		+= parseInt(sommeDesValeurs);
			nombreDe0Cumules			+= parseInt(nombreDe0 );
			nombreDe1Cumules			+= parseInt(nombreDe1 );
			nombreDe2Cumules			+= parseInt(nombreDe2 );
			nombreDe3Cumules			+= parseInt(nombreDe3 );
			nombreDe4Cumules			+= parseInt(nombreDe4 );
			tempsExecutionCumules 		+= parseInt(tempsExecution);
			nombreIterationsCumules		+= parseInt(nombreIterations);

			 tempsExecutionMinimum 		= (tempsExecution <  tempsExecutionMinimum) ? tempsExecution :  tempsExecutionMinimum;
			tempsExecutionMaximum 		= (tempsExecution > tempsExecutionMaximum) ? tempsExecution : tempsExecutionMaximum;


			divResultatDetailles += "<tr>";
			divResultatDetailles += "<td>" + i 						+"<t/d>";
			divResultatDetailles += "<td>" + nombresDeRondsSolution + "</td>";
			divResultatDetailles += "<td>" + sommeDesValeurs		+ "</td>";
			divResultatDetailles += "<td>" + nombreDe0 				+ "</td>";
			divResultatDetailles += "<td>" + nombreDe1 				+ "</td>";
			divResultatDetailles += "<td>" + nombreDe2 				+ "</td>";
			divResultatDetailles += "<td>" + nombreDe3 				+ "</td>";
			divResultatDetailles += "<td>" + nombreDe4 				+ "</td>";
			divResultatDetailles += "<td>" + nombreIterations 		+ "</td>";
			divResultatDetailles += "<td>" + tempsExecution			+ " en Ms</td>";
			divResultatDetailles += "<td>" + resultat 				+"</td>";
			divResultatDetailles += "</tr>";
		}
		divResultatDetailles += "</table>";
		document.getElementById("resultatsDetailles").innerHTML = divResultatDetailles;

		var divResultat = "<table><tr><th> </th><th> Cumulées - </th><th> Moyennes </th>";

divResultat += "<tr><th>Nombre de ronds des solutions : </th><th>"+ 	nombresDeRondsSolutionC	 + "</th><th>"+ (nombresDeRondsSolutionC / NombreDeTest) + "</th>";
divResultat += "<tr><th>Somme des valeurs : </th><th>" + sommeDesValeursCumules	 + "</th><th>"+ (sommeDesValeursCumules	/ NombreDeTest) + "</th>";
divResultat += "<tr><th>Nombre de 0 : </th><th>" + nombreDe0Cumules + "</th><th>"+ (nombreDe0Cumules/ NombreDeTest) + "</th>";
divResultat += "<tr><th>Nombre de 1 : </th><th>" + nombreDe1Cumules + "</th><th>"+ (nombreDe1Cumules/ NombreDeTest) + "</th>";
divResultat += "<tr><th>Nombre de 2 : </th><th>" + nombreDe2Cumules + "</th><th>"+ (nombreDe2Cumules/ NombreDeTest) + "</th>";
divResultat += "<tr><th>Nombre de 3 : </th><th>" + nombreDe3Cumules + "</th><th>"+ (nombreDe3Cumules/ NombreDeTest) + "</th>";
divResultat += "<tr><th>Nombre de 4 : </th><th>" + nombreDe4Cumules + "</th><th>"+ (nombreDe4Cumules/ NombreDeTest) + "</th>";
divResultat += "<tr><th>Nombre d'itérations : </th><th>" +  nombreIterationsCumules	 + "</th><th>"+ (nombreIterationsCumules		/ NombreDeTest) + "</th>";
divResultat += "<tr><th>tempsExecution </th><th>" +  		tempsExecutionCumules	 + "</th><th>"+ (tempsExecutionCumules	/ NombreDeTest) + "</th>";
divResultat += "</tr></table><hr><p>Nombre de grilles résolus : " + nombreSolvableCumules + "<br>Nombre de grilles non résolus : " + nombreInsolvableCumules + "</p>";
divResultat += "<p> Temps d'exécution maximum : " + tempsExecutionMaximum + " ms";
divResultat += "<br> Temps d'exécution minimum : " +  tempsExecutionMinimum + " ms</p>";
		document.getElementById("resultats").innerHTML = divResultat;
	}



	function afficherMasquer(divName) {
		if (document.getElementById(divName).style.display == "none") {
			document.getElementById(divName).style.display = "block";
		} else {
			document.getElementById(divName).style.display="none";
		}
	}