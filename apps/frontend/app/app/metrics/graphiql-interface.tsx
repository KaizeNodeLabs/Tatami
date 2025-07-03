import { GraphiQL } from 'graphiql'
import { Fetcher } from '@graphiql/toolkit'
import 'graphiql/graphiql.min.css'
import { useState, useRef, useEffect } from 'react'
import { Minus, Plus, Maximize, Minimize } from 'lucide-react'

interface GraphiQLInterfaceProps {
  fetcher?: Fetcher | null
}

export function GraphiQLInterface({ fetcher }: GraphiQLInterfaceProps) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 15, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 15, 50))
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  if (!fetcher) {
    return (
      <div className="min-h-[600px] xl:h-full w-full border border-dashed border-gray-300 flex items-center justify-center rounded-md text-sm text-muted-foreground text-center px-4">
        ⚠️ No GraphQL endpoint connected. Please enter a valid endpoint above to start exploring the API.
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-[600px] xl:h-full w-full flex flex-col ${isFullScreen ? 'bg-white' : ''}`}
    >
      <div 
        className="flex-grow relative overflow-hidden"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
      >
        <GraphiQL fetcher={fetcher} defaultQuery="" />
      </div>
      
      <div className="flex items-center justify-end gap-4 p-2 pr-4 border-t border-gray-200 bg-transparent">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
            title="Zoom Out (15%)"
            disabled={zoomLevel <= 50}
          >
            <Minus size={16} className={zoomLevel <= 50 ? 'text-white/40' : 'text-white'} />
          </button>
          
          <span className="text-sm text-white min-w-[60px] text-center">{zoomLevel}%</span>
          
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
            title="Zoom In (15%)"
            disabled={zoomLevel >= 200}
          >
            <Plus size={16} className={zoomLevel >= 200 ? 'text-white/40' : 'text-white'} />
          </button>
        </div>
        
        <div className="h-6 border-l border-white/30"></div>
        
        <button
          onClick={toggleFullScreen}
          className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
          title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        >
          {isFullScreen ? (
            <Minimize size={16} className="text-white" />
          ) : (
            <Maximize size={16} className="text-white" />
          )}
        </button>
      </div>
    </div>
  )
}
