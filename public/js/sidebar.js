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