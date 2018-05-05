import tensorflow as tf
from keras.layers import Input, UpSampling2D
from keras import backend as K
import numpy as np

sess = tf.InteractiveSession()

def getImageTensor():
 """
  (batch, height, width, channels)
 """
 image = [ [ [1], [2], [3] ],
           [ [4], [5], [6] ],
           [ [7], [8], [9] ] ]

 return image 

def getImageTensorMultiChannel():
 """
  (batch, height, width, channels)
 """
 def c(v):
   return [ v, v, v ]

 image = [ [ c(1), c(2), c(3) ],
           [ c(4), c(5), c(6) ],
           [ c(7), c(8), c(9) ] ]

 return image 

def test1():
 l =  UpSampling2D((2, 2))
 x = np.array([getImageTensor()])
 d = tf.convert_to_tensor(x, dtype=tf.float32)
 return l(d)
  

def test2():
 l =  UpSampling2D((1, 1))
 x = np.array([getImageTensor()])
 d = tf.convert_to_tensor(x, dtype=tf.float32)

 return l(d)

def test3():
 l =  UpSampling2D((2, 2))
 x = np.array([getImageTensorMultiChannel()])
 d = tf.convert_to_tensor(x, dtype=tf.float32)

 return l(d)

tests = [test1, test2, test3]

for test in tests:
  print(test)
  x = test().eval()
  print(x)
