import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
dotenv.config();
const { DB_USER_DEV, DB_PASSWORD_DEV, DB_NAME_DEV, DB_HOST_DEV } = process.env;

const connectDB = new DataSource({
    type: "mysql",
    database: DB_NAME_DEV,
    username: DB_USER_DEV,
    password: DB_PASSWORD_DEV,
    host: DB_HOST_DEV,
    entities: [__dirname + "/../src/entities/**/*.ts"],
    logging: false,
    synchronize: true,
})

connectDB.initialize()
    .then(()=> {
        console.log('Database connected!')
    })
    .catch(err => {
        console.error('Data source initialize error', err)
    })

export default connectDB;