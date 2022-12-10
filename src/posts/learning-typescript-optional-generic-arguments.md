---
title: Optional Generic Function Argument
seoTitle: TypeScript Optional Generic Function Argument
slug: learning-typescript-optional-generic-arguments
abstract: How to define a generic type argument for an optional function parameter in TypeScript
isPublished: true
publishedOn: 2022-11-30
---

<script>
  import DocInfo from '../lib/components/doc-info.svelte';
</script>

While performing a code review for [Dinero.js](https://github.com/dinerojs/dinero.js), an awesome JavaScript money library maintained by [Sarah Dayan](https://github.com/sarahdayan), I noticed something odd. A newly added format function's return type was `unknown`, when it was expected to be a generic.

An optional `transformer` parameter had recently been added to the function. If provided, the transformer should convert a money object to another type.

## The Problem

```ts title="Simplified example of the original type declaration"
function toDecimal<TOutput>(dineroObject: Dinero, transformer?: (value: string) => TOutput);
```

The intent was for `TOutput` to be inferred by the transform function return type. The default argument to `transformer` is a function that returns a string representation of a decimal.

<DocInfo>
  There is no explicit return type. Type inference in the function definition was relied on to provide the return type.
</DocInfo>

```ts title="Simplified example of the original function definition" showLineNumbers {1}
function toDecimal(dineroObject, transformer = (value) => value as TOutput) {
  const value: string = toDecimalFn(dineroObject);
  return transformer(value);
}
```

<DocInfo>
  The return `value` has to be coerced to `TOutput`. Without using `as`, the compiler gave a very cryptic error.
</DocInfo>

```
Type 'string' is not assignable to type 'TOutput'.
  'TOutput' could be instantiated with an arbitrary type which could be unrelated to 'string'.ts(2322)
```

After some research, I figured out what was happening. `TOutput` is a generic argument and can be user provided. If provided, as in `toDecimal<number>(d)`, there is a type conflict between the generic argument `number` and the return type of default `transformer`, which is `string`. The generic type can not be inferred by a default argument.

Requirements to make the typing work as intended:

- If a transform argument isn't provided:
  - The `TOutput` generic argument should not be used or required.
  - The return type of `toDecimal` should be `string`.
- When a transform argument is provided:
  - `TOutput` should be inferred from the return type of the `transformer` argument.
  - The return type of `toDecimal` should be `TOutput`

I spend a lot of time thinking though how to use conditional types to solve this issue. Though fortunately Sarah put out a call on Twitter for help and [Matt Pocock](https://github.com/mattpocock) kindly provided an answer, use overloads.

## The Fix: Using Overloads

Overloading the function declaration of `toDecimal` allows `TOutput` to be an optional generic argument. If not provided, the return type is `string`. Though if provided, the return type of `toDecimal` is inferred by the return type of the `transformer`, just as intended!

Since `TOutput` can't be inferred by the return type of a default `transformer` argument, it was removed in favor of branching. In the overload declaration, `TOutput` doesn't even exist if a `transformer` isn't provided. Coercing it into `TOutput` was wrong, because it that situation it should explicitly be a `string` not a generic.

```ts title="Simplified example of the solution to add an optional generic argument" showLineNumbers
function toDecimal(dineroObject: Dinero): string;

function toDecimal<TOutput>(dineroObject: Dinero, transformer: (value: string) => TOutput): TOutput;

function toDecimal<TOutput>(dineroObject: Dinero, transformer?: (value: string) => TOutput) {
  const value: string = toDecimalFn(dineroObject);
  if (!transformer) return value;
  return transformer(value);
}
```

Link to the actual source of [toDecimal with overloads](https://github.com/dinerojs/dinero.js/blob/2117fd35855d5e36530f76eb2b62cc94fbce66a3/packages/dinero.js/src/api/toDecimal.ts)

I hope this little case study helped you understand how to implement an optional generic argument in your own project.
