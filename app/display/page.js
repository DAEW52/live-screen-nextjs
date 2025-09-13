'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('react-qr-code'), { ssr: false });

const SocialIcon = ({ type }) => {
  const socialType = type?.toLowerCase();
  // --- ✨ 1. ปรับขนาดไอคอน ✨ ---
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
  if (socialType === 'tiktok') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white">
        <path d="M12.48 2.502c-2.825-.02-5.41.944-7.46 2.926v8.046c.01 3.51 2.37 6.64 5.67 7.79.48.17.98.26 1.49.26.1 0 .2-.01.3-.02.43-.05.85-.15 1.27-.3 3.32-1.15 5.68-4.28 5.67-7.77v-8.03c-2.02-1.99-4.57-2.96-7.36-2.92zm2.02 14.53v-2.02c-1.83.02-3.66.02-5.49 0v-2.1c1.83 0 3.66 0 5.49 0v-2.08c1.83 0 3.66 0 5.49 0v-2.08c-1.83 0-3.66 0-5.49 0V6.7c-1.63-.01-3.27-.01-4.9 0v8.28c1.63.02 3.27.02 4.9 0z"/>
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
  const [currentImage, setCurrentImage] = useState(null);
  const [isIdle, setIsIdle] = useState(true);
  const [countdown, setCountdown] = useState(0);

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
      if (data) {
        slideShowData.current.list = data;
        slideShowData.current.ids = new Set(data.map(item => item.id));
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
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ [Display Page] Connected to Realtime!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ [Display Page] Realtime Connection Error:', err);
        }
      });

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    const DELAY = 15000;

    const timer = setInterval(() => {
      let nextItem = null;
      
      if (slideShowData.current.queue.length > 0) {
        nextItem = slideShowData.current.queue.shift();
      } 
      else if (slideShowData.current.list.length > 0) {
        const nextIndex = (slideShowData.current.currentIndex + 1) % slideShowData.current.list.length;
        slideShowData.current.currentIndex = nextIndex;
        nextItem = slideShowData.current.list[nextIndex];
      }
      
      setCurrentImage(nextItem);
      setIsIdle(!nextItem);

    }, DELAY);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentImage) return;
    const DELAY_SECONDS = 15000 / 1000;
    setCountdown(DELAY_SECONDS);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev > 1) {
          return prev - 1;
        }
        return DELAY_SECONDS;
      });
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, [currentImage]);

  return (
    <div className="stage" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        @keyframes zoomIn {
          from { transform: scale(1.05); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .zoom-in {
          animation: zoomIn 1.2s ease-out forwards;
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      {/* --- 1. รูปภาพพื้นหลัง --- */}
      {currentImage && (
        <div className="imgwrap zoom-in" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <img id="img" src={currentImage.imageUrl} alt="display" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* --- 2. คอนเทนเนอร์สำหรับ Overlays ทั้งหมด --- */}
      <div className="overlay-container" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>

        {/* หน้าจอ Idle เริ่มต้น */}
        {isIdle && (
            <div id="idle" style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h1 id="idleBrand">THER Phuket</h1>
            </div>
        )}
        
        {/* ตัวนับเวลา (มุมขวาบน) */}
        {currentImage && (
             <div style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              border: '2px solid white',
              pointerEvents: 'auto',
            }}>
              {countdown}
            </div>
        )}
        
        {/* --- 3. จัดตำแหน่งข้อความและเพิ่มขอบ ✨ --- */}
        {currentImage && (
            <div style={{
                position: 'absolute',
                top: '80%',
                left: '50%',
                transform: 'translate(-95%, -50%)',
                width: '90%',
            }}>
                <h1 id="msg" className="text fade-in-up" style={{ 
                    textAlign: 'center',
                    animationDelay: '0.3s',
                    fontSize: '3rem',
                    textShadow: '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 6px 6px 10px rgba(0,0,0,0.7)',
                }}>
                    "{currentImage.message}"
                </h1>
            </div>
        )}
        
        {/* Footer (ด้านล่าง) */}
        <div className="footer" style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            right: '2rem',
            width: 'calc(100% - 4rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            pointerEvents: 'auto',
        }}>
            {/* ข้อมูลผู้ใช้ (ฝั่งซ้าย) */}
            <div>
              {currentImage && (
                <div className="fade-in-up" style={{ 
                  animationDelay: '0.5s', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '20px 25px', 
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <SocialIcon type={currentImage.socialType} />
                    <p id="name" style={{ fontSize: '2.5rem', margin: 0 }}>{currentImage.name}</p>
                  </div>
                  <p id="table" style={{ fontSize: '2.5rem', margin: 0, marginTop: '10px' }}>โต๊ะ: {currentImage.tableNumber}</p>
                </div>
              )}
            </div>
            
            {/* QR Code (ฝั่งขวา) */}
            <div className="fade-in-up" style={{ 
              animationDelay: '0.5s', 
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '10px'
            }}>
                {uploadUrl && <QRCode value={uploadUrl} size={160} />}
            </div>
        </div>
      </div>
    </div>
  );
}

