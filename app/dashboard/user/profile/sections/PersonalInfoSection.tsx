"use client";

import React, { useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  Save,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface PersonalInfoProps {
  user: {
    name: string;
    email: string;
    phone: string;
    photoUrl: string;
    joinDate: string;
  };
  onBack: () => void;
  role?: "user" | "courier"; // Menambahkan role agar layout fleksibel
}

export default function PersonalInfoSection({
  user,
  onBack,
  role = "user",
}: PersonalInfoProps) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await userService.updateProfile({
        name: form.name,
        phone: form.phone,
      });
      
      setSaved(true);
      toast.success("Profile updated successfully!");
      
      // Refresh data di react-query
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      
      setTimeout(() => setSaved(false), 2500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file (opsional, misal 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large. Max 2MB allowed.");
      return;
    }

    setIsUploading(true);
    try {
      await userService.uploadProfilePic(file);
      toast.success("Profile picture updated!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-dark">
              Personal Information
            </h2>
            <p className="text-[10px] font-black text-dark/40 uppercase tracking-widest">
              Edit your profile details
            </p>
          </div>
        </div>

        {/* Avatar Upload Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20 bg-gray-50">
              {isUploading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Hidden Input File */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />

            <button 
              onClick={triggerFileUpload}
              disabled={isUploading}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            >
              <Camera size={24} className="text-white" />
            </button>
            <div 
              onClick={triggerFileUpload}
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform"
            >
              {isUploading ? (
                <Loader2 size={16} className="text-white animate-spin" />
              ) : (
                <Camera size={16} className="text-white" />
              )}
            </div>
          </div>
          <div className="text-center">
            <p className="font-black text-dark">{user.name}</p>
            <p className="text-xs text-gray-400">
              Member Since {user.joinDate}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Account Details
          </h3>

          {[
            {
              label: "Full Name",
              key: "name",
              icon: User,
              type: "text",
              placeholder: "Enter your full name",
            },
            {
              label: "Email Address",
              key: "email",
              icon: Mail,
              type: "email",
              placeholder: "Enter your email",
              disabled: true, // Email biasanya tidak bisa diubah langsung
            },
            {
              label: "Phone Number",
              key: "phone",
              icon: Phone,
              type: "tel",
              placeholder: "+62 xxx xxxx xxxx",
            },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <field.icon size={18} />
                </div>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  disabled={field.disabled || isSaving}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className={cn(
                    "w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 bg-gray-50 text-dark text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all",
                    field.disabled && "opacity-60 cursor-not-allowed"
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving || isUploading}
          className={cn(
            "w-full py-5 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
            saved
              ? "bg-green-500 text-white"
              : "bg-dark text-white hover:bg-primary",
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving...
            </>
          ) : saved ? (
            <>
              <Check size={18} /> Changes Saved!
            </>
          ) : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </button>
      </div>
    </DashboardLayout>
  );
}
