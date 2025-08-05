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
  setUploading(true);

  const uploadedFilenames = await Promise.all(
    files.map(async (file) => {
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const formData = new FormData();
      formData.append("file", file, filename);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Upload failed", await res.text());
        return null;
      }

      const data = await res.json();
      return data?.filename || null;
    })
  );

  const validFilenames = uploadedFilenames.filter(Boolean);

  setFormData((prev) => ({
    ...prev,
    mainImage: validFilenames[0] || prev.mainImage,
    images: [...prev.images, ...validFilenames],
  }));

  setUploading(false);
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

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      console.error("Product creation failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">إضافة منتج جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Arabic and French names */}
        <div>
          <label className="block mb-1">الاسم (عربي)</label>
          <input name="nameAr" value={formData.nameAr} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block mb-1">Nom (Français)</label>
          <input name="nameFr" value={formData.nameFr} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>

        {/* Descriptions */}
        <div>
          <label className="block mb-1">الوصف (عربي)</label>
          <textarea name="descriptionAr" value={formData.descriptionAr} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">Description (Français)</label>
          <textarea name="descriptionFr" value={formData.descriptionFr} onChange={handleChange} className="w-full border rounded p-2" />
        </div>

        {/* Price and Currency */}
        <div>
          <label className="block mb-1">السعر</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border rounded p-2" step="0.01" required />
        </div>
        <div>
          <label className="block mb-1">العملة</label>
          <select name="currency" value={formData.currency} onChange={handleChange} className="w-full border rounded p-2">
            <option value="USD">USD</option>
            <option value="DZD">DZD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1">تحميل الصور</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          {uploading && <p className="text-sm text-gray-500">جاري رفع الصور...</p>}

          {/* Preview Main Image */}
          {formData.mainImage && (
            <Image
              src={`https://<your-vercel-blob-host>/${formData.mainImage}`}
              alt="Main Image"
              width={120}
              height={120}
              className="mt-2 rounded border"
            />
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1">الكمية</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1">التصنيف</label>
          <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border rounded p-2" required>
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
          <input type="checkbox" name="isVisible" checked={formData.isVisible} onChange={handleChange} />
          <label>عرض المنتج</label>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          إضافة المنتج
        </button>
      </form>
    </div>
  );
}
