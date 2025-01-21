import { products } from "../../../../src/data/products";
import Image from "next/image";

export default async function ProductDetails({
  params,
}: {
  params: { id: number };
}) {
  const product = products.find((product) => product.id === Number(params.id));

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-600">Product Not Found</h1>
      </div>
    );
  }

  const { name, price, image, description } = product;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          {name}
        </h1>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={image}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Description */}
            <p className="text-xl text-gray-700 leading-relaxed">
              {description}
            </p>

            {/* Price */}
            <p className="text-3xl font-semibold text-gray-800">{price}</p>

            {/* Ratings */}
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-2xl">★ ★ ★ ★ ☆</span>
              <span className="text-gray-600 text-lg">(4.5)</span>
            </div>

            {/* Size Selector */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Select Size:
              </h2>
              <div className="flex space-x-3">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-200 transition"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Add to Cart Button */}
            <button className="w-full px-6 py-3 bg-primaryColor text-white text-lg font-medium rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-primaryColor">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
