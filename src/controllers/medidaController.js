var medidaModel = require("../models/medidaModel");

function buscarMaquinas(req, res){
    medidaModel.buscarMaquinas().then(function (resultado){
        if(resultado.length > 0){
            res.status(200).json(resultado);
        }else{
            res.status(204).send("Não foram encontradas máquinas!");
        }
    }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao tentar resgatar as máquinas! Erro: " + erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    })
}

function buscarUltimosRegistros(req, res){

    const limite_linhas = 15;

    var idMaquina = req.params.idMaquina;

    medidaModel.buscarUltimosRegistros(idMaquina, limite_linhas).then(function (resultado){
        if(resultado.length > 0){
            res.status(200).json(resultado);
        }else{
            res.status(204).send("Não foram encontrados registros!");
        }
    }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao tentar os últimos registros no controller! Erro: " + erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });

}

function mediaUsoComponente(req, res){
    medidaModel.mediaUsoComponente().then(function (resultado){
        if(resultado.length > 0){
            res.status(200).json(resultado);
        }else{
            res.status(204).send("Não foram encontrados componentes para calculo da média!");
        }
    }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao tentar resgatar a média do uso dos componentes! Erro: " + erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    })
}

function buscarUltimasMedidas(req, res) {

    const limite_linhas = 7;

    var idAquario = req.params.idAquario;

    console.log(`Recuperando as ultimas ${limite_linhas} medidas`);

    medidaModel.buscarUltimasMedidas(idAquario, limite_linhas).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


function buscarMedidasEmTempoReal(req, res) {

    var idAquario = req.params.idAquario;

    console.log(`Recuperando medidas em tempo real`);

    medidaModel.buscarMedidasEmTempoReal(idAquario).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    buscarMaquinas,
    buscarUltimosRegistros,
    mediaUsoComponente
    // buscarUltimasMedidas,
    // buscarMedidasEmTempoReal

}