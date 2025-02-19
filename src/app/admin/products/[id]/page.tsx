"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import apiClient from "@/utils/apiClient";
import { useParams } from "next/navigation";
import Link from "next/link";

const ProductPage = () => {
  const [product, setProduct] = useState<null | Record<string, string>>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const params = useParams<{ id: string }>();

  const { id } = params;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {product && (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${
                product.productImages[0].split("/")[1]
              }/${product.productImages[0].split("/")[2]}/${
                product.productImages[0].split("/")[3]
              }`}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>

          {/* Product Description */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-lg text-gray-600 mt-4">{product.description}</p>

            <div className="mt-6">
              <p className="text-xl font-bold text-gray-800">
                Price: ${product.price}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Stock: {product.stock}
              </p>
            </div>

            {/* Edit Button */}
            <Link href={`edit/${product.id}`}>
              <button className="mt-6 px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300">
                Edit Product
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
