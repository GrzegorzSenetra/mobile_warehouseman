FROM python:3.6.9

RUN apt-get update && apt-get install -y tdsodbc unixodbc-dev \
 && apt install unixodbc-bin -y  \
 && apt-get clean -y

RUN echo "[FreeTDS]\n\
Description = FreeTDS unixODBC Driver\n\
Driver = /usr/lib/arm-linux-gnueabi/odbc/libtdsodbc.so\n\
Setup = /usr/lib/arm-linux-gnueabi/odbc/libtdsS.so" >> /etc/odbcinst.ini

ENV PORT=8888
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home/grzegorz/metalzbyt_panel
RUN /bin/bash -c "pip install --upgrade pip;"
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 8888 1111
RUN /bin/bash -c "source /home/grzegorz/metalzbyt_panel/bin/activate;"
RUN /bin/bash -c "python /home/grzegorz/metalzbyt_panel/src/manage.py makemigrations;"
RUN /bin/bash -c "python /home/grzegorz/metalzbyt_panel/src/manage.py migrate;"

CMD ["python", "-u" , "/home/grzegorz/metalzbyt_panel/src/manage.py", "runserver", "0.0.0.0:8888"]