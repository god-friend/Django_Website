
def formatData(rdata):
    quiz = {}
    questions = {}
    data = rdata
    data._mutable = True
    total = int(data['total'])
    del data['csrfmiddlewaretoken']

    for i in range(total):
        questions[str(i+1)] = {
            "question": "",
            "choices": [],
            "answer": "",
        }

    quiz['title'] = data['title']
    quiz['category'] = data['category']

    for key, value in data.items():
        if "question" in key:
            if value != "":
                questions[str(key[-1])]['question'] = value
            else:
                questions[str(key[-1])]['question'] = "null"
        elif "choice" in key:
            if value != "":
                questions[str(key[-1])]['choices'].append(value)
            else:
                questions[str(key[-1])]['choices'].append("-1")
        elif "answer" in key:
            if value != "":
                questions[str(key[-1])]['answer'] = value
            else:
                questions[str(key[-1])]['answer'] = "null"

    quiz['questions'] = questions
    return quiz

