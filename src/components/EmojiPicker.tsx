import { useEffect, useRef, useState } from "react";

const EMOJIS = [
  "🧘", "💧", "🍎", "🚶", "☀️", "🌙", "🧠", "💊", "🫁", "☕",
  "📚", "💻", "👀", "🦷", "🧴", "🌱", "🏋️", "🛌", "🎯", "✨",
  "❤️", "🔥", "🎵", "🍵", "🥗", "🧊", "⏰", "📱", "🪥", "🧘‍♀️",
];

interface Props {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="emoji-picker" ref={ref}>
      <button
        type="button"
        className="emoji-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Elegir emoji"
      >
        {value || "✨"}
      </button>

      {open && (
        <div className="emoji-popover">
          <div className="emoji-grid">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                className={`emoji-item ${value === e ? "selected" : ""}`}
                onClick={() => {
                  onChange(e);
                  setOpen(false);
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}