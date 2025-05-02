import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function DatabaseDiagram() {
  // Define the initial table data
  const initialTables = [
    {
      id: 1,
      name: 'Beast',
      position: { x: 200, y: 180 },
      fields: [
        { name: 'beast_id', type: 'u64', key: true },
        { name: 'beast_attack', type: 'u32' },
        { name: 'beast_name', type: 'String' },
        { name: 'beast_attack', type: 'u32' },
        { name: 'beast_description', type: 'String' },
        { name: 'beast_anything', type: 'String' },
        { name: 'beast_attack', type: 'u32' },
      ]
    },
    {
      id: 2,
      name: 'Beast',
      position: { x: 500, y: 250 },
      fields: [
        { name: 'beast_id', type: 'u64', key: true },
        { name: 'beast_attack', type: 'u32' },
        { name: 'beast_name', type: 'String' },
        { name: 'beast_attack', type: 'u32' },
        { name: 'beast_description', type: 'String' },
        { name: 'beast_anything', type: 'String' },
        { name: 'beast_attack', type: 'u32' },
      ]
    },
    {
      id: 3,
      name: 'Beast',
      position: { x: 750, y: 180 },
      fields: [
        { name: 'beast_id', type: 'u64', key: true },
        { name: 'beast_attack', type: 'u32' },
        { name: 'beast_name', type: 'String' },
        { name: 'beast_description', type: 'String' },
        { name: 'beast_anything', type: 'String' },
        { name: 'beast_attack', type: 'u32' },
      ]
    },
    {
      id: 4,
      name: 'Beast',
      position: { x: 500, y: 450 },
      fields: [
        { name: 'beast_id', type: 'u64', key: true },
        { name: 'beast_attack', type: 'u32' },
        { name: 'beast_name', type: 'String' },
        { name: 'beast_description', type: 'String' },
        { name: 'beast_anything', type: 'String' },
        { name: 'beast_attack', type: 'u32' },
      ]
    },
    {
      id: 5,
      name: 'Beast',
      position: { x: 930, y: 400 },
      fields: [
        { name: 'beast_id', type: 'u64', key: true },
        { name: 'beast_attack', type: 'u32' },
        { name: 'beast_name', type: 'String' },
        { name: 'beast_description', type: 'String' },
        { name: 'beast_anything', type: 'String' },
        { name: 'beast_attack', type: 'u32' },
      ]
    }
  ];

  // Define relationships between tables
  const relationships = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
  ];

  // State for table positions
  const [tables, setTables] = useState(initialTables);
  const [activeTable, setActiveTable] = useState(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [highlightedTable, setHighlightedTable] = useState(null);
  const diagramRef = useRef(null);

  // Handler for starting drag
  const handleMouseDown = (e, tableId) => {
    e.preventDefault();
    
    setActiveTable(tableId);
    setStartPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handler for dragging
  const handleMouseMove = (e) => {
    if (activeTable === null) return;
    
    const dx = e.clientX - startPosition.x;
    const dy = e.clientY - startPosition.y;
    
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === activeTable
          ? {
              ...table,
              position: {
                x: table.position.x + dx,
                y: table.position.y + dy
              }
            }
          : table
      )
    );
    
    setStartPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handler for ending drag
  const handleMouseUp = () => {
    setActiveTable(null);
  };

  // Add mouse event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeTable, startPosition]);

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden p-4">
      <div className="absolute top-4 left-4 text-teal-400 text-xl font-medium">Table</div>
      
      {/* Diagram container */}
      <div 
        ref={diagramRef}
        className="relative w-full h-full"
      >
        {/* Relationship lines */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {relationships.map((rel, idx) => {
            const fromTable = tables.find(t => t.id === rel.from);
            const toTable = tables.find(t => t.id === rel.to);
            
            if (!fromTable || !toTable) return null;
            
            // Calculate center points of each table
            const fromX = fromTable.position.x + 120;
            const fromY = fromTable.position.y + 100;
            const toX = toTable.position.x + 120;
            const toY = toTable.position.y + 100;
            
            return (
              <line
                key={`rel-${idx}`}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
        
        {/* Tables */}
        {tables.map(table => (
          <div
            key={`table-${table.id}`}
            className={`absolute cursor-move border-2 ${table.id === 1 ? 'border-teal-500' : 'border-transparent'} bg-gray-800 w-60 rounded-md overflow-hidden shadow-lg`}
            style={{
              left: `${table.position.x}px`,
              top: `${table.position.y}px`,
              zIndex: activeTable === table.id ? 10 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, table.id)}
            onMouseEnter={() => setHighlightedTable(table.id)}
            onMouseLeave={() => setHighlightedTable(null)}
          >
            {/* Table header */}
            <div className="flex justify-between items-center px-3 py-2 bg-amber-500 text-black font-semibold">
              <div className="flex items-center gap-1">
                <span className="text-xs bg-amber-600 px-1 rounded">🗃️</span>
                <span>{table.name}</span>
              </div>
              <ArrowUpRight size={16} />
            </div>
            
            {/* Table fields */}
            <div className="px-2 py-1">
              {table.fields.map((field, idx) => (
                <div key={`${table.id}-field-${idx}`} className="flex justify-between items-center py-1 px-1 text-sm">
                  <div className="flex items-center gap-2">
                    {field.key ? (
                      <span className="text-amber-500">🔑</span>
                    ) : field.name.includes('description') || field.name.includes('name') || field.name.includes('anything') ? (
                      <span className="text-gray-400">🔤</span>
                    ) : (
                      <span className="text-amber-500">🔢</span>
                    )}
                    <span className="text-gray-300">{field.name}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{field.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}