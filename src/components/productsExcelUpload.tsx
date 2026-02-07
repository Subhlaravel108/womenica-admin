import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";
import { X, Download } from "lucide-react";

type ActionType = "fetch" | "create" | "price";

interface ProductsExcelUploadProps {
  onSuccess?: () => void;
}

const ProductsExcelUpload = ({ onSuccess }: ProductsExcelUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);

  const token =
    JSON.parse(localStorage.getItem("user") || "{}")?.token || "";

  /* =======================
     🔽 DOWNLOAD SKU EXCEL
  ======================= */
  const handleDownloadSku = async () => {
    try {
      setLoading(true);

      const res = await api.get("/upload/export-product-skus", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = new Blob([res.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "product_skus.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Product SKU Excel downloaded");

    } catch (err: any) {
      toast.error("Failed to download SKU Excel");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     ⬆️ UPLOAD EXCEL
  ======================= */
  const handleUpload = async () => {
    if (!file || !action) {
      toast.error("Please select action and Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const url =
        action === "create"
          ? "/upload/product-excel"
          : "/upload/update-price-excel";

      const res = await api.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Excel processed successfully");
        onSuccess?.();
        reset();
      } else {
        toast.error(res.data.message || "Action failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAction(null);
    setFile(null);
    const input = document.getElementById(
      "excel-file-input"
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="space-y-4">

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 flex-wrap">
        <Button
          variant={action === "fetch" ? "default" : "outline"}
          onClick={() => {
            setAction("fetch");
            handleDownloadSku();
          }}
        >
          <Download size={16} /> Fetch Product SKUs
        </Button>

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

      {/* FILE INPUT (only for create / price) */}
      {(action === "create" || action === "price") && (
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

          <X
            className="h-9 w-9 cursor-pointer"
            onClick={reset}
          />
        </div>
      )}

      {/* SAMPLE FILE */}
      {/* {(action === "create" || action === "price") && ( */}
        <a
          href="/products.xlsx"
          className="text-sm text-blue-500 hover:underline"
          download
        >
          Download Sample Excel
        </a>
      {/* )} */}
    </div>
  );
};

export default ProductsExcelUpload;


    