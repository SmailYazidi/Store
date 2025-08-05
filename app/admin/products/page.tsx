// /app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Eye } from "lucide-react";
import Loading from '@/components/Loading';
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
type Product = {
  _id: string;
  name: {
    ar: string;
    fr: string;
  };
  description: {
    ar: string;
    fr: string;
  };
  price: number;
  currency: string;
  mainImage: string;
  images: string[];
  quantity: number;
  isVisible: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  purchases: number;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function ProductsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products?page=${page}&limit=10`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error || "Failed to fetch products");
      }
    } catch (err) {
      setError("An error occurred while fetching products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProducts(pagination.page); // Refresh current page
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
<Loading/>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return ( <div className="relative min-h-screen flex flex-col">

      {isSidebarOpen && (
        <div className="fixed inset-0 z-90">
          {isSidebarOpen && <AdminSidebar onClose={() => setIsSidebarOpen(false)} />}

   <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}


      <div className="flex-1 flex flex-col">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(prev => !prev)} />



          <main className="p-4 pt-25 bg-white text-black min-h-screen">
<div className="mb-10 max-w-7xl mx-auto">
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          href="/admin/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Product
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative h-10 w-10">
                    <Image
                      src={`https://your-blob-storage-url/${product.mainImage}`}
                      alt={product.name.fr}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name.fr}
                  </div>
                  <div className="text-sm text-gray-500">{product.name.ar}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.price} {product.currency}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.quantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.quantity} in stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.isVisible
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.isVisible ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(product.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <Link
                      href={`/client/product/${product._id}`}
                      className="text-green-600 hover:text-green-900"
                      title="View"
                      target="_blank"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => fetchProducts(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchProducts(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{products.length}</span> of{" "}
                <span className="font-medium">{pagination.total}</span> products
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => fetchProducts(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => fetchProducts(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === page
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => fetchProducts(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div></div>
    </main>
      </div>
    </div>
  );
}