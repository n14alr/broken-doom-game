import { useMemo } from 'react';
import { useBox } from '@react-three/cannon';
import { MeshStandardMaterial } from 'three';

const WALL_HEIGHT = 5;

export function Level() {
  const walls = useMemo(
    () => [
      // Floor
      { position: [0, 0, 0], scale: [50, 1, 50], isFloor: true },
      // Outer walls
      { position: [-25, WALL_HEIGHT / 2, 0], scale: [1, WALL_HEIGHT, 50] },
      { position: [25, WALL_HEIGHT / 2, 0], scale: [1, WALL_HEIGHT, 50] },
      { position: [0, WALL_HEIGHT / 2, -25], scale: [50, WALL_HEIGHT, 1] },
      { position: [0, WALL_HEIGHT / 2, 25], scale: [50, WALL_HEIGHT, 1] },
      // Inner maze walls
      { position: [-10, WALL_HEIGHT / 2, -10], scale: [20, WALL_HEIGHT, 1] },
      { position: [10, WALL_HEIGHT / 2, 10], scale: [1, WALL_HEIGHT, 20] },
      // Additional maze elements
      { position: [-15, WALL_HEIGHT / 2, 5], scale: [10, WALL_HEIGHT, 1] },
      { position: [5, WALL_HEIGHT / 2, -15], scale: [1, WALL_HEIGHT, 15] },
    ],
    []
  );

  const floorMaterial = useMemo(() => {
    const material = new MeshStandardMaterial({ 
      color: '#2c2c2c',
      roughness: 0.8,
      metalness: 0.2
    });
    return material;
  }, []);

  const wallMaterial = useMemo(() => {
    const material = new MeshStandardMaterial({ 
      color: '#4a4a4a',
      roughness: 0.6,
      metalness: 0.1
    });
    return material;
  }, []);

  return (
    <group>
      {walls.map((wall, index) => (
        <Wall 
          key={index} 
          {...wall} 
          material={wall.isFloor ? floorMaterial : wallMaterial} 
        />
      ))}
    </group>
  );
}

function Wall({ position, scale, material, isFloor }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: scale,
    material: {
      friction: isFloor ? 0.1 : 0, // Add friction to floor
      restitution: 0.1, // Add some bounce
    },
  }));

  return (
    <mesh ref={ref} material={material} receiveShadow castShadow>
      <boxGeometry args={scale} />
    </mesh>
  );
}