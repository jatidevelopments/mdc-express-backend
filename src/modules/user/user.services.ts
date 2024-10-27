import { Prisma } from '@prisma/client';
import { ROLE_ENUM } from '../../enums';
import prisma from '../../lib/database';
import { hashPassword } from '../../utils/auth.utils';
import { getPaginator } from '../../utils/getPaginator';
import { UserType } from './user.dto';
import { GetUsersSchemaType } from './user.schema';

export const updateUser = async (userId: number, payload: Prisma.UserUpdateInput): Promise<UserType> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });

  if (!user) throw new Error('User not found');

  return user as UserType;
};

export const getUserById = async (userId: number, select?: Prisma.UserSelect): Promise<UserType> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select,
  });

  if (!user) throw new Error('User not found');

  return user as UserType;
};

export const getUserByEmail = async (email: string, select?: Prisma.UserSelect): Promise<UserType> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select,
  });

  if (!user) throw new Error('User not found');

  return user as UserType;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await prisma.user.delete({ where: { id: userId } });
};

export const getUsers = async (userId: number, payload: GetUsersSchemaType) => {
  const currentUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!currentUser) throw new Error('User must be logged in');

  const conditions: Prisma.UserWhereInput = {};

  if (payload.searchString) {
    conditions.OR = [
      { name: { contains: payload.searchString, mode: 'insensitive' } },
      { email: { contains: payload.searchString, mode: 'insensitive' } },
    ];
  }

  if (payload.filterByRole) {
    conditions.role = payload.filterByRole;
  } else {
    conditions.role = ROLE_ENUM.DEFAULT_USER;
  }

  const totalRecords = await prisma.user.count({ where: conditions });
  const paginatorInfo = getPaginator(payload.limitParam, payload.pageParam, totalRecords);

  const results = await prisma.user.findMany({
    where: conditions,
    take: paginatorInfo.limit,
    skip: paginatorInfo.skip,
  });

  return { results: results as UserType[], paginatorInfo };
};

export const createUser = async (
  payload: Prisma.UserCreateInput & { password: string },
  checkExist: boolean = true
): Promise<UserType> => {
  if (checkExist) {
    const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existingUser) throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(payload.password);

  const createdUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  return { ...createdUser, password: '', otp: null } as UserType;
};
