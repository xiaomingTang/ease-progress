import React, {
  useCallback, useEffect, useRef, useState,
} from "react"

interface AssetLoaderProps {
  index: number;
  onProgress: (e: ProgressEvent) => void;
}

export function PreText({ text }: { text: string }) {
  return <pre>{text}</pre>
}

export function AssetLoader({ index, onProgress }: AssetLoaderProps) {
  const [state, setState] = useState({
    loaded: 0,
    total: 0,
  })
  const loadedRef = useRef(0)
  const totalRef = useRef(Math.floor(Math.random() * 50000 + 10000))

  const updateState = useCallback(() => {
    if (loadedRef.current < totalRef.current) {
      loadedRef.current = Math.min(
        loadedRef.current + Math.floor(Math.random() * 3 + 1),
        totalRef.current,
      )
      const newState = {
        loaded: loadedRef.current,
        total: totalRef.current,
      }
      onProgress(newState as ProgressEvent)
      setState(newState)
      window.requestAnimationFrame(updateState)
    }
  }, [onProgress])

  useEffect(() => {
    setTimeout(() => {
      updateState()
    }, Math.random() * 10000)
  }, [updateState])

  return <div>
    <PreText text={`${index}: loaded ${state.loaded.toString().padStart(5, " ")}, total ${state.total.toString().padStart(5, " ")}`} />
  </div>
}
