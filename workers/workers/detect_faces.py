import logging
import os

import cv2

from workers.align_dlib import AlignDlib

logger = logging.getLogger(__name__)
align_dlib = AlignDlib('/usr/lib/shape_predictor_68_face_landmarks.dat')

IMAGES_FOLDER = os.environ['IMAGES_FOLDER']

def detect_faces(filename: str):
    image = _buffer_image(os.path.join(IMAGES_FOLDER, filename))

    if image is not None:
        faces = align_dlib.getAllFaceBoundingBoxes(image)
    else:
        raise IOError('Error buffering image: {}'.format(filename))

    return faces

def _buffer_image(filename: str):
    logger.debug('Reading image: {}'.format(filename))
    image = cv2.imread(filename, )
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return image


