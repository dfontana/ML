### Summary of Chapter 1
- Perceptrons are old forms of neurons:
    - They take N number of *binary inputs*
    - Each input has a weight, determining its significance in the output
    - The output is given by the sum of all weights * inputs + a bias:

        0 if W dot X + b <= 0
        1 if W dot X + b > 0

- Sigmoid Nerons remove the binary nature, replacing it with a gentle curve.
    - This allows small changes in inputs and outputs.
    - Output is sigmoid(W dot X + b) where sigmoid is the activation function.
    - The sigmoid function is: 
        
        sigma(z) = 1 / ( 1 + e ^ -z )

    - So if z is large and positive, the output is closer to 1 and vice versa.
    - To approximate the small change in output, we look at the partials:
    
        Sum( (dOutput / dW)*deltaW + (dOutput / dB)*deltaB )

- Learning is effective when cost is minimized.
    - *X* is the vector of input to the netwrok
    - *y=y(x)* is the output of the network
    - The *Cost Function* is defined as:
        
        C(w, b) = (1 / 2n)*Sum( ||y(x) - a||^2 )

    - w is the weights, b is the biases, n is the number of total training inputs
    - y(x) is the actual output, a is the expected output of the network
    - Together this means we are summarizing how wrong the network is.

- Learning is accomplished with algorithms like Gradient Descent
    - We're looking to make deltaC negative, so that it is heading towards minimum:

        deltaC = (dC / dV1)deltaV1 + (dC / dV2)deltaV2

    - GradientC is defined as the vector of partial derivatives, so we rewrite this:
        
        deltaC = gradientC * deltaV

    - Introduce the *learning rate,* or rate of descent, and we can now find deltaV:

        deltaV = gradientC * -n

    - And so if we plug deltaV back into the DeltaC equation we get:

        deltaC = gradientC * gradientC*-n = -n(gradientC)^2

    - Becuase these are all vector based, the number of inputs can flex.

- Speed up learning with *Stochastic Gradient Descent*
    - Using small samples (batches) we can estimate the gradient and save time.
    - Randomly pick the batch of size m, and compute the average gradient:

        (1/m) * Sum(gradientC * xi)

    - Repeat for all training examples, across all batches to reach the *epoch*.
    - The new values for w and b are:

        w -> w` = w - (n/m) * Sum(dCi / dwi)
        b -> b` = b - (n/m) * Sum(dCi / dbi)

