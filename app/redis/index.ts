import { createClient } from "redis";
import { db } from "../config/database";

const client_redis = createClient({ url: process.env.URL_REDIS })

client_redis.on('ready', async () => {
  console.log(`REDIS [READY] !!`)
  tester();
})

const tester = async () => {
  try {
    console.log(`REDIS SET [MESSAGE RESPONSE] [START]`);
    const data = {
      name: "John",
      age: 31,
      city: "New York"
    };
    client_redis.set('message-response-logistic', JSON.stringify(data));
  }catch (err) {
    console.log(`REDIS SET [MESSAGE RESPONSE] [ERROR] => `, err);
  }
}

export { client_redis }