### Chapter 2: How Backpropagation Works
Last chapter we talked about using the gradient of the cost function but never talked about how that value was computed. Time to fix that! Backpropogation was introduced in 1986 as a way to speed up learning tremendously, and even today is used in many neural networks. This is gonna get mathy:

At the heart of backpropogation lies a singule expression: dC / dW, the partial derivative of the cost function C with respect to w (which can be replaced with b). This w is any weight within the network. This means *we can see how the cost changes based with respect to any w or b in the network*.

### Warm-Up: Matrix computation of output.
First we need to update our notation, which doesn't read nice on a computer:
    
    w^l,jk

l stands for the layer the weight is in, and jk represents the connection from the
jth neuron in the current layer to the kth neuron in the previous layer. Ex: w^3,24 is the weight connecting neuron 2 in the 3rd layer to neuron 4 in the 2nd layer. Similarly, biases are denoted:

    b^l,j

l stands for the layer the bias is in, on the jth neuron. Activations are denoted:

    a^l,j

Which has the same reading as a biases, but instead describes the activation value of that neuron. The activation value is computed as the sum of (weights times activation values plus the biases) of all connections leading into the activated neuron. This Sum is then given to the activation function to compute the final value. Formally:

    a^l,j = sigma( SumK((w^l,jk * a^l-1,k) + b^l,j) )

To rewrite this unholy mess in matrix form we define:
    1. A weight matrix w^l for each layer, l, whose entries are w^l,jk
    2. A bias matrix b^l, whose entries are the values b^l,j.
    3. An activation matrix a^l, whose entries are a^l,j
We then need to *vectorize* the activation function, sigma - meaning we need to apply the function to every element in a vector, v. To denote this vectorization we use:

    sigma(v)

This denotes this elementwise vectorization, whose elements are just the elements of v but with f applies to them (f(v)). With that understood, we can rewrite the activation computation function as:

    a^l = sigma( (w^l * a^l-1) + b^l )

With this new expression, we can understand the how the activations in one layer relate to the activations in the previous layer: We just apply the weight matrix to activations of the previous layer and then add the bias vector, applying this to the activation function. This also allows us to use matrix multiplication, vector addition, and vectorization commonly found in mathematical libraries like Numpy.

One thing to realize is that before we apply sigma, we end up computing a z value we denote as z^l. This is what is called the *weighted input* to the neurons in layer l. Sometimes, we rewrite the activation computation function as:

    a^l = sigma(z^l)

It's also worth noting that z^l has components like the others: z^l,j where that is the weighted input to the activation function for neuron j in layer l.

### Assumptions about the Cost Function
The goal of backpropogation is to compute dC/dW and dC/dB for all biases and weights in the network. But we have to assume two things about the *form* of the cost function for this to work (because remember, the cost function doesn't have to be the previously defined one!).
    1. The cost function can be written as an average over cost functions for individual training examples, X. As in: C = (1/n) * Sum(Cx). This is needed since we'll be computing partial derivatives for individual triaining examples and then averaging them to get an estimation of the real deal. 
    2. The cost function can be written as a function of the outputs from the network, as in C = C(a^L). In the current definition of the cost function, y could be viewed as a parameter, but since x has already been fired y is considered a fix value (the expected output of x) and as such the only remaining variable is a.

### Hadamard Product
Suppose s and t are two vectors with same dimensions. When we say s circleDot t, this denotes *elementwise* multiplication of the two vectors; explictly we are multiplying the elements of the two vectors whose index correspond, resulting in a vector of the same dimensions:

    [1,2] circleDot [3,4] = [1*3, 2*4] = [3,8]

This will be used in backpropagation.

### The 4 Fundamental Equations of Backpropogation:
Since backpropagation is about understanding how weights and biases affect the cost, this ultimately means needing dC / dw^l,jk and dC / db^l,j. But to compute this we need to compute the *error* in the jth neuron in the lth layer:

    delta^l,j

We define this error to be:

    delta^l,j = dC / dz^l,j

And the vector of errors is denoted at delta^l.

###### Equation 1: The error in the output layer

    delta^L,j = (dC / da^L,j) * sigmaPrime(z^L,j)

This looks at the change in cost relative to the activation of the jth output activation. It multiplies this by sigmaPrime, which looks at how sigma(z) is changing for z^L,j. Computing this is relatively easy, we just take the derivative of our cost function with respect to a and then multiply it by the derivative of sigma with z^L,j inputted. The only issue with this equation is that it speaks of components, when everywhere else we speak of matricies. Let's fix that:

    delta^L = gradientaC circleDot sigmaPrime(z^L)

Better. Realize gradientaC is a vector whose componenets are the partial derivatives dC / da^L,j. This is expressing the change of C with respect to all output activations. If we look at the current cost function definition, this looks like:

    delta^L = (a^L - y) circleDot sigmaPrime(z^L)

This shouldn't be too hard to compute with Numpy now :)

###### Equation 2: The error in terms of the next layer's error

    delta^l = ((w^l+1)^T * delta^l+1) circleDot sigmaPrime(z^l)

Don't get overwhelmed. (w^l+1)^T is just the transpose for the weight matrix w of the l+1th layer. If we know the error of the l+1th later (delta^l+1). By applying (w^l+1)^T to it, we are moving the error backwards through the network, giving us a measure of the error at the output of the lth layer.

Taking the Hadamard product with sigmaPrime moves this error further backward through the activation function in layer l, *giving us the error in the weighted input to layer l.*

Using these first two fundamental equations we can compute the error of any layer in the network. Using the 1st fundamental we compute delta^L, and then apply the 2nd fundamnetal to compute delta^L-1; repeating this second fundamental to get whatever layer we need.

###### Equation 3: The change in cost with respect to any bias in the network

    dC / db^l,j = delta^l,j

Yes, you wrote that correctly. The change in cost with respect to the bias at neuron j is *exactly* the the error at neuron j. And since we know how to compute this error, we can compute this bias super easily. For shorthand, it's the super and sub scripts are often removed, although it is understood we are still talking about a single neuron:

    dC / db = delta

###### Equation 4: The change in cost with respect to any weight in the network

    dC / dw^l,jk = a^l-1,k * delta^l,j

Not as pretty as the bias one, but same idea: we can get the weight's impact on the cost by looking at the activation of the kth neuron in the previous layer and the error of the jth neuron in the current layer. For shorthand, we write:

    dC / dw = ain * deltaout

Where we understand that ain is the activation of the neuron input to weight w and deltaout is the error in the neuron output from the weight w. If I coudl draw a prettier picture I would, but this is what it looks like:

    [ain] -------> [deltaout]

It just so happens that if ain is close to 0, then we can say the weight is small and is *learning slowly* (not changing as much during gradient descent). A consequence of this final equation, in other words, is that the weights outputted from low-activation neurons learn slowly.

###### Insights from combining all four equations
- Becuase the sigmoid function is relatively flat when near 0 or 1, sigmaPrime is about 0 (since the function doesn't change much). This means that when the neuron is low or high activation, it's not learning as much and is *saturated*. Same goes for biases.

- This applies for all neurons: delta^l,j is likely to get small if the neuron is near saturation, meaning the weights input to a saturated neuron will learn slowly.

- The four fundamental equations hold for any activatoin function, as their proofs don't rely on sigma's implementation. This means we can use these four equations to *derive* activation functions that learn in certain desired ways. 

### Proving the fundamental equations:
Totally not needed to follow, but a great review of simple chain rule and understanding.

- BP1: delta^L,j = (dC / da^L,j) * sigmaPrime(z^L,j)
    1. Recall delta^L,j = dC / dz^L,j
    2. Apply the chain rule, expressing this partial derivative in terms of a:

        delta^L,j = SumK( (dC / da^L,k) * (da^L,k / dz^L,j) )

    3. Because a^L,k only relies on z^L,j when k = j, we don't need summation.
    4. So we arrive at:

        delta^L,j = (dC / da^L,j) * (da^L,j / dz^L,j)

    5. Oh hey, the second part looks like simgaPrime:

        delta^L,j = (dC, da^L,j) * sigmaPrime(z^L,j)

- BP2, 3, and 4 are all similar - carefully applying the Chain Rule.

### The Backpropagration Algorithm
1. **Input x**: Set the corresponding activation a^1 for the input layer.
2. **Feedforward**: For each l = 2,3,...,L compute z^l = w^l * a^l-1 + b^l, followed by a^l = sigma(z^l)
3. **Output error, Delta^L**: Compute the vector delta^L, BP1
4. **Backpropgate the error**: For each l = L-1,L-2,...,2 compute BP2.
5. **Output**: The gradient of the cost function, given by BP3 and BP4.

Do you get why it's called *back*propagation now? We start at with the error at the end, and work backwards to understand how the output was affected by the weights and baises going in. And we're not done yet, we understand how backpropagation now works but remember: *backpropagation computes the gradient for one training example, x* which means we need to combine it with Stochastic gradient descent to compute the overall gradient over several mini-batches, m.

For a singular mini-batch, the algorithm looks like this:
1. **Input a set of training examples.**
2. **For each training example x**: run the backpropagation alforithm
3. **Gradient descent**: For each l = L, L-1,...,2 update the weights and biases according to:
    
    w^l -> w^l - (n/m) * SumX(delta^X,l * (a^x,l-1)^T)
    b^l -> b^l - (n/m) * SumX(delta^x,l)

Remember n is the learning rate and m is the size of the mini batch! Then to finish off Stochastic Gradient Descent, you'd have an outer loop to iterate over all the mini batches and applying this algorithm. Then you'd have another outer loop that would step through multiple epochs of training.
