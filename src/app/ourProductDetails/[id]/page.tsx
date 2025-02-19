import Image from "next/image";
import ProductDetailsCart from "@/components/productDetails/ProductDetailsCart";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Truck, ShieldCheck, Star } from "lucide-react";
import bannerImage from "../../../../public/images/hero-image.jpg";

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
        <div
          className="relative w-full  p-5"
          style={{ aspectRatio: "16 / 10" }}
        >
          <Image
            src={bannerImage}
            alt="bannerImage"
            layout="fill"
            objectFit="cover"
            className="w-full h-full rounded-md"
          />
        </div>

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6">
          {/* Left Side - Product Image */}
          <div className="flex justify-center w-full lg:w-1/2 p-6">
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${
                  productImages[0].split("/")[1]
                }/${productImages[0].split("/")[2]}/${
                  productImages[0].split("/")[3]
                }`}
                alt={name}
                width={400}
                height={500}
                className="object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="flex flex-col justify-center w-full lg:w-1/2 p-6">
            <div className="max-w-lg space-y-4">
              {/* Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

              {/* Price */}
              <p className="text-2xl font-bold text-gray-900">
                <span className="text-xl mr-1">৳</span>
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

              {/* Add to Cart */}
              <div className="pt-4">
                <ProductDetailsCart product={product} />
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
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
