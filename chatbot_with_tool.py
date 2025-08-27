import os
import requests
from dotenv import load_dotenv
from calculator_tool import calculate

load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def is_math_query(user_input):
    math_keywords = [
        "add", "plus", "sum", "+",
        "subtract", "minus", "-",
        "multiply", "multiplied", "*", "times",
        "divide", "/", "calculate"
    ]
    return any(keyword in user_input.lower() for keyword in math_keywords)

def is_multi_step_query(user_input):
    user_input = user_input.lower()
    
    has_math = is_math_query(user_input)
    
    multi_step_indicators = [
        "and also", "then", "also tell me", "and tell me", 
        "capital of", "what is the", "who is", "where is"
    ]
    
    has_non_math_question = any(indicator in user_input for indicator in multi_step_indicators)
    
    return has_math and has_non_math_question

def ask_llm(question):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [{"role": "user", "content": question}]
    }
    
    response = requests.post(OPENROUTER_URL, headers=headers, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()

def main():
    print("Welcome to the Chatbot. Type 'exit' to quit.")
    
    while True:
        user_input = input("Ask a question: ").strip()
        if user_input.lower() == "exit":
            print("Goodbye! Thanks for chatting.")
            break
        
        if is_multi_step_query(user_input):
            print("Sorry, I can only handle one task at a time.Please ask one question at a time.")
            continue
        
        if is_math_query(user_input):
            try:
                result = calculate(user_input)
                print(f"LLM Answer: {result}")
            except Exception as e:
                print(f"LLM error: {e}")
        else:
            try:
                answer = ask_llm(user_input)
                print(f"LLM Answer: {answer}")
            except Exception as e:
                print(f"LLM error: {e}")

if __name__ == "__main__":
    main()
