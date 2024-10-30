import prisma from "../../lib/database";

interface CreateMessageParams {
  conversation_id: number;
  content: string;
  role?: string;
  index?: number;
  is_image?: boolean;
  is_image_request?: boolean;
  liked?: boolean;
  disliked?: boolean;
}

export const createMessage = async ({
  conversation_id,
  content,
  role = "user",
  index = 0,
  is_image = false,
  is_image_request = false,
  liked = false,
  disliked = false,
}: CreateMessageParams) => {
  console.info('Creating message:', content, 'for conversation:', conversation_id);

  return await prisma.message.create({
    data: {
      conversation_id,
      content,
      role,
      index,
      is_image,
      is_image_request,
      liked,
      disliked,
      message_cost_in_tokens: 0,
      request_cost_in_tokens: 0,
      total_completion_cost_in_tokens: 0,
      response_generation_time: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

interface UpdateConversationParams {
  conversation_id: number;
  message_id: number;
}

export const updateConversation = async ({
  conversation_id,
  message_id,
}: UpdateConversationParams) => {
  console.info('Updating conversation:', conversation_id, 'with message:', message_id);

  return await prisma.conversation.update({
    where: { id: conversation_id },
    data: {
      last_message: message_id.toString(),
      last_time_used_at: new Date(),
      updatedAt: new Date(),
    },
  });
};
