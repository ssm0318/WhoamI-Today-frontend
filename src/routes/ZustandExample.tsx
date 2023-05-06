import { useBoundStore } from '@stores/useBoundStore';

function Counter() {
  const { count, getCounterText, increase, decrease } = useBoundStore((state) => ({
    count: state.count,
    getCounterText: state.getCounterText,
    increase: state.increase,
    decrease: state.decrease,
  }));

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button type="button" onClick={increase}>
        +
      </button>
      <button type="button" onClick={decrease}>
        -
      </button>
      <div>{getCounterText()}</div>
    </div>
  );
}

export default Counter;
