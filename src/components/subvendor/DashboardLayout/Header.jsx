const Header = ({ setSidebarOpen }) => {
  const profile = JSON.parse(localStorage.getItem('user')) || {};
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="bg-gradient-to-r from-[#042C53] to-[#185FA5] border-b border-[#0C447C] px-4 lg:px-6 py-4 flex items-center gap-4 sticky top-0 z-50 shadow-lg">
      <button 
        onClick={() => setSidebarOpen(true)} 
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#185FA5] text-white transition-colors"
      >
        &#9776;
      </button>
      
      <div className="flex-1">
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-white">
            {getGreeting()}, {profile?.name || localStorage.getItem('name') || "Employee"}
          </h1>
          <p className="text-xs text-[#B5D4F4]">
            Employee Dashboard - Manage your tasks
          </p>
        </div>
      </div>
      
      <div className="flex cursor-pointer items-center gap-3">
        <button className="relative w-9 cursor-pointer h-9 flex items-center justify-center rounded-xl hover:bg-[#185FA5] text-white transition-colors">
          &#128226;
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full border-2 border-[#042C53]" />
        </button>
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#185FA5] px-2 py-1.5 rounded-xl transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#378ADD] to-[#185FA5] flex items-center justify-center text-white text-xs font-bold shadow-md">
            {(profile?.name || localStorage.getItem('name') || "EM").slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-white">
              {profile?.name || localStorage.getItem('name') || "Employee"}
            </div>
            <div className="text-xs text-[#B5D4F4]">
              Subvendor Team
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
