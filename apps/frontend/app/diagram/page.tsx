"use client";

import { EntityCard, type EntityField } from "@/components/diagram/EntityCard";

// Example data - this would typically come from your data source
const exampleEntities = [
  {
    title: "Player",
    fields: [
      { name: "beast_id", type: "u64", isPrimary: true },
      { name: "beast_attack", type: "u32" },
      { name: "beast_name", type: "string" },
      { name: "beast_atack", type: "u32" },
      { name: "beast_defense", type: "u32" },
      { name: "beast_description", type: "string" },
      { name: "beast_anything", type: "string" },
      { name: "beast_mana", type: "u32" },
      { name: "beast_gold", type: "u32" },
    ] as EntityField[],
  },
];

export default function DiagramPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Entity Diagram</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-10">
        <EntityCard title="Beast" fields={exampleEntities[0].fields} />
      </div>
    </main>
  );
}
