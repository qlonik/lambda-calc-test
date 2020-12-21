import test, {
  ExecutionContext,
  ImplementationResult,
  Implementation,
  Macro,
  UntitledMacro,
} from 'ava'
import fc, { Arbitrary, Parameters } from 'fast-check'

// similar to https://gist.github.com/qlonik/9a297285284d71f7da47022f120ef4ad

/* eslint-disable */
const fcMacro: CheckMacro = async (
  t: ExecutionContext<unknown>,
  ...args: unknown[]
) => {
  const opts = args[0] instanceof fc.Arbitrary ? {} : args.shift() as Parameters<unknown>
  const testFn = args.pop() as UntitledMacro<unknown[], unknown>
  const arbs = args as Arbitrary<unknown>[]

  const logsMap = new Map<string, string[]>()
  const prop = (fc.asyncProperty as any)(...arbs, async (...args: unknown[]): Promise<boolean> => {
    const attempt = await t.try(testFn, ...args)
    attempt.discard()
    logsMap.set(attempt.title, attempt.logs)
    return attempt.passed
  })

  const result = await fc.check(prop, opts)

  if (!result.failed) {
    t.pass()
  } else {
    const attempt = await t.try(testFn, ...result.counterexample as unknown[])
    attempt.commit()
  }
}
fcMacro.title = (str, ...args) =>
  `${str ? str + ' ' : ''}with ${args.join(' ')}`
/* eslint-enable */

// as UntitledMacro<[Arbitrary<string>, UntitledMacro<[string]>]>
test('hello', fcMacro as CheckMacro, fc.string(), (t, s) => {
  t.is(1, 1)
  t.is(2, 2)
})

type UnboxArbitrary <T extends Arbitrary<unknown>> = T extends Arbitrary<infer R> ? R : never

// prettier-ignore
interface CheckMacro {
  // <A extends Arbitrary<unknown>>(t: ExecutionContext<unknown>, a: A, prop: UntitledMacro<[UnboxArbitrary<A>], unknown>): ImplementationResult
  <A extends Arbitrary<unknown>>(t: ExecutionContext<unknown>, a: Arbitrary<unknown>, prop: (t: ExecutionContext<unknown>, a1: UnboxArbitrary<typeof a>) => ImplementationResult): ImplementationResult
  // (t: ExecutionContext<unknown>, a: Arbitrary<unknown>, b: Arbitrary<unknown>, prop: UntitledMacro<[UnboxArbitrary<typeof a>, UnboxArbitrary<typeof b>], unknown>): ImplementationResult


  // <A, T>(opts: Parameters<unknown>, a: Arbitrary<A>, prop: UntitledMacro<[A], T>): ImplementationResult
  // <A, B>(t: ExecutionContext<unknown>, a: Arbitrary<A>, b: Arbitrary<B>, prop: UntitledMacro<[A, B], unknown>,): ImplementationResult
  // <A, B, T>(opts: Parameters<unknown>, a: Arbitrary<A>, b: Arbitrary<B>, prop: UntitledMacro<[A, B], T>,): ImplementationResult
  // <A, B, C>(t: ExecutionContext<unknown>, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, prop: UntitledMacro<[A, B, C], unknown>): ImplementationResult
  // <A, B, C, T>(opts: Parameters<unknown>, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, prop: UntitledMacro<[A, B, C], T>,): ImplementationResult

  /* eslint-disable */
  title?: (title: string | undefined, ...args: unknown[]) => string;
  /* eslint-enable */
}

type Options = Parameters<unknown>
// prettier-ignore
export interface CheckFn {
  <A, T>(a: Arbitrary<A>, prop: (t: ExecutionContext<T>, a: A) => ImplementationResult): Implementation<T>
  <A, T>(opts: Options, a: Arbitrary<A>, prop: (t: ExecutionContext<T>, a: A) => ImplementationResult): Implementation<T>
  <A, B, T>(a: Arbitrary<A>, b: Arbitrary<B>, prop: (t: ExecutionContext<T>, a: A, b: B) => ImplementationResult): Implementation<T>
  <A, B, T>(opts: Options, a: Arbitrary<A>, b: Arbitrary<B>, prop: (t: ExecutionContext<T>, a: A, b: B) => ImplementationResult): Implementation<T>
  <A, B, C, T>(a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C) => ImplementationResult): Implementation<T>
  <A, B, C, T>(opts: Options, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C) => ImplementationResult): Implementation<T>
  <A, B, C, D, T>(a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D) => ImplementationResult): Implementation<T>
  <A, B, C, D, T>(opts: Options, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, T>(a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, T>(opts: Options, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, T>(a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, T>(opts: Options, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, G, T>(a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, g: Arbitrary<G>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F, g: G) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, G, T>(opts: Options, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, g: Arbitrary<G>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F, g: G) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, G, H, T>(a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, g: Arbitrary<G>, h: Arbitrary<H>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, G, H, T>(opts: Options, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, g: Arbitrary<G>, h: Arbitrary<H>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, G, H, I, T>(a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, g: Arbitrary<G>, h: Arbitrary<H>, i: Arbitrary<I>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, G, H, I, T>(opts: Options, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, g: Arbitrary<G>, h: Arbitrary<H>, i: Arbitrary<I>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, G, H, I, J, T>(a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, g: Arbitrary<G>, h: Arbitrary<H>, i: Arbitrary<I>, j: Arbitrary<J>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J) => ImplementationResult): Implementation<T>
  <A, B, C, D, E, F, G, H, I, J, T>(opts: Options, a: Arbitrary<A>, b: Arbitrary<B>, c: Arbitrary<C>, d: Arbitrary<D>, e: Arbitrary<E>, f: Arbitrary<F>, g: Arbitrary<G>, h: Arbitrary<H>, i: Arbitrary<I>, j: Arbitrary<J>, prop: (t: ExecutionContext<T>, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J) => ImplementationResult): Implementation<T>
  <T>(/* options?, ...arbitrary, propertyFn */ ...args: any[]): Implementation<T>
}
