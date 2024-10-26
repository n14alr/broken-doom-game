import { forwardRef, useRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { WeaponType } from '../store';
import * as THREE from 'three';

interface WeaponProps {
  type: WeaponType;
}

export const Weapon = forwardRef<any, WeaponProps>(({ type }, ref) => {
  const groupRef = useRef<THREE.Group>();
  const recoilTime = useRef(0);
  const originalPosition = new THREE.Vector3(0.3, -0.2, -0.5);

  useImperativeHandle(ref, () => ({
    triggerRecoil: () => {
      recoilTime.current = 100;
    }
  }));

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (recoilTime.current > 0) {
      recoilTime.current -= delta * 1000;
      const progress = Math.min(recoilTime.current / 100, 1);
      const recoilOffset = new THREE.Vector3(0, 0, 0.2 * progress);
      groupRef.current.position.copy(originalPosition).add(recoilOffset);
    } else {
      groupRef.current.position.copy(originalPosition);
    }
  });

  return (
    <group ref={groupRef} position={originalPosition}>
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.4]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
});