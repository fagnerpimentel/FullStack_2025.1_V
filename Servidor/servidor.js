require("colors");
var http = require("http");
var express = require("express");
let bodyParser = require("body-parser")

var app = express();
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views');

var server = http.createServer(app);
server.listen(80);

console.log("Servidor rodando ...".rainbow);


// Métodos e actions

app.get("/inicio", function(requisicao, resposta){
    resposta.redirect("Aula_1/index.html")
})

app.post("/inicio", function(requisicao, resposta){
    resposta.redirect("Aula_1/index.html")
})

app.get("/cadastrar", function(requisicao, resposta){
    let nome = requisicao.query.nome;
    let login = requisicao.query.login;
    let senha = requisicao.query.senha;
    let nasc = requisicao.query.nascimento;

    console.log(nome, login, senha, nasc)
})

app.post("/cadastrar", function(requisicao, resposta){
    let nome = requisicao.body.nome;
    let login = requisicao.body.login;
    let senha = requisicao.body.senha;
    let nasc = requisicao.body.nascimento;
    console.log(nome, login, senha, nasc);
    resposta.render("resposta",{nome, login, senha, nasc});
})
