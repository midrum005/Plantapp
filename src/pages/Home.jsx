import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Leaf, Plus, Loader2, TreeDeciduous } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import PlantCard from "@/components/plants/PlantCard";
import SearchFilter from "@/components/plants/SearchFilter";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const userData = await base44.auth.me();
        setUser(userData);
        if (!userData.id_card_number || !userData.position) {
          setNeedsSetup(true);
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
    setCheckingAuth(false);
  };

  const { data: plants = [], isLoading } = useQuery({
    queryKey: ['plants'],
    queryFn: () => base44.entities.Plant.list('-created_date'),
  });

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.common_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || plant.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (needsSetup && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 flex items-center justify-center">
        <ProfileSetupForm onComplete={() => {
          setNeedsSetup(false);
          checkAuth();
        }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mobile Optimized */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-700 text-white pt-11">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
              <TreeDeciduous className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              ฐานข้อมูลพันธุ์พืช
            </h1>
            <p className="text-sm text-emerald-100 mb-6">
              วิทยาลัยเทคนิคสระแก้ว
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{plants.length}</p>
              <p className="text-sm text-gray-500">พืชทั้งหมด</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-4">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
        </div>

        {/* Plants Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : filteredPlants.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Leaf className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-700 mb-1">ไม่พบข้อมูลพืช</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || selectedDepartment !== 'all' 
                ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง' 
                : 'ยังไม่มีข้อมูลพืชในระบบ'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}