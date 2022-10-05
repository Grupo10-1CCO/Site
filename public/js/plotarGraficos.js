function plotarBotoes() {
    area_botoes.innerHTML = '';

    fetch("/medidas/resgatarMaquinas").then(function (resposta) {
        if (resposta.ok) {
            if (resposta == 204) {
                console.log("Retorno vazio de máquinas!");
            }
            resposta.json().then(function (resposta) {
                console.log("Máquinas recebidas: ", JSON.stringify(resposta));

                for (var i = 0; i < resposta.length; i++) {

                    var dadosMaquina = resposta[i];

                    var botao = document.createElement("button");
                    botao.setAttribute("id", `botaoMaquina${dadosMaquina.idMaquina}`);
                    botao.setAttribute("onClick", `gerar(1, ${dadosMaquina.idMaquina})`);
                    botao.innerHTML = `${dadosMaquina.nome}`;
                    document.getElementById("area_botoes").appendChild(botao);

                }
            })
        }
    })
}

function gerar(idEmpresa, idMaquina) {

    plotarBotoes();

    area_grafico.innerHTML = '';

    var titulo = document.createElement("h1");
    titulo.innerHTML = `Monitoramento`;
    area_grafico.appendChild(titulo);

    fetch(`/medidas/buscarComponentesMaquina/${idEmpresa}/${idMaquina}`, { cache: 'no-store' }).then(function (resposta){
        if(resposta.ok){
            resposta.json().then(function (retorno){
                console.log(`Dados recebidos: ${JSON.stringify(retorno)}`);

                var vetorComponentes = [];

                for(var i = 0; i < retorno.length; i++){
                    vetorComponentes.push(retorno[i].fkComponente);
                }

                gerarGrafico(vetorComponentes);

            })
        }
    });


    function gerarGrafico(vetorComponentes){

        for(var i = 0; i < vetorComponentes.length; i++){
            var idComponente = vetorComponentes[i];
            fetch(`/medidas/ultimosRegistros/${idEmpresa}/${idMaquina}/${idComponente}`, { cache: 'no-store' }).then(function (resposta) {
                if (resposta.ok) {
                    resposta.json().then(function (retorno) {
                        console.log(`Dados recebidos: ${JSON.stringify(retorno)}`);
                        // retorno.reverse();
        
                        configurarGraficoMon(retorno, idComponente);

                        graficosMedia(idMaquina);
        
                    })
                } else {
                    console.error('Nada foi encontrado!');
                }
            });
        }

    }    

    function configurarGraficoMon(retorno, idComponente) {

        console.log("CHEGOU AQUI:")

        var vetorData = [];
        var vetorRegistro = [];

        for(var i = 0; i < retorno.length; i++){
            var tupla = retorno[i];
            vetorData.push(tupla.momento);
            vetorRegistro.push(tupla.registro);
        }

        var data = {
            labels: vetorData,
            datasets: [{
                label: `Componente: ${retorno[0].nomeComponente} | Unidade de Medida: ${retorno[0].unidadeMedida}`,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: vetorRegistro
            }]
        }

        var config = {
            type: 'line',
            data: data,
            options: {
                scales: {
                    y: {
                        min: 0,
                        max: 100
                    }
                }
            }
        };

        var h3Nome = document.createElement("h3");
        h3Nome.innerHTML = retorno[0].nomeComponente;

        var div = document.createElement("div");
        var canva = document.createElement("canvas");
        canva.setAttribute('id', `grafico${retorno[0].fkComponente}`);
        div.append(h3Nome);
        div.appendChild(canva);
        document.getElementById("area_grafico").appendChild(div);

        var graficoMon = new Chart(
            document.getElementById(`grafico${retorno[0].fkComponente}`),
            config,
        );

        setTimeout(() => atualizarGrafico(graficoMon, idMaquina, idComponente, data), 4000);

    }

    function atualizarGrafico(grafico, idMaquina, idComponente, data) {

        fetch(`/medidas/registrosTempoReal/${idEmpresa}/${idMaquina}/${idComponente}`, { cache: 'no-store' }).then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (novoPonto) {
                    console.log(`Novo dado recebido: ${JSON.stringify(novoPonto)}`);
                    console.log(`Dados atuais do gŕafico: ${data}`);

                    console.log("ME AJUDA SENHOR: " + data.datasets.length);

                    data.labels.shift(); // apagar o primeiro
                    data.labels.push(novoPonto[0].momento); // incluir um novo momento

                    data.datasets[0].data.shift();  // apagar o primeiro de temperatura
                    data.datasets[0].data.push(novoPonto[0].registro); // incluir uma nova medida de temperatura

                    console.log(data)

                    grafico.update();
                    console.log("Update realizado");

                    proximaAtt = setTimeout(() => atualizarGrafico(grafico, idMaquina, idComponente, data), 4000);
                })
            } else {
                console.error('Nada foi encontrado!');
                proximaAtt = setTimeout(() => atualizarGrafico(grafico, idMaquina, idComponente, data), 4000);
            }
        });

    }

}



function graficosMedia(idMaquina){
    fetch("/medidas/mediaUsoComponente").then(function (retorno) {
        if (retorno.ok) {
            if (retorno == 204) {
                console.log("Retorno vazio de máquinas!");
            }
            retorno.json().then(function (resposta) {
                console.log("Médias Recebidas: ", JSON.stringify(resposta));
    
                plotarGraficoMedia(resposta, idMaquina);
    
                // for(var i = 0; i < resposta.length; i++){
    
                //     var dadosMaquina = resposta[i];
    
                //     var botao = document.createElement("button");
                //     botao.setAttribute("id", `botaoMaquina${dadosMaquina.idMaquina}`);
                //     botao.setAttribute("onClick", `gerar(${dadosMaquina.idMaquina})`);
                //     botao.innerHTML = `${dadosMaquina.nome}`;
                //     document.getElementById("area_botoes").appendChild(botao);
    
    
                // }
            })
        }
    })

    function plotarGraficoMedia(retorno, idMaquina) {

        var titulo = document.createElement("h1");
        titulo.innerHTML = `Média Uso Componentes`;
        area_grafico.appendChild(titulo);
    
        for (var i = 0; i < retorno.length; i++) {
    
            if (idMaquina == retorno[i].idMaquina) {
                console.log("teste 1: " + retorno[i].nomeComponente);
                console.log("teste 2: " + retorno[i].MediaUso);
                console.log("teste 3: " + 100 - retorno[i].MediaUso);
    
                const dataMedia = {
                    labels: [
                        'Porcentagem Usada',
                        'Porcentagem Não Usada',
                    ],
                    datasets: [{
                        label: `Uso ${retorno[i].nomeComponente}`,
                        data: [retorno[i].MediaUso, 100 - retorno[i].MediaUso],
                        backgroundColor: [
                            '#4D9E41',
                            '#6B6568',
                        ],
                        hoverOffset: 4
                    }]
                };
    
                const config = {
                    type: 'doughnut',
                    data: dataMedia,
                };
    
                var h3Nome = document.createElement("h3");
                h3Nome.innerHTML = retorno[i].nomeComponente;
    
                var div = document.createElement("div");
                var canva = document.createElement("canvas");
                canva.setAttribute('id', `graficoMedia${retorno[i].fkComponente}`);
                div.appendChild(h3Nome);
                div.appendChild(canva);
                document.getElementById("area_grafico").appendChild(div);
    
                window.grafico = new Chart(
                    document.getElementById(`graficoMedia${retorno[i].fkComponente}`),
                    config
                );
            }
    
        }
    }
}