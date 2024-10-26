import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export function Effects() {
  const { gl, camera } = useThree();

  return (
    <EffectComposer>
      <Bloom 
        intensity={0.5}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
      />
    </EffectComposer>
  );
}