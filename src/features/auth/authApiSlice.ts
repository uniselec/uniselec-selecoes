import { Forgot, ResetPassword } from '../../types/ResetPassword';
import { User } from '../../types/User';
import { apiSlice } from '../api/apiSlice';
import { logOut, setCredentials } from './authSlice';


export type Credentials = {
	email: string;
	password: string;
	device_name: string;
};

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation({
			query: (credentials: Credentials) => ({
				url: '/login',
				method: 'POST',
				body: { ...credentials },
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(setCredentials(response.data));
				} catch (error) {
					console.log(error);
				}
			},
		}),
		register: builder.mutation({
			query: (user: User) => ({
				url: '/register',
				method: 'POST',
				body: { ...user },
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(setCredentials(response.data?.data));
				} catch (error) {
					console.log(error);
				}
			},
		}),
		resetPassword: builder.mutation({
			query: (passwordResetData: ResetPassword) => ({
				url: '/reset-password',
				method: 'POST',
				body: { ...passwordResetData },
			})
		}),
		passwordForgot: builder.mutation({
			query: (passwordForgot: Forgot) => ({
				url: '/password/forgot',
				method: 'POST',
				body: { ...passwordForgot },
			})
		}),
		sendLogOut: builder.mutation({
			query: () => ({
				url: '/logout',
				method: 'POST',
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(logOut());
					dispatch(apiSlice.util.resetApiState());
				} catch (error) {
					console.log(error);
				}
			},
		}),
	}),
});

export const { useLoginMutation, usePasswordForgotMutation, useRegisterMutation, useSendLogOutMutation, useResetPasswordMutation } =
	authApiSlice;