'use client';

import React, { useState } from 'react';
import RegistrationModal from '@/components/RegistrationModal';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  classes: string;
  instructors: string[];
  tags: string[];
  trackCode: string;
}

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses: Course[] = [
    {
      id: "track_fullstack_01",
      title: "BECOME A FULL STACK DEVELOPER",
      subtitle: "Understands how to build complete web applications from frontend and backend.",
      price: 100000,
      duration: "4 Weeks",
      classes: "8 Classes",
      instructors: ["Matthew Abana", "Emmanuel Mazoje"],
      tags: ["Database & APIs", "Building Full Systems", "Deploying Application", "Frontend + Backend Basics"],
      trackCode: "TRACK 01 / DEV"
    },
    {
      id: "track_3d_render_02",
      title: "MODEL RENDER REALITY",
      subtitle: "Design Products and animation using industry tools. Create in 3D & Motion.",
      price: 50000,
      duration: "2 Weeks",
      classes: "4 Classes",
      instructors: ["Kamal Usman"],
      tags: ["CAD Design", "3D Modelling Basics", "Motion Animation", "Product Visualization"],
      trackCode: "TRACK 02 / DESIGN"
    },
    {
      id: "track_visual_brand_03",
      title: "IDENTITY BEFORE AESTHETICS",
      subtitle: "Branding and Visual Design Masterclass. Establish core functional architecture.",
      price: 50000,
      duration: "2 Weeks",
      classes: "4 Classes",
      instructors: ["McAnthony Odey"],
      tags: ["Logo Design & Brand Identity", "Color & Typography Systems", "Real Brand Project", "Visual Direction & Layout"],
      trackCode: "TRACK 03 / BRAND"
    }
  ];

  return (
    <main className="relative min-h-screen bg-transparent bg-grid-pattern bg-[size:40px_40px] flex flex-col items-center px-4 pt-40 pb-24 overflow-hidden">
      
      <div className="absolute inset-0 distribution-glow pointer-events-none" />

      {/* Hero Branding Header Section */}
      <div className="text-center max-w-4xl z-10 flex flex-col items-center mb-16 select-none">
        <div className="inline-flex items-center gap-2 bg-[#A27B2C]/5 border border-[#A27B2C]/30 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] text-[#A27B2C] uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A27B2C] animate-pulse"></span>
          BUILT FOR EXCELLENCE
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-[#001D4A] tracking-tight uppercase leading-[0.95] mb-4">
          WHERE TECHNOLOGY <br />
          <span className="text-[#A27B2C]">MEETS PURPOSE.</span>
        </h1>

        <p className="text-slate-500 max-w-xl text-xs md:text-sm leading-relaxed tracking-wide font-medium">
          Steins Inc. is a multi-disciplinary holding company dedicated to architecting the infrastructure of a robotics-enabled future.
        </p>
      </div>

      {/* Dynamic Matrix Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl w-full z-10 px-2">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl shadow-slate-100/40 flex flex-col justify-between hover:border-slate-300 transition-all relative"
          >
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">{course.trackCode}</span>
                <span className="text-base font-black text-[#001D4A]">₦{course.price.toLocaleString()}</span>
              </div>

              <h3 className="text-lg font-black text-[#001D4A] tracking-tight uppercase leading-snug mb-2 min-h-[50px]">
                {course.title}
              </h3>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed min-h-[40px]">
                {course.subtitle}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {course.tags.map((tag, idx) => (
                  <span key={idx} className="bg-[#A27B2C]/10 text-[#A27B2C] text-[9px] font-bold px-2.5 py-1 rounded-full border border-[#A27B2C]/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Duration</span>
                  <span className="text-[#001D4A] font-bold">{course.duration}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Instructors</span>
                  <span className="text-[#001D4A] font-bold truncate max-w-[140px] block">
                    {course.instructors.join(' & ')}
                  </span>
                </div>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedCourse(course);
                }}
                className="w-full bg-[#001D4A] hover:bg-[#A27B2C] text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer relative z-20"
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <RegistrationModal 
          courseId={selectedCourse.id}
          courseTitle={selectedCourse.title}
          price={selectedCourse.price}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </main>
  );
}