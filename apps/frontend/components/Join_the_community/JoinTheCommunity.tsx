import { Button } from "@/components/ui/button";
import { Github, Send } from "lucide-react";
import { Testimonial } from "./TestimonialComponent";
import { testimonialGroups } from './opinions';


export default function JoinCommunity() {
  return (
    <div className="bg-background text-primary-foreground py-16 px-4 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="md: text-md sm:text-sm lg:text-4xl font-bold tracking-tighter text-primary-foreground mb-4">
            Join the community
          </h2>
          <p className="mx-auto max-w-[700px] text-secondary-foreground sm:text-sm md:text-md lg:text-lg">
            Lorem ipsum dolor sit ammet letarsha wut et mortem lortem vitae lid perplexit
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="action" className="bg-yellow text-black hover:bg-yellow/90">
              GitHub
              <div className="p-1.5 ml-2 flex items-center justify-center">
                <Github className="h-3.5 w-3.5 text-third-foreground" />
              </div>
            </Button>
            <Button variant="action" className="bg-yellow text-black hover:bg-yellow/90">
              Telegram
              <div className="p-1.5 ml-2 flex items-center justify-center">
                <Send className="h-3.5 w-3.5 text-third-foreground" />
              </div>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[900px] mx-auto ">
          {testimonialGroups.map((group) => (
            <div key={group[0].id} className="flex flex-col gap-6 ">
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

