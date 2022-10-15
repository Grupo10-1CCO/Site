var sidebar = document.getElementById("sidebar");

function botaoMenu(){
    if(sidebar.style.display == "flex"){
        sidebar.style.display = "none";
        console.log("caiu em none");
    }else{
        sidebar.style.display = "flex";
        console.log("caiu em flex");
    }
}

function guardar(idMaquina) {
    sessionStorage.ID_MAQUINA = idMaquina;
    sessionStorage.BOT_SELECIONADO = `maquina${idMaquina}`;
    
}

function selecionarBotao(idBotao) {
    
    document.getElementById(idBotao).className = "item-selecionado"
}

var idEmpresa = sessionStorage.ID_EMPRESA
    fetch("/medidas/buscarServidores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idEmpresa: idEmpresa
            })
        }).then(function (resposta) {
            if (resposta.ok) {
                
                resposta.json().then(json => {
                    
                        console.log(JSON.stringify(json));
                        console.log(json);

                    for (var index = 0; index < json.length; index++) {

                            idMaquina = json[index].idMaquina;
                            serialMaquina = json[index].serialMaquina;
                            nomeMaquina = json[index].nome;
                            fkEmpresa = json[index].fkEmpresa;
                            
                            
                            ul_maquinas.innerHTML += `<li>
                            <a href='dashboard.html' onclick="guardar(${idMaquina})" id="maquina${idMaquina}"><img src="../assets/icons/server.png">${nomeMaquina}</a>
                        </li>`
                        }
                      
                })
            

            } 

        
        })