"use client";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const BASE_URL = "https://india-thailand-api-8.onrender.com";
// const BASE_URL = " http://127.0.0.1:3001";

const DownloadDataPage = () => {
  const [loadingIndex, setLoadingIndex] = useState(null);

  const downloadFile = async (url, filename, index) => {
    try {
      setLoadingIndex(index);

      const token =
        JSON.parse(localStorage.getItem("user") || "{}")?.token || "";

      if (!token) {
        toast.error("Token missing! Please login again.");
        return;
      }

      const response = await fetch(BASE_URL + url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error(`Download failed: ${response.statusText}`);
        return;
      }

      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      toast.success(`${filename} downloaded successfully!`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed.");
    } finally {
      setLoadingIndex(null);
    }
  };

  const items = [
    {
      title: "Home Page Categories",
      description: "Download home page categories JSON.",
      url: "/api/product-categories?download=true&type=homepage&limit=8",
      file: "categories_homepage.json",
    },
    {
      title: "Home Page featured products",
      description: "Download home page featured product JSON.",
      url: "/api/products?download=true&type=homepage&limit=8",
      file: "featuredProducts_homepage.json",
    },
    // {
    //   title: "Home Page Blog",
    //   description: "Download home page blog JSON.",
    //   url: "/api/blog?download=true&type=homepage&limit=3",
    //   file: "blog_homepage.json",
    // },
    {
      title: "All Products",
      description: "Download all products JSON.",
      url: "/api/products?download=true",
      file: "all_products.json",
    },
    {
      title: "All Products categories",
      description: "Download All products categories JSON.",
      url: "/api/product-categories?download=true",
      file: "all_categories.json",
    },
     {
      title: "All Trending Products",
      description: "Download all trending products JSON.",
      url: "/api/product/inTrending?download=true&type=all",
      file: "all_trending_products.json",
    },
    //  {
    //   title: "All Tour",
    //   description: "Download all tour JSON.",
    //   url: "/api/tours?download=true",
    //   file: "all_tours.json",
    // },
  //  {
  //     title: "Feedbacks",
  //     description: "Download approved JSON.",
  //     url: "/api/feedback-list?download=true",
  //     file: "feedbacks.json",
  //   },

  ];

  return (
    <div className="h-auto bg-gray-100 flex  justify-center p-6">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Download Website Data
        </h1>

        {/* TABLE START */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex justify-center mx-auto"
                      onClick={() => downloadFile(item.url, item.file, index)}
                      disabled={loadingIndex === index}
                    >
                      {loadingIndex === index ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        "Download JSON"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* TABLE END */}
      </div>
    </div>
  );
};

export default DownloadDataPage;