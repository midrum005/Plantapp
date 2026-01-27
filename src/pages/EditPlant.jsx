import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PlantEditForm from "@/components/plants/PlantEditForm";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";

export default function EditPlant() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  
  const urlParams = new URLSearchParams(window.location.search);
  const plantId = urlParams.get('id');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      if (!authenticated) {
        base44.auth.redirectToLogin(createPageUrl("EditPlant") + `?id=${plantId}`);
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
      if (!userData.id_card_number || !userData.position) {
        setNeedsSetup(true);
      }
    } catch (error) {
      base44.auth.redirectToLogin(createPageUrl("EditPlant") + `?id=${plantId}`);
    }
    setCheckingAuth(false);
  };

  const { data: plant, isLoading, error } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: async () => {
      const plants = await base44.entities.Plant.filter({ id: plantId });
      return plants[0];
    },
    enabled: !!plantId && !checkingAuth,
  });

  if (checkingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 flex items-center justify-center">
        <ProfileSetupForm onComplete={() => {
          setNeedsSetup(false);
          checkAuth();
        }} />
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pt-11">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl("PlantDetail") + `?id=${plantId}`}>
            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-semibold text-gray-900 text-lg">แก้ไขข้อมูลพืช</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <PlantEditForm 
          plant={plant}
          user={user} 
          onSuccess={() => {
            window.location.href = createPageUrl("PlantDetail") + `?id=${plantId}`;
          }} 
        />
      </div>
    </div>
  );
}