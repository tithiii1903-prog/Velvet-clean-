import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

function GlassDropdown({ value, options, onChange, containerClassName = '', buttonClassName = '', menuClassName = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={`relative ${containerClassName}`} ref={dropdownRef}>
      <div 
        className={`flex items-center justify-between cursor-pointer ${buttonClassName}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-2">{selectedOption?.label}</span>
        <ChevronDown size={16} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 mt-2 rounded-xl text-cabernet bg-milk/80 backdrop-blur-2xl border border-milk/50 shadow-2xl overflow-hidden min-w-[170px] ${menuClassName}`}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                value === opt.value ? 'bg-milk/30 font-bold text-cabernet' : 'text-cabernet hover:bg-milk/20'
              }`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GlassDropdown;
