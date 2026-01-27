import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PlantForm from "@/components/plants/PlantForm";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";

export default function AddPlant() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      if (!authenticated) {
        base44.auth.redirectToLogin(createPageUrl("AddPlant"));
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
      if (!userData.id_card_number || !userData.position) {
        setNeedsSetup(true);
      }
    } catch (error) {
      base44.auth.redirectToLogin(createPageUrl("AddPlant"));
    }
    setLoading(false);
  };

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pt-11">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-semibold text-gray-900 text-lg">เพิ่มข้อมูลพืช</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <PlantForm 
          user={user} 
          onSuccess={() => {
            window.location.href = createPageUrl("Home");
          }} 
        />
      </div>
    </div>
  );
}