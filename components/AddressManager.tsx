"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaPlus, FaSpinner } from "react-icons/fa";

interface Address {
  id: string;
  address: string;
}

export default function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.street || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      alert("Please fill all required fields, including phone number.");
      return;
    }

    const fullAddress = `${formData.name ? formData.name + ', ' : ''}${formData.street}, ${formData.city}, ${formData.state} - ${formData.zip}. Phone: ${formData.phone}`;

    setLoading(true);
    try {
      const res = await fetch("/api/profile/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: fullAddress }),
      });

      if (!res.ok) {
        throw new Error("Failed to add address");
      }

      const added = await res.json();
      setAddresses((prev) => [added, ...prev]);
      setFormData({ name: "", street: "", city: "", state: "", zip: "", phone: "" });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (addresses.length <= 1) {
      alert("You must keep at least one saved address.");
      return;
    }

    if (!confirm("Are you sure you want to delete this address?")) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/profile/address", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete address");
      }

      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-brand-secondary border-b border-brand/10 pb-3">Manage Shipping Addresses</h3>

      {/* Add Address Form */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-text-dark/10 shadow-sm space-y-4">
        <h4 className="font-semibold text-text-dark mb-2">Add New Address</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name (Optional)"
            className="px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
          />
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number *"
            className="px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
          />
        </div>
        
        <input
          type="text"
          name="street"
          required
          value={formData.street}
          onChange={handleChange}
          placeholder="Street Address *"
          className="w-full px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="City *"
            className="px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
          />
          <input
            type="text"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
            placeholder="State *"
            className="px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
          />
          <input
            type="text"
            name="zip"
            required
            value={formData.zip}
            onChange={handleChange}
            placeholder="ZIP / Postal Code *"
            className="px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-topbar transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
            <span>Save Address</span>
          </button>
        </div>
      </form>

      {/* List of Addresses */}
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-sm text-text-dark/50 italic">No addresses saved.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-center justify-between p-4 bg-brand-hero/40 rounded-xl border border-brand/5 group hover:border-brand/10 transition-all"
            >
              <p className="text-sm font-medium text-text-dark pr-4 whitespace-pre-wrap">{addr.address}</p>
              <button
                onClick={() => handleDelete(addr.id)}
                disabled={deletingId === addr.id}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-lg transition-colors shrink-0 disabled:opacity-50"
                title="Delete Address"
              >
                {deletingId === addr.id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash size={14} />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
