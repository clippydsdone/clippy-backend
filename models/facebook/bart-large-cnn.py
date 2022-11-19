import sys
from transformers import pipeline

if __name__ == '__main__':
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    print(summarizer(sys.argv[1], max_length=130, min_length=30, do_sample=False, truncation=True))
    sys.stdout.flush()