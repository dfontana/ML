import numpy as np
import random


# The network object is used to represent the neural net
class Network(object):

    # sizes: Array of numbers. Each index is a layer of corresponding size.
    #   Ex: Network([2,3,1)] makes 3 layers w/ 2,3,1 neurons respectively
    # Biases/Weights:
    #   - Initialized randomly, their size derived from sizes.
    #   - Arrays of matricies, starting at index 0.
    #   - Weights stored in form wjk, biases as bj
    # Note: we don't have biases for input neurons.
    def __init__(self, sizes):
        self.num_layers = len(sizes)
        self.sizes = sizes
        self.biases = [np.random.randn(y, 1) for y in sizes[1:]]
        self.weights = [np.random.randn(y, x)
                        for x, y in zip(sizes[:-1], sizes[1:])]

    # Applies the activation equation: sigma(wa + b) to each layer.
    def feedforward(self, a):
        for b, w in zip(self.biases, self.weights):
            a = sigmoid(np.dot(w, a)+b)
        return a

    # Stochastic gradient descent learning algorithm.
    # Training_data: A list of tuples in (x,y) form (aka: input,output)
    # ETA: learning rate
    # Batch_size and epochs are size of a mini batch and # of epochs to run.
    #
    # If test_data is provided the network is evaluated against it at the
    # end of each epoch, which will slow things down but will ensure progress.
    def SGD(self, training_data, epochs, mini_batch_size, eta,
            test_data=None):
        training_data = list(training_data)
        n = len(training_data)

        if test_data:
            test_data = list(test_data)
            n_test = len(test_data)

        for j in range(epochs):
            random.shuffle(training_data)

            # Breaks data into mini batches
            mini_batches = [
                    training_data[k:k+mini_batch_size]
                    for k in range(0, n, mini_batch_size)]

            # Run backwards propagation / update the weights and biases.
            for mini_batch in mini_batches:
                self.update_mini_batch(mini_batch, eta)
            if test_data:
                print("Epoch {}: {} / {}".format(
                        j, self.evaluate(test_data), n_test))
            else:
                print("Epoch {} complete".format(j))

    # Update the network's weights and biases. Applies gradient
    # descent through backpropagation to a single mini_batch.
    # The mini_batch is a list of tuples. Eta is learning rate.
    def update_mini_batch(self, mini_batch, eta):

        # Store zero'd biases and weight arrays
        nabla_b = [np.zeros(b.shape) for b in self.biases]
        nabla_w = [np.zeros(w.shape) for w in self.weights]

        # Loop over training data pairs in the mini batch
        for x, y in mini_batch:
            delta_nabla_b, delta_nabla_w = self.backprop(x, y)
            nabla_b = [nb+dnb for nb, dnb in zip(nabla_b, delta_nabla_b)]
            nabla_w = [nw+dnw for nw, dnw in zip(nabla_w, delta_nabla_w)]

        # nb is computed in backprop as the delta
        # nw is computed in backprop as delta * transposed activation
        self.weights = [w-(eta/len(mini_batch))*nw
                        for w, nw in zip(self.weights, nabla_w)]
        self.biases = [b-(eta/len(mini_batch))*nb
                       for b, nb in zip(self.biases, nabla_b)]

    # Returns a tuple of (nabla_b, nabla_w) representing the
    # gradient for the cost function C_x.
    def backprop(self, x, y):
        nabla_b = [np.zeros(b.shape) for b in self.biases]
        nabla_w = [np.zeros(w.shape) for w in self.weights]

        # Compute the activations for each layer and store
        activation = x
        activations = [x]  # Stores activations layer by layer
        zs = []            # Stores all z vectors, layer by layer
        for b, w in zip(self.biases, self.weights):
            z = np.dot(w, activation)+b
            zs.append(z)
            activation = sigmoid(z)
            activations.append(activation)

        # Computes the error for the output layer, stores nb / nw.
        delta = (activations[-1] - y) * sigmoid_prime(zs[-1])  # BP1
        nabla_b[-1] = delta  # BP3
        nabla_w[-1] = np.dot(delta, activations[-2].transpose())  # BP4

        # Backpropagates from L-1 to 2, computing the error, nb, and nw
        for l in range(2, self.num_layers):
            z = zs[-l]
            sp = sigmoid_prime(z)
            delta = np.dot(self.weights[-l+1].transpose(), delta) * sp  # BP2
            nabla_b[-l] = delta  # BP3
            nabla_w[-l] = np.dot(delta, activations[-l-1].transpose())  # BP4

        # Backpropagation done
        return (nabla_b, nabla_w)

    # Return the number of test inputs for which the neural network
    # outputs the correct result. It's assumed the output of the net
    # is the index of the neuron in the final layer with the hightest
    # activation.
    def evaluate(self, test_data):
        test_results = [(np.argmax(self.feedforward(x)), y)
                        for (x, y) in test_data]
        return sum(int(x == y) for (x, y) in test_results)


# Helpers: Applies elementwise if Z is a vector
def sigmoid(z):
    return 1.0/(1.0+np.exp(-z))


def sigmoid_prime(z):
    return sigmoid(z)*(1-sigmoid(z))
