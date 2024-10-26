import { useGameStore, WEAPONS } from '../store';

export function UI() {
  const { currentWeapon, ammo } = useGameStore();
  const weapon = WEAPONS[currentWeapon];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-8 pointer-events-none">
      <div className="container mx-auto">
        <div className="bg-gray-900/90 text-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            {weapon.name}
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(ammo).map(([type, count]) => (
              <div
                key={type}
                className={`${
                  type === currentWeapon
                    ? 'bg-yellow-500/20 border-yellow-400'
                    : 'bg-gray-800/50 border-gray-700'
                } border rounded-lg p-3 text-center`}
              >
                <div className="text-sm opacity-75 mb-1">
                  {WEAPONS[type as keyof typeof WEAPONS].name}
                </div>
                <div className="text-xl font-bold">
                  {count}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Press 1-3 to switch weapons
          </div>
        </div>
      </div>
    </div>
  );
}