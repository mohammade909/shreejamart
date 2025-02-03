const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ['"Poppins"', "sans-serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      // fontSize: {
      //   xs: "0.625rem", // 10px (default 12px)
      //   sm: "0.75rem", // 12px (default 14px)
      //   base: "0.875rem", // 14px (default 16px)
      //   lg: "1rem", // 16px (default 18px)
      //   xl: "1.125rem", // 18px (default 20px)
      //   "2xl": "1.25rem", // 20px (default 24px)
      //   "3xl": "1.5rem", // 24px (default 30px)
      //   "4xl": "1.875rem", // 30px (default 36px)
      //   "5xl": "2.25rem", // 36px (default 48px)
      //   "6xl": "3rem", // 48px (default 64px)
      // },
      colors: {
        primary: "#4b5966", // Define primary color
        secondary: "#5caf90",
        base:'#f8f8fb',
        star: {
          DEFAULT: "#f27d0c", // Default star color
          70: "rgba(242, 125, 12, 0.7)", // 70% opacity version
        }, // Define secondary color
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          ".no-scrollbar::-webkit-scrollbar": {
            display: "none",
          },
          ".no-scrollbar": {
            "-ms-overflow-style": "none" /* IE and Edge */,
            "scrollbar-width": "none" /* Firefox */,
          },
        },
        ["responsive", "hover", "focus"]
      );
    },
  ],
});
