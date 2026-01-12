import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/app/services/api.js';
import { redirect } from 'react-router-dom';
import { formatError } from '@/app/utils/errorformatter.js';

export const useLogin = () => {
	return useMutation({
		mutationFn: async (data) => {
			await api.post('/auth/login', data)
		},
		onSuccess: () => {
			toast.removeAll();
			toast.success('Login successful');
			window.location.href = "/";
		},
		onError: (error) => {
			toast.removeAll();
			toast.error(formatError(error));
		}
	})
}