import { Injectable } from '@nestjs/common';
import  { Redis } from 'ioredis';

const { NODE_ENV, REDIS_URL, REDIS_URL_TEST } = process.env

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(NODE_ENV === 'test'? REDIS_URL_TEST: REDIS_URL);
  }

  async setValue(key: string, value: string): Promise<string> {
    return this.client.set(key, value);
  }


  async setValueWithExpiration(key: string, value: string, expirationSeconds: number): Promise<string> {
    return this.client.set(key, value, 'EX', expirationSeconds);
  }

  async getValue(key: string): Promise<string> {
    return this.client.get(key);
  }

  async destroyValue(key: string): Promise<void>{
     this.client.del(key);
  }
}