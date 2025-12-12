import React, { createContext, useContext, useState, useCallback } from 'react';
import './Toast.css';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: Toast['type'], duration?: number) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
        const id = Date.now().toString();
        const toast: Toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`toast toast-${toast.type}`}
                        onClick={() => hideToast(toast.id)}
                    >
                        <span className="toast-icon">
                            {toast.type === 'success' && '✓'}
                            {toast.type === 'error' && '✕'}
                            {toast.type === 'warning' && '⚠'}
                            {toast.type === 'info' && 'ℹ'}
                        </span>
                        <span className="toast-message">{toast.message}</span>
                        <button className="toast-close" onClick={() => hideToast(toast.id)}>×</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
