import {DataSource, DataSourceOptions} from 'typeorm'
import {config} from 'dotenv'

config()
export const datasourceOptions:DataSourceOptions={
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    logging: false,
    synchronize: false
}

const datasSource = new DataSource(datasourceOptions);

export default datasSource;
