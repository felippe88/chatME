const Sequelize = require('sequelize');

const db = require('./db');

const Sala = db.define('salas',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    }
   

});
//Cria Tabela
//Sala.sync();

//apaga tabelma e cria novamente
//Usuario.sync({ force:true});

module.exports = Sala;