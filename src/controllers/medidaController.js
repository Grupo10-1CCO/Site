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

    const limite_linhas = 35;

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

function buscarRegistroTempoReal(req, res){
    var idMaquina = req.params.idMaquina;

    medidaModel.buscarRegistroTempoReal(idMaquina).then(function (resultado){
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

module.exports = {
    buscarMaquinas,
    buscarUltimosRegistros,
    buscarRegistroTempoReal,
    mediaUsoComponente
    // buscarUltimasMedidas,
    // buscarMedidasEmTempoReal

}