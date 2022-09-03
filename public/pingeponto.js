var pontos1 = 0;
var pontos2 = 0;
var jogador1 = {name: undefined, vitorias: 0};
var jogador2 = {name: undefined, vitorias: 0};

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
	});

	document.getElementById('pts1').value = pontos1;
	document.getElementById('pts2').value = pontos2;
	document.getElementById('vit1').value = jogador1.vitorias;
	document.getElementById('vit2').value = jogador2.vitorias;	
}

function adicionarPonto1(){
  //Verifica se tem dois jogadores na mesa________________________________________
	if(jogador1.name == undefined || jogador2.name == undefined)
		return;
	if(!onGame)
		return;

  //Adiciona um ponto, atualiza o placar e confere a pontuação____________________
	pontos1++;

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
	pontos2++;  

	ultimoPonto = 2;

	atualizarPlacar(jogador1.name, jogador2.name);	
	checkScore();
}

function editarPonto1(){
	pontos1 = document.getElementById('pts1').value;
	atualizarPlacar(jogador1.name, jogador2.name);
}
function editarPonto2(){	
	pontos2 = document.getElementById('pts2').value;
	atualizarPlacar(jogador1.name, jogador2.name);
}

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
			if(pontos1 == 0)
				return;
			pontos1--;
			break;
		case 2:
			if(pontos2 == 0)
				return;
			pontos2--;
			break;
	}
}

function resetarVitorias(){
	jogador1.vitorias = 0;
	jogador2.vitorias = 0;
}

function atualizarPlacar(player1, player2){

	//	Placar	
	document.getElementById('placar').innerHTML = pontos1 + ' x ' + pontos2;
	document.getElementById('j1').innerHTML = player1;
	document.getElementById('j2').innerHTML = player2;
	document.getElementById('v1').innerHTML = jogador1.vitorias;
	document.getElementById('v2').innerHTML = jogador2.vitorias;

	// 	Opções
	document.getElementById('pts1').value = pontos1;
	document.getElementById('pts2').value = pontos2;	
}	

function resetarPlacar(){
	pontos1 = 0;
	pontos2 = 0;
}

function checkScore(){

	switch(overtime){

		case false:
			if(pontos1 == 7){
				winner(jogador1, 2);
		 	}

			if(pontos2 == 7){
				winner(jogador2, 1);
			}
			if(pontos1 == 6 && pontos2 == 6){
				overtime = true;
				document.getElementById('overtime').innerHTML = 'OVERTIME';
				resetarPlacar();
			}
			break;

		case true:
			if(pontos1 == 2 && pontos2 == 0){
				winner(jogador1, 2);
			}	
			if(pontos2 == 2 && pontos1 == 0){
				winner(jogador2, 1);
			}
			if(pontos1 == 3){
				winner(jogador1, 2);
			}
			if(pontos2 == 3){
				winner(jogador2, 1);
			}
	 }		
}

function winner(winner, loser){

	hasWinner = true;
	onGame = false;
	document.getElementById('vitoria').innerHTML = winner.name + ' venceu! 🏆<p class="message">Próximo: <strong>'  + filaJogadores[0] + '</strong><br><strong>Enter</strong> para iniciar próxima partida</p>';
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

function joinPlayer(nome){	

	if(nome == '')
		return;

	if(jogador1.name && jogador2.name){
		filaJogadores.push(nome);
		atualizarFila();
		document.getElementById('nome').value = '';
		return;
	}

	if(!jogador1.name){
		jogador1.name = nome;
		atualizarPlacar(jogador1.name, 'Jogador 2');
		document.getElementById('nome').value = '';
		return;
	}

	if(!jogador2.name){
		jogador2.name = nome;
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
		case 1:

			if(jogador2.vitorias < 3){
				filaJogadores.push(jogador1.name);
				jogador1.name = filaJogadores[0];
				filaJogadores.shift();

			}else{
				//adiciona ambos jogadores à fila, começando pelo que perdeu
				filaJogadores.push(jogador1.name);
				filaJogadores.push(jogador2.name);
				jogador1.vitorias = 0;
				jogador2.vitorias = 0;


				jogador1.name = filaJogadores[0];
				filaJogadores.shift();
				jogador2.name = filaJogadores[0];
				filaJogadores.shift();
			}
			jogador1.vitorias =  0;
			break;
		case 2:
			if(jogador1.vitorias < 3){
				filaJogadores.push(jogador2.name);
				jogador2.name = filaJogadores[0];
				filaJogadores.shift();
				
			}else{
				filaJogadores.push(jogador2.name);
				filaJogadores.push(jogador1.name);
				jogador1.vitorias = 0;
				jogador2.vitorias = 0;

				jogador1.name = filaJogadores[0];
				filaJogadores.shift();
				jogador2.name = filaJogadores[0];
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
            fila += '<p draggable=true ondragstart="drag(event, ' + i +')" ondragover="allowDrop(event)" ondragenter="" ondrop="drop(event, ' + i + ')"><button class="remover" onclick="removePlayer(' + i + ')">X</button>' + filaJogadores[i] + '</p>'  
		}
	document.getElementById('fila').innerHTML = fila;
}

function removePlayer(index){

	console.log(filaJogadores[index] + ' saiu da fila.');

	filaJogadores.splice(index, 1);
	atualizarFila();
}

//----------- Drag and Drop ---------------------------------------------------------------------

var selectedPlayer, filaOriginal;
let isDragging = false;

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