// ==UserScript==
// @name        AP++
// @namespace   https://github.com/Polysynchron/AP-
// @include     https://hbgtweb.ac-poitiers.fr/gael/*
// @updateURL https://github.com/Polysynchron/AP-/raw/master/AP%2B%2B.user.js
// @version     1
// @grant       none
// ==/UserScript==

(function() {
	
  //manip blédarde pour éviter un bug tordu
	if(document.location.href.startsWith('https://hbgtweb.ac-poitiers.fr/gael/086v3/accueil.php')){
		window.location.replace('https://hbgtweb.ac-poitiers.fr/gael/086v3/accueil0.php');
	}
  
  var AP = {
    init : function(table){
      //indications de série et d'horaires
      var hoursTextNode = table.querySelector('span').firstChild;
      //horaires classés dans un tableau
      var hours = getNumbersInString(hoursTextNode.textContent);
      //horaire de début
      this.startHour = hours[0];
      //horaire de fin (sans blague)
      this.endHour = hours[1];
      //mise en forme : "16/18" → "16h-18h"
      hoursTextNode.textContent = hoursTextNode.textContent.split(' ')[0] + ' ' + hours[0] + 'h-' + hours[1] + 'h';
      //la date (jj/mm/aaaa)
      this.date =  table.querySelector('strong').firstChild.textContent;
      //le table contenant l'ap
      this.table = table;
      this.table.className = 'ap';
    }
  };
  
  var Box = {
    init : function(aps, content){
      var boxDiv = document.createElement('div');
      this.boxDiv = boxDiv;
      this.boxDiv.className = 'box';
      this.aps = aps;
      content.appendChild(this.boxDiv);
    }
  };
  
  
	var tables = document.querySelectorAll('table[width="80%"][border="0"][cellpadding="5"]');
	var container = document.getElementById('content2');
	var aps = [];
	var boxes = [];
  //init aps with object AP
	for(var iTable = 0; iTable < tables.length; iTable++){
		var ap = Object.create(AP);
    ap.init(tables[iTable]);
		aps.push(ap);
	}
	
	//MAIN...
	
	//init boxes with object Box (contains aps)
	var key = 0;
	while(key < aps.length){
		var apsOfThisDay = [];
		var date = aps[key].date;
		var dateOk = true;
		while(dateOk && key < tables.length){
			if(aps[key].date === date){
				apsOfThisDay.push(aps[key]);
				key++;
			}else{
				dateOk = false;
			}
		}
    var box = Object.create(Box);
		box.init(apsOfThisDay, container);
		boxes.push(box);
	}
  
	//sort aps in divs
	for(var iBox = 0; iBox < boxes.length; iBox++){
		var box = boxes[iBox];
		var oneHourLayoutTop = document.createElement('div');
		var oneHourLayoutBottom = document.createElement('div');
		var hourMin = 25;
		var hourMax = -1;
		var allHoursLayouts = [];
		//find first hour and last hour
		for(var iAp = 0; iAp < box.aps.length; iAp++){
			var ap = box.aps[iAp];
			if(ap.endHour - ap.startHour === 1){
        if(ap.startHour < hourMin){
          hourMin = ap.startHour;
        }
        if(ap.endHour > hourMax){
          hourMax = ap.endHour;
        }
      }
    }
    for(var iAp = 0; iAp < box.aps.length; iAp++){
      var ap = box.aps[iAp];
      if(ap.endHour - ap.startHour === 1){
        //pour les aps de 1h
        if(ap.startHour === hourMin){
          //ap de première heure
          oneHourLayoutTop.appendChild(ap.table);
        }else if(ap.endHour === hourMax){
          //ap de deuxième heure
          oneHourLayoutBottom.appendChild(ap.table);
        }
      }else{
        //pour les aps de 2h
        var allHoursLayout = document.createElement('div');
        allHoursLayouts.push(allHoursLayout);
        allHoursLayout.appendChild(ap.table);
        allHoursLayout.className = 'allHoursLayout';
        box.boxDiv.appendChild(allHoursLayout);
      }
    }
    oneHourLayoutTop.className = 'oneHourLayoutTop';
    oneHourLayoutBottom.className = 'oneHourLayoutBottom';
    var wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.appendChild(oneHourLayoutTop);
    wrap.appendChild(oneHourLayoutBottom);
    box.boxDiv.appendChild(wrap);
	}
	
  //enlever ce dégradé immonde
	document.querySelector('#masthead table').removeAttribute('background');
  //petite signature
	document.querySelector('#masthead td[valign="middle"][width="33%"] h6').appendChild(document.createTextNode('Mise en forme par Malo Revel'));
  
	var head = document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	
  //lourde feuille de style css
	style.innerHTML = '\
	.wrap{\
		display : inline-block;\
		width : 50%;\
		float : right;\
	}\
	.ap{\
		width : 100%;\
		float : left;\
		height : 100%;\
		padding : 0;\
	}\
	.wrap .ap{\
		width : 50%;\
	}\
	.ap .cadre{\
		background : rgb(230, 230, 230);\
		border : 0;\
		border-radius : 10px;\
	}\
	.box{\
		width : 80%;\
		height : 80%;\
		margin : 40px auto 40px auto;\
		padding : 20px;\
		background-color : rgb(102, 153, 255);\
		border-radius : 20px;\
	}\
	.allHoursLayout, .oneHourLayoutTop, .oneHourLayoutBottom{\
		display : inline-block;\
		margin : auto;\
	}\
	.allHoursLayout{\
		position : auto;\
		width : 25%;\
		height : 100%;\
	}\
	.oneHourLayoutTop{\
		height : 50%;\
		width : 100%;\
	}\
	.oneHourLayoutBottom{\
		height : 50%;\
		width : 100%;\
	}\
	.oneHourLayoutBottom .ap .cadre{\
		width : 25%;\
	}\
	.oneHourLayoutTop .ap .cadre{\
		width : 25%;\
	}\
	\
	\
	html, h1, h2, h3, h4, h5{\
		color : black;\
    font-family : "Lucida sans unicode", Monaco, monospace;\
	}\
	#content2 div[align="center"], .popin-open-03{\
		display : none;\
	}\
	body, #masthead{\
		background-color : rgb(40, 40, 40);\
	}\
	#siteInfo{\
		background-color : rgb(230, 230, 230);\
	}\
	body{\
		color : black;\
	}\
	.btntxt{\
		border : 0;\
		border-radius : 0;\
		background : rgb(102, 153, 255);\
		color : white;\
	}\
	.btntxtrouge{\
		border : 0;\
		border-radius : 0;\
		background : rgb(200, 100, 0);\
	}\
	#masthead h3, #masthead h6, a:link{\
		color : white;\
	}\
	.listbx2{\
		width : 100%;\
	}\
	';
	head.appendChild(style);
	//...MAIN
	
	
  //trouves les nombres dans une chaîne et les retourne dans un tableau : "hePfir10fjir3PGu" → [10, 3]
	function getNumbersInString(string){
		var numbers = [];
		var iChar = 0;
		while(iChar < string.length){
			var chiffre = string.charAt(iChar);
			if(!isNaN(parseInt(chiffre))){
				var strNumber = '';
				while(!isNaN(parseInt(chiffre))){
					iChar++;
					strNumber += chiffre;
					chiffre = string.charAt(iChar);
				}
				numbers.push(parseInt(strNumber));
			}else{
				iChar++;
			}
		}
		return numbers;
	}
	
	console.log('AP++ init ok');
  
  //décommenter pour choisir la couleur des box en haut à gauche de la page (c'est cool)
  /*
  var color = document.createElement('input');
  color.type = 'color';
  document.querySelector("#masthead").appendChild(color);
  color.addEventListener('change', function(){
	 document.querySelector('.box').style.backgroundColor = color.value;
  });
  */

})();