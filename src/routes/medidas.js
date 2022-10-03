var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");

router.get("/resgatarMaquinas", function(req, res){
    medidaController.buscarMaquinas(req, res);
});

router.get("/mediaUsoComponente", function(req, res){
    medidaController.mediaUsoComponente(req, res);
});

router.get("/ultimosRegistros/:idMaquina", function (req, res){
    medidaController.buscarUltimosRegistros(req, res);
});

router.get("/ultimas/:idAquario", function (req, res) {
    medidaController.buscarUltimasMedidas(req, res);
});

router.get("/tempo-real/:idAquario", function (req, res) {
    medidaController.buscarMedidasEmTempoReal(req, res);
})

module.exports = router;