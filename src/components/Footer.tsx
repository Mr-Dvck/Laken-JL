import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto max-w-6xl px-4 py-6 text-center">
        <p className="text-sm text-gray-400 flex items-center justify-center gap-1.5">
          Made with <Heart size={14} className="text-laken-400 fill-laken-400" /> for
          Laken · You&apos;re going to do great things! ✨
        </p>
      </div>
    </footer>
  );
}
