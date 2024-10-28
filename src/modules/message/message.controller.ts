// message.controller.ts
import { Request, Response } from 'express';
import { getImageAsBase64, messageCensorship } from './helpers';
import { SendMessageSchemaType } from './message.schema';
import { createMessage, updateConversation } from './message.service';

export const handleSendMessage = async (
  req: Request<unknown, unknown, SendMessageSchemaType>,
  res: Response
): Promise<void> => {
  try {
    const { conversation_id, message, character_id } = req.body;

    if (!conversation_id || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (!(await messageCensorship(message))) {
      res.status(400).json({ error: 'Message contains inappropriate content' });
      return;
    }

    // const calculationResult = heavyCalculation();
    const newMessage = await createMessage(conversation_id, message, character_id || '');

    await updateConversation(conversation_id, newMessage.id);

    const base64Image = await getImageAsBase64(
      'https://i.ibb.co/ThyGvSb/mdc-test-image.webp'
    );

    res.status(200).json({ message: newMessage, base64Image });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
