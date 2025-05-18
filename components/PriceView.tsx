import { twMerge } from "tailwind-merge";

import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price: originalPrice, discount, className }: Props) => {
  if (originalPrice === undefined) {
    return null;
  }

  let finalPrice = originalPrice;

  if (discount !== undefined && discount > 0 && discount <= 100) {
    finalPrice = originalPrice * (1 - discount / 100);
  } else if (discount !== undefined && discount > 100) {
    finalPrice = 0;
  }

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        <PriceFormatter amount={finalPrice} className={className} />
        {discount !== undefined &&
          discount > 0 &&
          originalPrice !== finalPrice && (
            <PriceFormatter
              amount={originalPrice}
              className={twMerge(
                "line-through text-xs font-medium text-zinc-500",
                className
              )}
            />
          )}
      </div>
    </div>
  );
};

export default PriceView;
