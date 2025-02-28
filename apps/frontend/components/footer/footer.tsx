import { FooterBottom } from "./footer-bottom";
import { LogoSection } from "./logo-section";
import { ResourcesSection } from "./resources-section";
import { SocialSection } from "./social-section";
import { SubscribeSection } from "./subscribe-section";

export const Footer = () => {
  return (
    <footer className="bg-black text-white px-4 sm:px-6 py-8 sm:py-12 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <LogoSection />
          <ResourcesSection />
          <SocialSection />
          <SubscribeSection />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
};
