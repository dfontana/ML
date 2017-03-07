### Perceptrons (The Basics)
- The original type of neuron used to develop neural networks. These have been replaced by Sigmoid neurons. 
- The perceptron takes multiple *binary* inputs: x1,x2,x3...,xn
- Each input has an associated real value: the weight. This determines the significance of the input or output
- The overall output is then determined by the summation of the weighted sum being less than or greater than some threshold value.
- ie: 
	0 if Σi(wixi) <= threshold
	1 if Σi(wixi) > threshold

###### Perceptrons (Layers)
- What if we want to make decisions a little more fine grained? For example, let's say a cheese festival is occuring and you have three factors to consider:
	1. Will your other go with you
	2. Is the weather okay.
	3. Is the festival near public transport.
- By setting a weight to each decision, and a threshold reflective of how willing you'd go, we start to model this decision making.
- But what if the decision was a little more involved? Add another layer.
	- The first layer makes simple decisions
	- The second layer then uses those descisions to make another decision.
	- Continue until all layers are done and the final output computed.

###### Simplifying the notation:
1. Saying Σi(wixi) > threshold is unhelpful. Lets instead note this as w ∙ x, where w and x are vectors of weights and inputs respectively being dot product'd.
2. Then move the threshold to the other side of the equation (making it negative) and call it the bias.
3. The result is:
	0 if w∙x + b <= 0
	1 if w∙x + b > 0
The bias can be viewed as "how difficult it is to get the preceptron to output a 1."
AKA 'fire'. The larger the bias, the easier it is to fire.

As an example of the new notation, we can make perceptrons that mimic the behavior of logical gates (OR, AND, NAND).
	- Perceptron has a bias of 3. X1 and X2 has a weight of -2. Now if we input 00,10,01 we get 1. But if we input 11, we got 0. A NAND gate!
	- Recognizing this, we can string many of these NAND gates together to compute bitwise summation (yikes!).

By convention we should draw inputs similar to perceptrons and call them the input layer. A semantic note: they are not perceptrons, they are just a special unit that looks like them. 

### Sigmoid Neurons
- You'll recognize that perceptrons being NAND gates are lacklustre. The power arrives from the fact we can automatically tune weights and biases with learning algorithms. Enter the Sigmoid neuron.
- When learning, we desire to make small changes to weights that makes small changes to outputs. This allows learning. Too much, and we won't be able to be precise enough! This can be read as:
	w + ΔW (or b + ΔB) -> output + ΔOutput
- The issue with Perceptrons is that we can't do small adjustments: the output will either be 1 or 0 and no inbetween. To solve this **sigmoid neurons** allow output that can be change slightly based on slight changes in weights/biases.
	1. Unlike perceptrons, sigmoids can take inputs between 1 and 0.
	2. Unlike perceptrons, sigmoids output the value: sigma(wDotx + b). Recognize some folks make refer to sigma as logistic, because that's a new class of neurons floating around out there. Also note that sigma is short for **sigmoid function**.  *ps this is called the activation function*
	3. The **sigmoid function** is defined as: σ(z) = 1 / ( 1 + e ^ -z )

###### Let's get technical.
We know the output of a sigmoid and we know the sigmoid function, so truth be told a sigmoid with inputs x1,x2... and weights w1,w2... and bias b is:
	- 1 / ( 1 + exp(- Σi(wixi) - b))
	- The gist of this is that if z is w∙x + b, then when z is large and positive the output of the neuron will be 1-ish. If it's very negative, it's 0. Anywhere between is then anywhere between.
	- And the shape of the sigmoid function? It's a smoothed curve from 0 to 1. Keyword *smoothed*. The smoothness means that small changes to bias and weights will make small changes to output. Brilliant.
	- To approximate this small change in output, we can look at it as the sum of the partial derivatives: Σ((dOutput / dW) * ΔW + (dOutput / dB) * ΔB)
	- The above formula is interpretted as a *linear function* of ΔW and ΔB

###### Handling Sigmoid Output
- Sometimes we can use the raw output as needed. In other cases we can consider a convention, like output > 0.5 (for example). Just keep this in mind.

### Neural Network Architecture
1. Leftmost layer is the *input layer* which is made up of *input neurons*.
2. Rightmost layer is the *output layer* which is made of *output neurons*.
3. Middle layers are called *hidden layers* because these neurons are not used as an input or output.
Designing input and output layers tends to be straightforward:
	- To determine if a picture is of a 9, encode the pixel intensities as inputs
	- So if the image is 64x64, that's 64x64 inputs, with intensitites between 0 and 1.
	- The output layer would then be a single neuron with values < 0.5 signifying "not a 9" and vice versa.

Middle layers are much harder with no set-fast rules. Researchers have determined as set of heuristics that can be used to help get the desired outcome, at the cost of time to test and number of layers. More later.

###### Feedforward Networks
- Thus far we've been talking about feedforward networks: outputs from previous layers are used as inputs in the next layer and never travel backwards.
- However, in some types of nets (recurrent neural networks), outputs can be looped back as inputs for the net. This makes things very hard to make sense of, but its a thing. This may be closer to how our brains work, however, and could protentially solve feedforward problems much more easily. We'll hold off on this for now, though.

### Getting Hands On.
To the problem at hand, we want to detect the digits of a handwritten number. First we need to split this number into each seperate digit. This is a *segmentation problem*. This is something of another challange, as for us, we're focused on after these digits have been broken out - we need to identify them. If we have a good way to identify, then we can segment more easily. (We could have the network try to identify an example segmentation, if it does poorly we can try to adjust the segment and such until success...) Never the less: To handle identification we will be using
	1. A three layer network
	2. With 784 input neurons (the digits are 28px x 28px = 784)
	3. 15 hidden neurons
	4. and 10 output neurons describing whether the digit is a 0 (or not), 1 (or not), 2, 3 ... 9
 The inputs are grayscaled, with 0.0 meaning white and 1.0 meaning black, with shades of gray between. The hidden layer will start with (n=15) neurons. This n can be tweaked and we will be doing so. The output is 10 neurons: the neuron with the highest value tells us what number it is.

###### How to Learn
First we need a set of data to learn from, to quiz our network on. We'll be using the MNIST data set (A Modified United States National Institute of Standards and Technology data set) to train our data. This dataset happens to have two parts: 60,000 training images and 10,000 test images. The second part is from a whole different set of people the network didn't see in training, helping us ensure the network isn't biased.

Training inputs will be referred to as *x*. Each x will be a 784 dimensional vector, each entry a pixel intensity. The output will be denoted: *y=y(x)*, where y is a 10 dimensional vetor. The goal is to get a set of weights and biases that will approximate y(x) for all training x. To do this we need a qualifying function:
	- C(w,b) = (1 / 2n ) * Σx( ||y(x) - a||^2 )
	- w is the collection of all weights in the network
	- b is all the biases
	- n is the total number of training inputs
	- a is the vector of outputs from the network when x is the input
	- The sum is over all training inputs, x.
	- ||v|| means the length function for a vector.
This makes for a function C called the *quadratic cost function* or the *mean squared error (MSE)*. This function is non-negative, with the cost being small when y(x) is equal to the output a for all training inputs x. AKA the algorithm did its job if it found weights and biases such that the cost is about 0. This can be accomplished with an algorithm called *gradient decent*.

*Note that the quadradic cost function is an arbitrary choice that can be replaced, but for learning is an easy example.*

###### Gradient Descent
To approach the problem of minimizing cost we need to forget everything. There's too much distraction with weights and biases and sigmoid functions, etc. Instead focus strictly on *gradient descent to do this for us*.

Let's say we want to minimize from function C(v). This function C has two variables: v1 and v2. What we want to find is where C hits it global minimum over all inputs. We *could* use calculus and compute this, but that becomes a disaster when trying to use many, many, *many* input variables. So what do we do?

We got this analogy:
	1. Imagine our function as a valley. If we roll a ball down the hill, it eventually hits the bottom of the valley. 
	2. Now what if we picked a random start point to release the ball from, and then simulated the motion of the ball as it rolls down to the bottom. 
	3. If we capture derivatives and second derivatives of C, we can then inspect the shape of the valley and learn when the "ball" is at the bottom!
To accomplish this programatically for C, we want to find a ΔV1 and ΔV2 that will make deltaC negative (as in decreasing) in the following formula:

	ΔC = (dC / dV1)ΔV1 + (dC / dV2)ΔV2

DeltaV can be defined as the vector of changes in v, aka Transpose (ΔV1, ΔV2). The gradient of C (∇C) can be defined as a vector of partial derivatives, aka Transpose (dC/dV1, dC/dV2). With this knowledge in hand, we can rewrite the above ΔC equation as:
	
	ΔC = ∇C * ΔV

And this tells us how to find our deltaV values:

	ΔV = ∇C * -η

Where η is a small, positive parameter known as the *learning rate*. When we plug this back into our new ΔC equation we learn:

	ΔC = ∇C * -η∇C = -n||∇C||^2

Now we can guarentee that ΔC will always be negative due to the -η, since squaring ∇C forces that number to be positive. Now we can use this fact to determine how the ball should move down the hill, following the equation we defined for ΔV:

	v -> v` = v - η∇C

For each step from v to vprime we compute a new number, eventually hitting the minimum of C. In a nutshell, *gradient decent works by computing ∇C and then moving in the opposite direction to fall down the slope towards the minimum*. All we have to do is pick a learning rate that isn't too small to slow down computations, but isn't too large to make ΔC > 0.

Note that for more than two variables, all we do is change our vectors to include more variables. No biggie. It's important to note gradient decent may not always work and there are fixes to make it more reliable in finding the global minimum, which will come later...

###### Applying Gradient Descent to Learning
Above we defined the equation C(w,b) as our cost function, which we want to minize. If we take the learnings of gradient descent, and apply the gradient descent update rule in terms of our cost function (that ΔV equation):

	wk -> wk` = wk - η(dC/dWk)
	bl -> bl` = bl - η(dC/dBl)

Repeatedly applying this rule makes for minimizing our cost function. Now there's one small flaw with this. If we want to minimize our cost function, we would need to compute these values an ungodly number of times since we need to eventually sum and average these values for all training values x. To speed this up, something called *stochastic gradient descent* can be used. The idea is to take a small sample from the training inputs and using that as an estimation of the gradient. 

How?
	1. Randomly pick a small number, m, of training values: x1,x2,...,xm. This is our *mini-batch*
	2. If we have a large enough sample size, we can expect the average of the mini-batch to be equal to the average of the real deal: ∇C = (1/m)Σi(∇Cxi). 

Applying this to neural nets, we get:

	wk -> wk` = wk - η/m Σi(dCi/dWki)
	bl -> bl` = bl - η/m Σi(dCi/dBli)

Which essentially is the sums over all training examples Xi in the current mini-batch. Pick another mini-batch and repeat. Continue until all training data is used. This is called the *epoch* of tranining, in which a new epoch can then begin.

### Getting Hands on Part 2
For our implementation we're going to use the MNIST data of 60,000 but we're going to reserve 10,000 data points for validation that will take place later on. This will allow us to look at values like learning rate more carefully.

... And now the coding ensures.
