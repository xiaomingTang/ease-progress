import React, {
  ProviderProps, useMemo, useRef, useState,
} from "react"
import { throttle } from "throttle-debounce"

interface ProgressState {
  loaded: number;
  total: number;
}

/**
 * key 的作用是保留不同来源的 ProgressState
 *
 * 且使用者必须保证, 不同来源的 ProgressState(亦即不同的加载进度) key 也不同
 */
interface NamedProgressState {
  [key: string]: ProgressState;
}

type ProgressContext = ProgressState & {
  /**
   * 这个函数已经过节流处理(300 ms, 暂不支持自定义), 所以可以随意调用
   *
   * (可以在 onProgress 时调用而无须再次节流)
   */
  setProgressState(newValue: NamedProgressState): void;
}

const defaultProgressContext: ProgressContext = {
  loaded: 0,
  total: 0,
  setProgressState: () => {
    // pass
  },
}

/**
 * 使用时, 使用 ProgressProvider 包裹组件
 *
 * ``` js
 * import { ProgressProvider, RawProgressContext } from "path/to/Progress"
 *
 * function App() {
 *   const { loaded, total, setProgressState } = useContext(RawProgressContext)
 *
 *   return <>
 *     {
 *       LargeAssetList.map((url) => <SomeComponent
 *         key={url}
 *         onProgress={(e) => {
 *           setProgressState({
 *             [url]: {
 *               loaded: e.loaded,
 *               total: e.total,
 *             },
 *           })
 *         }}
 *       />)
 *     }
 *
 *     <p>loaded: {loaded}</p>
 *     <p>total: {total}</p>
 *   </>
 * }
 *
 * ReactDOM.render(
 *   <ProgressProvider>
 *     <App />
 *   </ProgressProvider>,
 *   document.querySelector("#app"),
 * )
 * ```
 */
export const RawProgressContext = React.createContext(defaultProgressContext)

function useProgressContext(): ProgressContext {
  const [rawValue, setRawValue] = useState<ProgressState>(defaultProgressContext)

  const namedValueRef = useRef<NamedProgressState>({})

  const updateRawValue = useMemo(() => throttle(300, () => {
    setRawValue((prev) => {
      let loaded = 0
      let total = 0
      Object.values(namedValueRef.current).forEach((item) => {
        loaded += item.loaded
        total += item.total
      })
      if (prev.loaded >= loaded && prev.total >= total) {
        return prev
      }
      return {
        loaded,
        total,
      }
    })
  }), [])

  const setValue: ProgressContext["setProgressState"] = useMemo(() => (newValue) => {
    namedValueRef.current = {
      ...namedValueRef.current || {},
      ...newValue,
    }
    updateRawValue()
  }, [updateRawValue])

  return {
    loaded: rawValue.loaded || 1,
    total: rawValue.total || 1,
    setProgressState: setValue,
  }
}

type ProgressProviderProps = Omit<ProviderProps<ProgressState>, "value">

export function ProgressProvider({
  // 这儿 props 实际上始终为空, 但以防 react 更新后为 ProviderProps 新增些什么属性, 所以就放这儿了
  children, ...props
}: ProgressProviderProps) {
  const value = useProgressContext()

  return <RawProgressContext.Provider value={value} {...props}>
    {children}
  </RawProgressContext.Provider>
}
