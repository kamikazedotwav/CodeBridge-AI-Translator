import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

const LANGUAGES = [
  { value: 'Java',       label: 'Java',       color: '#f89820' },
  { value: 'Python',     label: 'Python',     color: '#3776ab' },
  { value: 'JavaScript', label: 'JavaScript', color: '#f7df1e' },
  { value: 'TypeScript', label: 'TypeScript', color: '#3178c6' },
  { value: 'C++',        label: 'C++',        color: '#00599c' },
  { value: 'C#',         label: 'C#',         color: '#9b4f96' },
  { value: 'Go',         label: 'Go',         color: '#00acd7' },
  { value: 'Rust',       label: 'Rust',       color: '#ce422b' },
  { value: 'Ruby',       label: 'Ruby',       color: '#cc342d' },
  { value: 'Swift',      label: 'Swift',      color: '#fa7343' },
  { value: 'Kotlin',     label: 'Kotlin',     color: '#7f52ff' },
  { value: 'PHP',        label: 'PHP',        color: '#8892be' },
];

function getLangColor(value) {
  return LANGUAGES.find(l => l.value === value)?.color || '#888';
}

function LangDropdown({ value, onChange, exclude, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = LANGUAGES.find(l => l.value === value);

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div className="lang-dropdown-wrap" ref={ref}>
      <div className="lang-label-tag">{label}</div>
      <button
        className={'lang-btn' + (open ? ' open' : '')}
        onClick={() => setOpen(o => !o)}
        type="button"
        style={{ '--lang-color': getLangColor(value) }}
      >
        <span className="lang-swatch" style={{ background: getLangColor(value) }}></span>
        <span className="lang-btn-name">{selected?.label}</span>
        <svg className="lang-btn-chevron" viewBox="0 0 10 6" width="10" height="6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div className="lang-menu">
          {LANGUAGES.filter(l => l.value !== exclude).map(lang => (
            <button
              key={lang.value}
              className={'lang-option' + (lang.value === value ? ' selected' : '')}
              onClick={() => { onChange(lang.value); setOpen(false); }}
              type="button"
            >
              <span className="lang-swatch" style={{ background: lang.color }}></span>
              <span>{lang.label}</span>
              {lang.value === value && (
                <svg className="lang-check" viewBox="0 0 12 10" width="12" fill="none">
                  <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CopyBtn({ text }) {
  const [state, setState] = useState('idle');
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    });
  };
  return (
    <button className={'copy-btn' + (state === 'copied' ? ' copied' : '')} onClick={copy} type="button">
      {state === 'copied' ? (
        <><svg viewBox="0 0 14 11" width="13" fill="none"><path d="M1 5.5l4 4L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>Copied!</>
      ) : (
        <><svg viewBox="0 0 14 14" width="13" fill="none"><rect x="4" y="4" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 10H1.5A1.5 1.5 0 0 1 0 8.5v-7A1.5 1.5 0 0 1 1.5 0h7A1.5 1.5 0 0 1 10 1.5V2" stroke="currentColor" strokeWidth="1.5"/></svg>Copy</>
      )}
    </button>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.35 + 0.05,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120,180,255,' + p.a + ')';
        ctx.fill();
      });
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(100,160,255,' + (0.07 * (1 - dist / 130)) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" />;
}

export default function App() {
  const [sourceCode, setSourceCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [fromLang, setFromLang] = useState('Java');
  const [toLang, setToLang] = useState('Python');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const lineNums = Math.max(sourceCode.split('\n').length, 1);
  const outLineNums = translatedCode ? translatedCode.split('\n').length : 0;

  const handleSwap = useCallback(() => {
    setFromLang(toLang);
    setToLang(fromLang);
    setSourceCode(translatedCode);
    setTranslatedCode('');
    setError('');
  }, [fromLang, toLang, translatedCode]);

  const handleTranslate = async () => {
    if (!sourceCode.trim()) return;
    setIsLoading(true);
    setTranslatedCode('');
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceCode, fromLang, toLang }),
      });
      const data = await response.json();
      if (response.ok) {
        setTranslatedCode(data.translatedCode);
      } else {
        setError(data.error || 'Translation failed.');
      }
    } catch {
      setError('Could not reach the server. Make sure the backend is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <ParticleCanvas />

      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">
              <img src="/favicon.png" alt="CodeBridge Logo" width="32" height="32" style={{ borderRadius: '8px' }} />
            </div>
            <div className="logo-text">
              <span className="logo-name">CodeBridge</span>
              <span className="logo-sub">AI Translator</span>
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <p className="hero-eyebrow">✦ AI-Powered Code Translation ✦</p>
        <h1 className="hero-title">
          Translate Code<br/>
          <span className="hero-gradient">Across Any Language</span>
        </h1>
        <p className="hero-sub">Paste your code, pick a target language, and let AI handle the rest.</p>
      </section>

      <main className="translator">
        <div className="controls-row">
          <LangDropdown value={fromLang} onChange={setFromLang} exclude={toLang} label="FROM" />
          <button className="swap-btn" onClick={handleSwap} type="button" title="Swap languages">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
              <path d="M6 14V4M6 4L3 7M6 4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 6v10m0 0l3-3m-3 3l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <LangDropdown value={toLang} onChange={setToLang} exclude={fromLang} label="TO" />
          <button
            className={'translate-btn' + (isLoading ? ' loading' : '')}
            onClick={handleTranslate}
            disabled={isLoading || !sourceCode.trim()}
            type="button"
          >
            {isLoading ? (
              <><span className="btn-spinner"/><span>Translating…</span></>
            ) : (
              <><svg viewBox="0 0 20 20" width="16" height="16" fill="none"><path d="M10.5 2L3 11h7l-.5 7 7.5-9H10l.5-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Translate</span></>
            )}
          </button>
        </div>

        <div className="panels">
          <div className="panel" style={{ '--acol': getLangColor(fromLang) }}>
            <div className="panel-header">
              <div className="panel-header-left">
                <span className="panel-dot" style={{ background: getLangColor(fromLang) }}></span>
                <span className="panel-title">{fromLang}</span>
                <span className="panel-badge">Source</span>
              </div>
              <div className="panel-header-right">
                {sourceCode && <span className="line-count">{lineNums} {lineNums === 1 ? 'line' : 'lines'}</span>}
                {sourceCode && <CopyBtn text={sourceCode} />}
                {sourceCode && (
                  <button className="clear-btn" onClick={() => { setSourceCode(''); setTranslatedCode(''); setError(''); }} type="button">Clear</button>
                )}
              </div>
            </div>
            <div className="code-wrap">
              <div className="line-nums" aria-hidden="true">
                {Array.from({ length: lineNums }, (_, i) => <span key={i}>{i + 1}</span>)}
              </div>
              <textarea
                className="code-input"
                value={sourceCode}
                onChange={e => setSourceCode(e.target.value)}
                onScroll={e => {
                  const ln = e.currentTarget.previousSibling;
                  if (ln) ln.scrollTop = e.currentTarget.scrollTop;
                }}
                placeholder={'Paste your ' + fromLang + ' code here…'}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>

          <div className="panel-arrow" aria-hidden="true">
            <div className={'arrow-wrap' + (isLoading ? ' pulsing' : '')}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="panel" style={{ '--acol': getLangColor(toLang) }}>
            <div className="panel-header">
              <div className="panel-header-left">
                <span className="panel-dot" style={{ background: getLangColor(toLang) }}></span>
                <span className="panel-title">{toLang}</span>
                <span className="panel-badge panel-badge-green">Output</span>
              </div>
              <div className="panel-header-right">
                {translatedCode && <CopyBtn text={translatedCode} />}
              </div>
            </div>
            <div className="code-wrap output-wrap">
              {isLoading && (
                <div className="out-state">
                  <div className="loading-bars"><span/><span/><span/><span/><span/></div>
                  <p>Translating with AI…</p>
                </div>
              )}
              {error && !isLoading && (
                <div className="out-state out-error">
                  <svg viewBox="0 0 20 20" width="22" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="#f87171" strokeWidth="1.5"/>
                    <path d="M10 6v5M10 14v.5" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p>{error}</p>
                </div>
              )}
              {!translatedCode && !isLoading && !error && (
                <div className="out-state out-empty">
                  <svg viewBox="0 0 48 48" width="38" height="38" fill="none">
                    <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <path d="M18 24h12M24 18v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <p>Translation will appear here</p>
                  <span>Select languages and click <b>Translate</b></span>
                </div>
              )}
              {translatedCode && !isLoading && (
                <div className="out-code-wrap">
                  <div className="line-nums" aria-hidden="true">
                    {Array.from({ length: outLineNums }, (_, i) => <span key={i}>{i + 1}</span>)}
                  </div>
                  <pre className="code-output"><code>{translatedCode}</code></pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <section className="features">
        {[
          { icon: '⚡', title: 'Instant Translation', desc: 'Sub-second results powered by Gemini Flash' },
          { icon: '🎯', title: 'Logic-Preserving', desc: 'Structure, naming and intent stay intact' },
          { icon: '🌐', title: '12 Languages', desc: 'Java, Python, Rust, Go, Swift and more' },
          { icon: '🔒', title: 'Zero Storage', desc: 'Your code is never saved or logged' },
        ].map(f => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      <footer className="footer">
        <span>CodeBridge — Built with React, Vite &amp; Gemini AI</span>
        <span className="footer-dot">·</span>
        <span>© 2025</span>
      </footer>
    </div>
  );
}