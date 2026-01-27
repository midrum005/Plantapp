import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const departmentLabels = {
  automotive: "แผนกวิชาช่างยนต์",
  welding: "แผนกวิชาช่างเชื่อมโลหะ",
  electrical_power: "แผนกวิชาช่างไฟฟ้ากำลัง",
  electronics: "แผนกวิชาอิเล็กทรอนิกส์",
  computer_technology: "แผนกวิชาเทคนิคคอมพิวเตอร์",
  construction: "แผนกวิชาช่างก่อสร้าง",
  accounting: "แผนกวิชาการบัญชี",
  marketing: "แผนกวิชาการตลาด",
  computer_business: "แผนกวิชาคอมพิวเตอร์ธุรกิจ",
  information_technology: "แผนกวิชาเทคโนโลยีสารสนเทศ",
  logistics: "แผนกวิชาการจัดการโลจิสติกส์",
  home_economics: "แผนกวิชาคหกรรม",
  fine_arts: "แผนกวิชาวิจิตรศิลป์",
  other: "อื่นๆ"
};

const departmentColors = {
  automotive: "bg-red-100 text-red-800",
  welding: "bg-orange-100 text-orange-800",
  electrical_power: "bg-yellow-100 text-yellow-800",
  electronics: "bg-blue-100 text-blue-800",
  computer_technology: "bg-cyan-100 text-cyan-800",
  construction: "bg-amber-100 text-amber-800",
  accounting: "bg-green-100 text-green-800",
  marketing: "bg-pink-100 text-pink-800",
  computer_business: "bg-indigo-100 text-indigo-800",
  information_technology: "bg-purple-100 text-purple-800",
  logistics: "bg-violet-100 text-violet-800",
  home_economics: "bg-rose-100 text-rose-800",
  fine_arts: "bg-fuchsia-100 text-fuchsia-800",
  other: "bg-gray-100 text-gray-800"
};

export default function PlantCard({ plant }) {
  const mainImage = plant.images?.[0] || "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80";

  return (
    <Link to={createPageUrl("PlantDetail") + `?id=${plant.id}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={plant.common_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Badge className={`absolute top-3 right-3 ${departmentColors[plant.department] || departmentColors.other}`}>
            {departmentLabels[plant.department] || "อื่นๆ"}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start gap-2 mb-2">
            <Leaf className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                {plant.common_name}
              </h3>
              {plant.scientific_name && (
                <p className="text-sm text-gray-500 italic">{plant.scientific_name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="truncate">{plant.location}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}