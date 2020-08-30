FROM colemurray/medium-facenet-tutorial

# Install dlib binary
RUN cd /usr/lib/ \
    && curl -O http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2 \
    && bzip2 -d shape_predictor_68_face_landmarks.dat.bz2

# Create workers directory
WORKDIR /usr/src/workers

# Installing dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copying source files
COPY ./workers .
ENV PYTHONPATH $PYTHONPATH:/usr/src/workers

# Running the workers
CMD "python3" "workers/message_listener.py"
