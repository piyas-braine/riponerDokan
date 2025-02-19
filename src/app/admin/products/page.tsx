"use client";
import apiClient from "@/utils/apiClient";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  productImages: string[];
  createdAt: string;
  updatedAt: string;
}

const Page: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products"); // Replace with your API endpoint
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle delete action
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await apiClient.delete(`/products/${productToDelete}`);

      if (response.data) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productToDelete)
        );

        toast.success("Deleted Successfully");
        setOpenDeleteModal(false);
      }
    } catch (error) {
      toast((error as Error).message || "failed to delete");
      console.error("Failed to delete product", error);
    }
  };

  // Close dropdown if click happens outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Link href="products/add">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Add Product
          </button>
        </Link>
      </div>
      {products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg max-h-[80vh] overflow-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Images
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700 flex justify-center items-center">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${product.productImages[0].split("/")[1]}/${
                        product.productImages[0].split("/")[2]
                      }/${product.productImages[0].split("/")[3]}`}
                      width={40}
                      height={40}
                      alt="Product"
                      className="w-16 h-16 object-cover inline-block mr-2"
                    />
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-medium text-gray-800 truncate"
                    title={product.id}
                  >
                    {product.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="text-2xl font-bold">৳</span>
                    {product.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="relative">
                      <button
                        className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        onClick={() => {
                          setOpenDropdown(
                            openDropdown === product.id ? null : product.id
                          );
                        }}
                      >
                        Actions
                      </button>
                      {openDropdown === product.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-1/2 mt-1 bg-white shadow-lg rounded-lg w-40 border border-gray-200 z-10"
                        >
                          <Link href={`products/${product.id}`}>
                            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg transition duration-200">
                              View
                            </button>
                          </Link>
                          <Link href={`products/edit/${product.id}`}>
                            <button className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 transition duration-200">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setProductToDelete(product.id);
                              setOpenDeleteModal(true);
                            }}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-b-lg transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center m-4 text-2xl font-bold">
          No product found
        </div>
      )}

      {/* Delete Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-700">
              Are you sure you want to delete this product?
            </h3>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
