import Image from "next/image";
import Link from "next/link";

export const LogoSection = () => {
  return (
    <div>
      <Link href="/" className="inline-block mb-4">
        <Image
          src="/Primary Logo_Primary Color.svg"
          alt="Tatami Logo"
          width={0}
          height={0}
          className="h-20 w-auto"
        />
      </Link>
      <p className="block text-white text-lg transition-colors">
        Conquer the Dojo
      </p>
    </div>
  );
};
