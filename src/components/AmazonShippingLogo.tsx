import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const AmazonShippingLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'light' 
}) => {
  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-11'
  };

  const isLightMode = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none cursor-pointer group ${className}`}>
      {/* Badge Container */}
      <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl shadow-sm transition border ${
        isLightMode
          ? 'bg-white border-gray-200 hover:border-amber-400 shadow'
          : 'bg-slate-900/90 border-slate-700/80 hover:border-amber-400/50 shadow-lg'
      }`}>
        
        {/* Amazon Logo with Smile Curve */}
        <div className="relative flex items-center">
          <svg 
            viewBox="0 0 140 45" 
            className={`${heights[size]} w-auto fill-current`}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Amazon text */}
            <text 
              x="2" 
              y="26" 
              fontSize="24" 
              fontWeight="900" 
              fontFamily="Arial, sans-serif" 
              fill={isLightMode ? "#131921" : "#FFFFFF"} 
              letterSpacing="-0.5"
            >
              amazon
            </text>

            {/* Amazon smile arrow curve */}
            <path 
              d="M 8,34 Q 45,46 78,34" 
              fill="none"
              stroke="#FF9900"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Arrowhead */}
            <path 
              d="M 74,29 L 84,33 L 78,41 Z" 
              fill="#FF9900" 
            />
          </svg>
        </div>

        {/* Vertical Separator */}
        <div className={`h-5 w-px ${isLightMode ? 'bg-gray-300' : 'bg-slate-700/80'}`} />

        {/* SHIPPING Badge */}
        <div className="bg-[#FF9900] text-slate-950 px-2 py-0.5 rounded-md font-black text-[11px] uppercase tracking-wider shadow-sm">
          Shipping
        </div>

      </div>
    </div>
  );
};
