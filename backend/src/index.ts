import { Hono } from 'hono';
import webhookApi from './controllers/webhooks';
import userApi from './controllers/user';

export interface Env {
  DB: D1Database
}

const app = new Hono();
app.route('/', webhookApi);
app.route('/user', userApi)

export default app
