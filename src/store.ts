import { create } from 'zustand';

export type WeaponType = 'shotgun' | 'rifle' | 'plasma';

interface WeaponStats {
  name: string;
  damage: number;
  projectileSpeed: number;
  projectileCount: number;
  spread: number;
  projectileSize: number;
  projectileLifetime: number;
  color: string;
  emissive: string;
  model: string;
}

export const WEAPONS: Record<WeaponType, WeaponStats> = {
  shotgun: {
    name: 'Shotgun',
    damage: 15,
    projectileSpeed: 30,
    projectileCount: 8,
    spread: 0.3,
    projectileSize: 0.1,
    projectileLifetime: 500,
    color: '#ff4400',
    emissive: '#ff2200',
    model: 'shotgun'
  },
  rifle: {
    name: 'Rifle',
    damage: 25,
    projectileSpeed: 50,
    projectileCount: 1,
    spread: 0.05,
    projectileSize: 0.15,
    projectileLifetime: 1000,
    color: '#ffff00',
    emissive: '#ffaa00',
    model: 'rifle'
  },
  plasma: {
    name: 'Plasma Gun',
    damage: 40,
    projectileSpeed: 20,
    projectileCount: 1,
    spread: 0.1,
    projectileSize: 0.3,
    projectileLifetime: 2000,
    color: '#00ffff',
    emissive: '#0088ff',
    model: 'plasma'
  }
};

interface GameState {
  currentWeapon: WeaponType;
  ammo: Record<WeaponType, number>;
  setCurrentWeapon: (weapon: WeaponType) => void;
  decreaseAmmo: (weapon: WeaponType, amount: number) => void;
  addAmmo: (weapon: WeaponType, amount: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentWeapon: 'shotgun',
  ammo: {
    shotgun: 30,
    rifle: 60,
    plasma: 20
  },
  setCurrentWeapon: (weapon) => set({ currentWeapon: weapon }),
  decreaseAmmo: (weapon, amount) =>
    set((state) => ({
      ammo: {
        ...state.ammo,
        [weapon]: Math.max(0, state.ammo[weapon] - amount)
      }
    })),
  addAmmo: (weapon, amount) =>
    set((state) => ({
      ammo: {
        ...state.ammo,
        [weapon]: state.ammo[weapon] + amount
      }
    }))
}));