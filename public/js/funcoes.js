// import Swal from 'sweetalert2'

function entrar() {

    var emailVar = inp_email.value;
    var senhaVar = inp_senha.value;

    if (emailVar == "" || senhaVar == "") {
        Swal.fire({
            title: 'Erro!',
            text: 'Preencha todos os campos!',
            icon: 'error',
            timer: 3000
        })
    }else{
        console.log("FORM LOGIN: ", emailVar);
        console.log("FORM SENHA: ", senhaVar);
    
        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: emailVar,
                senhaServer: senhaVar
            })
        }).then(function (resposta) {
            console.log("ESTOU NO THEN DO entrar()!")
    
            if (resposta.ok) {
                console.log(resposta);
    
                resposta.json().then(json => {
    
    
                    console.log(json);
                    console.log(JSON.stringify(json));
    
                    sessionStorage.EMAIL_USUARIO = json.emailUsuario;
                    sessionStorage.NOME_USUARIO = json.nomeUsuario;
                    sessionStorage.ID_USUARIO = json.idUsuario;
                    sessionStorage.ID_EMPRESA = json.idEmpresa;
                    sessionStorage.NOME_EMPRESA = json.nomeEmpresa;
                    sessionStorage.CARGO_USUARIO = json.cargo;
    
                    
                    window.location = "dashboard/dashboard.html";
                     // apenas para exibir o loading
    
                });
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: 'E-mail ou senha inválidos!!',
                    icon: 'error',
                    timer: 3000
                });
            }
    
        }).catch(function (erro) {
            console.log(erro);
        })
    }

    return false;
}

// sessão
function validarSessao() {
    // aguardar();

    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;
    var idUsuario = sessionStorage.ID_USUARIO;
    var cargo = sessionStorage.CARGO_USUARIO;
    var nomeEmpresa = sessionStorage.NOME_EMPRESA;
    var idEmpresa = sessionStorage.ID_EMPRESA;

    if (email != null && nome != null && idUsuario != null && cargo != null && nomeEmpresa != null && idEmpresa != null) {
        // window.alert(`Seja bem-vindo, ${nome}!`);
        var h3_empresa = document.getElementById("nome_empresa");
        h3_empresa.innerHTML = `${nomeEmpresa}`;
        // finalizarAguardar();
    } else {
        window.location = "../login.html";
    }
}

function limparSessao() {
    // aguardar();
    sessionStorage.clear();
    // finalizarAguardar();
    window.location = "../login.html";
}

// carregamento (loading)
function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "none";

    var divErrosLogin = document.getElementById("div_erros_login");
    if (texto) {
        divErrosLogin.innerHTML = texto;
    }
}


// modal
function mostrarModal() {
    var divModal = document.getElementById("div_modal");
    divModal.style.display = "flex";
}

function fecharModal() {
    var divModal = document.getElementById("div_modal");
    divModal.style.display = "none";
}

