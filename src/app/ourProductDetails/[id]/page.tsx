import Image from "next/image";
import ProductDetailsCart from "@/components/productDetails/ProductDetailsCart";

async function fetchProduct(id: string) {
  const fetchUrl = `http://localhost:3000/api/products/${id}`;
  const res = await fetch(fetchUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

export default async function ProductDetails({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await fetchProduct(params.id);

    if (!product) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <h1 className="text-3xl font-bold text-gray-600">
            Product Not Found
          </h1>
        </div>
      );
    }

    const { name, price, image, description } = product;

    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            {name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={image}
                alt={name}
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {description}
              </p>

              <p className="text-3xl font-semibold text-gray-800">${price}</p>

              {/* Add to Cart Button */}
              <ProductDetailsCart product={product} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-red-600">
          Error loading product
        </h1>
      </div>
    );
  }
}
