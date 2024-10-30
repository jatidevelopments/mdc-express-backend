// message.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from "../../lib/database";
import { messageCensorship } from './helpers';
import { SendMessageSchemaType } from './message.schema';
import { createMessage, updateConversation } from './message.service';


export const handleSendMessage = async (
  req: Request<unknown, unknown, SendMessageSchemaType>,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const sendMessageSchema = z.object({
      conversation_id: z.string().nonempty(),
      message: z.string().nonempty(),
      character_id: z.string().optional(),
    });
    const parsedBody = sendMessageSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({ error: 'Invalid request data' });
      return;
    }

    const { conversation_id, message, character_id } = parsedBody.data;
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check for inappropriate content
    if (!(await messageCensorship(message))) {
      res.status(400).json({ error: 'Message contains inappropriate content' });
      return;
    }

    // Resolve character_id if not provided
    const finalCharacterId = character_id
      ? parseInt(character_id)
      : (
        await prisma.conversation.findUnique({
          where: { id: parseInt(conversation_id) },
          select: { character_id: true },
        })
      )?.character_id;

    if (!finalCharacterId) {
      res.status(400).json({ error: 'Character ID required' });
      return;
    }

    // Create new message
    const newMessage = await createMessage({
      conversation_id: parseInt(conversation_id),
      content: message,
      role: 'user',
      index: 0,
      is_image: false,
      is_image_request: false,
      liked: false,
      disliked: false,
    });

    // Update conversation
    await updateConversation({
      conversation_id: parseInt(conversation_id),
      message_id: newMessage.id,
    });

    // Handle non-premium user free message count
    if (!user.is_premium) {
      if (user.free_messages <= 1) {
        await prisma.user.update({
          where: { id: user.id },
          data: { free_messages: 0 },
        });
        if (user.klaviyo_id) {
          console.info(`Email sent to user with ID: ${user.klaviyo_id}`);
        }
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { free_messages: { decrement: 1 } },
        });
      }
    }
    // Send success response
    res.status(200).json({ message: newMessage });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
