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

Regularization, more specifically, reduces overfitting because it makes the impact of each input less significant (through reducing the magnitude of the weights). This makes it so that minute changes in input (things that would be specific to a data set) doesn't get overly compensated for in the network.

###### Approach 2: L1 Regularization
L2 is by far the most common, but L1 also serves as another example. Similarly, L1 punishes large weights in the cost function - but this time it's less aggressive compared to L2. It subtracts a constant value from w rather than a factored value. 

The L1 cost function and its updated weight rule looks like:

    C = C₀ + (λ/n)Σw|w|
    w → w` - (ηλ/n)sgn(w) - η(dC₀/dw)
    Where sgn is the sign of w.

Overall, this creates a network that focuses on very few, very important connections since high magnitude weights decrease the same amount as low magnitude ones. The only edge case we have to make for this is when w = 0. In that event, we apply the unregularized cost function / weight update schema.

###### Approach 3: Dropout
A theory on the rise and in usage, dropout looks to not modify the cost function - but to modify the network itelf. When we train, we start by "removing" half the hidden layer's neurons. Then we forward propagate and back propagate, updating the weights and biases as appropriate. For the next mini-batch, we repeat, but having removed a different set of neurons. Then when it comes time for production, we half the weights outgoing from the hidden neurons (since there will be double the amount of neruons in the normal network).

This creates a network whose components rely little on the neighboring components to arrive at a solution. It works by simulating multiple networks solving the problem and then averaging their solutions to produce a more accurate estimate of the actual answer. This, of course, reduces overfitting since no single subset of the network is able to overfit to the data. 

###### Approach 4: Artificially expanding the training data
We know that more data leads to less overfitting of the network and a better generalization. Unfortunately getting that data is hard - or is it? For a lot of problems, like the MNIST character set, we can tweak the images to produce new images; like rotating them 15 degrees. This makes a whole new data input out of existing data, allowing us to double our data set instantly. Similar tactics can be applied to other data types, of course. Translating and skewing images works too, there's been work done in actually developing methods of modifying data to be realistic of what the subtle movements of our hands would do. 

For example, we could add or remove background noise from sound samlples if we wre working with sound input.

### Weight Initialization
So far we've initialized our networks with basic Guassian distributions - but there's one fault with it. When doing so, we leave some neurons really close to 1 which, knowing our activation function, means its really hard for those neurons to learn. And if they're in the wrong state, that means we have to do a lot more training to get them in the right state.

To solve this, we can initialize our network more "smartly". Some folks will go as far to just letting the network start at 0. But we can do a little better. If we decrease the range of the distribution, then we get initialize most of the network to be a little bit off of zero and no where near 1. It takes a simple, little tweak to the initialization formula:

    Guassian Dist with mean 0 and std dev 1/(sqrt(number of input weights))
    Biases still use mean 0 std dev 1.

Now, this works much better for learning speed, and as we'll come to see in Chapter 4, the overall accuracy.

### Picking Hyper-Parameters
There's no easy way, but there's a few simple tricks. There is also work being done on automated approaches, but we're skipping those here. Here's the executive summary.

 A neural net can appear to be utterly broken if the hyper-params are wrong, misleading the creator into thinging their network is utterly garbage when it may not be. It may not be performing any better than just guessing - and *that is the measure to go by. Is our network still guessing or has it improved?* 
 
 To solve this the creator should, broadly speaking:

    1. Reduce the complexity of his network. If we're identifying numbers, just focus on figuring out 0s and 1s. If you think removing hidden neurons helps, remove those too. Just the bare essentials.
    2. Now we can train faster (to rapidly guess and check), and we can remove variance. We can increase our iteration speed by having the training report in smaller intervals than entire epochs - "after x amount of inputs" for example.
    3. Now focus on adjusting the regularization parameter λ. Pick something that makes sense for the size of the training data you are using (as we went over before). 
    4. We still may not be getting anywhere, but there will be a small improvement. So try to tweak the learning rate next. Does increase it by a factor of 10 make things better? No? Decrease it.
    5. Once you are starting to seeing a meaningful improvment, go back and tweak λagain. See if there is a better value. Then try adding back some of your hidden neurons, adjusting η and λ once more. Then add more neurons, tweaking η and λ again. Repeat until your full network is back. As you add more and more complexity, remove the frequency of monitoring to keep the speed acceptable.
    6. All better :)

But that is far too "optimistic" and things won't always be so nice. So let's step away from the "broad" approach and get specific.

###### Adjusting Learning Rate η
Monitor the cost of the network per epoch. We want to find a η such that as we train the cost *smoothly* decreases, and continues to do so throughout all epochs. So we set our hyper parameters to an appropriate initial value we believe to be good. Then we monitor the cost:

    - If it is decreasing during the first few epochs, try increasing η by a factor of 10 (ie 0.01 to 0.1). Repeat until it starts increasing.
    - If it is increasing or fluctuating, drop η by a factor of 10 (ie 0.01 to 0.001). Repeat until it starts decreasing.

Once you have an *order of magnitude found* then you can tweak a little more fine tuned within that magnitude. You want the largest η for which the cost decreases during the first few epochs. (Mind you, first few should be something along the lines of 10-30 epochs). When it comes time to polish things, your *actual value of η* should be no larger than this rough estimate value. In fact, it should be a factor of two below this rough value, to allow fine tuned training to occur without overshooting the minimum. (Ie if you found 0.2, your real value should be 0.002).

###### Adjusting the number of epochs
This one is simple. Just use early stopping so your network goes for as long as it needs to. The only unclear thing is how to define *stops improving* when speaking about early stopping. There's many ways to do this. When starting out it may be "accuracy hasn't increased in over 10 epochs". But eventually we'd realize that neural nets plateau during training before improving again (or at least some do). So as you progress, you can relax this rule: no-improvement-in-20, 50, 100... Of course you could try other approaches to determine improvement or not, but that is up to you.

###### Learning rate scheduler
Learning rate has been held constant. It doesn't have to be. At first you could have it be large and then decrease it by some amount when accuracy gets worse, continuing to do so until it has decreased by some factor (1/128th its original value, for example). This adds complexity, but can speed things up a lot more!

###### Regularization parameter λ
Just like learning rate. Once you have a learning rate selected, revisit this parameter - starting at 1.0 and increasing/decreasing an order of magnitude to improve performance. Once you've stopped improving, start fine tuning. And with this optimized, you may want to revisit learning rate one last time.

###### Mini Batch Size
We could do online training (that is a mini batch size of 1 so we go example by example) - but that is slower and removes the opportunity to do fancy matrix operations to compute entire batches at once rather than looping over them. That would slow us down quite a bit! 

### Other Techniques for training
I'll be brief. There are other ways out there to train other than SGD. For example, *Hessian technique* tries to minimize the cost function through estimations, etc, etc. Case in point, it falls short in that its much harder to implement due to the size of the matrix it needs (tracking not only partial but second derivatives is *huge*).

An improvement upon SGD, however, inspired by Hessian technique (along with many others), is the *Momentum based gradient descent*. This approach looks to mimic the analogy of moving down a slope until we hit the bottom much closer, by accounting for velocity (how the slope is changing, rather than position) and friction (to slow down the speed as we get near the bottom).

To do this, we introduce v as a vector of velocities correspoding to each wj variable. Then we replace the update rule in gradient descent:

    v → v` = μv - η∇C
    w → w` = w + v`

Now we have μ as a hyper parameter, representing friction. If we set it to 1, there would be no friction to slow the velocities down, and we would overshoot. So we need ot set this to some value between 0 and 1 to ensure we don't do that. Case in point, however, is this is a great way to speed up training with little extra effort from our part: it's super easy to add onto SGD.

### Other types of neurons
There's other neurons out there that hold potential. Tanh neurons allow negative values in activation, which can allow some weights to increase while other decrease - rather than always forcing all the weights to increase of decrease. This may be faster to train, but not always the case.

There's also rectified linear neurons which can work better with images (but not yet proven) as inputs. They don't suffer from learning slowdowns since they never saturdate, but when the weighted input is negative it outputs a 0, removing it from the equation - it's not learning at all. So it's not fully effective for all cases.
Picking a mini batch, then, is a compromise: Too little and you're not getting the best performance. To large, and you're not updating your weights frequently enough. Thankfully, this parameter is pretty independent of the others and you can choose this one after you've done the more impactful / meaningful ones. If you want to try a few different sizes, remember to scale your learning rate appropriately (Since that is proportional to the size of the mini batch). *Realize this parameter is not about pushing accuracy, but pushing physical speed it takes to learn at - so it really is independent of the others!*

