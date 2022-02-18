import { memo, useCallback, useMemo, useRef, useState } from "react"

type noop = (...args: any[]) => any

function useMemoizedFn<T extends noop>(fn:T) {
  if(process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error(`useMemoizedFn expected parameter is a function, got ${typeof fn}`)
    }
  }

  const fnRef = useRef<T>(fn)
  fnRef.current = useMemo(() => fn, [fn])
  const memoizedFn = useRef<T>()
  if(!memoizedFn.current) {
    memoizedFn.current = function(...args) {
      // @ts-ignore
      return fnRef.current.apply(this as any, args)
    } as T
  }
  return memoizedFn.current
}
const useMemoizedFnTest = () => {
  const [count, setCount] = useState(0);

  const callbackFn = useCallback(() => {
    alert(`Current count is ${count}`);
  }, [count]);

  const memoizedFn = useMemoizedFn(() => {
    alert(`Current count is ${count}`);
  });

  return (
    <>
      <p>count: {count}</p>
      <button
        type="button"
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </button>

      <p>You can click the button to see the number of sub-component renderings</p>

      <div style={{ marginTop: 32 }}>
        <h3>Component with useCallback function:</h3>
        {/* use callback function, ExpensiveTree component will re-render on state change */}
        <ExpensiveTree showCount={callbackFn} />
      </div>

      <div style={{ marginTop: 32 }}>
        <h3>Component with useMemoizedFn function:</h3>
        {/* use memoized function, ExpensiveTree component will only render once */}
        <ExpensiveTree showCount={memoizedFn} />
      </div>
    </>
  );
};

// some expensive component with React.memo
const ExpensiveTree = memo<{ [key: string]: any }>(({ showCount }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
      <button type="button" onClick={showCount}>
        showParentCount
      </button>
    </div>
  );
});
export default useMemoizedFn