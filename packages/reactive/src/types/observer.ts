type ObserverFn<TValue> = (value: TValue) => void;

type ObserverObj<TValue> = {
  next: (value: TValue) => void;
  error?: (error: Error) => void;
  done?: () => void;
};

export type Observer<TValue> = ObserverFn<TValue> | ObserverObj<TValue>;
