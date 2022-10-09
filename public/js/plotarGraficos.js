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

    // area_grafico.innerHTML = '';

    // var titulo = document.createElement("h1");
    // titulo.innerHTML = `Monitoramento`;
    // area_grafico.appendChild(titulo);

    fetch(`/medidas/buscarComponentesMaquina/${idEmpresa}/${idMaquina}`, {cache: 'no-store'}).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (retorno) {
                console.log(`Dados recebidos dos componentes: ${JSON.stringify(retorno)}`);

                for (var i = 0; i < retorno.length; i++) {
                    gerarGrafico(retorno[i].fkComponente);
                }
                graficosMedia(idMaquina);


            })
        }
    });


    function gerarGrafico(idComponente) {
        fetch(`/medidas/ultimosRegistros/${idEmpresa}/${idMaquina}/${idComponente}`, {
            cache: 'no-store'
        }).then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (retorno) {
                    console.log(`Dados recebidos: ${JSON.stringify(retorno)}`);
                    configurarGraficoMon(retorno, idComponente);
                })
            } else {
                console.error('Nada foi encontrado!');
            }
        });
    }

    function configurarGraficoMon(retorno, idComponente) {

        // var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        // gradient.addColorStop(0, 'rgba(214, 31, 31, 0.5)');   
        // gradient.addColorStop(1, 'rgba(214, 31, 31, 0)');

        var vetorData = [];
        var vetorRegistro = [];

        for (var i = 0; i < retorno.length; i++) {
            var tupla = retorno[i];
            vetorData.push(tupla.momento);
            vetorRegistro.push(tupla.registro);
        }

        var data = {
            labels: vetorData,
            datasets: [{
                label: `Componente: ${retorno[0].nomeComponente} | Unidade de Medida: ${retorno[0].unidadeMedida}`,
                backgroundColor: 'rgba(255, 250, 250, 0.8)',
                borderColor: 'rgba(255, 250, 250, 0.8)',
                data: vetorRegistro,
                fill: true,
                tension: 0.5
            }]
        }

        var config = {
            type: 'line',
            data: data,
            backgroundColor: '#1E1E1E',
            options: {
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'white',
                            font:{
                                size: 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'white',
                            font:{
                                size: 10
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white',
                            font:{
                                size: 10
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        };

        var h3Nome = document.createElement("h3");
        h3Nome.innerHTML = retorno[0].nomeComponente;

        var nomeComponente = retorno[0].nomeComponente;
        var nomeSplit = nomeComponente.substring(0,3);

        if(nomeSplit == "CPU"){
            var graficoMon = new Chart(
                document.getElementById(`graficoCpu`),
                config,
            );
        }else if(nomeSplit == "RAM"){
            var graficoMon = new Chart(
                document.getElementById(`graficoRam`),
                config,
            );
        }else{

        }

        // var div = document.createElement("div");
        // var canva = document.createElement("canvas");
        // canva.setAttribute('id', `grafico${retorno[0].fkComponente}`);
        // div.append(h3Nome);
        // div.appendChild(canva);
        // document.getElementById("area_grafico").appendChild(div);

        // var graficoMon = new Chart(
        //     document.getElementById(`grafico${retorno[0].fkComponente}`),
        //     config,
        // );

        setTimeout(() => atualizarGrafico(idEmpresa, idMaquina, idComponente, data), 5000);

        function atualizarGrafico(idEmpresa, idMaquina, fkComponente, data) {
            fetch(`/medidas/registrosTempoReal/${idEmpresa}/${idMaquina}/${fkComponente}`, {
                cache: 'no-store'
            }).then(function (resposta) {
                if (resposta.ok) {
                    resposta.json().then(function (novoPonto) {
                        console.log(`Novo dado recebido: ${JSON.stringify(novoPonto)}`);
                        console.log(`Dados atuais do gŕafico: ${data}`);

                        console.log("ME AJUDA SENHOR: " + data.datasets.length);

                        data.labels.shift();
                        data.labels.push(novoPonto[0].momento);

                        data.datasets[0].data.shift();
                        data.datasets[0].data.push(novoPonto[0].registro);

                        graficoMon.update('none');

                        proximaAtt = setTimeout(() => atualizarGrafico(idEmpresa, idMaquina, idComponente, data), 5000);
                    })
                } else {
                    console.error('Nada foi encontrado!');
                    proximaAtt = setTimeout(() => atualizarGrafico(idEmpresa, idMaquina, idComponente, data), 5000);
                }
            })
        }

    }

}

function graficosMedia(idMaquina) {
    fetch("/medidas/mediaUsoComponente").then(function (retorno) {
        if (retorno.ok) {
            if (retorno == 204) {
                console.log("Retorno vazio de máquinas!");
            }
            retorno.json().then(function (resposta) {
                console.log("Médias Recebidas: ", JSON.stringify(resposta));

                plotarGraficoMedia(resposta, idMaquina);

            })
        }
    })

    function plotarGraficoMedia(retorno, idMaquina) {

        var titulo = document.createElement("h1");
        titulo.innerHTML = `Média Uso Componentes`;
        area_grafico.appendChild(titulo);

        for (var i = 0; i < retorno.length; i++) {

            if (idMaquina == retorno[i].idMaquina) {

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