import useCounterStore from '@stores/example';

function Counter() {
  // 1. 아무런 인자를 넘기지 않고 호출하면 스토어의 모든 값을 가져오므로 원치 않는 리렌더링 발생가능.
  // const { count, increase, decrease } = useCounterStoreBase();

  // 2. 컴포넌트에서 꼭 필요한 state만 가져올 수 있도록 selector function을 넘겨준다.
  const { count, getCounterText, increase, decrease } = useCounterStore((state) => ({
    count: state.count,
    getCounterText: state.getCounterText,
    increase: state.increase,
    decrease: state.decrease,
  }));

  // 3. 또는 custom selector 함수를 정의하여 이용한다.
  // const count = useCounterStore.use.count();
  // const increase = useCounterStore.use.increase();
  // const decrease = useCounterStore.use.decrease();

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
