import { useTheme } from "../contexts/ThemeContext";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Palette } from "lucide-react";

const allColors = [
  // Base
  "red", "green", "blue", "yellow", "purple",
  // Extra
  "slate", "gray", "zinc", "neutral", "stone",
  "orange", "amber", "lime", "emerald", "teal",
  "cyan", "sky", "indigo", "violet", "fuchsia",
  "pink", "rose"
];

const colorMap = {
  red: "bg-red-500", green: "bg-green-500", blue: "bg-blue-500", yellow: "bg-yellow-500", purple: "bg-purple-500",
  slate: "bg-slate-500", gray: "bg-gray-500", zinc: "bg-zinc-500", neutral: "bg-neutral-500", stone: "bg-stone-500",
  orange: "bg-orange-500", amber: "bg-amber-500", lime: "bg-lime-500", emerald: "bg-emerald-500", teal: "bg-teal-500",
  cyan: "bg-cyan-500", sky: "bg-sky-500", indigo: "bg-indigo-500", violet: "bg-violet-500", fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500", rose: "bg-rose-500",
};

const ThemeSwitcher = () => {
  const { primaryColor, setPrimaryColor } = useTheme();

  return (
    <div className="flex items-center">
      <Popover className="relative z-50">
        {({ open }) => (
          <>
            <PopoverButton
              className={`
                w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                ${open ? "bg-white text-black rotate-90" : "bg-white/10 text-white hover:bg-white/20"}
                focus:outline-none
              `}
            >
              <Palette className="w-5 h-5" />
            </PopoverButton>

            <PopoverPanel
              className="absolute right-0 top-full mt-4 w-64 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-4 grid grid-cols-5 gap-2 z-[100] origin-top-right backdrop-blur-xl ring-1 ring-black/5"
            >
              <div className="col-span-full mb-2 text-xs text-gray-400 font-medium uppercase tracking-wider text-center">
                Select Theme
              </div>
              {allColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className={`
                    w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none
                    ${colorMap[color]} 
                    ${primaryColor === color ? "ring-2 ring-white scale-110 shadow-lg" : "ring-1 ring-white/10 opacity-80 hover:opacity-100"}
                  `}
                  title={color}
                />
              ))}
            </PopoverPanel>
          </>
        )}
      </Popover>
    </div>
  );
};

export default ThemeSwitcher;
