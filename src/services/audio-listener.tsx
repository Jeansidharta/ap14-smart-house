import React, { FC } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useLamps } from '../contexts/lamps';
import { useMusicListener } from '../contexts/music-listener';
import { useMouseDrag } from '../libs/hooks/use-mouse-drag';
import { useSendCommand } from '../libs/hooks/use-send-command';
import { useEffectAsync } from '../libs/hooks/useEffectAsync';

const Root = styled.div`
	width: 20px;
	height: 100px;
	position: fixed;
	bottom: 8px;
	left: 8px;
	cursor: pointer;
`;

const MeterBackground = styled.div`
	width: 100%;
	height: 100%;
	background-color: red;
	position: absolute;
	left: 0;
	top: 0;
	pointer-events: none;
`;

const MeterBar = styled.div`
	background-color: green;
	width: 100%;
	height: 0;
	position: absolute;
	left: 0;
	bottom: 0;
	pointer-events: none;
`;

const Selector = styled.div`
	width: 100%;
	height: 5px;
	background-color: black;
	pointer-events: none;
	position: absolute;
	bottom: 0;
	left: 0;
`;

const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

function createProcessor(stream: MediaStream) {
	const audioContext = new AudioContext();
	const track = audioContext.createMediaStreamSource(stream);
	const processor = audioContext.createScriptProcessor(1024, 1, 1);
	processor.connect(audioContext.destination);
	track.connect(processor);
	return processor;
}

function getVolume(event: AudioProcessingEvent) {
	const buf = event.inputBuffer.getChannelData(0);
	let sum = 0;
	for (let i = 0; i < buf.length; i++) {
		sum += buf[i] ** 2;
	}
	return Math.floor(Math.sqrt(sum / buf.length) * 100 * 2);
}

const AudioListenerService: FC<{}> = ({}) => {
	const { isListening, setIsListening } = useMusicListener();
	const [sendCommand] = useSendCommand();
	const { targetLamps } = useLamps();
	const [userMediaStream, setUserMediaStream] = React.useState<MediaStream | null>(null);

	const meterBarRef = React.useRef<HTMLDivElement | null>(null);
	const selectorRef = React.useRef<HTMLDivElement | null>(null);
	const rootRef = React.useRef<HTMLDivElement | null>(null);

	const thresholdRef = React.useRef<number>(20);
	const lastThresholdPass = React.useRef<number>(0);

	React.useEffect(() => {
		if (!isListening) return;

		const style = selectorRef.current!.style;
		style.bottom = thresholdRef.current + 'px';
	}, [isListening]);

	useMouseDrag(rootRef, {
		onMouseChange: event => {
			const { bottom } = rootRef.current!.getBoundingClientRect();
			const style = selectorRef.current!.style;

			const y = Math.min(100, Math.max(0, bottom - event.y));
			style.bottom = y + 'px';
			thresholdRef.current = y;
		},
	});

	async function aboveThreshold() {
		if (Date.now() - lastThresholdPass.current < 200) return;
		lastThresholdPass.current = Date.now();
		await sendCommand(targetLamps, `set_power`, [`on`, `sudden`, 30, 0]);
		await sleep(100);
		await sendCommand(targetLamps, `set_power`, [`off`, `sudden`, 30, 0]);
	}

	useEffectAsync(async () => {
		if (!isListening) {
			if (!userMediaStream) return;
			userMediaStream.getTracks().forEach(track => track.stop());
			return;
		}

		if (!navigator?.mediaDevices?.getUserMedia) {
			toast.error('Your device does not support microphones');
			setIsListening(false);
			return;
		}

		try {
			setUserMediaStream(await navigator.mediaDevices.getUserMedia({ audio: true }));
		} catch (e: any) {
			if (e.message === 'Permission denied') {
				toast.error('Permission to access your microphone was denied.');
			} else {
				toast.error('Error requestion user permission do microphone');
				console.error(e);
			}
			setIsListening(false);
		}
	}, [isListening]);

	React.useEffect(() => {
		if (!userMediaStream || !isListening) return;
		const processor = createProcessor(userMediaStream);

		function audioProcess(event: AudioProcessingEvent) {
			const volume = getVolume(event);
			const style = meterBarRef.current!.style;
			style.height = volume + 'px';
			if (volume > thresholdRef.current) {
				aboveThreshold();
			}
		}

		processor.addEventListener('audioprocess', audioProcess);

		return () => {
			processor.removeEventListener('audioprocess', audioProcess);
		};
	}, [userMediaStream, targetLamps, isListening]);

	if (!isListening) return null;
	return (
		<Root ref={rootRef}>
			<MeterBackground />
			<MeterBar ref={meterBarRef} />
			<Selector ref={selectorRef} />
		</Root>
	);
};

export default AudioListenerService;
