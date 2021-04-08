import { hot } from "react-hot-loader/root"
import React, { useCallback, useContext } from "react"

import "@Src/examples/global/global"

import { RawProgressContext, ProgressProvider } from "@Src/index"

import Styles from "./App.module.less"
import { PreText, AssetLoader } from "./AssetLoader"

const tempList = new Array(10).fill(0).map((_, i) => i)

export function Asset({ index }: { index: number }) {
  const { setProgressState } = useContext(RawProgressContext)

  const onProgress = useCallback((e: ProgressEvent) => {
    setProgressState({
      [`name of ${index}`]: {
        loaded: e.loaded,
        total: e.total,
      },
    })
  }, [index, setProgressState])

  return <AssetLoader index={index} onProgress={onProgress} />
}

function Demo() {
  const { loaded, total } = useContext(RawProgressContext)

  return <div>
    <div>子组件可能会在不同时间调用 setProgressState</div>
    <div>但 ProgressProvider 总是能提供正确的加载信息</div>
    <div>且自带 throttle, <strong>你只管调用, throttle 有我</strong></div>
    <div><PreText text={`总加载状况: loaded ${loaded.toString().padStart(5, " ")}, total ${total.toString().padStart(5, " ")}`} /></div>
    {tempList.map((_, i) => (<Asset key={i} index={i} />))}
  </div>
}

function App() {
  return <ProgressProvider>
    <Demo />
  </ProgressProvider>
}

export default hot(App)
