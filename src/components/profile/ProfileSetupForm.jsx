import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { Loader2, GraduationCap, BookOpen, Leaf } from "lucide-react";
import { toast } from "sonner";

export default function ProfileSetupForm({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_card_number: '',
    student_teacher_id: '',
    position: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.id_card_number.length !== 13) {
      toast.error("กรุณากรอกเลขบัตรประชาชน 13 หลัก");
      return;
    }
    
    if (!formData.student_teacher_id) {
      toast.error("กรุณากรอกรหัสนักศึกษา/อาจารย์ หรือเบอร์โทร");
      return;
    }
    
    if (!formData.position) {
      toast.error("กรุณาเลือกตำแหน่ง");
      return;
    }

    setLoading(true);
    try {
      await base44.auth.updateMe(formData);
      toast.success("บันทึกข้อมูลสำเร็จ");
      onComplete?.();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Leaf className="w-8 h-8" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">ลงทะเบียนสมาชิก</CardTitle>
        <CardDescription className="text-emerald-100 text-center mt-2">
          วิทยาลัยเทคนิคสระแก้ว - ฐานข้อมูลพันธุ์พืช
        </CardDescription>
      </div>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="id_card" className="text-gray-700 font-medium">
              เลขบัตรประชาชน <span className="text-red-500">*</span>
            </Label>
            <Input
              id="id_card"
              placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
              value={formData.id_card_number}
              onChange={(e) => setFormData({...formData, id_card_number: e.target.value.replace(/\D/g, '').slice(0, 13)})}
              className="h-12 rounded-xl"
              maxLength={13}
            />
            <p className="text-xs text-gray-500">{formData.id_card_number.length}/13 หลัก</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_id" className="text-gray-700 font-medium">
              รหัสนักศึกษา/อาจารย์ หรือเบอร์โทร <span className="text-red-500">*</span>
            </Label>
            <Input
              id="student_id"
              placeholder="กรอกรหัสหรือเบอร์โทรศัพท์"
              value={formData.student_teacher_id}
              onChange={(e) => setFormData({...formData, student_teacher_id: e.target.value})}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">
              ตำแหน่ง <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.position}
              onValueChange={(value) => setFormData({...formData, position: value})}
              className="grid grid-cols-2 gap-4"
            >
              <label
                htmlFor="student"
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.position === 'student'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-200'
                }`}
              >
                <RadioGroupItem value="student" id="student" className="sr-only" />
                <GraduationCap className={`w-6 h-6 ${formData.position === 'student' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span className={formData.position === 'student' ? 'text-emerald-700 font-medium' : 'text-gray-600'}>
                  นักศึกษา
                </span>
              </label>
              <label
                htmlFor="teacher"
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.position === 'teacher'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-200'
                }`}
              >
                <RadioGroupItem value="teacher" id="teacher" className="sr-only" />
                <BookOpen className={`w-6 h-6 ${formData.position === 'teacher' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span className={formData.position === 'teacher' ? 'text-emerald-700 font-medium' : 'text-gray-600'}>
                  อาจารย์
                </span>
              </label>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-medium mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              "ยืนยันการลงทะเบียน"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}