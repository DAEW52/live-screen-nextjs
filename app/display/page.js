'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('react-qr-code'), {
  ssr: false,
});

export default function DisplayPage() {
  const [uploadUrl, setUploadUrl] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [isIdle, setIsIdle] = useState(true);

  useEffect(() => {
    setUploadUrl(window.location.origin);

    const DELAY = 15000; // 15 วินาที
    let approvedList = [];
    let currentIndex = -1;
    let priorityQueue = [];
    let timer = null;

    const show = (item) => {
        setCurrentImage(item);
        setIsIdle(!item);
    };

    const nextImage = () => {
        if (priorityQueue.length > 0) {
            const newItem = priorityQueue.shift();
            const newIndex = approvedList.findIndex(item => item.id === newItem.id);
            if (newIndex !== -1) currentIndex = newIndex;
            show(newItem);
        } else if (approvedList.length > 0) {
            currentIndex = (currentIndex + 1) % approvedList.length;
            show(approvedList[currentIndex]);
        } else {
            show(null);
        }
    };

    const startSlideshow = () => {
        if (timer) clearInterval(timer);
        nextImage(); // แสดงรูปแรกทันที
        timer = setInterval(nextImage, DELAY);
    };

    const fetchInitialData = async () => {
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: true }); // เรียงจากเก่าไปใหม่สำหรับสไลด์โชว์
        
        if (data) {
            approvedList = data;
            if (approvedList.length > 0) {
                startSlideshow();
            }
        }
    };

    fetchInitialData();

    const channel = supabase
      .channel('realtime display')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        (payload) => {
          console.log('Display received change!', payload);
          // เมื่อมีรูปใหม่ถูก Approve
          if (payload.eventType === 'UPDATE' && payload.new.status === 'approved' && payload.old.status === 'pending') {
            const newItem = payload.new;
            if (!approvedList.some(item => item.id === newItem.id)) {
              approvedList.push(newItem);
              priorityQueue.push(newItem);
            }
          }
          // เมื่อมีรูปถูกลบ
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            approvedList = approvedList.filter(item => item.id !== deletedId);
            if (currentImage && currentImage.id === deletedId) {
                // ถ้าภาพที่แสดงอยู่ถูกลบ ให้เปลี่ยนภาพทันที
                if (timer) clearInterval(timer);
                startSlideshow();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timer) clearInterval(timer);
    };
  }, [currentImage]); // ใส่ currentImage เพื่อให้ re-render

  return (
    <div className="stage">
        <div id="bg" className="bg"></div>
        {isIdle && <div id="idle"><h1 id="idleBrand">THER Phuket</h1></div>}
        
        {currentImage && (
            <div id="content">
                <div className="imgwrap">
                    <img id="img" src={currentImage.imageUrl} alt="display" />
                </div>
                <h1 id="msg" className="text">"{currentImage.message}"</h1>
                <div className="hud">
                    <p id="name">{currentImage.name}</p>
                    <p id="table">โต๊ะ: {currentImage.tableNumber}</p>
                </div>
            </div>
        )}

        <div id="qrBox">
            {uploadUrl && <QRCode value={uploadUrl} size={128} />}
        </div>
    </div>
  );
}