"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const videos = [
  {
    id: 1,
    url: "/videos/demo-1.mp4",
    title: "Create Game Models",
  },
  {
    id: 2,
    url: "/videos/demo-2.mp4",
    title: "Generate Game Logic",
  },
];

export function ProductiveSection() {
  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Stay productive and build your own game
          </h2>
          <p className="mx-auto max-w-[700px] text-secondary md:text-xl">
            Lorem ipsum dolor sit ammet letarsha wut et mortem lortem vitae lid
            perplexit
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {videos.map((video, index) => (
              <Button
                key={video.id}
                variant="action"
                className={cn(
                  "min-w-[120px]",
                  activeVideo === index &&
                    "bg-yellow text-black hover:bg-yellow/90",
                )}
                onClick={() => setActiveVideo(index)}
              >
                Option {index + 1}
              </Button>
            ))}
          </div>

          <div className="w-full max-w-[800px] mt-8 rounded-lg overflow-hidden bg-white/5 aspect-video">
            <video
              key={videos[activeVideo].url}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
            >
              <source src={videos[activeVideo].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
