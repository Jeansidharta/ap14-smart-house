import React from 'react';

export function useGetData<T>(url: string) {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<null | Error>(null);
	const [data, setData] = React.useState<null | T>(null);

	async function getData() {
		let response: Response;
		try {
			response = await fetch (url, {
				method: 'GET',
			});
			if (response.status < 200 || response.status > 299) {
				throw new Error('Non-200 response');
			}
			const data = await response.json();
			setError(null);
			setData(data);
			return data;
		} catch (e) {
			setError(e);
			setData(null);
			return e;
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		getData();
	}, []);

	return [data, loading, error, { getData }] as const;
}