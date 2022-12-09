---
title: Optional Generic Function Argument
seoTitle: TypeScript Optional Generic Function Argument
slug: learning-typescript-optional-generic-arguments
abstract: How to define a generic type argument for an optional function parameter
isPublished: true
publishedOn: 2022-11-30
---

While performing a code review for the awesome JavaScript money library [Dinero.js](https://github.com/dinerojs/dinero.js) maintained by [Sarah Dayan](https://github.com/sarahdayan), I was looking through the tests of a new format function and noticed the return was of type `unknown`.

An optional `transformer` parameter had recently been added to the format function. If provided, the transformer would convert the money object into any type.

## The Problem

```ts title="Simplified example of the original type declaration"
declare function toDecimal<TOutput>(dineroObject: Dinero, transformer?: (value: string) => TOutput);
```

The concept was for `TOutput` to be inferred by the transform function. The default argument to `transformer` is a function that returns a string representation of a decimal.

Note there is no explicit return type. Type inference in the function definition was relied on to provide the return type.

```ts title="Simplified example of the original function definition" showLineNumbers {1}
function toDecimal(dineroObject, transformer = (value) => value as TOutput) {
  const value: string = toDecimalFn(dineroObject);
  return transformer(value);
}
```

Note the return `value` has to be coerced to `TOutput`. Without using `as`, the compiler gave a very cryptic error.

```
Type 'string' is not assignable to type 'TOutput'.
  'TOutput' could be instantiated with an arbitrary type which could be unrelated to 'string'.ts(2322)
```

After some research and additional thinking on the issue, I figured out what was happening. `TOutput` is a generic argument and can be user provided. If provided, as in `toDecimal<number>(d)`, there is a type conflict between the generic argument and the return type of default `transformer`, which is `string`.

I spend a lot of time trying to think though how to use conditional types to solve this issue. Though fortunately Sarah put out a call on Twitter for help. [Matt Pocock](https://github.com/mattpocock) kindly provided the answer, use overloads.

## The Fix: Using Overloads

Now if the `transformer` is not provided, the return type is `string`, though if provided the return type of the format function is inferred from the return type of the `transformer`!

```ts title="Simplified example of the solution to add an optional generic argument" showLineNumbers
declare function toDecimal(dineroObject: Dinero): string;

declare function toDecimal<TOutput>(
  dineroObject: Dinero,
  transformer: (value: string) => TOutput
): TOutput;
```

Source of [toDecimal with overloads](https://github.com/dinerojs/dinero.js/blob/2117fd35855d5e36530f76eb2b62cc94fbce66a3/packages/dinero.js/src/api/toDecimal.ts)
