import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const departments = [
  { value: "all", label: "ทุกแผนก" },
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

export default function SearchFilter({ searchTerm, setSearchTerm, selectedDepartment, setSelectedDepartment }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="ค้นหาชื่อพืช..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-base"
        />
      </div>
      <div className="w-full sm:w-56">
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="h-12 rounded-xl border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <SelectValue placeholder="เลือกแผนก" />
            </div>
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
  );
}