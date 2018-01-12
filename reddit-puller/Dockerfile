FROM python:3.6
MAINTAINER William Wagner "wcwwagner@gmail.com"
ADD . ./code
WORKDIR /code
RUN pip install -r requirements.txt
CMD ["python", "run.py"]
