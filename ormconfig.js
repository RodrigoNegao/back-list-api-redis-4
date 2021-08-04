require('dotenv').config();

module.exports = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    entities: [
        'src/core/infra/data/database/entities/**/*'
    ],
    migrations: [
        'src/core/infra/data/database/migrations/**/*'
    ],
    cli: {
        entitiesDir: 'src/core/infra/data/database/entities',
        migrationsDir: 'src/core/infra/data/database/migrations'
    }
}