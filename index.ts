import express from 'express';
const app = express();
import { client_redis } from './app/redis/index'
import { config } from 'dotenv';
import { router } from './app/router/index_router'
config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

client_redis.connect();

app.post('/', (req, res) => {
  res.status(200).send("Welcome to logistic api !")
});

app.use('/api/v1', router);


const port = process.env.APP_PORT || 9932
app.listen(port, () => {
  console.log(`listening port: ${port}`);
})