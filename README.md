# ease-progress
react progress 原始组件, 提供便捷的 progress 统计信息

### Install
```
yarn add ease-progress
```

### Usage
使用 ProgressProvider 包裹组件
``` javascript
import { ProgressProvider, RawProgressContext } from "ease-progress"

function App() {
  const { loaded, total, setProgressState } = useContext(RawProgressContext)

  return <>
    {
      LargeAssetList.map((url) => <SomeComponent
        key={url}
        onProgress={(e) => {
          setProgressState({
            [url]: {
              loaded: e.loaded,
              total: e.total,
            },
          })
        }}
      />)
    }

    <p>loaded: {loaded}</p>
    <p>total: {total}</p>
  </>
}

ReactDOM.render(
  <ProgressProvider>
    <App />
  </ProgressProvider>,
  document.querySelector("#app"),
)
```
