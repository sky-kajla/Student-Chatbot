# This script loads a trained AI model to create an interactive chatbot.

import nltk
from nltk.stem import WordNetLemmatizer
import numpy as np
import pickle
import json
from tensorflow.keras.models import load_model
import random
import sys

# Load the trained model and other necessary files
try:
    model = load_model('chatbot_model.h5')
    intents = json.loads(open('chatbot_data.json').read())
    words = pickle.load(open('words.pkl', 'rb'))
    classes = pickle.load(open('classes.pkl', 'rb'))
except (FileNotFoundError, IOError) as e:
    print(f"Error loading required files. Please make sure the 'train_chatbot.py' script was run successfully. Error: {e}")
    sys.exit()

lemmatizer = WordNetLemmatizer()

def clean_up_sentence(sentence):
    """
    Tokenizes and lemmatizes a user's input sentence.
    """
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence, words):
    """
    Creates a bag-of-words array from the user's sentence.
    """
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    """
    Predicts the intent class of the user's sentence.
    """
    p = bag_of_words(sentence, words)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

def get_response(ints, intents_json):
    """
    Returns a random response from the predicted intent.
    """
    if not ints:
        return "Sorry, I don't understand that. Can you please rephrase?"

    tag = ints[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    else:
        # Fallback if no matching tag is found (shouldn't happen with a good model)
        result = "I'm not sure how to respond to that. Please try asking in a different way."
    return result

# Start the chatbot interaction
print("Chatbot is running! You can start talking to it. Type 'quit' to exit.")

while True:
    message = input("")
    if message.lower() == 'quit':
        break
    
    # Get the predicted intent and a response
    ints = predict_class(message)
    res = get_response(ints, intents)
    print(res)
