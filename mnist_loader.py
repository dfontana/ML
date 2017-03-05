import pickle
import gzip
import numpy as np


# Return: Tuple of Training Data, Validation Data, and test Data
# Training Data is a tuple:
#   - 1st entry is 50,000 images for training.
#   - 2nd entry is 50,000 digits, the "answers" for the first entry.
# Validation and test data are the same but with 10,000 images.
def load_data():
    f = gzip.open('./data/mnist.pkl.gz', 'rb')
    training_data, validation_data, test_data = pickle.load(f,
                                                            encoding="latin1")
    f.close()
    return (training_data, validation_data, test_data)


# Improves upon the format of load_data, such that training_data is
# a list of 50,000 2-tuples (x,y) where x is the input image and y
# is a 10-dimensional vector representing the correct answer to x.
# Test and Validation data are similar, but y is instead the digit
# value that x should be read as.
def load_data_wrapper():
    tr_d, va_d, te_d = load_data()
    training_inputs = [np.reshape(x, (784, 1)) for x in tr_d[0]]
    training_results = [vectorized_result(y) for y in tr_d[1]]
    training_data = zip(training_inputs, training_results)
    validation_inputs = [np.reshape(x, (784, 1)) for x in va_d[0]]
    validation_data = zip(validation_inputs, va_d[1])
    test_inputs = [np.reshape(x, (784, 1)) for x in te_d[0]]
    test_data = zip(test_inputs, te_d[1])
    return (training_data, validation_data, test_data)


# Creates the 10-D vector for y. Essentially puts a 1.0 in the
# jth position where jth is the correct number representing x.
def vectorized_result(j):
    e = np.zeros((10, 1))
    e[j] = 1.0
    return e
