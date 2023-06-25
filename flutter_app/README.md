# Mandelbrot

The Mandelbrot set is a set of complex numbers for which the function $f_c(z) = z^2 + c$ stays
bounded between a certain range of values when iterated from $z = 0$.

## The function
Complex numbers will be represented as a coordinate in the application. This results in the formula
$z = x + yi$ or in code `z = vec2(x, y)`

Keeping in mind that the complex number is represented as $i^2 = -1$, we can expand the function of the Mandelbrot set as follows:
$$
\begin{split}
f_c(z) & = z^2 + c \\
& = (x + yi)^2 + c \\
& = x^2 + 2xyi + y^2i^2 + c \\
& = x^2 + 2xyi - y^2 + c \\
& = x^2 - y^2 + 2xyi + c \\
\end{split}
$$

In this function we can rewrite the complex number $x^2 - y^2 + 2xyi$ in vector representation to $(x^2 - y^2, 2xyi)_z$. And $c$ in vector representation $(x, y)_c$. This results in
$$ f_c((x, y)_z)=(x^2 - y^2, 2xy)_z + (x, y)_c$$

## Input for the function
In this function we can input a value $z$ which is bounded by the following rule:
$$|z_n + 1| <= 2$$
Or in vector representation:
$$|(x, y)_z| <= 2$$

## Implementation
The implementation of this set is quit simple and elegant.

We will need to iterate over a point in the Mandelbrot set:
```
float calculateMandelbrotPoint(ComplexNumber c) {
	ComplexNumber z
	for i = 0; i <= maxIterations; i++ {
		z = square(z) + c
		if abs(z) > 2 {
			return i / maxIterations;
		} 
	}
	return maxIterations;
}
```

In this function we use two other functions: square and abs.

The square function squares a complex numbers according to the formula $z^2 = (x^2 - y^2, 2xy)_z$$.

The abs function calculates the modulus of the complex number according to the formula $r = |z| = sqrt(x^2 + y^2)$