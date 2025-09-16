'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
  const [currentContent, setCurrentContent] = useState(null);
  const [isIdle, setIsIdle] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [imageSlots, setImageSlots] = useState([
    { src: null, visible: false }, 
    { src: null, visible: false }
  ]);
  const [activeSlot, setActiveSlot] = useState(0);

  const dataRef = useRef({
    approvedList: [],
    newItemsQueue: [],
    currentIndex: -1,
    ids: new Set(),
    lastIndexBeforeQueue: null, // --- ✨ เพิ่มตัวแปรสำหรับ "จดจำ" ตำแหน่ง ✨ ---
  });

  const activeSlotRef = useRef(activeSlot);
  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  useEffect(() => {
    setUploadUrl(window.location.origin);
    const fetchInitialData = async () => {
      const { data } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: true });
      if (data && data.length > 0) {
        const slideData = dataRef.current;
        slideData.approvedList = data;
        slideData.ids = new Set(data.map(item => item.id));
      }
    };
    fetchInitialData();
    
    const channel = supabase.channel('realtime display')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, 
        (payload) => {
          const data = dataRef.current;
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            if (payload.new.status === 'approved' && !data.ids.has(payload.new.id)) {
              data.ids.add(payload.new.id);
              data.approvedList.push(payload.new);
              data.newItemsQueue.push(payload.new);
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            if (data.ids.has(deletedId)) {
                data.ids.delete(deletedId);
                data.approvedList = data.approvedList.filter(item => item.id !== deletedId);
                data.newItemsQueue = data.newItemsQueue.filter(item => item.id !== deletedId);
            }
          }
        }
      ).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    const DELAY = 15000;
    const tick = () => {
      const data = dataRef.current;
      let nextItem = null;

      if (data.newItemsQueue.length > 0) {
        // --- ✨ 1. เมื่อมีรูปใหม่ ให้ "จดจำ" ตำแหน่งปัจจุบันไว้ก่อน ✨ ---
        data.lastIndexBeforeQueue = data.currentIndex;
        nextItem = data.newItemsQueue.shift();
        const itemIndex = data.approvedList.findIndex(item => item.id === nextItem.id);
        if (itemIndex !== -1) {
          data.currentIndex = itemIndex;
        }
      } else if (data.approvedList.length > 0) {
        let nextIndex;
        // --- ✨ 2. ตรวจสอบว่าเราเพิ่งเล่นรูปจากคิวด่วนจบไปหรือไม่ ✨ ---
        if (data.lastIndexBeforeQueue !== null) {
          // ถ้าใช่ ให้กลับไปเล่นต่อจากตำแหน่งที่จำไว้
          nextIndex = (data.lastIndexBeforeQueue + 1) % data.approvedList.length;
          data.lastIndexBeforeQueue = null; // เคลียร์ความจำ
        } else {
          // ถ้าไม่ใช่ ก็เล่นตามลำดับปกติ
          nextIndex = (data.currentIndex + 1) % data.approvedList.length;
        }
        data.currentIndex = nextIndex;
        nextItem = data.approvedList[data.currentIndex];
      }

      if (nextItem) {
        const currentActiveSlot = activeSlotRef.current;
        const nextSlot = (currentActiveSlot + 1) % 2;
        setImageSlots(prev => {
            const newSlots = [...prev];
            newSlots[nextSlot] = { src: nextItem.imageUrl, visible: true };
            newSlots[currentActiveSlot] = { ...newSlots[currentActiveSlot], visible: false };
            return newSlots;
        });
        setActiveSlot(nextSlot);
        setCurrentContent(nextItem);
        setIsIdle(false);
      } else {
        setIsIdle(true);
        setCurrentContent(null);
      }
    };
    
    const timerId = setInterval(tick, DELAY);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!currentContent) return;
    setCountdown(15);
    const countdownTimer = setInterval(() => {
      setCountdown(prev => prev > 1 ? prev - 1 : 15);
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, [currentContent]);

  return (
    <div className="stage" style={{ 
      position: 'relative', width: '100vw', height: '100vh', 
      overflow: 'hidden', backgroundColor: 'black' 
    }}>
      <style>{`
        .image-slot {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: opacity 1.5s ease-in-out;
        }
        .image-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .content-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.8s ease-out 0.5s;
        }
        .content-overlay.visible {
          opacity: 1;
        }
      `}</style>

      {imageSlots.map((slot, index) => (
        <div key={index} className="image-slot" style={{ opacity: slot.visible ? 1 : 0 }}>
          {slot.src && <img src={slot.src} alt={`display-slot-${index}`} />}
        </div>
      ))}
      
      <div key={currentContent?.id} className={`content-overlay ${currentContent ? 'visible' : ''}`}>
        {isIdle && (
          <div style={{
            width: '100%', height: '100%', display: 'flex', 
            justifyContent: 'center', alignItems: 'center'
          }}>
            <h1 style={{ color: 'white', fontSize: '6rem' }}>THER Phuket</h1>
          </div>
        )}
        
        {currentContent && (
          <div style={{
            position: 'absolute', top: '2rem', right: '2rem', 
            backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', 
            width: '50px', height: '50px', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '1.5rem', fontWeight: 'bold', border: '2px solid white'
          }}>
            {countdown}
          </div>
        )}
        
        {currentContent && (
          <div style={{
            position: 'absolute', top: '70%', left: '50%',
            transform: 'translate(-50%, -50%)', width: '90%',
          }}>
            <h1 style={{ 
              color: 'white', textAlign: 'center', fontSize: '5rem',
              textShadow: '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000',
              margin: 0
            }}>
              "{currentContent.message}"
            </h1>
          </div>
        )}
        
        <div style={{
          position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
        }}>
          <div>
            {currentContent && (
              <div style={{ 
                display: 'flex', flexDirection: 'column', 
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '20px 25px', borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                  <SocialIcon type={currentContent.socialType} />
                  <p style={{ fontSize: '2.5rem', margin: 0, color: 'white' }}>
                    {currentContent.name}
                  </p>
                </div>
                <p style={{ fontSize: '2.5rem', margin: '10px 0 0 0', color: 'white' }}>
                  โต๊ะ: {currentContent.tableNumber}
                </p>
              </div>
            )}
          </div>
          
          <div style={{ 
            backgroundColor: 'white', padding: '10px', borderRadius: '10px'
          }}>
            {uploadUrl && <QRCode value={uploadUrl} size={160} />}
          </div>
        </div>
      </div>
    </div>
  );
}

