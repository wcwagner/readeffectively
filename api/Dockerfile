FROM python:3.6.4
MAINTAINER William Wagner <wcw.wagner@gmail.com>
WORKDIR /code
ADD . /code

# Install any neccessary dependencies
RUN pip install -r requirements.txt

# Open port 8000 for serving the webpage
EXPOSE 8000

# $ gunicorn [OPTIONS] APP_MODULE where APP_MODULE is (MODULE_NAME):$(VARIABLE_NAME)
# binding on port 8000
RUN chmod +x ./wait-for-it.sh
CMD /usr/local/bin/gunicorn -w 2 -b :8000 books:app
