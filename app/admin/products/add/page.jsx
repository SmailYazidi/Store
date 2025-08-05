// /app/admin/products/add/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nameAr: "",
    nameFr: "",
    descriptionAr: "",
    descriptionFr: "",
    price: "",
    currency: "USD",
    mainImage: "",
    images: [],
    quantity: 1,
    categoryId: "",
    isVisible: true,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFilenames = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Upload failed: ${await res.text()}`);
        }

        const data = await res.json();
        if (data.filename) {
          uploadedFilenames.push(data.filename);
        }
        setUploadProgress((prev) => prev + (100 / files.length));
      }

      setFormData((prev) => ({
        ...prev,
        mainImage: prev.mainImage || uploadedFilenames[0],
        images: [...prev.images, ...uploadedFilenames],
      }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
        mainImage: prev.mainImage === prev.images[index] ? newImages[0] || "" : prev.mainImage,
      };
    });
  };

  const setAsMainImage = (filename) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: filename,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = {
      name: {
        ar: formData.nameAr,
        fr: formData.nameFr,
      },
      description: {
        ar: formData.descriptionAr,
        fr: formData.descriptionFr,
      },
      price: parseFloat(formData.price),
      currency: formData.currency,
      mainImage: formData.mainImage,
      images: formData.images,
      quantity: parseInt(formData.quantity),
      isVisible: formData.isVisible,
      categoryId: formData.categoryId,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        router.push("/admin/products/add");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("Product creation failed:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">إضافة منتج جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Arabic and French names */}
        <div>
          <label className="block mb-1">الاسم (عربي)</label>
          <input
            name="nameAr"
            value={formData.nameAr}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Nom (Français)</label>
          <input
            name="nameFr"
            value={formData.nameFr}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Descriptions */}
        <div>
          <label className="block mb-1">الوصف (عربي)</label>
          <textarea
            name="descriptionAr"
            value={formData.descriptionAr}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Description (Français)</label>
          <textarea
            name="descriptionFr"
            value={formData.descriptionFr}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Price and Currency */}
        <div>
          <label className="block mb-1">السعر</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded p-2"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block mb-1">العملة</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="USD">USD</option>
            <option value="DZD">DZD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1">تحميل الصور</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                جاري رفع الصور... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          {/* Image Previews */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={`https://vercel-blob-url/${image}`}
                  alt={`Product Image ${index + 1}`}
                  width={120}
                  height={120}
                  className="rounded border object-cover h-32 w-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setAsMainImage(image)}
                    className={`p-1 rounded ${
                      formData.mainImage === image
                        ? "bg-green-500"
                        : "bg-blue-500"
                    } text-white`}
                  >
                    {formData.mainImage === image ? "Main" : "Set as Main"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 bg-red-500 rounded text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1">الكمية</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded p-2"
            min="1"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1">التصنيف</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">اختر تصنيفًا</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name.ar}
              </option>
            ))}
          </select>
        </div>

        {/* Visibility */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isVisible"
            checked={formData.isVisible}
            onChange={handleChange}
          />
          <label>عرض المنتج</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={uploading}
        >
          إضافة المنتج
        </button>
      </form>
    </div>
  );
}