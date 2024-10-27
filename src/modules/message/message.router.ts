// message.router.ts
import MagicRouter from '../../openapi/magic-router';
import { handleSendMessage } from './message.controller';
import { sendMessageSchema } from './message.schema';

export const MESSAGE_ROUTER_ROOT = '/messages';

const messageRouter = new MagicRouter(MESSAGE_ROUTER_ROOT);

messageRouter.post(
  '/sendMessage',
  { requestType: { body: sendMessageSchema } },
  handleSendMessage,
);

export default messageRouter.getRouter();
