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
                            
                            
                            ul_maquinas.innerHTML += `<li>
                            <a><img src="../assets/icons/server.png">${serialMaquina}</a>
                        </li>`
                        }
                      
                })
            

            } 

        
        })