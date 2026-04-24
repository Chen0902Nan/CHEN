/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        // 绘本岛品牌色彩
        primary: {
          50: '#FAF8F3', // 米白色 - 主背景
          100: '#F5F1E8', // 浅米色
          200: '#E8DCC0', // 米黄色
          300: '#D4C5A0', // 中米色
          400: '#C4B080', // 深米色
          500: '#B5A06A', // 主色调
          600: '#A68B5B', // 深色调
          700: '#8B7355', // 更深色调
          800: '#6B5D4F', // 深棕色
          900: '#4A4A4A', // 文字色
        },
        secondary: {
          50: '#FFF8DC', // 淡黄色 - 温暖感
          100: '#FFE4B5', // 浅黄色
          200: '#FFD700', // 金黄色
          300: '#FFA500', // 橙色
          400: '#FF8C00', // 深橙色
          500: '#FF7F50', // 珊瑚色
        },
        accent: {
          50: '#F0F8FF', // 天蓝色 - 童真
          100: '#E0F6FF', // 浅天蓝
          200: '#87CEEB', // 天蓝色
          300: '#5F9EA0', // 镉蓝色
          400: '#4682B4', // 钢蓝色
          500: '#1E90FF', // 道奇蓝
        },
        // 功能色彩
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Monaco', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
