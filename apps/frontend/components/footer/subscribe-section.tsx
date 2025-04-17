"use client";

import { NewsletterForm } from "@/components/footer/newsletter-form";
import { useTranslation } from 'react-i18next';

export const SubscribeSection = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="text-yellow text-xl font-semibold mb-4">
        {t('subscribeToNewsOfTatami')}
      </h3>
      <NewsletterForm />
    </div>
  );
};