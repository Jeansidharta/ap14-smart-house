import React from 'react';

export function usePostData<T>(baseUrl: string) {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<null | Error>(null);
	const [data, setData] = React.useState<null | T>(null);

	async function postData(url: string, body: Object) {
		let response: Response;
		try {
			response = await fetch (baseUrl + url, {
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
				},
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

	return [postData, { loading, error, data } as const] as const;
}