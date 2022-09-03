//----------------Pontuação

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

//----------------The zuera never ends

//var audios = [new Audio('cavalo.mp3'), new Audio('')];

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
			/*case '':
				resetarPlacar();
				resetarVitorias();
				atualizarPlacar(jogador1.name, jogador2.name);
				break;*/
			case 'NumpadEnter':
				nextPlayer(vencedor, perdedor);
				break;
			case 'NumpadSubtract':
				desfazerPonto(ultimoPonto);
				atualizarPlacar(jogador1.name, jogador2.name);
				break;

		}
	});

	cadastros = getCadastros();
	backup();

	document.getElementById('pts1').value = pontos1;
	document.getElementById('pts2').value = pontos2;
	document.getElementById('vit1').value = jogador1.vitorias;
	document.getElementById('vit2').value = jogador2.vitorias;	

	updateStats();
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
	//tocarAudio();
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
	//tocarAudio();
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

/*function tocarAudio(){
	var a = Math.floor(Math.random() * 11); 

	if(a <= 3){
		
		audios[0	].play();
	}
}*/

function resetarVitorias(){
	jogador1.vitorias = 0;
	jogador2.vitorias = 0;
}

function atualizarPlacar(player1, player2){
	/*document.getElementById('pontuação').innerHTML = '<span class="vitorias" id="v1">' + jogador1.vitorias + '</span>&ensp;' + player1 + '&nbsp;:&ensp;<span id="placar">' + pontos1 + ' x ' + pontos2 + 
		'</span>&ensp;:&nbsp;' + player2 + '&ensp;<span class="vitorias" id="v20">'+ jogador2.vitorias + '</span>';*/

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
	//Movidos para nextPlayer:
	//winner.vitorias++;
	//resetarPlacar();
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

	//Confere se já tem cadastro
	checkRegistration(nome);	


	//___NewCode___//
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


	//___NewCode___//
	/*
	if (jogador1.name == undefined){ 
		//insert player name to jogador1
		
		jogador1.name = nome;
		atualizarPlacar(jogador1.name, 'Jogador 2');
		document.getElementById('nome').value = '';
		return;

	}else{

		if (jogador2.name == undefined){
			//insert player name to jogador2
			jogador2.name = nome;
			atualizarPlacar(jogador1.name, jogador2.name);
			document.getElementById('nome').value = '';
			return;
		}else{
			filaJogadores.push(nome);
			atualizarFila();
			document.getElementById('nome').value = '';

		}
	}*/
}

function nextPlayer(winner, perdedor){

	if(!hasWinner)
		return;

	winner.vitorias++;
	addWin(winner.name);
	//Resetar placar
	resetarPlacar();
	onGame = true;	
	hasWinner = false;

	//-----------------------------------------
	/*
	Adiciona o perdedor na fila e colocar o primeiro da fila no lugar dele
		Switch dependendo de quem vence para definir o perdedor
		Em cada um tem um if statement para verificando se já é a terceira vitória consecutiva do jogador.
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
				//fila += '<p draggable=true id="fila"><button class="remover" onclick="removePlayer(' + i + ')">X</button>' + filaJogadores[i] + '</p>';

				fila += '<p draggable=true ondragstart="drag(event, ' + i +')" ondragover="allowDrop(event)" ondragenter="" ondrop="drop(event, ' + i + ')"><button class="remover" onclick="removePlayer(' + i + ')">X</button>' + filaJogadores[i] + '</p>'  
		}
	document.getElementById('fila').innerHTML = fila;
}

function removePlayer(index){

	console.log(filaJogadores[index] + ' saiu da fila.');

	filaJogadores.splice(index, 1);
	atualizarFila();
}
//___________Database Management______________________________________________________

function addWin(winner){
    for(element of cadastros)
    {
    	for(var i = 0; i < element.nome.length; i++)
    	{

         if(winner.toUpperCase() === element.nome[i])
         {
             element.vitorias++;

             setCadastros();

             updateStats();

             return console.log(corrigirNome(winner) + ' está agora com ' + element.vitorias + ' vitórias.');
        }
      }
    }
    console.log('Cadastro não encontrado.');

    return;
}    

function checkRegistration(nome){
	
	for(element of cadastros)
  {
  	for(var i = 0; i < element.nome.length; i++)
  	{
       if(nome.toUpperCase() === element.nome[i])
       {
       		return console.log(nome + ' já tem cadastro');					
      }
    }
  }

  console.log('Cadastro não encontrado. Criando um novo.');
  
  cadastros.push({nome: [nome.toUpperCase()], vitorias: 0});
	setCadastros();  
	updateStats();
}

function updateStats(){
		let lista = '';
		for(element of cadastros){
			//lista += '<p style="font-size: 18px;">' + corrigirNome(element.nome[0]) + ': ' + element.vitorias + '</p>';
			lista += "<div id='cad' onclick='joinPlayer(\"" + corrigirNome(element.nome[0]) + "\")'><p><strong>" + corrigirNome(element.nome[0]) + "</strong></p><p>Vitórias: " + element.vitorias + "</p></div>";
		}

		lista += '<p id="ponto">Importar cadastros:</br><button onclick="cadastrosPontomais()"><img src="pontomais.png" height="30px" style="vertical-align: top;"></button></p>'
		document.getElementById('cadCol').innerHTML = lista
}

function addNickname(nome, novoApelido){
	for(element of cadastros)
  {
  	for(var i = 0; i < element.nome.length; i++)
  	{
       if(nome.toUpperCase() === element.nome[i])
       {
       		element.nome.push(novoApelido.toUpperCase());
       		setCadastros();  
       		return console.log('Apelido "' + novoApelido.toUpperCase() + '" cadastrado com sucessso para ' + element.nome[0] + '.');					
      }
    }
  }
  return console.log('Cadastro não encontrado');
}

function backup(){
	let d = new Date();
	let backupName = 'Backup ' + String(d.getDate()) + '/' + String(d.getMonth()+1);

	//Confere se já existe um backup no mesmo dia. Se sim, não sobrepõe o existente.

	if(localStorage.getItem(backupName))
	{
		//localStorage.setItem(backupName + '.2', JSON.stringify(cadastros));
		localStorage.setItem(backupName + '.2', JSON.stringify(cadastros));
		return console.log('Criado uma segunda instância de ' + backupName);
	}
	else
	{
		localStorage.setItem(backupName, JSON.stringify(cadastros));	
		console.log(backupName + ' criado com sucesso!');
	}	
}

//-//-//-//-//-// CAUTION //-//-//-//-//-//-//-//-//-//

function resetWins(temCerteza){
	if(!temCerteza)
		return console.log('Você quase zerou a quantidade de vitórias de todos os cadastros. Caso tenha certeza de que deseja prosseguir, utilize um argumento Truthy.');

	for(element of cadastros){
		element.vitorias = 0
	}

	setCadastros();
	return console.log('As vitórias foram resetadas!')
}	

//-----------Funções auxiliares--------------------------------------------------


function corrigirNome(nome){
		nome = nome.charAt(0) + nome.slice(1).toLowerCase();
    return nome;
}


//----------- Drag and Drop ---------------------------------------------------------------------

let selectedPlayer, filaOriginal;
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

	// Remove o selecionado da fila
	// filaJogadores.push(filaJogadores[filaJogadores.length]);
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

	/*ev.preventDefault();
	  var data = ev.dataTransfer.getData("text");
	  console.log(data);
	  ev.target.appendChild(document.getElementById(data));*/
}

//-------------------Sidebar----------------------------------------
var isOpen = false;

function togglePanel() {
	if(isOpen){
			document.getElementById("sidepanel").style.left = "-190px";
		}else{
			document.getElementById("sidepanel").style.left = "0px";
	}  
	isOpen = !isOpen;
}
var painelCadastros = false;

function toggleCad() {
	if(painelCadastros){
			document.getElementById("cadPanel").style.right = "-500px";
		}else{
			document.getElementById("cadPanel").style.right = "0px";
	}  
	painelCadastros = !painelCadastros;
}


//-----------------------TESTE AJAX---------------------------

function runPyScript(input){
	var jqXHR = $.ajax({
		type: "POST",
		url: "database.py",
		async: false,
		data: { mydata: input}
	});

	return jqXHR.responseText;
}

//-Pega as informações do Database e retorna os cadastros já como lista
function getCadastros(){
	var jqXHR = $.ajax({
		type: "GET",
		url: "https://aprendendo-python-requests-default-rtdb.firebaseio.com/.json",
		async: false,
	});

	let dataBase = JSON.parse(jqXHR.responseText);

	return dataBase.Cadastros;
}

function setCadastros(){

	let cad ={Cadastros: cadastros};

	var jqXHR = $.ajax({
		type: "PATCH",
		url: "https://aprendendo-python-requests-default-rtdb.firebaseio.com/.json",
		data: JSON.stringify(cad)
	});

	return jqXHR.responseText;
}

function cadastrosPontomais(){


	/*var requis = $.ajax({
		type: "GET",
		url: "https://aprendendo-python-requests-default-rtdb.firebaseio.com/.json",
		headers: "{ access-token: $2a$10$1xjETjQFvsVxAnuo4Rtre.7ejVLT1KCCdwqIvbRxmMfvZoyM4jIla'}"
	});

	return requis.responseText;*/

	var settings = {
	  "url": "https://api.pontomais.com.br/external_api/v1/employees?active=true&attributes=first_name,last_name&count=true&per_page=200&sort_direction=asc&sort_property=first_name&business_unit_id=73440",
	  "method": "GET",
	  "timeout": 0,
	  "headers": {
	    "access-token": "$2a$10$1xjETjQFvsVxAnuo4Rtre.7ejVLT1KCCdwqIvbRxmMfvZoyM4jIla"
	  },
	};

	var requis = $.ajax(settings).done((response)=>{
		console.log(response);
		let dados = response.employees;

		console.log(dados);
		for(let i = 0; i < dados.length; i++){
			checkRegistration(dados[i].first_name);
			//console.log(dados[i]);
		}
	});	
}

function testReqs(){
	var settings = {
	  "url": "https://api.pontomais.com.br/external_api/v1/reports/work_days",
	  "method": "POST",
	  "timeout": 0,
	  "headers": {
	    "Content-Type": "application/json",
	    "access-token": "$2a$10$1xjETjQFvsVxAnuo4Rtre.7ejVLT1KCCdwqIvbRxmMfvZoyM4jIla"
	  },
	  "data": JSON.stringify({
	    "report": {
	      "start_date": "2022-06-01",
	      "end_date": "2022-07-31",
	      "group_by": "employee",
	      "row_filters": "with_inactives,has_time_cards",
	      "columns": "date,shift_name,time_breaks,shift_appointments,time_cards,summary,extra_time,total_time,shift_time,custom_interval_time,overnight_time,registration_number,time_balance,motive, employee_id",
	      "format": "json"
	    }
	  }),
	};

	$.ajax(settings).done(function (response) {
	  console.log(response);
	});	
}

