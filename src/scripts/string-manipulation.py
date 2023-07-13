import sys

def main():
    if len(sys.argv) > 1:
        string, delimitter = sys.argv[1], sys.argv[2]
        print(delimitter.join(string.strip().split(" ")))
    else:
        print("No text provided")

if __name__ == "__main__":
    main()
