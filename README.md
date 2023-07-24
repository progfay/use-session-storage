## `useSessionStorage(key)` hooks

__⚠️ This code has not yet been published in npm registry.__

```tsx
import {
  setSessionStorageItem,
  useSessionStorage,
} from '@progfay/use-session-storage'

const KEY = 'RANDOM_VALUE'

const ComponentA = () => (
  <button onClick={() => setSessionStorageItem(Math.random().toFixed(10))}>
    Set random value for sessionStorage
  </button>
)

const ComponentB = () => {
  const randomValue = useSessionStorage(KEY)
  return (
    <p>
      random value in sessionStorage: {randomValue}
    </p>
  )
}

const App = () => (
  <>
    <ComponentA />
    <ComponentB />
  </>
)
```
