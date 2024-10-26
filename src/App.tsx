import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Sky, PointerLockControls, Stars } from '@react-three/drei';
import { Crosshair } from './components/Crosshair';
import { Player } from './components/Player';
import { Level } from './components/Level';
import { Enemies } from './components/Enemies';
import { UI } from './components/UI';
import { Effects } from './components/Effects';

function App() {
  return (
    <>
      <UI />
      <Crosshair />
      <Canvas shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <Physics 
            gravity={[0, -20, 0]}
            defaultContactMaterial={{
              friction: 0.1,
              restitution: 0.1,
              contactEquationStiffness: 1e8,
              contactEquationRelaxation: 3,
            }}
          >
            <Player />
            <Level />
            <Enemies />
          </Physics>
          <Effects />
        </Suspense>
        <PointerLockControls />
      </Canvas>
    </>
  );
}

export default App;