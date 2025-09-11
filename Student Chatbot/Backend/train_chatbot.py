# This script trains a simple neural network model to classify user intents for a chatbot.

import nltk
from nltk.stem import WordNetLemmatizer
import json
import pickle
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation, Dropout
from tensorflow.keras.optimizers import SGD
import random

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()

# Declare lists to store words, classes (tags), and documents
words = []
classes = []
documents = []
ignore_words = ['?', '!']

# Load the intents file
try:
    data_file = open('chatbot_data.json').read()
    intents = json.loads(data_file)
except FileNotFoundError:
    print("Error: 'chatbot_data.json' not found. Please ensure the file is in the same directory.")
    exit()

# Loop through each intent and its patterns to preprocess the data
for intent in intents['intents']:
    for pattern in intent['patterns']:
        # Tokenize each word in the pattern
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        # Add a tuple of the tokenized words and the intent tag to the documents list
        documents.append((w, intent['tag']))
        # Add the tag to the classes list if it's not already there
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Lemmatize and clean up the words, then remove duplicates
words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))

# Sort classes
classes = sorted(list(set(classes)))

# Print summary information
print(len(documents), "documents")
print(len(classes), "classes:", classes)
print(len(words), "unique lemmatized words:", words)

# Create pickle files for the words and classes lists
pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))

# Create the training data
training = []
output_empty = [0] * len(classes)

# Create the bag-of-words array for each document
for doc in documents:
    bag = []
    pattern_words = doc[0]
    pattern_words = [lemmatizer.lemmatize(word.lower()) for word in pattern_words]
    
    # Create the bag-of-words array
    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)
    
    # Create the output row with the target class set to 1
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    
    training.append([bag, output_row])

# Shuffle the training data
random.shuffle(training)
training = np.array(training, dtype=object)

# Create training and testing lists
train_x = list(training[:, 0])
train_y = list(training[:, 1])

# Build the neural network model
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(train_y[0]), activation='softmax'))

# Compile the model
sgd = SGD(learning_rate=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# Train the model
hist = model.fit(np.array(train_x), np.array(train_y), epochs=200, batch_size=5, verbose=1)

# Save the trained model
model.save('chatbot_model.h5', hist)

print("\nModel training complete.")
print("The trained model and other necessary files have been saved.")
