const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'asd',
        database: 'market_cubos_querybuilder'
    }
});

module.exports = knex;