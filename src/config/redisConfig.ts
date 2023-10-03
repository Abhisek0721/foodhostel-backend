import properties from './properties';
import { Redis } from 'ioredis';

const redis = new Redis(properties.REDIS_URL);


export default redis;