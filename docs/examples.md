# Racket Examples

## calculation
```racket
(+ (+ 1 2) 3 4 5)
(- (+ 1 2 3 4 5) 1 2 3 4 5)
(/ (* (- (+ 1 2 3) 4) 5) 2)
```

## lambda
```racket
(define (square x) (* x x))
(square 4)
((lambda (x) (+ x 1)) 2)
((lambda (op) (op 1 2 3)) (lambda (x y z) (+ x y z)))
```

## recursion
```racket
(define (fibonacci n)
  (if
    (< n 2)
    n
    (+
      (fibonacci (- n 1))
      (fibonacci (- n 2)))))
(fibonacci 10)
```

## logic operations
```racket
(> 1 2)
(= 0 0)
(and #t #f)
(or #t #f)
(if #t 1 0)
```

## list functions
```racket
(define (length lst)
  (if
   (empty? lst)
   0
   (+ 1 (length (rest lst)))))

(define (cons x lst)
  (lambda (op) (op #false x lst)))

(define (empty? lst)
  (lst (lambda (x  y  z) x)))

(define (empty op)
  (op #true empty empty))

(define (first lst)
  (if
   (empty? lst)
   (+ #false #false)
   (first* lst)))

(define (rest lst)
  (if
   (empty? lst)
   (+ #false #false)
   (rest* lst)))

(define (first* lst)
  (lst (lambda (x y z) y)))

(define (rest* lst)
  (lst (lambda (x y z) z)))

(length (cons 0 (cons 0 empty)))
```

## benchmark
```
(define (ackermann m n)
	(if (= m 0)
		(+ n 1)
		(if (= n 0)
			(ackermann (- m 1) 1)
			(ackermann (- m 1) (ackermann m (- n 1))))))
	
(ackermann 3 6)
```

## string
```
(define (sample x)
	"sample string with quote: \\\"")
	
(sample 0)
```