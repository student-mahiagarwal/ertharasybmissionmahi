import { Link, useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from '../config/axios.js';
import { useUser } from '../context/UserContext.jsx';

function getAuthError(error) {
    const data = error.response?.data;

    if (data?.error) {
        return data.error;
    }

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
        return data.errors.map(nextError => nextError.msg).join(', ');
    }

    if (error.code === 'ERR_NETWORK') {
        return 'Backend is not reachable. Check VITE_API_URL and make sure the API server is running.';
    }

    return error.message || 'Authentication failed';
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [typedText, setTypedText] = useState('');
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const fullText = "Initializing AI system... Ready to authenticate.";

    const { setUser } = useUser();
    const navigate = useNavigate();

    // 🤖 typing effect
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    // 🧲 tilt effect
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setTilt({
            x: -(y - centerY) / 25,
            y: (x - centerX) / 25
        });
    };

    const resetTilt = () => setTilt({ x: 0, y: 0 });

    async function submitHandler(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            setError(getAuthError(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-black text-emerald-300 relative overflow-hidden font-mono">

            {/* 🔥 GRID */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#00ffcc22_1px,transparent_1px),linear-gradient(90deg,#00ffcc22_1px,transparent_1px)] bg-[size:40px_40px] animate-grid"></div>

            {/* 🔥 PARTICLES */}
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-particle"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                />
            ))}

            {/* 🔍 SCANLINE */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-[2px] bg-emerald-400/40 animate-scanline"></div>
            </div>

            {/* LEFT */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center px-16">
                <h1 className="text-4xl font-bold mb-4 glitch">
                    CollabServe AI
                </h1>

                <p className="text-gray-400 mb-6">
                    {typedText}
                    <span className="animate-pulse">|</span>
                </p>

                <div className="space-y-2 text-gray-500">
                    <p> Realtime processing enabled</p>
                    <p> AI modules active</p>
                    <p> Execution engine ready</p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex w-full lg:w-1/2 items-center justify-center px-6">

                <div className="perspective-[1000px]">

                    <div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={resetTilt}
                        style={{
                            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                            boxShadow: `${tilt.y * 2}px ${tilt.x * 2}px 40px rgba(16,185,129,0.25)`
                        }}
                        className="w-full max-w-md rounded-xl border border-emerald-500/20 bg-black/70 p-8 backdrop-blur transition-transform duration-200"
                    >

                        {/* HEADER */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-md bg-emerald-500 text-black">
                                <Code2 size={22} />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold">SYSTEM LOGIN</h1>
                                <p className="text-sm text-gray-500">Enter credentials</p>
                            </div>
                        </div>

                        {/* FORM */}
                        <form onSubmit={submitHandler} className="space-y-4">

                            <div>
                                <label className="text-sm text-gray-500">EMAIL</label>
                                <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="user@system.ai"
                                    className="mt-1 w-full rounded-md border border-emerald-500/20 bg-black px-3 py-2 text-emerald-300 outline-none focus:border-emerald-400 focus:shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">PASSWORD</label>
                                <input
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    type="password"
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="mt-1 w-full rounded-md border border-emerald-500/20 bg-black px-3 py-2 text-emerald-300 outline-none focus:border-emerald-400 focus:shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-md bg-emerald-500 py-2 text-black font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.7)] transition"
                            >
                                {loading ? 'Authenticating...' : 'ACCESS SYSTEM'}
                            </button>

                        </form>

                        <p className="mt-5 text-center text-sm text-gray-500">
                            New user?{" "}
                            <Link to="/register" className="text-emerald-400 hover:underline">
                                Initialize account
                            </Link>
                        </p>

                    </div>
                </div>
            </div>

            {/* STYLES */}
            <style>{`
                .glitch {
                  position: relative;
                }
                .glitch::before,
                .glitch::after {
                  content: "CollabServe AI";
                  position: absolute;
                  left: 0;
                }
                .glitch::before {
                  color: #00ffcc;
                  animation: glitchTop 1s infinite;
                }
                .glitch::after {
                  color: #ff00ff;
                  animation: glitchBottom 1.2s infinite;
                }

                @keyframes glitchTop {
                  0% { transform: translate(0); }
                  20% { transform: translate(-2px, -2px); }
                  100% { transform: translate(0); }
                }

                @keyframes glitchBottom {
                  0% { transform: translate(0); }
                  20% { transform: translate(2px, 2px); }
                  100% { transform: translate(0); }
                }

                @keyframes scanline {
                  0% { transform: translateY(-100%); }
                  100% { transform: translateY(100vh); }
                }
                .animate-scanline {
                  animation: scanline 6s linear infinite;
                }

                @keyframes gridMove {
                  0% { transform: translate(0,0); }
                  100% { transform: translate(40px,40px); }
                }
                .animate-grid {
                  animation: gridMove 12s linear infinite;
                }

                @keyframes particle {
                  0% { transform: translateY(0); opacity: 0; }
                  50% { opacity: 1; }
                  100% { transform: translateY(-200px); opacity: 0; }
                }
                .animate-particle {
                  animation: particle 6s linear infinite;
                }
            `}</style>

        </div>
    );
}
