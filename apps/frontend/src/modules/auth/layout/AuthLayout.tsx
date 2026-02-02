import type React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/doz0tncag/image/upload/w_1920/v1769177954/among-us-5592050_1920_ral2qe.png"
          className="object-cover w-full h-full opacity-60"
          alt="Lobby background"
        />
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default AuthLayout;
