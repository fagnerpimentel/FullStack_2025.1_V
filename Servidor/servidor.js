require("colors");
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser")
var mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://fagner:ctWgmti9MzjBEwih@aulabd.cjihvk4.mongodb.net/?retryWrites=true&w=majority&appName=AulaBD`;
const client = new MongoClient(uri, { useNewUrlParser: true });

var dbo = client.db("exemplo_bd");
var usuarios = dbo.collection("usuarios");

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

    var data = { db_nome: nome, db_login: login, db_senha: senha, db_nasc: nasc };

    usuarios.insertOne(data, function(err){
        if(err){
            resposta.render("resposta",{status: "Erro" ,nome, login, senha, nasc});
        }else{
            resposta.render("resposta",{status: "Sucesso", nome, login, senha, nasc});
        }
    })
})

app.get("/for_ejs",function(requisicao, resposta){
    let valor = requisicao.query.valor;
    resposta.render("exemplo_for",{valor});
})

app.post('/logar', function(requisicao, resposta){
    let login = requisicao.body.login;
    let senha = requisicao.body.senha;
    console.log(login, senha);

    var data = {db_login: login, db_senha: senha}

    usuarios.find(data).toArray(function(err, items){
        console.log(items)
        if(items.length == 0){
            resposta.render("resposta_login",{status: "usuario/senha não encontrado"});
        }else if(err){
            resposta.render("resposta_login",{status: "erro ao logar"});
        }else{
            resposta.render("resposta_login",{status: "usuario "+login+" logado"});
        }
    })

})


app.post('/atualizar_senha', function(requisicao, resposta){
    let login = requisicao.body.login;
    let senha = requisicao.body.senha;
    let novasenha = requisicao.body.novasenha;

    let data = { db_login: login, db_senha: senha }
    let new_data = { $set: {db_senha: novasenha}}

    usuarios.updateOne(data, new_data, function(err, result){
        console.log(result);
    
        if (result.modifiedCount == 0) {
            resposta.render('resposta_login', {status: "Usuário/senha não encontrado!"})
        }else if (err) {
            resposta.render('resposta_login', {status: "Erro ao atualizar usuário!"})
        }else {
            resposta.render('resposta_login', {status: "Usuário atualizado com sucesso!"})        
        };
    })

})



app.post('/remover_usuario', function(requisicao, resposta){
    let login = requisicao.body.login;
    let senha = requisicao.body.senha;

    let data = { db_login: login, db_senha: senha }

    usuarios.deleteOne(data, function(err, result){
        console.log(result);

          if (result.deletedCount == 0) {
            resposta.render('resposta_login', {status: "Usuário/senha não encontrado!"})
          }else if (err) {
            resposta.render('resposta_login', {status: "Erro ao remover usuário!"})
          }else {
            resposta.render('resposta_login', {status: "Usuário removido com sucesso!"})        
          };
    })
})

