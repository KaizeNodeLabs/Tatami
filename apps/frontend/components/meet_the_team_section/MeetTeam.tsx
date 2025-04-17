"use client";

import React from 'react';
import Image from "next/image";
import { useTranslation } from 'react-i18next';

interface TeamMember {
  name: string;
  surname: string;
  role: string;
  image: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    telegram?: string;
  };
}

const TeamSection: React.FC = () => {
  const { t } = useTranslation();

  const teamMembers: TeamMember[] = [
    {
      name: 'DIEGO DUARTE',
      surname: 'FERNÁNDEZ',
      role: t('founder'),
      image: '/Diego.webp',
      socialLinks: {
        github: 'https://github.com/diegoTech14',
        twitter: 'https://x.com/gioDiego14',
        telegram: 'https://t.me/diegotech1499'
      }
    },
    {
      name: 'DANIEL',
      surname: 'CALDERON DIAZ',
      role: t('coFounder'),
      image: '/Daniel.webp',
      socialLinks: {
        github: 'https://github.com/danielcdz',
        twitter: 'https://twitter.com/danielcdz',
        telegram: 'https://t.me/danielcdz'
      }
    }
  ];

  return (
    <div className="w-full bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground text-center mb-12">
          {t('meetTheTatamisTeam')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-24 gap-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="relative">
              {/* Team member card */}
              <div className="relative ">
                {/* Avatar image */}
                <img 
                  src={member.image} 
                  alt={`${member.name} ${member.surname}`}
                  className="w-full rounded-lg lg:h-[57vh] h-[45vh] aspect-square object-cover"
                />
                
                {/* Logo overlay in top right */}
                <div className="absolute top-0 overflow-hidden lg:-right-5 right-0 bg-yellow p-1 w-8 h-10 lg:w-12 lg:h-14 flex items-center justify-center">
                  <Image
                      src='/Tatami-logo.png'
                      width={50}
                      height={50}
                      alt= 'Tatami logo'
                  />
                </div>
              </div>
              
              {/* Member info */}
              <div className="mt-4">
                <h3 className="text-primary-foreground font-bold lg:text-xl">{member.name}</h3>
                <h4 className="text-primary-yellow font-bold lg:text-xl">{member.surname}</h4>
                <p className="text-yellow font-bold border-b-2 border-yellow w-[40%] lg:w-[60%] pb-3 mt-2">{member.role}</p>
                
                {/* Social icons */}
                <div className="flex space-x-4 mt-4">
                  {member.socialLinks.github && (
                    <a href={member.socialLinks.github} className="text-primary-foreground hover:text-primary" aria-label="GitHub">
                      <svg
                        className="w8 h-8 hover:text-yellow"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>

                    </a>
                  )}
                  {member.socialLinks.twitter && (
                    <a href={member.socialLinks.twitter} className="text-primary-foreground hover:text-primary" aria-label="Twitter">
                      <svg
                        className="w-8 h-8 hover:text-yellow"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>

                    </a>
                  )}
                  {member.socialLinks.telegram && (
                    <a href={member.socialLinks.telegram} className="text-primary-foreground hover:text-primary" aria-label="Telegram">
                      <svg
                        className="w-8 h-8 hover:text-yellow"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.03-1.97 1.25-5.57 3.67-.53.36-1.01.54-1.44.53-.47-.01-1.38-.26-2.06-.48-.83-.27-1.49-.42-1.43-.89.03-.25.39-.51 1.08-.78 4.24-1.84 7.07-3.06 8.48-3.65 4.04-1.69 4.88-1.99 5.42-2 .12 0 .39.03.57.18.17.14.21.33.24.48.02.12.02.24.02.36z" />
                      </svg>

                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;