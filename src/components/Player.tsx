import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Vector3 } from 'three';
import { useGameStore, WeaponType, WEAPONS } from '../store';
import { Weapon } from './Weapon';
import { Projectiles } from './Projectiles';

const SPEED = 5;
const JUMP_FORCE = 4;

export function Player() {
  const { currentWeapon, ammo, decreaseAmmo } = useGameStore();
  const weaponRef = useRef();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 2, 0],
  }));

  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 0, 0]);
  const projectilesRef = useRef();

  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
    api.position.subscribe((p) => (position.current = p));
  }, [api]);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          keys.current.forward = true;
          break;
        case 'KeyS':
          keys.current.backward = true;
          break;
        case 'KeyA':
          keys.current.left = true;
          break;
        case 'KeyD':
          keys.current.right = true;
          break;
        case 'Space':
          keys.current.jump = true;
          break;
        case 'Digit1':
          useGameStore.getState().setCurrentWeapon('shotgun');
          break;
        case 'Digit2':
          useGameStore.getState().setCurrentWeapon('rifle');
          break;
        case 'Digit3':
          useGameStore.getState().setCurrentWeapon('plasma');
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          keys.current.forward = false;
          break;
        case 'KeyS':
          keys.current.backward = false;
          break;
        case 'KeyA':
          keys.current.left = false;
          break;
        case 'KeyD':
          keys.current.right = false;
          break;
        case 'Space':
          keys.current.jump = false;
          break;
      }
    };

    const handleMouseDown = () => {
      if (ammo[currentWeapon] > 0) {
        const weapon = WEAPONS[currentWeapon];
        decreaseAmmo(currentWeapon, 1);
        weaponRef.current?.triggerRecoil();
        projectilesRef.current?.shoot(
          new Vector3(...position.current),
          weapon
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [currentWeapon, ammo, decreaseAmmo]);

  useFrame((state) => {
    const { forward, backward, left, right, jump } = keys.current;

    const direction = new Vector3();
    const frontVector = new Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new Vector3(Number(left) - Number(right), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }

    state.camera.position.set(
      position.current[0],
      position.current[1] + 1,
      position.current[2]
    );
  });

  return (
    <>
      <mesh ref={ref} />
      <Weapon ref={weaponRef} type={currentWeapon} />
      <Projectiles ref={projectilesRef} />
    </>
  );
}