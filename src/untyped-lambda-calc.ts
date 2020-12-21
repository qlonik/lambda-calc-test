// boolean types
// tru :: Bool
const tru = t => f => t
// fls :: Bool
const fls = t => f => f

// ternary construct
// test :: Bool -> a -> a -> a
const test = l => m => n => l (m) (n)

// boolean and
// and :: Bool -> Bool -> Bool
const and = b => c => b (c) (fls)
// boolean or
// or :: Bool -> Bool -> Bool
const or = b => c => b (tru) (c)
// boolean not
// not :: Bool -> Bool
const not = b => b (fls) (tru)

// pair constructor
// pair :: a -> b -> Pair a b
const pair = f => s => b => b (f) (s)
// fst :: Pair a b -> a
const fst = p => p (tru)
// snd :: Pair a b -> b
const snd = p => p (fls)

const realbool = b => b (true) (false)
const churchbool = b => (b ? tru : fls)
const realeq = m => n => equal (m) (n) (true) (false)
const realnum: (x) => number = n => n ((x: number) => x + 1) (0)
const realstr: (x) => string = n => n ((x: string) => `${x}x`) ('')

// church numerals
// c_0 :: ChNum
const c_0 = s => z => z
const c_1 = s => z => s (z)
const c_2 = s => z => s (s (z))
const c_3 = s => z => s (s (s (z)))
console.log ('c_3', realstr (c_3))

// successor
// scc :: ChNum -> ChNum
const scc = n => s => z => s (n (s) (z))
console.log ('scc', realnum (scc (c_3)))

/** Ex 5.2.2 */
// successor
// scc :: ChNum -> ChNum
const scc_2 = n => s => z => n (s) (s (z))
console.log ('scc_2', realnum (scc_2 (c_3)))

// addition
// plus :: ChNum -> ChNum -> ChNum
const plus = m => n => s => z => m (s) (n (s) (z))
console.log ('plus', realnum (plus (c_2) (c_3)))

// multiplication
// times :: ChNum -> ChNum -> ChNum
const times = m => n => m (plus (n)) (c_0)
console.log ('times', realnum (times (c_2) (plus (c_3) (c_3))))

/** Ex 5.2.3 */
// TODO
const times_2 = c_0
const times_3 = c_0

/** Ex 5.2.4 */
// power :: ChNum -> ChNum -> ChNum
const power = m => n => n (times (m)) (c_1)
console.log ('power', realnum (power (c_2) (plus (c_3) (c_3))))

// check if equal to zero
// iszro :: ChNum -> Bool
const iszro = n => n (() => fls) (tru)
console.log ('iszro c_0', realbool (iszro (c_0)))
console.log ('iszro c_2', realbool (iszro (c_2)))

const zz = pair (c_0) (c_0)
const ss = p => pair (snd (p)) (plus (c_1) (snd (p)))
// predecessor
// prd :: ChNum -> ChNum
const prd = m => fst (m (ss) (zz))
console.log ('prd', realnum (prd (c_2)))

/** Ex 5.2.5 */
// subtract
// subtr :: ChNum -> ChNum -> ChNum
const subtr = m => n => n (prd) (m)
console.log ('subtr', realnum (subtr (times (c_3) (c_3)) (c_2)))

/** Ex 5.2.7 */
// number equality
// equal :: ChNum -> ChNum -> Bool
const equal = m => n => and (iszro (subtr (m) (n))) (iszro (subtr (n) (m)))
console.log ('equal 1', realbool (equal (c_3) (c_3)))
console.log ('equal 2', realbool (equal (c_3) (c_2)))

// region /** Ex 5.2.8 */
const nil = c => n => n
const cons = h => t => c => n => c (h) (t (c) (n))
const isnil = l => l (() => () => fls) (tru)
const head = l => l (el => () => el) (nil)
const nn = pair (nil) (nil)
const cc = p => l => pair (snd (l)) (cons (p) (snd (l)))
const tail = l => fst (l (cc) (nn))

const real_lst = lst => lst (el => lst => [ el, ...lst ]) ([])

console.log ('nil:', real_lst (nil))
console.log ('cons 1:', real_lst (cons (123) (nil)))
console.log ('cons 2:', real_lst (cons (123) (cons (234) (nil))))

console.log ('isnil on nil:', isnil (nil))
console.log ('isnil on non-nil:', isnil (cons (123) (nil)))

{
  const el3_lst = cons (123) (cons (234) (cons (345) (nil)))
  console.log ('head:', head (el3_lst))
  console.log ('tail:', real_lst (tail (el3_lst)))
}
// endregion

// stack explosion :D
// const omega = (x => x (x)) (x => x (x))

// "call-by-value Y-combinator" OR "Z-combinator" from red brick book
const fix = f => (x => f (y => x (x) (y))) (x => f (y => x (x) (y)))
// another Z-combinator from http://kestas.kuliukas.com/YCombinatorExplained/
const fix_2 = le => (f => f (f)) (f => le (x => f (f) (x)))

const g = fct => n => (realeq (n) (c_0) ? c_1 : times (n) (fct (prd (n))))
const factorial = fix (g)

console.time ('factorial-church')
console.log ('factorial-church:', realnum (factorial (c_2)))
console.timeEnd ('factorial-church')

/*
// factorial on numbers using Z-combinator
const factorialNumYComb = fix (fct => n => (n === 0 ? 1 : n * fct (n - 1)))
console.time ('factorial-number-Y-comb')
console.log ('factorial-number-Y-comb', factorialNumYComb (32))
console.timeEnd ('factorial-number-Y-comb')

// factorial on numbers using regular recursion
const factorialNumRec = n => (n === 0 ? 1 : n * factorialNumRec (n - 1))
console.time ('factorial-number-recursion')
console.log ('factorial-number-recursion', factorialNumRec (32))
console.timeEnd ('factorial-number-recursion')
*/

// region /** Ex 5.2.9 */
const g_2 = fct => n => test (iszro (n)) (() => c_1) (() => times (n) (fct (prd (n)))) ()
const factorial_2 = fix (g_2)

console.time ('factorial-church-2')
console.log ('factorial-church-2:', realnum (factorial_2 (c_3)))
console.timeEnd ('factorial-church-2')
// endregion

// region /** Ex 5.2.10 */
const churchnat = fix (chn => n => (n === 0 ? c_0 : scc (chn (n - 1))))
console.log ('churchnat:', realstr (churchnat (3)))
// endregion

// region /** Ex 5.2.11 */
const sum_ch_lst = fix (add => xs =>
  realbool (isnil (xs)) ? c_0 : plus (head (xs)) (add (tail (xs))))

{
  const ch_lst = cons (times (c_3) (c_3)) (cons (power (c_2) (c_3)) (nil))
  console.log ('sum_ch_lst:', realnum (sum_ch_lst (ch_lst)))
}
// endregion
