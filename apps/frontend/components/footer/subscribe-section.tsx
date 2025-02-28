import { NewsletterForm } from "@/components/footer/newsletter-form";

export const SubscribeSection = () => {
  return (
    <div>
      <h3 className="text-primary text-xl font-semibold mb-4">
        Subscribe to news of Tatami
      </h3>
      <NewsletterForm />
    </div>
  );
};
