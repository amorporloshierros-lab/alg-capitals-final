// Simulated live data streams: equity, ticks, challenges

const { useState: useStateSim, useEffect: useEffectSim, useRef: useRefSim, useMemo: useMemoSim } = React;

// ---------- useLiveTicks: symbols with drifting prices ----------
function useLiveTicks() {
  const [ticks, setTicks] = useStateSim(() => ([
    { symbol: 'XAU/USD', price: 2318.45, delta: 0.42, bias: 'BULL' },
    { symbol: 'EUR/USD', price: 1.0832, delta: -0.18, bias: 'BEAR' },
    { symbol: 'GBP/JPY', price: 195.22, delta: 0.88, bias: 'BULL' },
    { symbol: 'US30',    price: 39412.5, delta: 0.35, bias: 'BULL' },
    { symbol: 'NAS100',  price: 18241.7, delta: 1.12, bias: 'BULL' },
    { symbol: 'BTC/USD', price: 67420.1, delta: -0.62, bias: 'NEUTRAL' },
    { symbol: 'ETH/USD', price: 3512.8,  delta: 0.24, bias: 'BULL' },
    { symbol: 'USOIL',   price: 82.14,   delta: -0.44, bias: 'BEAR' },
    { symbol: 'DXY',     price: 104.28,  delta: 0.09, bias: 'NEUTRAL' },
  ]));
  useEffectSim(() => {
    const t = setInterval(() => {
      setTicks(prev => prev.map(t => {
        const vol = t.price * 0.0008;
        const np = t.price + (Math.random() - 0.5) * vol * 2;
        const nd = t.delta + (Math.random() - 0.5) * 0.08;
        return { ...t, price: np, delta: nd };
      }));
    }, 1800);
    return () => clearInterval(t);
  }, []);
  return ticks;
}

// ---------- useEquityCurve: simulated equity ----------
function useEquityCurve(seed = 10000, points = 120) {
  const [data, setData] = useStateSim(() => {
    const arr = [seed];
    for (let i = 1; i < points; i++) {
      const drift = 20 + Math.random() * 30; // positive bias
      const vol = (Math.random() - 0.3) * 80;
      arr.push(Math.max(seed * 0.9, arr[i-1] + drift + vol));
    }
    return arr;
  });
  useEffectSim(() => {
    const t = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const next = Math.max(seed * 0.9, last + (Math.random() - 0.35) * 60);
        return [...prev.slice(1), next];
      });
    }, 2200);
    return () => clearInterval(t);
  }, [seed]);
  return data;
}

// ---------- useChallengeProgress: FTMO/Alpha/FundedNext ----------
function useChallengeProgress() {
  const [state, setState] = useStateSim([
    {
      firm: 'FTMO',        logo: '../../assets/ftmo.png',
      account: '250K',     stage: 'Stage 2',
      target: 5,           current: 3.82,     drawdown: 1.2,
      maxDd: 10,           dailyDd: 5,         daysLeft: 14,
      status: 'live',      trades: 47,  winrate: 62
    },
    {
      firm: 'Alpha Capital', logo: '../../assets/alpha.png',
      account: '100K',       stage: 'Stage 1',
      target: 8,             current: 7.41,    drawdown: 2.4,
      maxDd: 8,              dailyDd: 4,       daysLeft: 6,
      status: 'live',        trades: 32, winrate: 71
    },
    {
      firm: 'FundedNext',  logo: '../../assets/fundednext.png',
      account: '200K',     stage: 'Funded',
      target: 0,           current: 4.52,     drawdown: 0.8,
      maxDd: 6,            dailyDd: 3,         daysLeft: null,
      status: 'funded',    trades: 18,  winrate: 77
    },
  ]);
  useEffectSim(() => {
    const t = setInterval(() => {
      setState(prev => prev.map(c => ({
        ...c,
        current: c.current + (Math.random() - 0.3) * 0.05,
        drawdown: Math.max(0.2, c.drawdown + (Math.random() - 0.5) * 0.1),
      })));
    }, 2500);
    return () => clearInterval(t);
  }, []);
  return state;
}

// ---------- useTrades: recent trade journal ----------
const INITIAL_TRADES = [
  { id: 1, time: '14:22', symbol: 'XAU/USD', side: 'LONG',  pips: 142, rr: 3.2, result: 'win',  note: 'OB M15 + liquidity sweep' },
  { id: 2, time: '11:48', symbol: 'NAS100',  side: 'SHORT', pips: 84,  rr: 2.1, result: 'win',  note: 'FVG rechazo NY open' },
  { id: 3, time: '09:14', symbol: 'EUR/USD', side: 'SHORT', pips: -18, rr: 1.5, result: 'loss', note: 'CHoCH falso, SL ajustado' },
  { id: 4, time: '08:02', symbol: 'GBP/JPY', side: 'LONG',  pips: 68,  rr: 2.4, result: 'win',  note: 'Asia range breakout' },
  { id: 5, time: 'Ayer', symbol: 'US30',     side: 'LONG',  pips: 112, rr: 2.8, result: 'win',  note: 'SMT + premium entry' },
  { id: 6, time: 'Ayer', symbol: 'BTC/USD',  side: 'SHORT', pips: 0,   rr: 0,   result: 'be',   note: 'Partial + BE runner' },
  { id: 7, time: '-2d', symbol: 'XAU/USD',   side: 'LONG',  pips: 201, rr: 4.1, result: 'win',  note: 'Discount + killzone LDN' },
  { id: 8, time: '-2d', symbol: 'USOIL',     side: 'SHORT', pips: -22, rr: 1.2, result: 'loss', note: 'Fundamental adverso' },
];

function useTrades() {
  const [trades, setTrades] = useStateSim(INITIAL_TRADES);
  useEffectSim(() => {
    const t = setInterval(() => {
      // occasionally insert new trade at top
      if (Math.random() > 0.7) {
        const symbols = ['XAU/USD', 'NAS100', 'US30', 'EUR/USD', 'GBP/JPY'];
        const notes = ['OB + liquidity grab', 'FVG mitigation', 'SMT divergence', 'Turtle Soup', 'Daily bias follow-through'];
        const side = Math.random() > 0.5 ? 'LONG' : 'SHORT';
        const win = Math.random() > 0.35;
        const pips = win ? Math.round(60 + Math.random() * 160) : -Math.round(15 + Math.random() * 25);
        setTrades(prev => [{
          id: Date.now(),
          time: 'Ahora', symbol: symbols[Math.floor(Math.random() * symbols.length)],
          side, pips, rr: +(1 + Math.random() * 3).toFixed(1),
          result: win ? 'win' : 'loss',
          note: notes[Math.floor(Math.random() * notes.length)],
        }, ...prev].slice(0, 10));
      }
    }, 6000);
    return () => clearInterval(t);
  }, []);
  return trades;
}

Object.assign(window, { useLiveTicks, useEquityCurve, useChallengeProgress, useTrades });
