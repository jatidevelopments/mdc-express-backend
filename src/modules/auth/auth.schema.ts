import z from 'zod';
import validator from 'validator';
import { passwordValidationSchema } from '../../common/common.schema';
import { baseCreateUser } from '../user/user.schema';

export const resetPasswordSchema = z.object({
  userId: z
    .number({ required_error: 'userId is required' })
    .int()
    .positive('userId must be a valid positive integer'),
  code: z
    .string({ required_error: 'code is required' })
    .length(4, 'Code must be exactly 4 characters')
    .refine((value) => validator.isAlphanumeric(value), 'Code must be valid'),
  password: passwordValidationSchema('Password'),
  confirmPassword: passwordValidationSchema('Confirm password'),
});

export const changePasswordSchema = z.object({
  currentPassword: passwordValidationSchema('Current password'),
  newPassword: passwordValidationSchema('New password'),
});

export const forgetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Email must be valid'),
});

export const registerUserByEmailSchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }).min(1),
    confirmPassword: passwordValidationSchema('Confirm Password'),
  })
  .merge(baseCreateUser)
  .strict()
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Password and confirm password must be the same',
    path: ['confirmPassword'],
  });

export const loginUserByEmailSchema = baseCreateUser;

export type RegisterUserByEmailSchemaType = z.infer<
  typeof registerUserByEmailSchema
>;
export type LoginUserByEmailSchemaType = z.infer<typeof loginUserByEmailSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type ForgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
