def calculate(query):
    query = query.lower()

    # Addition (handles both "add 5 and 3" and "5 + 3")
    if "add" in query or "+" in query:
        if "add" in query:
            numbers = [int(word) for word in query.split() if word.isdigit()]
            if len(numbers) >= 2:
                return numbers[0] + numbers[1]
        
        if "+" in query:
            parts = query.split("+")
            if len(parts) == 2 and parts[0].strip().isdigit() and parts[1].strip().isdigit():
                return int(parts[0].strip()) + int(parts[1].strip())

    # Subtraction (handles both "subtract 3 from 10" and "10 - 3")
    if "subtract" in query or "-" in query:
        if "subtract" in query:
            numbers = [int(word) for word in query.split() if word.isdigit()]
            if len(numbers) >= 2:
                return numbers[1] - numbers[0]
        
        if "-" in query:
            parts = query.split("-")
            if len(parts) == 2 and parts[0].strip().isdigit() and parts[1].strip().isdigit():
                return int(parts[0].strip()) - int(parts[1].strip())

    # Multiplication (handles "multiply 5 and 3", "5 times 3", and "5 * 3")
    if "multiply" in query or "times" in query or "*" in query:
        if "multiply" in query or "times" in query:
            numbers = [int(word) for word in query.split() if word.isdigit()]
            if len(numbers) >= 2:
                return numbers[0] * numbers[1]
        
        if "*" in query:
            parts = query.split("*")
            if len(parts) == 2 and parts[0].strip().isdigit() and parts[1].strip().isdigit():
                return int(parts[0].strip()) * int(parts[1].strip())

    # Division (handles both "divide 10 by 2" and "10 / 2")
    if "divide" in query or "/" in query:
        if "divide" in query:
            numbers = [int(word) for word in query.split() if word.isdigit()]
            if len(numbers) >= 2 and numbers[1] != 0:
                return numbers[0] / numbers[1]
        
        if "/" in query:
            parts = query.split("/")
            if len(parts) == 2 and parts[0].strip().isdigit() and parts[1].strip().isdigit():
                if int(parts[1].strip()) != 0:
                    return int(parts[0].strip()) / int(parts[1].strip())
                else:
                    return "Error: Division by zero."

    # Fallback message if no operation is recognized
    return ("Sorry, I can't solve this. Try using an online math solver like "
            "https://www.mathgptpro.com for help.")
