import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, MapPin, Leaf, User, Calendar, 
  ChevronLeft, ChevronRight, Loader2, BookOpen, Pencil
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

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

export default function PlantDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const plantId = urlParams.get('id');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const { data: plant, isLoading, error } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: async () => {
      const plants = await base44.entities.Plant.filter({ id: plantId });
      return plants[0];
    },
    enabled: !!plantId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
        <Leaf className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">ไม่พบข้อมูลพืช</h2>
        <Link to={createPageUrl("Home")}>
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าหลัก
          </Button>
        </Link>
      </div>
    );
  }

  const images = plant.images?.length > 0 
    ? plant.images 
    : ["https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pt-11">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link to={createPageUrl("Home")}>
              <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-semibold text-gray-900 truncate text-base">{plant.common_name}</h1>
          </div>
          {isAuthenticated && (
            <Link to={createPageUrl("EditPlant") + `?id=${plant.id}`}>
              <Button variant="outline" size="sm" className="rounded-xl h-9">
                <Pencil className="w-4 h-4 mr-1" />
                แก้ไข
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="pb-4">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden bg-gray-100 aspect-square"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={plant.common_name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Plant Info */}
        <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {plant.common_name}
                  </h1>
                  {plant.scientific_name && (
                    <p className="text-lg text-gray-500 italic">{plant.scientific_name}</p>
                  )}
                </div>
                <Badge className={`${departmentColors[plant.department]} px-4 py-2 text-sm`}>
                  {departmentLabels[plant.department] || "อื่นๆ"}
                </Badge>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">สถานที่พบ</p>
                    <p className="font-medium text-gray-900">{plant.location}</p>
                  </div>
                </div>
                {plant.family && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">วงศ์</p>
                      <p className="font-medium text-gray-900">{plant.family}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {plant.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    รายละเอียดและลักษณะ
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {plant.description}
                  </p>
                </div>
              )}

              {/* Benefits */}
              {plant.benefits && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">ประโยชน์</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {plant.benefits}
                  </p>
                </div>
              )}

              {/* Recorder Info */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>
                      บันทึกโดย: {plant.recorded_by_name || 'ไม่ระบุ'} 
                      {plant.recorded_by_position && ` (${plant.recorded_by_position})`}
                    </span>
                  </div>
                  {plant.created_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(plant.created_date), 'd MMM yyyy', { locale: th })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </div>
  );
}