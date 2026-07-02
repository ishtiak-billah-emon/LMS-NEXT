function Ring({ size, opacity, top, left, right, bottom }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${parseInt(size) * 0.12}px solid rgba(255,255,255,${opacity})`,
        top,
        left,
        right,
        bottom,
        pointerEvents: "none",
      }}
    />
  );
}

const AuthLayout = ({children}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* MAIN AUTH CONTAINER */}
      <div className="w-full max-w-6xl min-h-[700px] bg-card rounded-3xl overflow-hidden shadow-2xl border border-border">
        <div className="grid lg:grid-cols-2 min-h-[700px]">
          {/* LEFT SIDE - FORM */}
          <div className="flex items-center justify-center p-8 lg:p-12 bg-card">
            <div className="w-full max-w-md">{children}</div>
          </div>

          {/* RIGHT SIDE - DESIGN */}
          <div className="relative hidden lg:flex overflow-hidden bg-primary items-center justify-center p-12">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-secondary opacity-95" />

            {/* Decorative Rings */}
            <Ring size="300px" opacity={0.08} top="-80px" right="-80px" />
            <Ring size="220px" opacity={0.06} bottom="-60px" left="-60px" />
            <Ring size="140px" opacity={0.05} top="40%" right="10%" />

            {/* Content */}
            <div className="relative z-10 max-w-lg text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-6">
                Learn Smarter
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Build Your Future
                <span className="block mt-2 text-white/80">
                  Through Modern Learning
                </span>
              </h1>

              <p className="mt-8 text-lg leading-relaxed text-white/80">
                Access high-quality courses, improve your skills, and grow with
                a smarter online learning experience designed for modern
                students.
              </p>

              {/* Bottom Line */}
              <div className="mt-12 flex items-center gap-4">
                <div className="w-14 h-[2px] bg-white/50"></div>

                <p className="text-sm text-white/70 tracking-wide">
                  Start your journey today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
