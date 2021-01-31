import React from 'react';
import { API_URL } from '../constants/api-url';
import { MethodNames } from '../models/lamp-methods';
import { usePostData } from './use-post-data';

type Command = {
	targets: string[],
	method: MethodNames,
	args: any[],
}

export function useSendCommand<T>() {
	const [rawSendCommand, { loading, error }] = usePostData(API_URL + '/lamp/rawmethod');

	async function sendCommand (targets: number[], method: string, args: any[]) {
		return rawSendCommand('', { targets, method, args });
	}

	return [sendCommand, { loading, error }] as const;
}