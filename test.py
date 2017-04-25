import mnist_loader as data
import network as neural

training_data, validation_data, test_data = data.load_data_wrapper()
training_data = list(training_data)

net = neural.Network([784, 30, 10])
net.SGD(training_data, 30, 10, 0.5, 5.0, eval_data=test_data,
        monitor_eval_cost=True,
        monitor_eval_acc=True,
        monitor_tr_cost=True,
        monitor_tr_acc=True)
        