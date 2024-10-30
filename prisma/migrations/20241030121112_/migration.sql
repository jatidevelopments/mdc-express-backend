-- CreateEnum
CREATE TYPE "ROLE_ENUM" AS ENUM ('DEFAULT_USER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "SOCIAL_ACCOUNT_ENUM" AS ENUM ('FACEBOOK', 'GOOGLE', 'TWITTER');

-- CreateTable
CREATE TABLE "User" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ROLE_ENUM" NOT NULL DEFAULT 'DEFAULT_USER',
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "free_messages" INTEGER DEFAULT 10,
    "tokens_amount" DECIMAL(65,30),
    "free_messages_refill_scheduled_for" TIMESTAMP(3),
    "subscription_type" TEXT,
    "user_educated_on_inchat_images" BOOLEAN NOT NULL,
    "klaviyo_id" TEXT,
    "utm_on_registration" JSONB,
    "utm_on_purchase" JSONB,
    "registration_ip" TEXT NOT NULL,
    "registration_user_agent" TEXT NOT NULL,
    "privacy_and_terms_accepted" TIMESTAMP(3),
    "age_policy_accepted" TIMESTAMP(3),
    "gender" TEXT,
    "cancelation_reason" TEXT,
    "last_payment" TIMESTAMP(3),
    "stripe_customer_id" TEXT,
    "pending_payment" BOOLEAN NOT NULL,
    "banned" BOOLEAN NOT NULL,
    "show_dispute_popup" BOOLEAN NOT NULL,
    "chat_features_explained" BOOLEAN NOT NULL,
    "first_inchat_paywall_seen" BOOLEAN NOT NULL,
    "hard_image_explanation_seen" BOOLEAN NOT NULL,
    "email_quality" TEXT,
    "country" TEXT,
    "millionverifier_result" TEXT,
    "is_tester" BOOLEAN NOT NULL,
    "referrer" TEXT,
    "is_cancelation_initiated" BOOLEAN NOT NULL,
    "create_char_funnel_options" JSONB,
    "is_unverified" BOOLEAN NOT NULL,
    "fp_ref_id" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleOAuth" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GoogleOAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "accountType" "SOCIAL_ACCOUNT_ENUM" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "tokenExpiry" TIMESTAMP(3),
    "refreshToken" TEXT,
    "accountID" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "greeting" TEXT NOT NULL,
    "system_prompt" TEXT,
    "last_message" TEXT,
    "last_time_used_at" TIMESTAMP(3),
    "model" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "character_id_2_deleteme" INTEGER,
    "user_id_if_archived" INTEGER,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "message_cost_in_tokens" DECIMAL(65,30),
    "request_cost_in_tokens" INTEGER NOT NULL,
    "total_completion_cost_in_tokens" INTEGER NOT NULL,
    "is_image" BOOLEAN NOT NULL,
    "is_image_request" BOOLEAN NOT NULL,
    "image_id" INTEGER,
    "liked" BOOLEAN NOT NULL,
    "disliked" BOOLEAN NOT NULL,
    "dislike_feedback" TEXT,
    "image_generation_duration" DECIMAL(65,30),
    "response_generation_time" DECIMAL(65,30),
    "tts_s3_url" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "profile_images" TEXT[],
    "system_prompt" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "greeting" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "skin_color" TEXT NOT NULL,
    "body_type" TEXT NOT NULL,
    "breast_size" TEXT NOT NULL,
    "eyes_color" TEXT NOT NULL,
    "hair_style" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_generated_character" BOOLEAN NOT NULL,
    "butt_size" TEXT NOT NULL,
    "outfit" TEXT NOT NULL,
    "agreebleness" TEXT NOT NULL,
    "sexual_dynamics" TEXT NOT NULL,
    "extraversion" TEXT NOT NULL,
    "power_dynamics" TEXT NOT NULL,
    "quirks" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "hobbies" TEXT NOT NULL,
    "user_role" TEXT NOT NULL,
    "char_role" TEXT NOT NULL,
    "setting" TEXT NOT NULL,
    "sd_prompt_embedding" TEXT NOT NULL,
    "default_style" TEXT NOT NULL,
    "funnel" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "quick_reply" TEXT NOT NULL,
    "tags" TEXT[],
    "faceswap_image_s3" TEXT NOT NULL,
    "creation_duration" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "species" TEXT NOT NULL,
    "body_type_to_show" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSubscription" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stripe_products_id" INTEGER NOT NULL,
    "next_recurring_payment_date" TIMESTAMP(3),
    "card_hash" TEXT NOT NULL,
    "card_expiry_date" TEXT NOT NULL,
    "retention_months" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "recovery_payment_retries" INTEGER NOT NULL,
    "next_recovery_payment_retry_date" TIMESTAMP(3),
    "price_net" INTEGER NOT NULL,
    "price_gross" INTEGER NOT NULL,
    "monthly_billing_cycle" INTEGER NOT NULL,
    "monthly_tokens" INTEGER NOT NULL,
    "is_cancelation_initiated" BOOLEAN NOT NULL,

    CONSTRAINT "PaymentSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebugInfo" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "DebugInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DreamCoinsLog" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payload" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "DreamCoinsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunnelStatistics" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "statistics" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "FunnelStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_klaviyo_id_key" ON "User"("klaviyo_id");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleOAuth_email_key" ON "GoogleOAuth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleOAuth_userId_key" ON "GoogleOAuth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_userId_key" ON "PasswordReset"("userId");

-- CreateIndex
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");

-- CreateIndex
CREATE INDEX "Character_user_id_idx" ON "Character"("user_id");

-- AddForeignKey
ALTER TABLE "GoogleOAuth" ADD CONSTRAINT "GoogleOAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSubscription" ADD CONSTRAINT "PaymentSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DreamCoinsLog" ADD CONSTRAINT "DreamCoinsLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
