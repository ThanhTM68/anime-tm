
import React from 'react';

const Pagination: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 mt-20 mb-10 font-bold text-sm">
      <div className="bg-[#1e293b] text-slate-400 px-4 py-2.5 rounded hover:bg-slate-800 transition-colors cursor-pointer">
        Trang 1 của 73
      </div>
      
      <div className="bg-[#e74c3c] text-white w-10 h-10 flex items-center justify-center rounded cursor-pointer shadow-lg">
        1
      </div>
      
      {[2, 3, 4, 5].map(num => (
        <div key={num} className="bg-[#1e293b] text-slate-400 w-10 h-10 flex items-center justify-center rounded hover:bg-slate-800 transition-colors cursor-pointer">
          {num}
        </div>
      ))}
      
      <div className="bg-[#1e293b] text-slate-400 px-4 py-2.5 rounded hover:bg-slate-800 transition-colors cursor-pointer">
        Trang Cuối
      </div>
    </div>
  );
};

export default Pagination;
