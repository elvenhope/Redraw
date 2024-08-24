import { useState } from 'react';
import { fetchUserDetails } from '../api/getUserDetailsApi';
import { UserDetails } from '../types';

export const useUserDetails = () => {
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchDetails = async () => {
		setLoading(true);
		try {
			const data = await fetchUserDetails();
			setUserDetails(data);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	};

	return { userDetails, loading, error, fetchDetails };
};
