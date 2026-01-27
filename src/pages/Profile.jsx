import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, User as UserIcon, IdCard, Phone, GraduationCap, BookOpen } from "lucide-react";
import { createPageUrl } from "@/utils";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      if (!authenticated) {
        base44.auth.redirectToLogin(createPageUrl("Profile"));
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
      if (!userData.id_card_number || !userData.position) {
        setNeedsSetup(true);
      }
    } catch (error) {
      base44.auth.redirectToLogin(createPageUrl("Profile"));
    }
    setLoading(false);
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl("Home"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <ProfileSetupForm onComplete={() => {
          setNeedsSetup(false);
          loadUser();
        }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white pt-11 pb-6 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
            <UserIcon className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold">{user?.full_name}</h1>
          <p className="text-emerald-100 text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-4">
        <Card className="rounded-2xl shadow-lg border-0 mb-4">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-lg">ข้อมูลส่วนตัว</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <IdCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">เลขบัตรประชาชน</p>
                <p className="font-medium text-gray-900">{user?.id_card_number}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">รหัสนักศึกษา/อาจารย์ หรือเบอร์โทร</p>
                <p className="font-medium text-gray-900">{user?.student_teacher_id}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                {user?.position === 'student' ? (
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                ) : (
                  <BookOpen className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">ตำแหน่ง</p>
                <p className="font-medium text-gray-900">
                  {user?.position === 'student' ? 'นักศึกษา' : 'อาจารย์'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-2" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );
}