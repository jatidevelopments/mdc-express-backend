import { ROLE_ENUM, RoleType, SOCIAL_ACCOUNT_ENUM } from '../../enums';
import { GoogleCallbackQuery } from '../../types';
import {
  compareHash,
  fetchGoogleTokens,
  getUserInfo,
  hashPassword,
  JwtPayload,
  signToken,
} from '../../utils/auth.utils';
import { generateRandomNumbers } from '../../utils/common.utils';
import { UserType } from '../user/user.dto';
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from '../user/user.services';
import {
  ChangePasswordSchemaType,
  ForgetPasswordSchemaType,
  LoginUserByEmailSchemaType,
  RegisterUserByEmailSchemaType,
  ResetPasswordSchemaType,
} from './auth.schema';

export const resetPassword = async (payload: ResetPasswordSchemaType) => {
  const user = await getUserById(payload.userId);

  if (!user || user.passwordResetCode !== payload.code) {
    throw new Error('Token is not valid or expired, please try again');
  }

  if (payload.confirmPassword !== payload.password) {
    throw new Error('Password and confirm password must be the same');
  }

  const hashedPassword = await hashPassword(payload.password);

  await updateUser(payload.userId, {
    password: hashedPassword,
    passwordResetCode: null,
  });
};

export const forgetPassword = async (
  payload: ForgetPasswordSchemaType,
): Promise<UserType> => {
  const user = await getUserByEmail(payload.email);

  if (!user) {
    throw new Error("User doesn't exist");
  }

  const code = generateRandomNumbers(4);

  await updateUser(user.id, { passwordResetCode: code });

  return user;
};

export const changePassword = async (
  userId: number,
  payload: ChangePasswordSchemaType,
): Promise<void> => {
  const user = await getUserById(userId);

  if (!user || !user.password) {
    throw new Error('User not found');
  }

  const isCurrentPasswordCorrect = await compareHash(
    user.password,
    payload.currentPassword,
  );

  if (!isCurrentPasswordCorrect) {
    throw new Error('Current password is not valid');
  }

  const hashedPassword = await hashPassword(payload.newPassword);

  await updateUser(userId, { password: hashedPassword });
};

export const registerUserByEmail = async (
  payload: RegisterUserByEmailSchemaType,
): Promise<UserType> => {
  const userExistByEmail = await getUserByEmail(payload.email);

  if (userExistByEmail) {
    throw new Error('Account already exists with the same email address');
  }

  const { confirmPassword, ...rest } = payload;

  const user = await createUser({ ...rest, name: rest.name, role: ROLE_ENUM.DEFAULT_USER }, false);

  return user;
};

export const loginUserByEmail = async (
  payload: LoginUserByEmailSchemaType,
): Promise<string> => {
  const user = await getUserByEmail(payload.email);

  if (!user || !(await compareHash(String(user.password), payload.password))) {
    throw new Error('Invalid email or password');
  }

  const jwtPayload: JwtPayload = {
    sub: String(user.id), // Convert user.id to string
    email: user.email,
    phoneNo: user.phoneNo,
    role: user.role as RoleType,
    username: user.username,
  };

  return signToken(jwtPayload);
};

export const googleLogin = async (
  payload: GoogleCallbackQuery,
): Promise<UserType> => {
  const { code, error } = payload;

  if (error) throw new Error(error);
  if (!code) throw new Error('Code not provided');

  const tokenResponse = await fetchGoogleTokens({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
    grant_type: 'authorization_code',
  });

  const { access_token, refresh_token, expires_in } = tokenResponse;
  const userInfoResponse = await getUserInfo(access_token);
  const { id, email, name } = userInfoResponse;

  let user = await getUserByEmail(email);

  if (!user) {
    user = await createUser({
      email,
      username: name,
      name,  // Add missing `name` field
      role: ROLE_ENUM.DEFAULT_USER,
      password: generateRandomNumbers(4),
      socialAccounts: {
        create: [
          {
            refreshToken: refresh_token,
            tokenExpiry: new Date(Date.now() + expires_in * 1000),
            accountType: SOCIAL_ACCOUNT_ENUM.GOOGLE,
            accessToken: access_token,
            accountID: id,
          },
        ],
      },
    });
  } else {
    await updateUser(user.id, {
      socialAccounts: {
        updateMany: {
          where: { accountID: id },
          data: {
            refreshToken: refresh_token,
            tokenExpiry: new Date(Date.now() + expires_in * 1000),
            accessToken: access_token,
          },
        },
      },
    });
  }

  return user;
};
