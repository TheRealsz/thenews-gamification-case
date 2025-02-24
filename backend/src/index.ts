import { Hono } from 'hono';
import webhookApi from './controllers/webhooks';
import userApi from './controllers/user';
import { cors } from 'hono/cors';
import newsletterApi from './controllers/newsletter';

export interface Env {
  DB: D1Database
}

const app = new Hono();

app.use("/*", cors({
  origin: "*"
}))
app.route('/', webhookApi);
app.route('/', userApi)
app.route('/', newsletterApi)

export default app
