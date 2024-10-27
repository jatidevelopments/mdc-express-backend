import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed data for Users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'User One',
      username: 'user_one',
      password: 'securePassword1',  // Use a hash for real applications
      role: 'DEFAULT_USER',
      free_messages: 10,
      is_premium: false,
      klaviyo_id: 'klaviyo_user_1',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'User Two',
      username: 'user_two',
      password: 'securePassword2',
      role: 'SUPER_ADMIN',
      free_messages: 0,
      is_premium: true,
      klaviyo_id: 'klaviyo_user_2',
    },
  });

  // Seed data for Conversations
  const conversation1 = await prisma.conversation.create({
    data: {
      character_id: String(user1.id),
      last_updated: new Date(),
      user: {
        connect: { id: user1.id },
      },
    },
  });

  const conversation2 = await prisma.conversation.create({
    data: {
      character_id: String(user2.id),
      last_updated: new Date(),
      user: {
        connect: { id: user2.id },
      },
    },
  });

  // Seed data for SocialAccounts
  await prisma.socialAccount.create({
    data: {
      accountType: 'GOOGLE',
      accessToken: 'accessToken123',
      refreshToken: 'refreshToken123',
      tokenExpiry: new Date(Date.now() + 3600000),
      accountID: 'google_user_1',
      user: {
        connect: { id: user1.id },
      },
    },
  });

  // Seed data for Messages
  await prisma.message.create({
    data: {
      conversation_id: conversation1.id,
      message: 'Hello, this is a test message!',
      character_id: String(user1.id),
      created_at: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      conversation_id: conversation2.id,
      message: 'Another test message here!',
      character_id: String(user2.id),
      created_at: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
