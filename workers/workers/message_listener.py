import json
import logging
import os
import time

import pika

from workers.detect_faces import detect_faces

LOGGER = logging.getLogger(__name__)

REQUEST_QUEUE_NAME = 'FaceDetectionRequest'
SUCCESS_QUEUE_NAME = 'FaceDetectionSuccess'

def listen():
    try:
        connection = pika.BlockingConnection(
            pika.connection.URLParameters(os.environ['RABBITMQ_URL']))
        consumer_channel = connection.channel()
        producer_channel = connection.channel()

        consumer_channel.queue_declare(queue=REQUEST_QUEUE_NAME, durable=True)
        producer_channel.queue_declare(queue=SUCCESS_QUEUE_NAME, durable=True)

        def callback(ch, method, properties, body):
            message = json.loads(body.decode())
            photoId = message['photoId']
            photoPath = message['photoPath']

            logging.info("Receved FaceDetectionRequest for photo id {}".format(photoId))

            faces = detect_faces(photoPath)

            return_message = {
                'photoId': photoId,
                'faces': [{"x": f.left(), "y": f.top(), "w": f.width(), "h": f.height()} for f in faces],
            }
            producer_channel.basic_publish(
                exchange='',
                routing_key=SUCCESS_QUEUE_NAME,
                body=json.dumps(return_message))

            logging.info("Detected {} faces on photo id {}".format(len(faces), photoId))

            ch.basic_ack(delivery_tag=method.delivery_tag)

        consumer_channel.basic_qos(prefetch_count=1)
        consumer_channel.basic_consume(queue=REQUEST_QUEUE_NAME, on_message_callback=callback)

        logging.info("Listening...")

        consumer_channel.start_consuming()
    except Exception:
        logging.exception("Listener failed")
        if connection:
            connection.close()
        raise


logging.basicConfig(level=logging.INFO)

while (True):
    try:
        time.sleep(30)
        listen()
    except:
        logging.info("Restarting in 30 seconds...")
