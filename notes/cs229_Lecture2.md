## Topics for this Lecture:
- Linear Regression
- Gradient Descent
- Normal Equations

## Housing Prices
- Data set follows: (Square Feet, Cost in $1000s)
- Given this training set, how do you learn to extrapolate from this?

## Notation
- Let *m* denote the number of training examples
- Let *x* denote the input variables/features
- Let *y* denote the output variable/target variable
(x,y) comprises on training example. One row in housing prices, for example.
The ith training example, aka the ith row in that table, is denoted at (x^i,y^i)

## Structure of Supervised Learning
1. Take a training set and feed it into the learning algorithm
2. The learning algorithm will return an hypothesis, h
3. The hypothesis must takes the input - a new square footage - and out the estimated house price. It makes inputs x to outputs y.
When first making a learning algorithm we have to think of how we want to represent this hypothesis. So for now, we're going to model this linearly:
    
    h(x) = theta0 + theta1X, where X is an input feature.

#### Side note: General form of the hypothesis
- In our example we can generalize the hypothesis. The thetas are called parameters.

    h(x) = theta0 + theta1X1 + theta2X2.

- For conciseness, X0 can be defined as 1, meaning h(x) can be defined as the sum of 0 to n, of thetaiXi which is theta transpose X:
    
    h(x) = Sum(0,n,thetaixi) = Transpose(theta)X

#### How do we choose the parameters, theta, such that our hypothesis is accurate?
- Given the training set our hypothesis will make some predictions and we can try to make those accurate:

   Error = J(theta) = (1/2)Sum(i, m, (h(xi) - yi)^2)

- The goal, then, is to minimize J(theta). Minimize that error. 
- To perform this minimization, we can do a few algorithms. The first one we'll look at is *gradient descent* which goes a little like:
    1. Start with some theta, say a vector of 0.
    2. Keep changing theta to reduce J(theta) until a minimum is reached.

## Gradient Descent
- If we start with:

    thetai := thetai - alpha * d/dthetai J(theta)

- Doing the partial derivative of thetai with respect to J(theta), we recognize the result to be:

    (h(x) - y) * xi

- Which means the learning rule becomes:
    
    thetai := thetai - alpha(h(x)-y)*xi
    Where alpha is the learning rate (how large of a step to take at a time)

- And makes for "Batch Gradient Descent"

    thetai := thetai - alpha * (Sum(h(xij) - yij * xij))

Stoichastic Gradient Descent:
    1. Repeat until convergence
    2.   For j=1 to m
    3.     thetai := thetai - alpha(h(xj)-yj) * xij for all i. 
For large data sets, this allows our algorithms to be much faster than normal gradient descent / batch gradient descent. It won't converge to the global minimum, but we'll get fairly close to it. Which is good enough most of the time!

## Derivatives with respect to matricies:
Given J:

    gradientJ (with respect to theta) = [dJ/dtheta ... dJ/dthetaN] for 0..N

Now gradient descent can be written as:

    theta := theta - alpha*gradientJ

Where all of these are vectors. In general, the derivative (gradient) of F where f is a matrix m by n is a matrix itself:

    gradientF(a) = [ df/da11 ... df/da1N
                     ...           ...
                     df/dm1  ... df/damn ]

If A is a square matrix (n rows by n columns) then A = Sum of Aii from 1 to N. (Can be denoted as 'Trace' or tr(A)). A Fact:
    - trAB = trBA. 
    - Similarly, trABC = trCAB = trBCA
    - The derivative of f(A) = trAB is B transposed.
    - trA = trA trasposed (since trA is just the sum of diagonal elements).
    - The derivative of ABAtransposedC = CAB + C transposed AB transposed.

## So how do we minimize J(theta) without iteration?
- Let's make matrix X where each row is the vector of inputs from the 1st training example, the second row is the 2nd training inputs, the 3rd... all the way to the mth training example.
- Now multiply X by theta, which means eah row is multiplied by theta.
- Which means Xtheta is just h(x) for each training set.
- And we'll define y as the vector of results for each training set.
- So Xtheta - y = [h(x1) - y1
                     ...
                   h(xm) - ym]
- And now we will take the inner product of this vector with itself, or (Xtheta - y) transposed * (Xtheta - y). This is equal to the Sum(1,m, (h(xi)-yi)^2)
- If we half this, we suddenly have our original definition of J(theta)!
- Now take the derivate, set it equal to 0, and solve for theta. We get:

    The normal equation! theta = (XtranposeX)^-1 * XtransposeY
