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
                    botao.setAttribute("onClick", `gerar(${dadosMaquina.idMaquina})`);
                    botao.innerHTML = `${dadosMaquina.nome}`;
                    document.getElementById("area_botoes").appendChild(botao);


                }
            })
        }
    })
}

function gerar(idMaquina) {

    plotarBotoes();

    area_grafico.innerHTML = '';

    var titulo = document.createElement("h1");
    titulo.innerHTML = `Monitoramento`;
    area_grafico.appendChild(titulo);

    fetch(`/medidas/ultimosRegistros/${idMaquina}`, { cache: 'no-store' }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (retorno) {
                console.log(`Dados recebidos: ${JSON.stringify(retorno)}`);
                // retorno.reverse();

                plotarGraficoMon(retorno, idMaquina);
            })
        } else {
            console.error('Nada foi encontrado!');
        }
    });

    function plotarGraficoMon(retorno, idMaquina) {

        // var dados = {
        //     labels: [],
        //     dataset: [{
        //         label: '',
        //         backgroundColor: 'rgb(255, 99, 132)',
        //         borderColor: 'rgb(255, 99, 132)',
        //         data: []
        //     }]
        // };

        var componentes = [];

        for (var i = 0; i < retorno.length; i++) {
            var existeFk = true;

            for (var j = 0; j < componentes.length; j++) {
                if (retorno[i].fkComponente == componentes[j].fkComponente) {
                    existeFk = false;
                }
            }
            if (existeFk) {
                componentes.push({
                    "fkComponente": retorno[i].fkComponente,
                    "nomeComponente": retorno[i].nomeComponente,
                    "unidadeMedida": retorno[i].unidadeMedida,
                    "registro": [],
                    "momento": []
                })
            }
        }

        console.log(componentes)

        for (var i = 0; i < retorno.length; i++) {
            for (var j = 0; j < componentes.length; j++) {
                if (retorno[i].fkComponente == componentes[j].fkComponente) {
                    componentes[j].registro.push(retorno[i].registro);
                    componentes[j].momento.push(retorno[i].momento_grafico);
                }
            }

        }

        for (var i = 0; i < componentes.length; i++) {

            var data = {
                labels: componentes[i].momento,
                datasets: [{
                    label: `Componente: ${componentes[i].nomeComponente} | Unidade de Medida: ${componentes[i].unidadeMedida}`,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: componentes[i].registro
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
            h3Nome.innerHTML = componentes[i].nomeComponente;

            var div = document.createElement("div");
            var canva = document.createElement("canvas");
            canva.setAttribute('id', `grafico${componentes[i].fkComponente}`);
            div.append(h3Nome);
            div.appendChild(canva);
            document.getElementById("area_grafico").appendChild(div);

            var socorro = document.getElementById(`grafico${componentes[i].fkComponente}`).getContext('2d');

            window.grafico = new Chart(
                socorro,
                config
            );

            console.log("socororororororororo: " + idMaquina)

            setTimeout(() => atualizarGrafico(grafico, idMaquina, data), 5000)
        }

    }

    function atualizarGrafico(grafico, idMaquina, data) {

        fetch(`/medidas/registrosTempoReal/${idMaquina}`, { cache: 'no-store' }).then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (novoPonto) {
                    console.log(`Novo dado recebido: ${JSON.stringify(novoPonto)}`);
                    console.log(`Dados atuais do gŕafico: ${data}`);
                    // retorno.reverse();

                    data.labels.shift(); // apagar o primeiro
                    data.labels.push(novoPonto[0].momento_grafico); // incluir um novo momento

                    data.datasets[0].data.shift();  // apagar o primeiro de temperatura
                    data.datasets[0].data.push(novoPonto[0].registro); // incluir uma nova medida de temperatura

                    window.grafico.update();
                    console.log("Update realizado");

                    proximaAtt = setTimeout(() => atualizarGrafico(grafico, idMaquina, data), 5000);
                })
            } else {
                console.error('Nada foi encontrado!');
                proximaAtt = setTimeout(() => atualizarGrafico(grafico, idMaquina, data), 5000);
            }
        });

    }

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
