import { useEffect, useState } from 'react';
import { DeviceMotion } from 'expo-sensors';
export function usePhoneHandling() {
	const [available, setAvailable] = useState<boolean | null>(null);
	const [accelerationMagnitude, setAccelerationMagnitude] = useState(0);
	const [rotationMagnitude, setRotationMagnitude] = useState(0);
	const [rotationRateMagnitude, setRotationRateMagnitude] = useState(0);
	useEffect(() => {
		let subscription: { remove: () => void } | undefined;
		void (async () => {
			const isAvailable = await DeviceMotion.isAvailableAsync();
			setAvailable(isAvailable);
			if (!isAvailable) return;
			await DeviceMotion.requestPermissionsAsync();
			DeviceMotion.setUpdateInterval(100);
			subscription = DeviceMotion.addListener((data) => {
				const acceleration = data.acceleration ?? {
					x: 0,
					y: 0,
					z: 0,
				};
				const rotation = data.rotation ?? {
					alpha: 0,
					beta: 0,
					gamma: 0,
				};
				const rotationRate = data.rotationRate ?? {
					alpha: 0,
					beta: 0,
					gamma: 0,
				};
				const accelerationValue = Math.hypot(
					acceleration.x,
					acceleration.y,
					acceleration.z,
				);
				const rotationValue = Math.hypot(
					rotation.alpha ?? 0,
					rotation.beta ?? 0,
					rotation.gamma ?? 0,
				);
				const rotationRateValue = Math.hypot(
					rotationRate.alpha ?? 0,
					rotationRate.beta ?? 0,
					rotationRate.gamma ?? 0,
				);
				setAccelerationMagnitude(accelerationValue);
				setRotationMagnitude(rotationValue);
				setRotationRateMagnitude(rotationRateValue);
			});
		})();
		return () => subscription?.remove();
	}, []);

	return {
		available,
		accelerationMagnitude,
		rotationMagnitude,
		rotationRateMagnitude,
	};
}
