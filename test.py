import mnist_loader as data
import network as neural

training_data, validation_data, test_data = data.load_data_wrapper()
training_data = list(training_data)

net = neural.Network([784, 30, 10])
net.SGD(training_data, 30, 10, 3.0, test_data=test_data)
