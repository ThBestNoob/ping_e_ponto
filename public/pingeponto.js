var jogador1 = {name: undefined, id: 0, pontos: 0, vitorias: 0};
var jogador2 = {name: undefined, id: 0, pontos: 0, vitorias: 0};

var current_match = {
	winner: jogador1.id,
	loser: jogador2.id,
	winner_score: jogador1.pontos,
	loser_score: jogador2.pontos
}

var ready = false;

var ultimoPonto;

var overtime = false;
var onGame = true;
var hasWinner = false;

var vencedor, perdedor;

//----------------Fila

var filaJogadores = [];

//----------------Cadastros

var cadastros = [];
var backupCadastros = [];


function start(){
	if(ready)
		return

	
	document.addEventListener("keyup", function(e){
		//console.log(e);
		switch(e.code){
			case 'Numpad1':	
				adicionarPonto1();
				break;
			case 'Numpad2':	
				adicionarPonto2();
				break;
			case 'Enter':
				joinPlayer(document.getElementById('nome').value);
				break;
			case 'NumpadEnter':
				nextPlayer(vencedor, perdedor);
				break;
			case 'NumpadSubtract':
				desfazerPonto(ultimoPonto);
				atualizarPlacar(jogador1.name, jogador2.name);
				break;		
		}
	})

	document.addEventListener('click', function(e){
	
		if(e.target.id !== "results"){
			document.getElementById('results').innerHTML = "";
		}
	})

	document.getElementById('pts1').value = jogador1.pontos;
	document.getElementById('pts2').value = jogador2.pontos;
	document.getElementById('vit1').value = jogador1.vitorias;
	document.getElementById('vit2').value = jogador2.vitorias;	

	ready = true
}

function adicionarPonto1(){
  //Verifica se tem dois jogadores na mesa________________________________________
	if(jogador1.name == undefined || jogador2.name == undefined)
		return;
	if(!onGame)
		return;

  //Adiciona um ponto, atualiza o placar e confere a pontuação____________________
	jogador1.pontos++;

	ultimoPonto = 1;
	atualizarPlacar(jogador1.name, jogador2.name);
	checkScore();
}

function adicionarPonto2(){
	//Verifica se tem dois jogadores na mesa________________________________________
	if(jogador1.name == undefined || jogador2.name == undefined)
		return;
	if(!onGame)
		return;

	//Adiciona um ponto, atualiza o placar e confere a pontuação____________________
	jogador2.pontos++;

	ultimoPonto = 2;

	atualizarPlacar(jogador1.name, jogador2.name);	
	checkScore();
}
//------------ Edição pontos
function editarPonto1(){
	pontos1 = document.getElementById('pts1').value;
	atualizarPlacar(jogador1.name, jogador2.name);
}
function editarPonto2(){	
	pontos2 = document.getElementById('pts2').value;
	atualizarPlacar(jogador1.name, jogador2.name);
}
//------------ Edição vitórias
function editarVitorias1(){
	jogador1.vitorias = document.getElementById('vit1').value;
	atualizarPlacar(jogador1.name, jogador2.name);
}
function editarVitorias2(){
	jogador2.vitorias = document.getElementById('vit2').value;
	atualizarPlacar(jogador1.name, jogador2.name);
}

function desfazerPonto(jogador){
	if(!onGame){
		return;
	}
	document.getElementById('vitoria').innerHTML = '';
	hasWinner = false;
	switch(jogador){
		case 1: 
			if(jogador1.pontos == 0)
				return;
			jogador1.pontos--;
			break;
		case 2:
			if(jogador2.pontos == 0)
				return;
			jogador2.pontos--;
			break;
	}
}

function resetarVitorias(){
	jogador1.vitorias = 0;
	jogador2.vitorias = 0;
}

function atualizarPlacar(player1, player2){

	//	Placar	
	document.getElementById('placar').innerHTML = jogador1.pontos + ' x ' + jogador2.pontos;
	document.getElementById('j1').innerHTML = player1;
	document.getElementById('j2').innerHTML = player2;
	document.getElementById('v1').innerHTML = jogador1.vitorias;
	document.getElementById('v2').innerHTML = jogador2.vitorias;

	// 	Opções
	document.getElementById('pts1').value = jogador1.pontos;
	document.getElementById('pts2').value = jogador2.pontos;	
}	

function resetarPlacar(){
	jogador1.pontos = 0;
	jogador2.pontos = 0;
}

function checkScore(){

	switch(overtime){

		case false:
			if(jogador1.pontos == 7){
				winner(jogador1, jogador2);
		 	}

			if(jogador2.pontos == 7){
				winner(jogador2, jogador1);
			}
			if(jogador1.pontos == 6 && jogador2.pontos == 6){
				overtime = true;
				document.getElementById('overtime').innerHTML = 'OVERTIME';
				resetarPlacar();
			}
			break;

		case true:
			if(jogador1.pontos == 2 && jogador2.pontos == 0){
				winner(jogador1, jogador2);
			}	
			if(jogador2.pontos == 2 && jogador1.pontos == 0){
				winner(jogador2, jogador1);
			}
			if(jogador1.pontos == 3){
				winner(jogador1, jogador2);
			}
			if(jogador1.pontos == 3){
				winner(jogador2, jogador1);
			}
	 }		
}

function winner(winner, loser){

	var current_match = {
		winner: winner.id,
		loser: loser.id,
		winner_score: jogador1.pontos,
		loser_score: jogador2.pontos
	}
	saveMatch(current_match)

	hasWinner = true;
	onGame = false;
	document.getElementById('vitoria').innerHTML = winner.name + ' venceu! 🏆<p class="message">Próximo: <strong>'  + filaJogadores[0].name + '</strong><br><strong>Enter</strong> para iniciar próxima partida</p>';
	vencedor = winner
	perdedor = loser;
	document.getElementById('overtime').innerHTML = ''; 
	overtime = false;		
}

function inverterMesa(){
	let jogador = jogador2;
	let pontos = pontos2;

	jogador2 = jogador1;
	pontos2 = pontos1

	jogador1 = jogador;
	pontos1 = pontos;


	atualizarPlacar(jogador1.name, jogador2.name);

}

//----------------------FILA---------------------

function joinPlayer(nome, playerId){	

	if(!ready)
		start();

	

	if(nome == '')
		return;

	if(jogador1.name && jogador2.name){
		filaJogadores.push({name: nome, id: playerId});
		atualizarFila();
		document.getElementById('nome').value = '';
		return;
	}

	if(!jogador1.name){
		jogador1.name = nome;
		jogador1.id = playerId
		atualizarPlacar(jogador1.name, 'Jogador 2');
		document.getElementById('nome').value = '';
		return;
	}

	if(!jogador2.name){
		jogador2.name = nome;
		jogador2.id = playerId
		atualizarPlacar(jogador1.name, jogador2.name);
		document.getElementById('nome').value = '';
		return;
	}
}

function nextPlayer(winner, perdedor){

	if(!hasWinner)
		return;

	winner.vitorias++;

	resetarPlacar();
	onGame = true;	
	hasWinner = false;

	//-----------------------------------------
	/*
	Adiciona o perdedor na fila e colocar o primeiro da fila no lugar dele
		Switch dependendo de quem vence para definir o perdedor
		Em cada um tem um if statement para verificar se já é a terceira vitória consecutiva do jogador.
		Se o número de vitórias for < que 3, retira somente o perdedor e colocar o próximo da fila no lugar.
		Se for a terceira vitória, coloca os dois no final da fila (perdedor na frente), e coloca os dois primeiros da fila no lugar.
	*/
	switch (perdedor){
		case jogador1:

			if(jogador2.vitorias < 3){
				filaJogadores.push({name: jogador1.name, id: jogador1.id});
				jogador1.name = filaJogadores[0].name
				jogador1.id = filaJogadores[0].id
				filaJogadores.shift();

			}else{
				//adiciona ambos jogadores à fila, começando pelo que perdeu
				filaJogadores.push({name: jogador1.name, id: jogador1.id});
				filaJogadores.push({name: jogador2.name, id: jogador2.id});
				jogador1.vitorias = 0;
				jogador2.vitorias = 0;


				jogador1.name = filaJogadores[0].name;
				jogador1.id = filaJogadores[0].id
				filaJogadores.shift();
				jogador2.name = filaJogadores[0].name;
				jogador2.id = filaJogadores[0].id
				filaJogadores.shift();
			}
			jogador1.vitorias =  0;
			break;
		case jogador2:
			if(jogador1.vitorias < 3){
				filaJogadores.push({name: jogador2.name, id: jogador2.id});
				jogador2.name = filaJogadores[0].name;
				jogador2.id = filaJogadores[0].id
				filaJogadores.shift();
				
			}else{
				//adiciona ambos jogadores à fila, começando pelo que perdeu
				filaJogadores.push({name: jogador2.name, id: jogador2.id});
				filaJogadores.push({name: jogador1.name, id: jogador1.id});
				jogador1.vitorias = 0;
				jogador2.vitorias = 0;


				jogador1.name = filaJogadores[0].name;
				jogador1.id = filaJogadores[0].id
				filaJogadores.shift();
				jogador2.name = filaJogadores[0].name;
				jogador2.id = filaJogadores[0].id
				filaJogadores.shift();
			}
			jogador2.vitorias = 0;
			break;
	}

	//-------------- Isso ocorre caso as vitórias sejam < 3 ---------------------------
	
	//Atualizar HTML fila e placar

	atualizarFila();

	atualizarPlacar(jogador1.name, jogador2.name);

	//Remover o texto de vitória	
	
	document.getElementById('vitoria').innerHTML = '';
}

function atualizarFila(){
	var fila = '';
	for(var i = 0; i < filaJogadores.length; i++){
            fila += '<p draggable=true ondragstart="drag(event, ' + i +')" ondragover="allowDrop(event)" ondragenter="" ondrop="drop(event, ' + i + ')"><button class="remover" onclick="removePlayer(' + i + ')">X</button>' + filaJogadores[i].name + '</p>'  
		}
	document.getElementById('fila').innerHTML = fila;
}

function removePlayer(index){

	console.log(filaJogadores[index] + ' saiu da fila.');

	filaJogadores.splice(index, 1);
	atualizarFila();
}

// document.onclick = function(e){
	
// 	if(e.target.id !== "results"){
// 		document.getElementById('results').innerHTML = "";
// 	}
// }

//----------- Data base ------------------------------------------------------------------------


function searchPlayer(search){
	$.ajax({
		url: '/search',
		type: 'GET',
		dataType: 'json',
		// data: info,
		data: {"search": search},

		complete: function (jqXHR, textStatus) {
			// callback

			console.log(textStatus)
		},  
		success: function (data, textStatus, jqXHR) {
			
			results = ""

            for(var i = 0; i < data.length; i++){
                results += '<button class="row" onClick="joinPlayer(' + "'" + data[i].nome + "'," + data[i].id + ')"><div class="col-sm-4"><div class="pic"><img src="pictures/' 
				
				if(data[i].picture){
					results += data[i].nome.toLowerCase() + '.png"></div></div><div class="col-sm-8">'	
				}else{
					results += 'placeholder.png"></div></div><div class="col-sm-8">'
				}
				
				results += "<p>" + data[i].nome + "</p></div></button>"
            }

            document.getElementById('results').innerHTML = results
		},  
		error: function (jqXHR, textStatus, errorThrown) {
			// do something if the request fails
			console.log(jqXHR)
			console.log(errorThrown)
		}   
	});
}

$("#nome").keyup( function() {
    var searchQuery = document.getElementById('nome').value;

    if(searchQuery == ""){
        document.getElementById('results').innerHTML = ""
        return
    }    
    searchPlayer(searchQuery)
});

function clearResults(){
	document.getElementById('results').innerHTML = ""
}

function saveMatch(match){
	$.ajax({
		url: '/matches',
		type: 'POST',
		dataType: 'json',
		data: {"match": match},

		complete: function (jqXHR, textStatus) {
			// callback

			console.log(textStatus)
		},  
		success: function (data, textStatus, jqXHR) {
			
			console.log(data);

		},  
		error: function (jqXHR, textStatus, errorThrown) {
			// do something if the request fails
			console.log(jqXHR)
			console.log(errorThrown)
		}   
	})
}


//----------- Drag and Drop ---------------------------------------------------------------------

var selectedPlayer, filaOriginal;
var isDragging = false;

function allowDrop(ev, lugar) {
  	ev.preventDefault();
}

function drag(ev, selected) {
  	ev.dataTransfer.setData("text", ev.target.id);

  	selectedPlayer = selected;
  	filaOriginal = filaJogadores;  	

  	console.log(selectedPlayer);

  	isDragging = false;
}

function hover(lugar){
	console.log('hover');

	if (isDragging === false) {

		isDragging = true;
		let jogador = filaJogadores[selectedPlayer];

		filaJogadores.splice(selectedPlayer, 1);
		filaJogadores.splice(lugar, 0, jogador);
		atualizarFila(jogador1.name, jogador2.name);
	}else{
		return;
	}
}

function drop(ev, lugar){

	ev.preventDefault();

	let jogador = filaJogadores[selectedPlayer];


	
  	filaJogadores.splice(selectedPlayer, 1);
  	console.log('Fila sem o ' + jogador + ': ' + filaJogadores);	

	console.log(jogador + ' entrou no lugar de ' + filaJogadores[lugar]);

	filaJogadores.splice(lugar, 0, jogador);
	atualizarFila(jogador1.name, jogador2.name);

	console.log(filaJogadores);
}
