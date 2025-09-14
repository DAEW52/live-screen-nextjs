'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('react-qr-code'), { ssr: false });

const SocialIcon = ({ type }) => {
  const socialType = type?.toLowerCase();
  const iconSize = "48";

  if (socialType === 'facebook') {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 105.78513 105.78513">
        <g transform="translate(-29.12827,-77.419919)">
          <g transform="matrix(0.98570778,0,0,0.98570778,1.1722601,1.8624552)">
            <circle r="47.625" cy="130.31248" cx="82.020836" fill="#0066ff"/>
            <path d="m 89.822943,107.76035 c -4.444987,-0.0186 -9.850149,0.22118 -11.336776,1.41386 -2.911076,2.33548 -2.258777,6.83421 -2.258777,6.83421 h 0.0098 v 8.17728 l -8.351943,-0.0424 2.606043,7.95146 5.7459,0.0176 v 22.96759 h 9.621637 v -22.93762 l 6.281269,0.0191 2.204516,-7.88427 -8.485785,-0.0429 v -8.13284 l 10.274823,0.0997 0.02274,-8.25583 c 0,0 -2.876251,-0.17051 -6.333464,-0.185 z" fill="#ffffff"/>
          </g>
        </g>
      </svg>
    );
  }
  if (socialType === 'instagram') {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 105.8851 105.88512">
        <defs>
            <linearGradient id="instagramGradient">
                <stop offset="0" stopColor="#00009f"/>
                <stop offset="0.32" stopColor="#7500cb" stopOpacity="0.53"/>
                <stop offset="0.59" stopColor="#c30077" stopOpacity="0.71"/>
                <stop offset="0.83" stopColor="#ff0000" stopOpacity="0.93"/>
                <stop offset="1" stopColor="#ffff00"/>
            </linearGradient>
        </defs>
        <g transform="translate(-52.572577,-100.74468)">
          <g transform="matrix(0.93003423,0,0,0.93003423,7.3824477,10.752847)">
            <ellipse ry="47.625" rx="46.125" cy="154.125" cx="105.84524" fill="url(#instagramGradient)"/>
            <rect ry="9.4182072" y="132.91701" x="83.404526" height="44.695126" width="44.695126" stroke="#ffffff" strokeWidth="2.41370797" fill="none"/>
            <circle r="2.7381825" cy="139.84071" cx="118.28339" fill="#ffffff"/>
            <circle r="11.584605" cy="155.26457" cx="105.75208" stroke="#ffffff" strokeWidth="3.32993841" fill="none"/>
          </g>
        </g>
      </svg>
    );
  }
  if (socialType === 'line') {
    return (
      <svg height={iconSize} width={iconSize} viewBox="0 0 99 99">
        <g>
          <rect fill="#3ACD01" height="99.4661" rx="10" ry="10" width="99.4661"/>
          <path fill="white" fillRule="nonzero" d="M50 17c19,0 35,12 35,28 0,5 -2,11 -5,15 0,0 -1,0 -1,1l0 0c-1,1 -2,2 -4,3 -10,9 -26,20 -28,19 -2,-2 3,-9 -2,-10 -1,0 -1,0 -1,0l0 0 0 0c-17,-3 -30,-14 -30,-28 0,-16 16,-28 36,-28zm-21 37l0 0 0 0 7 0c1,0 2,-1 2,-2l0 0c0,-1 -1,-2 -2,-2l-5 0 0 -12c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2zm44 -9l0 0 0 0c0,-1 0,-2 -1,-2l-6 0 0 -2 6 0c1,0 1,-1 1,-2l0 0c0,-1 0,-2 -1,-2l-7 0 0 0 -1 0c-1,0 -1,1 -1,2l0 13c0,1 0,2 1,2l1 0 0 0 7 0c1,0 1,-1 1,-2l0 0c0,-1 0,-2 -1,-2l-6 0 0 -3 6 0c1,0 1,-1 1,-2zm-13 8l0 0 0 0c0,0 0,0 0,-1l0 -14c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 9 -6 -9c-1,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2l0 0c1,0 2,-1 2,-2l0 -8 7 9c0,0 0,0 0,0l0 0c0,1 0,1 1,1 0,0 0,0 0,0l0 0c1,0 1,0 1,0 0,0 1,0 1,-1zm-18 1l0 0 0 0c1,0 2,-1 2,-2l0 -14c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2z"/>
        </g>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white">
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm0-18c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 11c-3.866 0-7 2.19-7 5v1c0 .552.448 1 1 1h12c.552 0 1-.448 1-1v-1c0-2.81-3.134-5-7-5z"/>
    </svg>
  );
};

export default function DisplayPage() {
  const [uploadUrl, setUploadUrl] = useState('');
  const [currentContent, setCurrentContent] = useState(null); // State สำหรับข้อมูล (ข้อความ, ชื่อ)
  const [isIdle, setIsIdle] = useState(true);
  const [countdown, setCountdown] = useState(0);

  // --- ✨ 1. State สำหรับจัดการ "เวที" ทั้งสอง ✨ ---
  const [imageSlots, setImageSlots] = useState([ { src: null, visible: false }, { src: null, visible: false } ]);
  const [activeSlot, setActiveSlot] = useState(0);

  const slideShowData = useRef({
    list: [],
    queue: [],
    currentIndex: -1,
    ids: new Set(),
  });

  useEffect(() => {
    setUploadUrl(window.location.origin);

    const fetchInitialData = async () => {
      const { data } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: true });
      if (data && data.length > 0) {
        slideShowData.current.list = data;
        slideShowData.current.ids = new Set(data.map(item => item.id));
        // --- ✨ แสดงรูปแรกเมื่อโหลดเสร็จ ✨ ---
        const firstItem = data[0];
        slideShowData.current.currentIndex = 0;
        setImageSlots([{ src: firstItem.imageUrl, visible: true }, { src: null, visible: false }]);
        setCurrentContent(firstItem);
        setIsIdle(false);
      }
    };

    fetchInitialData();

    const channel = supabase
      .channel('realtime display')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            if (payload.new.status === 'approved') {
              const newItem = payload.new;
              if (!slideShowData.current.ids.has(newItem.id)) {
                slideShowData.current.ids.add(newItem.id);
                slideShowData.current.list.push(newItem);
                slideShowData.current.queue.push(newItem);
              }
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            slideShowData.current.ids.delete(deletedId);
            slideShowData.current.list = slideShowData.current.list.filter(item => item.id !== deletedId);
            slideShowData.current.queue = slideShowData.current.queue.filter(item => item.id !== deletedId);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    const DELAY = 15000;

    const timer = setInterval(() => {
      let nextItem = null;
      
      if (slideShowData.current.queue.length > 0) {
        nextItem = slideShowData.current.queue.shift();
        const newIndex = slideShowData.current.list.findIndex(item => item.id === nextItem.id);
        if (newIndex !== -1) slideShowData.current.currentIndex = newIndex;
      } 
      else if (slideShowData.current.list.length > 0) {
        const nextIndex = (slideShowData.current.currentIndex + 1) % slideShowData.current.list.length;
        slideShowData.current.currentIndex = nextIndex;
        nextItem = slideShowData.current.list[nextIndex];
      }
      
      if (nextItem) {
        // --- ✨ 2. อัปเดต "เวที" ที่ซ่อนอยู่ และสลับการมองเห็น ✨ ---
        const nextSlot = (activeSlot + 1) % 2;
        setImageSlots(prevSlots => {
            const newSlots = [...prevSlots];
            newSlots[nextSlot] = { src: nextItem.imageUrl, visible: true }; // เตรียมรูปใหม่และทำให้มองเห็น
            newSlots[activeSlot] = { ...newSlots[activeSlot], visible: false }; // ซ่อนรูปเก่า
            return newSlots;
        });
        setActiveSlot(nextSlot);
        setCurrentContent(nextItem);
        setIsIdle(false);
      } else {
        setIsIdle(true);
        setCurrentContent(null);
      }

    }, DELAY);

    return () => clearInterval(timer);
  }, [activeSlot]); // ทำงานใหม่เมื่อ activeSlot เปลี่ยน

  useEffect(() => {
    if (!currentContent) return;
    const DELAY_SECONDS = 15000 / 1000;
    setCountdown(DELAY_SECONDS);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : DELAY_SECONDS));
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, [currentContent]);

  return (
    <div className="stage" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'black' }}>
      <style>{`
        .image-slot {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: opacity 1.5s ease-in-out; /* --- ✨ แอนิเมชัน Crossfade ✨ --- */
        }
        .image-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      {/* --- ✨ 3. สร้าง "เวที" ทั้งสอง ✨ --- */}
      {imageSlots.map((slot, index) => (
        <div key={index} className="image-slot" style={{ opacity: slot.visible ? 1 : 0 }}>
          {slot.src && <img src={slot.src} alt={`display-slot-${index}`} />}
        </div>
      ))}

      <div className="overlay-container" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
        {isIdle && (
            <div id="idle" style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h1 id="idleBrand">THER Phuket</h1>
            </div>
        )}
        
        {currentContent && (
             <div style={{
              position: 'absolute',
              top: '2rem', right: '2rem', backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white', width: '50px', height: '50px',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold',
              border: '2px solid white', pointerEvents: 'auto',
            }}>
              {countdown}
            </div>
        )}
        
        {currentContent && (
            <div key={currentContent.id} style={{
                position: 'absolute', top: '70%', left: '50%',
                transform: 'translate(-50%, -50%)', width: '90%',
            }}>
                <h1 className="text fade-in-up" style={{ 
                    textAlign: 'center', animationDelay: '0.3s', fontSize: '5rem',
                    textShadow: '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 7px 7px 10px rgba(0,0,0,0.8)',
                }}>
                    "{currentContent.message}"
                </h1>
            </div>
        )}
        
        <div className="footer" style={{
            position: 'absolute', bottom: '2rem', left: '2rem',
            right: '2rem', width: 'calc(100% - 4rem)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', pointerEvents: 'auto',
        }}>
            <div>
              {currentContent && (
                <div key={currentContent.id} className="fade-in-up" style={{ 
                  animationDelay: '0.5s', display: 'flex', flexDirection: 'column', 
                  alignItems: 'flex-start', backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '20px 25px', borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <SocialIcon type={currentContent.socialType} />
                    <p style={{ fontSize: '2.5rem', margin: 0 }}>{currentContent.name}</p>
                  </div>
                  <p style={{ fontSize: '2.5rem', margin: 0, marginTop: '10px' }}>โต๊ะ: {currentContent.tableNumber}</p>
                </div>
              )}
            </div>
            
            <div className="fade-in-up" style={{ 
              animationDelay: '0.5s', backgroundColor: 'white',
              padding: '10px', borderRadius: '10px'
            }}>
                {uploadUrl && <QRCode value={uploadUrl} size={160} />}
            </div>
        </div>
      </div>
    </div>
  );
}

