import { useNavigate } from "react-router-dom";
import logo from '../../assets/eBenchCampu.png';
import whiteLogo from '../../assets/ebenchwhite.png';

export function Logo({ nav, item = false, heigth = 70, width = 180 }) {
  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer"
      onClick={() => nav("landing")}
    >
      <div className=" rounded-[10px] bg-linear-to-br  flex items-center justify-baseline">
        <img
          src={item ? whiteLogo : logo}
          width={item ? width : 110}
          height={item ? heigth : 120}
          alt="logi"
        />
      </div>
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────────────

function Navbar({ nav }) {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const links = [
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Review", id: "review" },
    { label: "Contact Us", id: "contact-section" },

  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2EDF8] px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        <Logo nav={nav} />

        <div className="hidden md:flex items-center gap-8 text-sm text-[#6B84A0]">
          {links.map((l) => (
            <span
              key={l.id}
              onClick={() => handleScroll(l.id)}
              className="cursor-pointer font-medium hover:text-blue-500 transition-colors"
            >
              {l.label}
            </span>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm cursor-pointer font-semibold text-blue-500 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Log in
          </button>

          {/* <button
            onClick={() => navigate("/employee-login")}
            className="text-sm cursor-pointer font-semibold text-blue-500 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Login Employee
          </button> */}

          <button
            onClick={() => navigate("/signup")}
            className="text-sm cursor-pointer font-bold text-white px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_6px_20px_rgba(43,127,255,0.35)] hover:shadow-[0_8px_24px_rgba(43,127,255,0.45)] hover:-translate-y-0.5 transition-all"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar