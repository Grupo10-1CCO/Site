var database = require("../database/config");

function buscarMaquinas(){
    var query = '';

    if (process.env.AMBIENTE_PROCESSO == "producao") {

        // ADAPTAR

        query = `SELECT * FROM Maquina;`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM Maquina;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarServidores(idEmpresa){
    var query = ``;

    if(process.env.AMBIENTE_PROCESSO == "producao") {
        // ADAPTAR
    }else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento"){
        query = `SELECT * FROM Maquina WHERE fkEmpresa = ${idEmpresa};`;
    }else{
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}


function buscarComponentesMaquina(idEmpresa, idMaquina){
    var query = ``;

    if(process.env.AMBIENTE_PROCESSO == "producao") {
        // ADAPTAR
    }else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento"){
        query = `SELECT fkComponente FROM DadosServidor WHERE idMaquina = ${idMaquina} AND idEmpresa = ${idEmpresa} GROUP BY fkComponente;`;
    }else{
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarUltimosRegistros(idEmpresa, idMaquina, fkComponente, limite_linhas) {

    var query = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {

        // ADAPTAR

        query = `select top ${limite_linhas}
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        momento,
                        FORMAT(momento, 'HH:mm:ss') as momento_grafico
                    from medida
                    where fk_aquario = ${idAquario}
                    order by id desc`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM DadosServidor 
                    WHERE idEmpresa = ${idEmpresa} AND idMaquina = ${idMaquina} AND fkComponente = ${fkComponente} ORDER BY idRegistro LIMIT ${limite_linhas};`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarRegistroTempoReal(idEmpresa, idMaquina, fkComponente) {

    var query = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {

        // ADAPTAR

        query = `select top ${limite_linhas}
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        momento,
                        FORMAT(momento, 'HH:mm:ss') as momento_grafico
                    from medida
                    where fk_aquario = ${idAquario}
                    order by id desc`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM DadosServidor 
                    WHERE idEmpresa = ${idEmpresa} AND idMaquina = ${idMaquina} AND fkComponente = ${fkComponente} ORDER BY idRegistro DESC LIMIT 1;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function mediaUsoComponente(){
    var query = '';

    if (process.env.AMBIENTE_PROCESSO == "producao") {

        // ADAPTAR

        query = `SELECT * FROM MediaUsoComponente;`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM MediaUsoComponente;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

// function buscarUltimasMedidas(idAquario, limite_linhas) {

//     instrucaoSql = ''

//     if (process.env.AMBIENTE_PROCESSO == "producao") {
//         instrucaoSql = `select top ${limite_linhas}
//         dht11_temperatura as temperatura, 
//         dht11_umidade as umidade,  
//                         momento,
//                         FORMAT(momento, 'HH:mm:ss') as momento_grafico
//                     from medida
//                     where fk_aquario = ${idAquario}
//                     order by id desc`;
//     } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
//         instrucaoSql = `select 
//         dht11_temperatura as temperatura, 
//         dht11_umidade as umidade,
//                         momento,
//                         DATE_FORMAT(momento,'%H:%i:%s') as momento_grafico
//                     from medida
//                     where fk_aquario = ${idAquario}
//                     order by id desc limit ${limite_linhas}`;
//     } else {
//         console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
//         return
//     }

//     console.log("Executando a instrução SQL: \n" + instrucaoSql);
//     return database.executar(instrucaoSql);
// }

// function buscarMedidasEmTempoReal(idAquario) {

//     instrucaoSql = ''

//     if (process.env.AMBIENTE_PROCESSO == "producao") {
//         instrucaoSql = `select top 1
//         dht11_temperatura as temperatura, 
//         dht11_umidade as umidade,  
//                         CONVERT(varchar, momento, 108) as momento_grafico, 
//                         fk_aquario 
//                         from medida where fk_aquario = ${idAquario} 
//                     order by id desc`;

//     } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
//         instrucaoSql = `select 
//         dht11_temperatura as temperatura, 
//         dht11_umidade as umidade,
//                         DATE_FORMAT(momento,'%H:%i:%s') as momento_grafico, 
//                         fk_aquario 
//                         from medida where fk_aquario = ${idAquario} 
//                     order by id desc limit 1`;
//     } else {
//         console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
//         return
//     }

//     console.log("Executando a instrução SQL: \n" + instrucaoSql);
//     return database.executar(instrucaoSql);
// }


module.exports = {
    buscarMaquinas,
    buscarComponentesMaquina,
    buscarUltimosRegistros,
    buscarRegistroTempoReal,
    mediaUsoComponente,
    buscarServidores
    // buscarUltimasMedidas,
    // buscarMedidasEmTempoReal
}
