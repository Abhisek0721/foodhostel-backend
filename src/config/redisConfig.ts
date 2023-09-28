import properties from './properties';
import { Redis } from 'ioredis';

const redis = new Redis({
    port: properties.REDIS_PORT, // Redis port
    host: properties.REDIS_HOST, // Redis host
    username: "default", // needs Redis >= 6
    password: properties.REDIS_PASSWORD,
    db: 0, // Defaults to 0
});


export default redis;