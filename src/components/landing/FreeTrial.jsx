import { useNavigate } from "react-router-dom";
import { Pill } from "../../libs/Divider";

function FreeTrial({ nav }) {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-linear-to-br from-[#0F2744] to-[#1A3F6E] rounded-3xl px-12 py-16 text-center overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-blue-500/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border border-sky-400/10 pointer-events-none" />
          <div className="relative">
            <Pill className="bg-blue-500/20! border-blue-500/30!">
              <span className="text-blue-300">⭐ Limited Time Offer</span>
            </Pill>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-3 tracking-tight">
              Get 1 Month Free Trial
            </h2>
            <p className="text-base text-[#94B8D8] leading-relaxed mb-10 max-w-md mx-auto">
              No credit card required. Start assessing students and discovering talent today.
            </p>
            <div className="flex gap-4 justify-center mb-10 flex-wrap">
              {[["🏛️", "Colleges", "500 Free Credits"], ["💼", "Recruiters", "500 Free Credits"]].map(([e, l, c]) => (
                <div key={l} className="bg-white/7 border border-white/10 rounded-2xl px-7 py-5 text-center min-w-[140px]">
                  <div className="text-2xl mb-1.5">{e}</div>
                  <div className="text-xs text-[#94B8D8] mb-1">{l}</div>
                  <div className="text-sm font-extrabold text-blue-300">{c}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/signup")}
              className="text-lg font-bold cursor-pointer text-white px-12 py-4 rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_8px_28px_rgba(43,127,255,0.5)] hover:shadow-[0_14px_36px_rgba(43,127,255,0.6)] hover:-translate-y-0.5 transition-all"
            >
              Start Free Trial →
            </button>
            <p className="mt-4 text-xs text-[#6B84A0]">No credit card · Cancel anytime · Instant access</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FreeTrial;