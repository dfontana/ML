# Improving the Neural Net
### The Cross-Entropy cost function
- The quadratic cost function suffers from slow learning when activation is near 1 or 0 - the rate of change is low. 
- This is due to the derivative's usage of the sigmoid function, and can be seen when we examine the graph of the sigmoid function.
- Replacing this cost function with the *Cross Entropy* cost function solves this by removing these slow downs: when a mistake is made in the network, it learns much more from it, speeding up learning!
- This function is defined as:

    -(1/n) * Σx(ylna + (1-y)ln(1-a))

Where n is the total number of training items in the training data and y is the desired output for the specific x being looked at. When we take the derivative of this function, like we did with the quadratic one, we find that the sigmoid prime is removed from the equation - solving the learning slowdown:

    dC / dW = (1/n) * Σx( xj * (σ(z) - y) )

This tells us learning is driven by the error: sigma(z) - y. Fantastic. A similar answer is reached when looking at the bias. This makes cross-entropy almost always a better choice than quadriatic for learning!

### An alternate to Cross Entropy: Softmax
Another just as appropriate solution to cost function is the Softmax approach. Softmax uses additional layers to fix the training issue. It works by defining a new type of output layer for the neural nets that don't have a sigmoid function applied to to get the output. Instead we apply a softmax function that looks like:

    a^L,j = e^z^l,j / Σk( e^z^L,k )

This means each output is a fraction of the total output, meaning that all the activations summed together will equal 1. And each of these will be positive numbers. Combine those two facts and realize that the Softmax approach outputs a probability ditribution. 

How does this solve the learning slowdown problem? Well it doesn't directly - using the log-likelihood cost function associated with Softmax does, however:

    C = -lna^L,y

If we take the derviatives of this with respect to b and w, we find the same derivatives we arrive at for cross-entropy. Neat. When do we choose Softmax over cross-entropy? When it's appropriate: like we want the output to be a probability rather than the "highest activation value".

### Overfitting
When looking at the accuracy performance of our network as epochs of training increase, we expect to see a continuation in improvement: learning. But at some point the training may stop improving accuracy. At this point, we call it *overfitting* or *overtraining* the network. If we continue training past this point, we run the risk of making our network too accustomed to the training data and not to the generalization it was made to arrive at.

Another sign of overfitting could be that the cost of the general model is decreasing until a point at which is starts increasing again. This means we've gone too far. Or if we look at the accuracy of identifying the training data: if we ever hit a point where 100% is reached and then continue to train, we are overfitting to the particularities of the training data and no longer developing generalizations.

One way to prevent this is to track the accuracy throughout training. So what we can do is use another dedicated set of data: validation data. We track the accuracy of validation data, and once it hits saturation we stop. This is called *early stopping*. We use a seperate set of data, rather than test data, because we use this validation data to set hyper parameters - like epochs and learning rate. If we were to base these off of test data, we run the risk of again overfitting these parameters to the test data. Having their own data set ensures we are staying general!

Granted, it should be noted that *having a lot of training data is one of the best ways to reduce overfitting. More data = more generalizations to be made. But more training data can't always be gotten easily.*

### Regularization
So we know more data = less overfitting. But what else? Reducing network size works, but that reduces the power of it. *Regularization* can help alleviate this when we have a fixed training set and a fixed network.

###### Approach 1: Weight Decay, or L2 Regularization
This adds an extra term to the cost functon, called the *regularization term*. It looks like:

    C = C₀ + (λ/2n)Σw(w²)

That second term is the regularization term, and C₀ is the original cost function. This regularization term looks at the sum of the weights squared and scales it by a factor λ/2n where n is the number of training data and λ is the *regularization parameter*. More on this later.

Through adding this term, the goal is to make the network prefer small weights (since we are minimizing the cost function). When λ is small, we prefer to minimize the original cost function - since we reduce the importance of the second term. When it's large, we prefer to focus on smaller weights.

But why smaller weights? How does that help overfitting? First: fixing SGD so that we can even talk about an example. First, we need to fix our partial derivatives:

    dC/dw = dC₀/dw + (λ/n)w
    dC/db = dC₀/db

We can still apply backpropagation to there terms to find them. Then the only other fix to make is how we update our weights and biases (note this is for normal gradient descent, see below for SGD):

    b → b - η(dC₀/db)
    w → w - η(dC₀/dw) - (ηλ/n)w = (1 - (ηλ/n))w - η(dC₀/dw)

Biases doesn't change, but the weight changes slightly: we rescale the weight by a factor before setting it. This scalling is referred to as *weight decay* since it makes the weights smaller. So for SGD, we can expect to just need to add the factor:

    b → b - (η/m)Σx(dCx/db)
    w → (1 - (ηλ/n))w - (η/m)Σx(dCx/dw)

Utilizing this method, we reduce overfitting and push the accuracy of our model even further! Note we need ot pick a λ value that reflects the size of our training data. For example, if we chose 0.1 for a data pool of 50,000 terms - it's far too small. Something like 5.0 is much, much better. In addition, if we add more hidden neurons (like we did before) we can push accuracy even further (100 hidden neurons is a good bet).

Another major benefit to regularization is that it improves our networks *consistency* when training. Unregularized networks allow the weight vector to get large (magnitude wise). This forces the weights to "point" in one direction without the ability to change during Gradient Descent. When regularized, however, we force the network to keep the weights small, allowing searching to move more freely :)

->>>> Pickup at Why does regularization help reduce overfitting?
