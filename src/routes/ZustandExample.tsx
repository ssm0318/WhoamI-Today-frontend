import { BoundState, useBoundStore } from '@stores/useBoundStore';

const countSelector = (state: BoundState) => ({
  count: state.count,
  getCounterText: state.getCounterText,
  increase: state.increase,
  decrease: state.decrease,
});

function Counter() {
  const { count, getCounterText, increase, decrease } = useBoundStore(countSelector);

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
