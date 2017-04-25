import json
import sys
import network
import numpy as np


@staticmethod
# Exports the network to file.
# filename    - path to export the network
def save(network, filename):
    data = {"sizes": network.sizes,
            "weights": [w.tolist() for w in network.weights],
            "biases": [b.tolist() for b in network.biases],
            "cost": str(network.cost.__name__)}
    f = open(filename, "w")
    json.dump(data, f)
    f.close()


@staticmethod
# Reads a network from file.
# Return  - Instance of the network for usage.
def load(filename):
    f = open(filename, "r")
    data = json.load(f)
    f.close()
    cost = getattr(sys.modules[__name__], data["cost"])
    net = network(data["sizes"], cost=cost)
    net.weights = [np.array(w) for w in data["weights"]]
    net.biases = [np.array(b) for b in data["biases"]]
    return net
