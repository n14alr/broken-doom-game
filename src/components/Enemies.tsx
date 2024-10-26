import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { Vector3, MeshStandardMaterial, Color } from 'three';
import { useStore } from '../store';

const ENEMY_SPEED = 3;
const ENEMY_DAMAGE = 15;
const DAMAGE_COOLDOWN = 1000;

interface Monster {
  id: number;
  position: [number, number, number];
  health: number;
  type: 'demon' | 'beast' | 'specter';
  lastDamageTime?: number;
}

const MONSTER_TYPES = {
  demon: {
    color: '#ff2200',
    emissive: '#ff0000',
    scale: [1.2, 2.2, 1.2],
    health: 150,
    speed: 3.5,
  },
  beast: {
    color: '#880088',
    emissive: '#ff00ff',
    scale: [1.5, 1.8, 1.5],
    health: 120,
    speed: 4,
  },
  specter: {
    color: '#00ffff',
    emissive: '#0088ff',
    scale: [0.8, 2.5, 0.8],
    health: 80,
    speed: 5,
  },
};

export function Enemies() {
  const enemies = useRef<Monster[]>([
    { id: 1, position: [10, 1, -10], health: 150, type: 'demon' },
    { id: 2, position: [-10, 1, 10], health: 120, type: 'beast' },
    { id: 3, position: [15, 1, 15], health: 80, type: 'specter' },
  ]);

  return (
    <group>
      {enemies.current
        .filter((enemy) => enemy.health > 0)
        .map((enemy) => (
          <Monster key={enemy.id} {...enemy} />
        ))}
    </group>
  );
}

function Monster({ position, id, health: initialHealth, type }: Monster) {
  const [ref, api] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    position,
    args: MONSTER_TYPES[type].scale,
  }));

  const playerPos = useStore((state) => state.position);
  const damagePlayer = useStore((state) => state.damage);
  const addScore = useStore((state) => state.addScore);
  const addKill = useStore((state) => state.addKill);
  
  const healthRef = useRef(initialHealth);
  const lastDamageTimeRef = useRef(0);
  const floatOffset = useRef(0);
  const materialRef = useRef<MeshStandardMaterial>();

  const monsterConfig = MONSTER_TYPES[type];

  const damage = (amount: number) => {
    healthRef.current -= amount;
    if (healthRef.current <= 0) {
      addScore(100);
      addKill();
      api.position.set(0, -100, 0);
    }
  };

  useFrame((state, delta) => {
    if (healthRef.current <= 0) return;
    if (!playerPos) return;

    // Floating animation
    floatOffset.current += delta * 2;
    const floatHeight = Math.sin(floatOffset.current) * 0.2;
    
    const direction = new Vector3(
      playerPos[0] - position[0],
      0,
      playerPos[2] - position[2]
    ).normalize();

    api.velocity.set(
      direction.x * monsterConfig.speed,
      floatHeight * 2,
      direction.z * monsterConfig.speed
    );

    // Pulse emissive intensity based on health
    if (materialRef.current) {
      const pulseIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      const healthFactor = healthRef.current / monsterConfig.health;
      materialRef.current.emissiveIntensity = pulseIntensity * healthFactor;
    }

    // Check distance to player for damage
    const dist = new Vector3(...playerPos).distanceTo(new Vector3(...position));
    const now = Date.now();
    if (dist < 2 && now - lastDamageTimeRef.current > DAMAGE_COOLDOWN) {
      damagePlayer(ENEMY_DAMAGE);
      lastDamageTimeRef.current = now;
    }
  });

  return (
    <group ref={ref}>
      {/* Monster body */}
      <mesh userData={{ isEnemy: true, damage }} castShadow>
        <boxGeometry args={monsterConfig.scale} />
        <meshStandardMaterial
          ref={materialRef}
          color={monsterConfig.color}
          emissive={monsterConfig.emissive}
          emissiveIntensity={1}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Glowing eyes */}
      <mesh position={[0.2, monsterConfig.scale[1] / 3, monsterConfig.scale[2] / 2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.2, monsterConfig.scale[1] / 3, monsterConfig.scale[2] / 2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}</content>