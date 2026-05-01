interface NeuCoinsProps {
  price: number;
}

export default function NeuCoins({ price }: NeuCoinsProps) {
  const coins = Math.floor(price * 0.02);

  return (
    <div className="flex items-center gap-1.5 text-[12px] font-medium font-body text-cliq-cash">
      <span className="text-[14px]" role="img" aria-label="coin">
        🪙
      </span>
      <span>
        Earn <strong>{coins}</strong> NeuCoins on this order
      </span>
    </div>
  );
}
