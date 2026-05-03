// CoinIntro.jsx — cinematic boot overlay: coin drops, spins, lands, reveals homepage
const { useState: useStateI, useEffect: useEffectI } = React;

function CoinIntro({ onDone, skip }) {
  // phases: pre (black) -> drop -> spin -> land -> fade -> gone
  const [phase, setPhase] = useStateI(skip ? 'gone' : 'pre');
  const [hidden, setHidden] = useStateI(skip || false);

  useEffectI(() => {
    if (skip) { setHidden(true); onDone && onDone(); return; }
    // single continuous timeline — spin is uninterrupted the whole time
    const t0 = setTimeout(() => setPhase('drop'), 150);    // coin starts falling (spin already running)
    const t1 = setTimeout(() => setPhase('settle'), 2450); // landed, gentle slowdown
    const t2 = setTimeout(() => setPhase('fade'), 3900);   // fade overlay
    const t3 = setTimeout(() => { setHidden(true); onDone && onDone(); }, 5000);
    return () => [t0,t1,t2,t3].forEach(clearTimeout);
  }, []);

  if (hidden) return null;

  const fading = phase === 'fade';
  const landing = phase === 'settle' || phase === 'fade';
  const chromeIn = phase !== 'pre';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000',
      opacity: fading ? 0 : 1,
      transition: 'opacity 1100ms cubic-bezier(.2,.7,.2,1)',
      pointerEvents: fading ? 'none' : 'auto',
      overflow: 'hidden'
    }}>
      {/* matrix rain — sits behind the vignette/grid, fades with chrome */}
      <MatrixRain active={!fading} />

      {/* all chrome wrapped so we can fade it in together with the coin */}
      <div style={{
        position:'absolute', inset:0,
        opacity: chromeIn ? 1 : 0,
        transition: 'opacity 900ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* vignette + scanning aura */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(16,185,129,.12) 0%, transparent 55%)'
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: .25,
          backgroundImage: 'linear-gradient(rgba(16,185,129,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 70%)'
        }} />

        <CornerTicks />

        {/* status chip */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, calc(-50% + 220px))`,
          font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.5em',
          color: '#10b981', textTransform: 'uppercase',
          padding: '8px 18px', border: '1px solid rgba(16,185,129,.25)',
          background: 'rgba(16,185,129,.05)',
          opacity: landing ? 1 : 0.5,
          transition: 'opacity 700ms'
        }}>
          {phase === 'drop' ? '◉ Protocol handshake · v4.0' : '◉ Session authenticated'}
        </div>

        {/* caption */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% - 220px))', textAlign: 'center'
        }}>
          <div style={{
            font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.6em',
            color: '#737373', textTransform: 'uppercase'
          }}>Keyrules × Alg Capitals</div>
          <div style={{
            marginTop: 8,
            font: '400 10px/1 var(--font-mono)', letterSpacing: '.35em',
            color: '#404040', textTransform: 'uppercase'
          }}>Institutional Liquidity Protocol</div>
        </div>
      </div>

      {/* impact shockwave — only after land */}
      {landing && (
        <div className="coin-shockwave" style={{
          position:'absolute', top:'50%', left:'50%',
          width:280, height:280, marginLeft:-140, marginTop:-140,
          borderRadius:'50%', pointerEvents:'none',
        }}/>
      )}

      {/* the coin */}
      <div className="coin-drop-wrap" data-phase={phase} style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 280, height: 280, marginLeft: -140, marginTop: -140,
        perspective: 1400
      }}>
        <div className="coin-intro-inner" data-phase={phase}>
          <div className="coin-intro-face front" />
          <div className="coin-intro-face back" />
          <div className="coin-intro-sheen" />
          <div className="coin-intro-rim" />
        </div>
      </div>

      <style>{`
        /* OUTER wrapper handles drop only — pure translate/scale, no rotation swaps */
        .coin-drop-wrap[data-phase="pre"] { opacity: 0; transform: translateY(-120vh) scale(.5); }
        .coin-drop-wrap[data-phase="drop"],
        .coin-drop-wrap[data-phase="settle"],
        .coin-drop-wrap[data-phase="fade"] {
          animation: coinDrop 2300ms linear both;
        }
        /* Physical gravity fall: use cubic-bezier.easeIn for the fall (accelerating),
           then a tiny bounce. Linear timing-function + eased keyframes = no jitter.
           Position samples follow y = t² (gravity), scale grows linearly. */
        @keyframes coinDrop {
          0%   { transform: translateY(-110vh) scale(.55); opacity: 0; animation-timing-function: cubic-bezier(.55,0,.9,.5); }
          10%  { opacity: 1; }
          /* accelerating fall — samples of y=t² from 0 to 1 */
          70%  { transform: translateY(0) scale(1); animation-timing-function: cubic-bezier(.25,.8,.3,1); }
          /* soft bounce settle */
          80%  { transform: translateY(12px) scale(1.025); animation-timing-function: cubic-bezier(.4,0,.4,1); }
          90%  { transform: translateY(-4px) scale(.997); animation-timing-function: ease-out; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* INNER wrapper: ONE continuous spin animation that NEVER swaps — eliminates freezes.
           Speed is controlled by --spin-dur so it can ease from fast → slow without restarting. */
        .coin-intro-inner {
          width: 100%; height: 100%; position: relative;
          transform-style: preserve-3d;
          animation: coinSpin var(--spin-dur, 0.7s) linear infinite;
          transition: none;
        }
        .coin-intro-inner[data-phase="pre"]    { --spin-dur: 0.7s; }
        .coin-intro-inner[data-phase="drop"]   { --spin-dur: 0.7s; }
        .coin-intro-inner[data-phase="settle"] { --spin-dur: 1.6s; transition: --spin-dur 900ms ease-out; }
        .coin-intro-inner[data-phase="fade"]   { --spin-dur: 2.4s; transition: --spin-dur 900ms ease-out; }
        @keyframes coinSpin {
          0%   { transform: rotateX(4deg) rotateY(0deg); }
          100% { transform: rotateX(4deg) rotateY(360deg); }
        }

        .coin-shockwave {
          animation: shockwave 1100ms cubic-bezier(.2,.7,.2,1) forwards;
          border: 2px solid rgba(16,185,129,.7);
          box-shadow: 0 0 60px rgba(16,185,129,.5);
        }
        @keyframes shockwave {
          0%   { transform: scale(.6); opacity: 1; }
          100% { transform: scale(3.2); opacity: 0; }
        }

        .coin-intro-face {
          position: absolute; inset: 0;
          border-radius: 9999px;
          background-image: url("../../assets/logo-sello.jpg");
          background-size: cover; background-position: center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          box-shadow:
            0 0 0 2px rgba(16,185,129,.18),
            0 0 60px rgba(16,185,129,.45),
            inset 0 0 30px rgba(0,0,0,.55);
        }
        .coin-intro-face.back {
          transform: rotateY(180deg);
          filter: brightness(.78) contrast(1.12);
        }
        .coin-intro-rim {
          position: absolute; inset: -3px;
          border-radius: 9999px;
          border: 1px solid rgba(16,185,129,.22);
          box-shadow: 0 0 40px rgba(16,185,129,.25), inset 0 0 20px rgba(16,185,129,.08);
          pointer-events: none;
        }
        .coin-intro-sheen {
          position: absolute; inset: -2px;
          border-radius: 9999px;
          background:
            conic-gradient(from 200deg,
              rgba(255,255,255,0) 0deg,
              rgba(255,255,255,.0) 70deg,
              rgba(255,255,255,.55) 90deg,
              rgba(16,185,129,.35) 110deg,
              rgba(255,255,255,0) 140deg,
              rgba(255,255,255,0) 360deg);
          mix-blend-mode: screen;
          pointer-events: none;
          animation: sheenSpin 1.4s linear infinite;
        }
        @keyframes sheenSpin {
          0%   { transform: rotate(0deg); opacity: .85; }
          50%  { opacity: 1; }
          100% { transform: rotate(360deg); opacity: .85; }
        }
      `}</style>
    </div>
  );
}

// MATRIX RAIN — falling 0s and 1s in emerald, behind the coin
function MatrixRain({ active }) {
  const canvasRef = useStateI ? React.useRef(null) : null;
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, drops, fontSize, cols, w, h, dpr;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = Math.max(14, Math.round(w / 90));
      cols = Math.ceil(w / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * (h / fontSize));
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      // semi-transparent black to fade trails
      ctx.fillStyle = 'rgba(0,0,0,0.10)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px var(--font-mono, "Geist Mono", monospace)`;
      ctx.textBaseline = 'top';

      for (let i = 0; i < cols; i++) {
        const ch = Math.random() > 0.5 ? '1' : '0';
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // head — bright white-green
        ctx.fillStyle = 'rgba(220,255,235,0.95)';
        ctx.fillText(ch, x, y);

        // tail glow trail (a few above, dimmer)
        for (let k = 1; k < 6; k++) {
          const alpha = 0.55 * Math.pow(0.7, k);
          ctx.fillStyle = `rgba(16,185,129,${alpha})`;
          const ch2 = Math.random() > 0.5 ? '1' : '0';
          ctx.fillText(ch2, x, y - k * fontSize);
        }

        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.55 + Math.random() * 0.4;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0,
        zIndex: 0,
        opacity: active ? 0.55 : 0,
        transition: 'opacity 900ms cubic-bezier(.2,.7,.2,1)',
        // mask: fade out toward edges so coin reads as the focal point
        maskImage: 'radial-gradient(ellipse at 50% 50%, transparent 12%, black 35%, black 75%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, transparent 12%, black 35%, black 75%, transparent 100%)',
        pointerEvents: 'none',
      }}
    />
  );
}

function CornerTicks() {
  const tick = (pos) => (
    <div style={{ position: 'absolute', width: 28, height: 28, ...pos }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 1, background: 'rgba(16,185,129,.5)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 28, background: 'rgba(16,185,129,.5)' }} />
    </div>
  );
  const tickBR = (pos) => (
    <div style={{ position: 'absolute', width: 28, height: 28, ...pos }}>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 1, background: 'rgba(16,185,129,.5)' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 28, background: 'rgba(16,185,129,.5)' }} />
    </div>
  );
  return (
    <>
      {tick({ top: 40, left: 40 })}
      {tickBR({ top: 40, right: 40, transform: 'scaleX(-1)' })}
      {tickBR({ bottom: 40, left: 40, transform: 'scaleY(-1)' })}
      {tickBR({ bottom: 40, right: 40 })}
    </>
  );
}

Object.assign(window, { CoinIntro });
