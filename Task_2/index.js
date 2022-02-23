import express from 'express'
import http from 'http'
import routes from './config/routes.js'
import { databaseConnection } from './spots/spotController.js';

const port = 4000;
const app = express();
const server = http.createServer(app);
app.use('/api', routes);
app.listen(port, async () => {
    await databaseConnection()

    console.log(`Successfully started application, port: ${port}`)
})