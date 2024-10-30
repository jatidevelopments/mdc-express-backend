import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../../utils/api.utils';
import { generateRandomPassword } from '../../utils/auth.utils';
import { CreateUserSchemaType, GetUsersSchemaType } from './user.schema';
import { createUser, deleteUser, getUsers } from './user.services';
import { Prisma } from '@prisma/client';

export const handleDeleteUser = async (
  req: Request<{ id: number }, unknown>,
  res: Response,
) => {
  const userId = req.params.id;
  await deleteUser(userId);

  return successResponse(res, 'User has been deleted');
};

export const handleCreateUser = async (
  req: Request<unknown, unknown, CreateUserSchemaType>,
  res: Response,
) => {
  const data = req.body;

  const user = await createUser({
    ...data,
    password: generateRandomPassword(),
    role: 'DEFAULT_USER',
    username: data.username,
    is_premium: false,
    free_messages: 10,
    tokens_amount: 0,
    klaviyo_id: null,
    user_educated_on_inchat_images: false,
    registration_ip: req.ip || '',
    registration_user_agent: req.headers['user-agent'] || '',
    pending_payment: false,
    show_dispute_popup: false,
    banned: false,
    chat_features_explained: false,
    first_inchat_paywall_seen: false,
    hard_image_explanation_seen: false,
    create_char_funnel_options: Prisma.JsonNull,
    is_unverified: false,
    fp_ref_id: null,
    is_tester: false,
    is_cancelation_initiated: false,
  });

  return successResponse(
    res,
    'Email has been sent to the user',
    user,
    StatusCodes.CREATED,
  );
};

export const handleCreateSuperAdmin = async (
  _: Request<unknown, unknown, unknown>,
  res: Response,
) => {
  const password = 'Pa$$w0rd!';

  const user = await createUser({
    email: 'admin@mailinator.com',
    name: 'Super Admin',
    username: 'super_admin',
    password: password,
    role: 'SUPER_ADMIN',
    is_premium: true,
    free_messages: 1000,
    tokens_amount: 1000,
    user_educated_on_inchat_images: true,
    registration_ip: '',
    registration_user_agent: 'System',
    pending_payment: false,
    show_dispute_popup: false,
    banned: false,
    chat_features_explained: true,
    first_inchat_paywall_seen: true,
    hard_image_explanation_seen: true,
    create_char_funnel_options: Prisma.JsonNull,
    is_unverified: false,
    fp_ref_id: null,
    is_tester: false,
    is_cancelation_initiated: false,
  });

  return successResponse(
    res,
    'Super Admin has been created',
    { email: user.email, password },
    StatusCodes.CREATED,
  );
};

export const handleGetUsers = async (
  req: Request<unknown, unknown, unknown, GetUsersSchemaType>,
  res: Response,
) => {
  const userId = req.user.sub;
  const { results, paginatorInfo } = await getUsers(userId, req.query);

  return successResponse(res, undefined, { results, paginatorInfo });
};
