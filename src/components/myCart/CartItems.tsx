import Image from "next/image";

interface CartItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productImages: any;
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItemsProps {
  item: CartItem;
  handleDecreaseQuantity: (id: number) => void;
  handleIncreaseQuantity: (id: number) => void;
  handleRemoveItem: (id: number) => void;
}

const CartItems = ({
  item,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleRemoveItem,
}: CartItemsProps) => {
  return (
    <tr key={item.id} className="border-b">
      <td className="p-2 md:p-3 flex items-center space-x-4">
        <div className="relative w-12 h-12 md:w-16 md:h-16">
          <Image
            src={`/${item.productImages[0].split("/")[1]}/${
              item.productImages[0].split("/")[2]
            }/${item.productImages[0].split("/")[3]}`}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <span className="text-sm md:text-base font-medium text-gray-800">
          {item.name}
        </span>
      </td>
      <td className="p-2 md:p-3 text-sm md:text-base text-gray-600 flex items-center space-x-2">
        <button
          onClick={() => handleDecreaseQuantity(item.id)}
          className="bg-gray-200 text-gray-800 rounded-full px-2 py-1"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => handleIncreaseQuantity(item.id)}
          className="bg-gray-200 text-gray-800 rounded-full px-2 py-1"
        >
          +
        </button>
      </td>
      <td className="p-2 md:p-3 text-sm md:text-base text-gray-600">
        <span className="text-xl font-bold">৳</span>
        {(item.price * item.quantity).toFixed(2)}
      </td>
      <td className="p-2 md:p-3">
        <button
          onClick={() => handleRemoveItem(item.id)}
          className="text-red-500 font-bold text-xs md:text-sm py-1 transition"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItems;
