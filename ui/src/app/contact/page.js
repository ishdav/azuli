"use client";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  Send,
  Users,
  Phone,
  Info,
} from "lucide-react";
import MenuItem from "@/components/MenuItem";

export default function ContactPage() {
  const router = useRouter();

  const contacts = [
    {
      icon: Send,
      label: "Telegram",
      href: "https://t.me/",
      external: true,
    },
    {
      icon: MessageCircle,
      label: "Telegram Official Channel",
      href: "https://t.me/",
      external: true,
    },
    {
      icon: Users,
      label: "Telegram Group",
      href: "https://t.me/",
      external: true,
    },
    {
      icon: Phone,
      label: "WhatsApp",
      href: "https://wa.me/",
      external: true,
    },
  ];

  const handleOpen = (href) => {
    if (href) window.open(href, "_blank");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mt-4 mb-2">
        <ArrowLeft
          size={20}
          className="cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold">Contact Us</h1>
      </div>

      {/* Header Banner */}
      <Card className="p-6 bg-gradient-to-br from-purple-700 to-purple-500 text-white border-none">
        <h2 className="text-2xl font-bold">How can we help?</h2>
        <div className="flex items-center gap-2 mt-2 text-purple-100 text-xs">
          <span className="w-2 h-2 rounded-full bg-purple-300"></span>
          Online · 09:00 – 18:00
        </div>
      </Card>

      {/* Contact List */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Contact Us</h3>
        <div className="space-y-2">
          {contacts.map((c) => (
            <Card key={c.label} className="p-0">
              <MenuItem
                icon={c.icon}
                label={c.label}
                onClick={() => handleOpen(c.href)}
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Notice */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-purple-600" />
          <h4 className="font-bold text-sm">Notice</h4>
        </div>
        <ul className="text-xs text-gray-600 space-y-2 list-decimal pl-4">
          <li>
            If you have any questions or need assistance, you can contact our
            online support center at any time.
          </li>
          <li>
            Due to the high volume of inquiries, some responses may take a few
            minutes. Thank you for your patience.
          </li>
        </ul>
      </Card>
    </div>
  );
}