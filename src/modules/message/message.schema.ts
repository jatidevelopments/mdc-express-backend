import * as z from 'zod';

export const sendMessageSchema = z.object({
  conversation_id: z.string({ required_error: 'Conversation ID is required' }),
  message: z.string({ required_error: 'Message content is required' }).min(1),
  character_id: z.string().optional(),
});

export type SendMessageSchemaType = z.infer<typeof sendMessageSchema>;
