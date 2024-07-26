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

export const { useLoginMutation, useSendLogOutMutation } =
	authApiSlice;