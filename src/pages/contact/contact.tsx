import React, { useEffect, useState } from "react";
import { fetchAllContacts } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Search } from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const ContactList = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  // ✅ Load contacts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const res = await fetchAllContacts({ page, search: searchQuery });
        console.log("📬 Contact Data:", res);

        setContacts(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (err) {
        console.error("❌ Error loading contacts:", err);
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, [page, searchQuery]);

  // ✅ Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // ✅ Filter contacts by name/email/phone
  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
      </div>

      <Card className="p-4 shadow-md">
        {/* 🔍 Search Input */}
        <div className="flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>

        {/* 📋 Table */}
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2">#</TableHead>
                <TableHead className="px-4 py-2">Name</TableHead>
                <TableHead className="px-4 py-2">Email</TableHead>
                <TableHead className="px-4 py-2">Phone</TableHead>
                <TableHead className="px-4 py-2">Interest</TableHead>
                <TableHead className="px-4 py-2">Message</TableHead>
                <TableHead className="px-4 py-2">Created</TableHead>
                <TableHead className="px-4 py-2 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    <Loader2 className="animate-spin inline w-6 h-6 text-gray-500 mr-2" />
                    Loading contacts...
                  </TableCell>
                </TableRow>
              ) : filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No contacts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((c, index) => (
                  <TableRow key={c._id}>
                    <TableCell>{index + 1 + (page - 1) * 10}</TableCell>
                    <TableCell>
                      {c.name} {c.lastname || ""}
                    </TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.travelInterest || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {c.message || "-"}
                    </TableCell>
                    <TableCell>
                      {c.createdAt
                        ? format(new Date(c.createdAt), "dd MMM yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContact(c)}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 📄 Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* 👁️ View Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setSelectedContact(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Contact Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedContact.name}{" "}
                {selectedContact.lastname}
              </p>
              <p>
                <strong>Email:</strong> {selectedContact.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedContact.phone}
              </p>
              <p>
                <strong>Interest:</strong> {selectedContact.travelInterest}
              </p>
              <p className="break-words whitespace-pre-line">
                <strong>Message:</strong> {selectedContact.message}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {selectedContact.createdAt
                  ? format(new Date(selectedContact.createdAt), "dd MMM yyyy")
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
