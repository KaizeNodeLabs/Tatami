"use client";

import Link from "next/link";
import { useTranslation } from 'react-i18next';

export const ResourcesSection = () => {
  const { t } = useTranslation();
  const resources = [
    { id: "docs-id", label: t('docs'), url: "#" },
    { id: "start-building-id", label: t('startBuilding'), url: "#" },
  ];

  return (
    <div>
      <h3 className="text-yellow text-xl font-semibold mb-4">{t('resources')}</h3>
      <div className="flex flex-col space-y-2">
        {resources.map((resource) => {
          return (
            <Link
              key={resource.id}
              href={resource.url}
              className="text-white text-lg hover:text-primary transition-colors"
            >
              {resource.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};