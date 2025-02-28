import { Button } from "@/components/ui/button";
import AvatarImag from "@/public/avatar_joinCommunity.png";
import { Github, Send } from "lucide-react";
import { Testimonial } from "./TestimonialComponent";

const testimonialGroups = [
  [
    { id: 1, content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", author: "@drew_tex", avatar: AvatarImag.src, className: "h-[150px] lg:h-[200px]" },
    { id: 2, content: "Good tool!", author: "@drew_tex", avatar: AvatarImag.src, className: "h-[120px]" },
  ],
  [
    { id: 3, content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", author: "@drew_tex", avatar: AvatarImag.src, className: "h-full" },
  ],
  [
    { id: 4, content: "Good tool!", author: "@drew_tex", avatar: AvatarImag.src, className: "h-[120px]" },
    { id: 5, content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", author: "@drew_tex", avatar: AvatarImag.src, className: "h-[150px] lg:h-[200px]" },
  ],
];

export default function JoinCommunity() {
  return (
    <div className="text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4">
            Join the community
          </h2>
          <p className="mx-auto max-w-[700px] text-secondary md:text-xl">
            Lorem ipsum dolor sit ammet letarsha wut et mortem lortem vitae lid perplexit
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="action" className="bg-yellow text-black hover:bg-yellow/90">
              GitHub
              <div className="bg-black rounded-full p-1.5 ml-2 flex items-center justify-center">
                <Github className="h-3.5 w-3.5 text-yellow" />
              </div>
            </Button>
            <Button variant="action" className="bg-yellow text-black hover:bg-yellow/90">
              Telegram
              <div className="bg-black rounded-full p-1.5 ml-2 flex items-center justify-center">
                <Send className="h-3.5 w-3.5 text-yellow" />
              </div>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          {testimonialGroups.map((group) => (
            <div key={group[0].id} className="flex flex-col gap-6">
              {group.map((testimonial) => (
                <Testimonial key={testimonial.id} {...testimonial} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

