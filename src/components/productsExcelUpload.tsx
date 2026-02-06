import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";

type ActionType = "create" | "price";

interface ProductsExcelUploadProps {
  onSuccess?: () => void;
}

const ProductsExcelUpload = ({ onSuccess }: ProductsExcelUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);

  const handleUpload = async () => {
    if (!file || !action) {
      toast.error("Please select action and Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token =
      JSON.parse(localStorage.getItem("user") || "{}")?.token || "";

    try {
      setLoading(true);

      const url =
        action === "create"
          ? "/upload/product-excel"
          : "/upload/update-price-excel";

      const res = await api.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Excel processed successfully");
        onSuccess?.();
        setFile(null);
        setAction(null);

        const input = document.getElementById(
          "excel-file-input"
        ) as HTMLInputElement;
        if (input) input.value = "";
      } else {
        toast.error(res.data.message || "Action failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <Button
          variant={action === "create" ? "default" : "outline"}
          onClick={() => setAction("create")}
        >
          ➕ Create Products
        </Button>

        <Button
          variant={action === "price" ? "default" : "outline"}
          onClick={() => setAction("price")}
        >
          💰 Update Prices
        </Button>
      </div>

      {/* FILE INPUT */}
      {action && (
        <div className="flex gap-3 items-center">
          <Input
            id="excel-file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="max-w-xs"
            disabled={loading}
          />

          <Button
            onClick={handleUpload}
            disabled={loading || !file}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading
              ? "Processing..."
              : action === "create"
              ? "Upload & Create"
              : "Upload & Update"}
          </Button>
        </div>
      )}

      {/* SAMPLE FILE */}
    
        <a
          href="/products.xlsx"
          className="text-sm text-blue-500 hover:underline"
          download
        >
          Download Sample Excel
        </a>

    </div>
  );
};

export default ProductsExcelUpload;
