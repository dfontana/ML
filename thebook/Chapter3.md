# Improving the Neural Net
### The Cross-Entropy cost function
- The quadratic cost function suffers from slow learning when activation is near 1 or 0 - the rate of change is low. 
- This is due to the derivative's usage of the sigmoid function, and can be seen when we examine the graph of the sigmoid function.
- Replacing this cost function with the *Cross Entropy* cost function solves this by removing these slow downs: when a mistake is made in the network, it learns much more from it, speeding up learning!
- This function is defined as:

    -(1/n) * SumX( ylna + (1-y)ln(1-a) )

Where n is the total number of training items in the training data and y is the desired output for the specific x being looked at. When we take the derivative of this function, like we did with the quadratic one, we find that the sigmoid prime is removed from the equation - solving the learning slowdown:

    dC / dW = (1/n) * SumX( xj * (sigma(z) - y) )

This tells us learning is driven by the error: sigma(z) - y. Fantastic. A similar answer is reached when looking at the bias. This makes cross-entropy almost always a better choice than quadriatic for learning!

### An alternate to Cross Entropy: Softmax
Another just as appropriate solution to cost function is the Softmax approach. Softmax uses additional layers to fix the training issue. It works by defining a new type of output layer for the neural nets that don't have a sigmoid function applied to to get the output. Instead we apply a softmax function that looks like:

    a^L,j = e^z^L,j / SumK( e^z^L,k )

This means each output is a fraction of the total output, meaning that all the activations summed together will equal 1. And each of these will be positive numbers. Combine those two facts and realize that the Softmax approach outputs a probability ditribution. 

How does this solve the learning slowdown problem? Well it doesn't directly - using the log-likelihood cost function associated with Softmax does, however:

    C = -lna^L,y

If we take the derviatives of this with respect to b and w, we find the same derivatives we arrive at for cross-entropy. Neat. When do we choose Softmax over cross-entropy? When it's appropriate: like we want the output to be a probability rather than the "highest activation value".
