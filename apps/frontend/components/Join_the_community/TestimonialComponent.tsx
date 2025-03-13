import { Card } from "@/components/ui/card";
import x_icon from "@/public/x.png";
import Image from "next/image";

interface TestimonialProps {
    content: string;
    author: string;
    avatar: string;
    className?: string;
  }

export function Testimonial({
    content,
    author,
    avatar,
    className = "",
  }: TestimonialProps) {
    return (
      <Card
        className={`bg-background text-primary-foreground border-primary-700 p-4 flex flex-col w-full relative ${className}`}
      >
        <div className="relative flex items-center gap-2 mb-2">
          <div className="relative w-8 h-8">
            <Image
              src={avatar || "/placeholder.svg"}
              alt={`${author}'s avatar`}
              width={32}
              height={32}
              className="rounded-full"
            />
            <Image
              src={x_icon}
              alt="X Icon"
              width={12}
              height={12}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <span className="text-primary-foreground">{author}</span>
        </div>
        <p className="text-primary-foreground text-sm flex-grow">{content}</p>
      </Card>
    );
  }