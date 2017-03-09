import numpy as np
import random
import cost as cst


# The network object is used to represent the neural net
class Network(object):

    # sizes:    Array of numbers. Each index is a layer of corresponding size.
    # cost:     Cost function to use. Defaults to Cross-Entropy.
    #   Ex: Network([2,3,1)] makes 3 layers w/ 2,3,1 neurons respectively
    def __init__(self, sizes, cost=cst.CrossEntropyCost):
        self.num_layers = len(sizes)
        self.sizes = sizes
        self.initializeNetwork()
        self.cost = cost

    # Prepares the network's biases and weights, stored in form wjk and bj
    # Note there are no biases for input neurons. Remember, matricies use the
    # notation of number of rows x number of columns.
    def initializeNetwork(self):
        # Each iteration produces a new index representing layer l. RandN
        # produces a matrix of j neurons tall(rows) by 1(column) to fill each
        # index. These sub matricies are filled with standard normal values.
        self.biases = [np.random.randn(j, 1) for j in self.sizes[1:]]

        # Zip produces an array representing what layers need connections,
        # looking like: ((2,3),(3,1)). It then iterates, reversing the pair
        # so we get Wjk format: ((3,2)(1,3)). Each iteration calls RandN to
        # make a matrix of j neurons(rows) having k connections each (columns)
        #   - Weights[l] holds the lth layer (not input)
        #   - Weights[l][j] holds the weights connecting to the jth neuron
        #       of layer l.
        #   - Weights[l][j][k] holds the single weight between the jth neuron
        #       of layer l and the kth neuron of layer l-1.
        self.weights = [np.random.randn(j, k)/np.sqrt(k)
                        for k, j in zip(self.sizes[:-1], self.sizes[1:])]

    # Applies the activation equation: sigma(wa + b) to each layer.
    def feedforward(self, a):
        for b, w in zip(self.biases, self.weights):
            a = sigmoid(np.dot(w, a)+b)
        return a

    # Stochastic gradient descent learning algorithm.
    # tr_data:  A list of tuples in (x,y) form (aka: input,output)
    # ETA:      learning rate
    # bat_size: Size of mini-batch to use
    # epochs:   Number of epochs of training to perform
    #
    # If test_data is provided the network is evaluated against it at the
    # end of each epoch, which will slow things down but will ensure progress.
    def SGD(self, tr_data, epochs, bat_size, eta,
            test_data=None):
        tr_data = list(tr_data)
        n = len(tr_data)

        if test_data:
            test_data = list(test_data)
            n_test = len(test_data)

        for j in range(epochs):
            random.shuffle(tr_data)

            # Breaks data into mini batches
            mini_batches = [
                    tr_data[k:k+bat_size]
                    for k in range(0, n, bat_size)]

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
        delta = (self.cost).delta(zs[-1], activations[-1], y)  # BP1
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
