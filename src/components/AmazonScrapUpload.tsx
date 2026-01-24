import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { amazonScrapToCsv } from "@/lib/api";
import { Loader2, Download, Link as LinkIcon } from "lucide-react";

interface AmazonScrapUploadProps {
  onSuccess?: () => void;
}
const BASE_URL = "https://womenica-api.onrender.com";
// const BASE_URL = " http://127.0.0.1:3001";

const AmazonScrapUpload = ({ onSuccess }: AmazonScrapUploadProps) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScrap = async () => {
  if (!url.trim()) {
    toast.error("Please enter an Amazon URL");
    return;
  }

  if (!url.includes("amazon.") && !url.includes("amzn.")) {
    toast.error("Please enter a valid Amazon URL");
    return;
  }

  try {
    setLoading(true);

    const response = await amazonScrapToCsv({ url: url.trim() });

    if (!response.success) {
      toast.error(response.message || "Scraping failed");
      return;
    }

    toast.success("CSV generated successfully");

    // 🔥 MAIN PART
    const downloadUrl = response.data?.download_url;

    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = `${BASE_URL}${downloadUrl}`;
      link.download = `amazon_products_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setUrl("");
    onSuccess?.();

  } catch (err: any) {
    console.log(err)
    toast.error(
      err?.response?.data?.message || "Failed to scrape Amazon"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Amazon Product Scraper
        </CardTitle>
        <CardDescription>
          Enter Amazon product URL to scrap and download as CSV
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label htmlFor="amazon-url" className="text-sm font-medium mb-2 block">
              Amazon Product URL
            </label>
            <Input
              id="amazon-url"
              type="url"
              placeholder="https://www.amazon.in/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleScrap}
            disabled={loading || !url.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Scrap to CSV
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmazonScrapUpload;
