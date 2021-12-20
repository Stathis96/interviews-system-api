// Update with your config settings.

export default {

  development: {
    client: "mysql",
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '',
      database : 'interviews-system',
      charset: 'utf8'
    },
    migrations: {
      extension: 'ts'
    }    
  },

  test: {
    client: "mysql",
    connection: {
      host : '127.0.0.1',
      user: "root",
      password : '',
      database: 'test'
    },
    migrations: {
      extension: 'ts'
    } 
  },

  production: {
    client: "mysql",
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '',
      database : 'interviews-system',
      charset: 'utf8'
    },
    migrations: {
      extension: 'ts'
    } 
  }

};
