"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { videos } from './videos';

const Productive = () => {
  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="md:text-md font-bold tracking-tighter sm:text-4xl xl:text-4xl">
            Stay productive and build your own game
          </h2>
          <p className="mx-auto text-secondary-foreground lg:text-lg">
            Lorem ipsum dolor sit ammet letarsha wut et mortem lortem vitae lid
            perplexit
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {videos.map((video, index) => (
              <Button
                key={video.id}
                variant="action"
                className={cn(
                  "min-w-[120px] bg-primary-200 text-primary-foreground hover:bg-primary-200/90",
                  activeVideo === index &&
                    "bg-yellow text-black hover:bg-yellow/90",
                )}
                onClick={() => setActiveVideo(index)}
              >
                {video.type}
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
};

export default Productive;
