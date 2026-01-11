import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from "react-icons/fa";

interface ShowAlertMessageProps {
  message: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowAlertMessage: React.FC<ShowAlertMessageProps> = ({ message, visible, setVisible }) => {
  const [progress, setProgress] = useState(0); // Start at 0%

  useEffect(() => {
    if (visible) {
      setProgress(0); // Reset progress on new visible alert

      const totalDuration = 3000;
      const interval = 100;
      const progressStep = (interval / totalDuration) * 100;

      const timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + progressStep;
          return next >= 100 ? 100 : next;
        });
      }, interval);

      const autoHide = setTimeout(() => {
        setVisible(false); // ✅ Set visibility off after total duration
      }, totalDuration);

      return () => {
        clearInterval(timer);
        clearTimeout(autoHide);
      };
    }
  }, [visible, setVisible]);

  return (
    <div className={`hello fixed top-[70px] right-4 z-[999999] ${visible ? 'slide-in' : 'slide-out'}`} style={{ minWidth: '300px' }}>
      <div className="w-auto relative overflow-hidden">
        <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-lg text-white px-4 py-5 shadow-lg" role="alert">
          <div className="flex items-center gap-4">
            <div className="text-[30px] flex items-center justify-center text-white">
              <FaExclamationTriangle />
            </div>
            <div>
              <p className="text-sm">Alert! {message}</p>
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 h-1 bg-white"
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowAlertMessage;