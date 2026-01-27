import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { Loader2, Upload, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";

const departments = [
  { value: "automotive", label: "แผนกวิชาช่างยนต์" },
  { value: "welding", label: "แผนกวิชาช่างเชื่อมโลหะ" },
  { value: "electrical_power", label: "แผนกวิชาช่างไฟฟ้ากำลัง" },
  { value: "electronics", label: "แผนกวิชาอิเล็กทรอนิกส์" },
  { value: "computer_technology", label: "แผนกวิชาเทคนิคคอมพิวเตอร์" },
  { value: "construction", label: "แผนกวิชาช่างก่อสร้าง" },
  { value: "accounting", label: "แผนกวิชาการบัญชี" },
  { value: "marketing", label: "แผนกวิชาการตลาด" },
  { value: "computer_business", label: "แผนกวิชาคอมพิวเตอร์ธุรกิจ" },
  { value: "information_technology", label: "แผนกวิชาเทคโนโลยีสารสนเทศ" },
  { value: "logistics", label: "แผนกวิชาการจัดการโลจิสติกส์" },
  { value: "home_economics", label: "แผนกวิชาคหกรรม" },
  { value: "fine_arts", label: "แผนกวิชาวิจิตรศิลป์" },
  { value: "other", label: "อื่นๆ" }
];

export default function PlantForm({ user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    common_name: '',
    scientific_name: '',
    family: '',
    description: '',
    location: '',
    department: '',
    benefits: ''
  });

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => 
        base44.integrations.Core.UploadFile({ file })
      );
      const results = await Promise.all(uploadPromises);
      const newImages = results.map(r => r.file_url);
      setImages([...images, ...newImages]);
    } catch (error) {
      toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.common_name || !formData.location || !formData.department) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น");
      return;
    }

    setLoading(true);
    try {
      await base44.entities.Plant.create({
        ...formData,
        images,
        recorded_by_name: user.full_name,
        recorded_by_position: user.position === 'student' ? 'นักศึกษา' : 'อาจารย์'
      });
      toast.success("บันทึกข้อมูลพืชสำเร็จ");
      onSuccess?.();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setLoading(false);
  };

  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardHeader className="border-b bg-gray-50/50 rounded-t-2xl">
        <CardTitle className="text-xl text-gray-800">เพิ่มข้อมูลพืช</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">รูปภาพพืช</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-400 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-emerald-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="sr-only"
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">เพิ่มรูป</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                ชื่อสามัญ <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="เช่น ต้นมะม่วง"
                value={formData.common_name}
                onChange={(e) => setFormData({...formData, common_name: e.target.value})}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">ชื่อวิทยาศาสตร์</Label>
              <Input
                placeholder="เช่น Mangifera indica"
                value={formData.scientific_name}
                onChange={(e) => setFormData({...formData, scientific_name: e.target.value})}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">วงศ์ (Family)</Label>
            <Input
              placeholder="เช่น Anacardiaceae"
              value={formData.family}
              onChange={(e) => setFormData({...formData, family: e.target.value})}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                สถานที่พบ <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="เช่น หน้าอาคาร 1"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                แผนกที่ดูแล/พบ <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({...formData, department: value})}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="เลือกแผนก" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">รายละเอียดและลักษณะ</Label>
            <Textarea
              placeholder="อธิบายลักษณะของพืช..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="min-h-[100px] rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">ประโยชน์</Label>
            <Textarea
              placeholder="ประโยชน์ของพืชชนิดนี้..."
              value={formData.benefits}
              onChange={(e) => setFormData({...formData, benefits: e.target.value})}
              className="min-h-[80px] rounded-xl resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              "บันทึกข้อมูลพืช"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}