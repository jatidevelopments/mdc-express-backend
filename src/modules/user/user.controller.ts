import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../../utils/api.utils';
import { generateRandomPassword } from '../../utils/auth.utils';
import { CreateUserSchemaType, GetUsersSchemaType } from './user.schema';
import { createUser, deleteUser, getUsers } from './user.services';

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
