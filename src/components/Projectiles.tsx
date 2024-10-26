import { forwardRef, useRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useSphere } from '@react-three/cannon';
import { WeaponType, WEAPONS } from '../store';

interface Projectile {
  id: number;
  position: Vector3;
  velocity: Vector3;
  lifetime: number;
  maxLifetime: number;
  size: number;
  color: string;
  emissive: string;
}

export const Projectiles = forwardRef((props, ref) => {
  const projectiles = useRef<Projectile[]>([]);
  let nextId = useRef(0);

  useImperativeHandle(ref, () => ({
    shoot: (position: Vector3, weapon: typeof WEAPONS[WeaponType]) => {
      const spread = weapon.spread;
      
      for (let i = 0; i < weapon.projectileCount; i++) {
        const angle = (Math.random() - 0.5) * spread;
        const verticalAngle = (Math.random() - 0.5) * spread;
        
        const velocity = new Vector3(
          Math.sin(angle) * weapon.projectileSpeed,
          Math.sin(verticalAngle) * weapon.projectileSpeed,
          -Math.cos(angle) * weapon.projectileSpeed
        );

        projectiles.current.push({
          id: nextId.current++,
          position: position.clone(),
          velocity,
          lifetime: 0,
          maxLifetime: weapon.projectileLifetime,
          size: weapon.projectileSize,
          color: weapon.color,
          emissive: weapon.emissive
        });
      }
    }
  }));

  useFrame((state, delta) => {
    projectiles.current = projectiles.current.filter(projectile => {
      projectile.lifetime += delta * 1000;
      if (projectile.lifetime >= projectile.maxLifetime) {
        return false;
      }

      projectile.position.add(
        projectile.velocity.clone().multiplyScalar(delta)
      );
      return true;
    });
  });

  return (
    <group>
      {projectiles.current.map(projectile => (
        <mesh
          key={projectile.id}
          position={projectile.position}
          scale={[projectile.size, projectile.size, projectile.size]}
        >
          <sphereGeometry />
          <meshStandardMaterial
            color={projectile.color}
            emissive={projectile.emissive}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
});