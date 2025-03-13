import Link from "next/link";

export const ResourcesSection = () => {
  const resources = [
    { id: "docs-id", label: "Docs", url: "#" },
    { id: "start-building-id", label: "Start Building", url: "#" },
  ];

  return (
    <div>
      <h3 className="text-primary-foreground text-xl font-semibold mb-4">Resources</h3>
      <div className="flex flex-col space-y-2">
        {resources.map((resource) => {
          return (
            <Link
              key={resource.id}
              href={resource.url}
              className="text-primary-foreground text-lg hover:text-primary transition-colors"
            >
              {resource.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
