import prisma from "../../lib/database";

export const createMessage = async (
  conversation_id: string,
  message: string,
  character_id: string
) => {
  console.log({ conversation_id, message, character_id });

  // get all available conversations
  const conversations = await prisma.conversation.findMany();

  console.log({ conversations });

  return await prisma.message.create({
    data: {
      conversation_id: conversations[0].id,
      message,
      character_id,
    },
  });
};

export const updateConversation = async (conversation_id: string, message_id: string) => {
  return await prisma.conversation.update({
    where: { id: conversation_id },
    data: {
      last_message_id: message_id,
      last_updated: new Date(),
    },
  });
};
