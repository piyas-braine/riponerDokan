import Image from "next/image";
import ProductDetailsCart from "@/components/productDetails/ProductDetailsCart";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Truck, ShieldCheck, Star } from "lucide-react";
import Banner from "@/components/banner/Banner";

async function fetchProduct(id: string) {
  const fetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`;
  const res = await fetch(fetchUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const product = await fetchProduct(id);

    if (!product) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-white">
          <h1 className="text-3xl font-bold text-gray-600">
            Product Not Found
          </h1>
        </div>
      );
    }

    const { name, price, productImages, description, stock } = product;

    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="p-5">
          <Navbar />
        </div>
        <Banner></Banner>
        <main className="flex-1">
          {/* Split Layout Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
            {/* Left Side - Product Image */}
            <div className=" flex items-center justify-center p-12">
              <div className="relative w-full max-w-lg h-[500px] rounded-lg overflow-hidden ">
                <Image
                  src={`/${productImages[0].split("/")[1]}/${
                    productImages[0].split("/")[2]
                  }/${productImages[0].split("/")[3]}`}
                  alt={name}
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex items-center justify-center p-12">
              <div className="max-w-md space-y-6">
                {/* Category and Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Product Name */}
                <h1 className="text-4xl font-bold text-gray-900">{name}</h1>

                {/* Price */}
                <p className="text-3xl font-bold text-gray-900">
                  <span className="text-2xl mr-1">৳</span>
                  {price}
                </p>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">{description}</p>

                {/* Stock Status */}
                {stock > 0 ? (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    In Stock
                  </p>
                ) : (
                  <p className="text-sm text-red-600">Out of Stock</p>
                )}

                {/* Add to Cart Section */}
                <div className="pt-6">
                  <ProductDetailsCart product={product} />
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-gray-700" />
                    <span>Fastest Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-gray-700" />
                    <span>Anywhere in the country</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold text-red-600">
          Error loading product
        </h1>
      </div>
    );
  }
}
