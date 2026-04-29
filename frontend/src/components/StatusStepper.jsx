import React from 'react';

const STATUSES = [
  { value: 'RECEIVED', label: 'Received', num: 1 },
  { value: 'PROCESSING', label: 'Processing', num: 2 },
  { value: 'READY', label: 'Ready', num: 3 },
  { value: 'DELIVERED', label: 'Delivered', num: 4 },
];

function StatusStepper({ currentStatus, onStatusChange }) {
  const currentIndex = STATUSES.findIndex(s => s.value === currentStatus);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="flex items-start justify-between w-full min-w-[280px] max-w-[400px] pt-2 pb-2 relative">
      {/* Background Line */}
      <div className="absolute top-[22px] left-[10%] right-[10%] h-[3px] bg-milk/20 z-0 rounded-full"></div>
      
      {/* Active Line */}
      <div 
        className="absolute top-[22px] left-[10%] h-[3px] bg-[#FFD18B] z-0 rounded-full transition-all duration-500"
        style={{ width: `${(safeIndex / (STATUSES.length - 1)) * 80}%` }}
      ></div>

      {STATUSES.map((status, index) => {
        const isCompleted = index <= safeIndex;
        const isLastStep = index === 3;
        
        // Colors matching the image
        const completedBg = isLastStep ? 'bg-[#FFB098]' : 'bg-[#FFD18B]';
        const completedShadow = isLastStep ? 'shadow-[0_0_15px_rgba(255,176,152,0.6)]' : 'shadow-[0_0_10px_rgba(255,209,139,0.3)]';
        const completedText = isLastStep ? 'text-[#FFB098]' : 'text-[#FFD18B]';

        return (
          <div key={status.value} className="flex flex-col items-center relative z-10 w-12 cursor-pointer group" onClick={() => onStatusChange(status.value)}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                isCompleted 
                  ? `${completedBg} text-cabernet ${completedShadow}` 
                  : 'bg-[#401318] text-milk/60 border-2 border-milk/20 group-hover:border-[#FFD18B]/50'
              }`}
            >
              {status.num}
            </div>
            <span className={`text-[10px] mt-2 font-semibold uppercase tracking-wider transition-colors duration-300 ${isCompleted ? completedText : 'text-milk/50 group-hover:text-milk/80'}`}>
              {status.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default StatusStepper;
