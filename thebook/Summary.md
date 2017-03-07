### Summary of Chapter 1
- Perceptrons are old forms of neurons:
    - They take N number of *binary inputs*
    - Each input has a weight, determining its significance in the output
    - The output is given by the sum of all weights * inputs + a bias:

        0 if W∙X + b <= 0
        1 if W∙X + b > 0

- Sigmoid Nerons remove the binary nature, replacing it with a gentle curve.
    - This allows small changes in inputs and outputs.
    - Output is sigmoid(W∙X + b) where sigmoid is the activation function.
    - The sigmoid function is: 
        
        σ(z) = 1 / ( 1 + e ^ -z )

    - So if z is large and positive, the output is closer to 1 and vice versa.
    - To approximate the small change in output, we look at the partials:
    
        Σ( (dOutput / dW)*ΔW + (dOutput / dB)*ΔB )

- Learning is effective when cost is minimized.
    - *X* is the vector of input to the netwrok
    - *y=y(x)* is the output of the network
    - The *Cost Function* is defined as:
        
        C(w, b) = (1 / 2n)*Σx( ||y(x) - a||^2 )

    - w is the weights, b is the biases, n is the number of total training inputs
    - y(x) is the actual output, a is the expected output of the network
    - Together this means we are summarizing how wrong the network is.

- Learning is accomplished with algorithms like Gradient Descent
    - We're looking to make deltaC negative, so that it is heading towards minimum:

        ΔC = (dC / dV1)ΔV1 + (dC / dV2)ΔV2

    - ∇C is defined as the vector of partial derivatives, so we rewrite this:
        
        ΔC = ∇C * ΔV

    - Introduce the *learning rate,* or rate of descent, and we can now find ΔV:

        ΔV = ∇C * -η

    - And so if we plug ΔV back into the ΔC equation we get:

        ΔC = ∇C * ∇C*-η = -η(∇C)^2

    - Becuase these are all vector based, the number of inputs can flex.

- Speed up learning with *Stochastic Gradient Descent*
    - Using small samples (batches) we can estimate the gradient and save time.
    - Randomly pick the batch of size m, and compute the average gradient:

        (1/m) * Σi(∇C * xi)

    - Repeat for all training examples, across all batches to reach the *epoch*.
    - The new values for w and b are:

        w -> w` = w - (η/m) * Σi(dCi / dwi)
        b -> b` = b - (η/m) * Σi(dCi / dbi)

