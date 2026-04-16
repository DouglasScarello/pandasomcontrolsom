import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Plus, Minus, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const isElectron = typeof window !== 'undefined' && window.electron !== undefined;

function App() {
    const [volume, setVolume] = useState(0);
    const [muted, setMuted] = useState(false);

    const fetchStatus = async () => {
        if (!isElectron) return;
        try {
            const data = await window.electron.getStatus();
            setVolume(data.volume || 0);
            setMuted(data.muted || false);
        } catch (err) {
            console.error("Erro ao obter status do Panda", err);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (action) => {
        if (!isElectron) return;
        if (action === 'up') window.electron.volumeUp();
        if (action === 'down') window.electron.volumeDown();
        if (action === 'mute') window.electron.toggleMute();

        // Pequeno delay para permitir o processamento do comando
        setTimeout(fetchStatus, 50);
    };

    return (
        <div className="glass-card">
            <div className="status-badge">CONECTADO</div>
            <h1>Panda Audio</h1>

            <div className="panda-container">
                <div className="ears">
                    <motion.div
                        className="ear"
                        animate={{ scale: 1 + volume / 200 }}
                        style={{ backgroundColor: muted ? '#334155' : '#000' }}
                    />
                    <motion.div
                        className="ear"
                        animate={{ scale: 1 + volume / 200 }}
                        style={{ backgroundColor: muted ? '#334155' : '#000' }}
                    />
                </div>

                <div className="panda-face">
                    <div className="eye"></div>
                    <div className="eye"></div>
                </div>

                <svg className="volume-ring" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                    />
                    <motion.circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="var(--panda-green)"
                        strokeWidth="4"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (283 * Math.min(volume, 150)) / 150 }}
                        strokeLinecap="round"
                        style={{
                            filter: volume > 100 ? 'drop-shadow(0 0 8px #ff4444)' : 'drop-shadow(0 0 5px var(--panda-green))',
                            stroke: volume > 100 ? '#ff4444' : 'var(--panda-green)'
                        }}
                    />
                </svg>
            </div>

            <div className="volume-text">
                {muted ? "MUDO" : `${volume}%`}
            </div>

            <div className="controls">
                <button onClick={() => handleAction('down')}>
                    <Minus size={24} />
                </button>
                <button onClick={() => handleAction('mute')} style={{ background: muted ? 'var(--panda-green)' : '' }}>
                    {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <button onClick={() => handleAction('up')}>
                    <Plus size={24} />
                </button>
            </div>

            <div className="footer-controls">
                <button className="icon-btn" onClick={() => window.electron.closeApp()}>
                    Fechar Aplicativo
                </button>
            </div>
        </div>
    );
}

export default App;
