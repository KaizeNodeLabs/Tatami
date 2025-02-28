import Link from "next/link";

export const FooterBottom = () => {
  return (
    <div className="border-t border-white/40 pt-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
        <Link
          href="/privacy-policy"
          className="text-white text-lg hover:text-primary transition-colors"
        >
          Privacy Policy
        </Link>
        <span className="text-white/40">|</span>
        <Link
          href="/terms"
          className="text-white text-lg hover:text-primary transition-colors"
        >
          Terms of Service
        </Link>
      </div>
      <div className="text-white text-lg">
        <Link href="https://github.com/KaizeNodeLabs">
          2025 <span className="font-semibold">Kaizenode Labs</span>
        </Link>
      </div>
    </div>
  );
};
