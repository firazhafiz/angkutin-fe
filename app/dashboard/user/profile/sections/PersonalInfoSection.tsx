"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  Save,
  Check,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface PersonalInfoProps {
  user: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    joinDate: string;
    tier: string;
  };
  onBack: () => void;
}

export default function PersonalInfoSection({
  user,
  onBack,
}: PersonalInfoProps) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: "Passionate about waste recycling and sustainable living.",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout role="user">
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all"
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
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={24} className="text-white" />
            </button>
            <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <Camera size={16} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-black text-dark">{user.name}</p>
            <p className="text-xs text-gray-400">
              {user.tier} Member · Since {user.joinDate}
            </p>
          </div>
          <button className="px-6 py-2.5 rounded-full border border-dashed border-primary text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
            Change Profile Photo
          </button>
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
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 bg-gray-50 text-dark text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>
          ))}

          {/* Bio */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
              Bio
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us something about yourself..."
              className="w-full px-4 py-4 rounded-xl border border-gray-100 bg-gray-50 text-dark text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={cn(
            "w-full py-5 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
            saved
              ? "bg-green-500 text-white"
              : "bg-dark text-white hover:bg-primary",
          )}
        >
          {saved ? (
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
