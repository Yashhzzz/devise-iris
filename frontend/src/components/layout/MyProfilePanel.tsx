import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface MyProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyProfilePanel({ isOpen, onClose }: MyProfilePanelProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 transition-opacity duration-200"
        style={{ 
          backgroundColor: "rgba(0,0,0,0.4)", 
          backdropFilter: "blur(4px)",
          opacity: isClosing ? 0 : 1 
        }}
        onClick={handleClose}
      />
      
      <div 
        className="fixed top-0 bottom-0 right-0 z-50 bg-white flex flex-col transition-transform duration-200"
        style={{ 
          width: 480, 
          boxShadow: "-12px 0 48px rgba(0,0,0,0.12)",
          transform: isClosing ? "translateX(100%)" : "translateX(0)" 
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#F0F2F5]">
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}>
            My Profile
          </h2>
          <button 
            onClick={handleClose}
            className="p-1 rounded-full transition-colors hover:bg-[#F8FAFC]"
            style={{ color: "#94A3B8" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          
          <div className="flex flex-col items-center">
            <div
              className="flex items-center justify-center rounded-full mb-4"
              style={{ 
                width: 64, height: 64, 
                backgroundColor: "#FF5C1A", 
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 24,
                boxShadow: "0 4px 12px rgba(255, 92, 26, 0.25)"
              }}
            >
              YM
            </div>
            <button className="text-sm font-medium text-[#FF5C1A] hover:text-[#E5521A] transition-colors">
              Change avatar
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 13, color: "#64748B", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Full Name</label>
              <input 
                type="text" 
                defaultValue="Yash M" 
                className="w-full outline-none"
                style={{ padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 13, color: "#64748B", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Email Address</label>
              <input 
                type="text" 
                defaultValue="yash@devise.ai" 
                readOnly
                className="w-full outline-none bg-[#F8FAFC]"
                style={{ padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, color: "#64748B", fontFamily: "Inter, sans-serif", cursor: "not-allowed" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 13, color: "#64748B", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Department</label>
              <select 
                defaultValue="Engineering"
                className="w-full outline-none bg-white cursor-pointer"
                style={{ padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}
              >
                <option>Engineering</option>
                <option>Product</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Operations</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 13, color: "#64748B", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Role</label>
              <input 
                type="text" 
                defaultValue="Admin" 
                readOnly
                className="w-full outline-none bg-[#F8FAFC]"
                style={{ padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, color: "#64748B", fontFamily: "Inter, sans-serif", cursor: "not-allowed" }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#F0F2F5] flex justify-end gap-3">
          <button 
            onClick={handleClose}
            className="transition-colors hover:bg-[#F8FAFC]"
            style={{ 
              padding: "10px 16px", borderRadius: 8, fontSize: 14, 
              fontWeight: 500, color: "#64748B", fontFamily: "Inter, sans-serif",
              border: "1px solid #E2E8F0"
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleClose}
            className="transition-all hover:-translate-y-[1px]"
            style={{ 
              backgroundColor: "#FF5C1A", color: "white", padding: "10px 20px", borderRadius: 8, 
              fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif",
              boxShadow: "0 2px 4px rgba(255, 92, 26, 0.2)"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#E5521A"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FF5C1A"}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
