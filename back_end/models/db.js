const Sequelize = require('sequelize');


const sequelize = new Sequelize('chat_me', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
  });


//teste de conexao com banco  
sequelize.authenticate()
.then(() => {
    console.log("Conexão com banco de dados realizada com sucesso!");
}).catch(() => {
    console.log("Conexão com banco de dados NÃO realizada com sucesso!");
});

module.exports = sequelize;