tailwind.config = {
    theme: {
        extend: {
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'blur-in': 'blurIn 0.8s ease-out forwards',
                'scale-in': 'scaleIn 0.8s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
                'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
                'slide-out-left': 'slideOutLeft 0.8s ease-out forwards',
                'marquee': 'marquee 25s linear infinite',
                'marquee-reverse': 'marquee-reverse 25s linear infinite',
                'typing': 'typing 4s steps(40, end) infinite',
                'blink': 'blink 1s infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                blurIn: {
                    '0%': { opacity: '0', filter: 'blur(8px)' },
                    '100%': { opacity: '1', filter: 'blur(0px)' }
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' }
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.2)' }
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-100%)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                slideOutLeft: {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(-100%)' }
                },
                letterReveal: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' }
                },
                'marquee-reverse': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0%)' }
                },
                typing: {
                    '0%': { width: '0' },
                    '100%': { width: '100%' }
                },
                blink: {
                    '0%, 50%': { opacity: '1' },
                    '51%, 100%': { opacity: '0' }
                }
            }
        }
    }
}