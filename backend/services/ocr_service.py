import easyocr
import cv2
import numpy as np

# Initialize OCR
reader = easyocr.Reader(['en'])

def preprocess_image(image):

    # Resize for better OCR
    image = cv2.resize(
        image,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Blur for cleaner thresholding
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Threshold
    thresh = cv2.threshold(
        blurred,
        200,
        255,
        cv2.THRESH_BINARY
    )[1]

    return thresh

def detect_speech_bubbles(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    thresh = cv2.threshold(
        gray,
        200,
        255,
        cv2.THRESH_BINARY
    )[1]

    contours, _ = cv2.findContours(
        thresh,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    bubbles = []

    for contour in contours:

        x, y, w, h = cv2.boundingRect(contour)

        area = w * h

        # Ignore tiny regions
        if area < 5000:
            continue

        # Ignore overly huge regions
        if area > 300000:
            continue

        bubbles.append((x, y, w, h))

    return bubbles

def clean_text(text):

    text = text.strip()

    if len(text) < 2:
        return None

    return text

def extract_text(image_path):

    image = cv2.imread(image_path)

    bubbles = detect_speech_bubbles(image)

    extracted_text = []

    for (x, y, w, h) in bubbles:

        bubble_crop = image[y:y+h, x:x+w]

        processed = preprocess_image(bubble_crop)

        results = reader.readtext(processed)

        for result in results:

            text = result[1]
            confidence = result[2]

            cleaned_text = clean_text(text)

            if cleaned_text and confidence > 0.40:

                extracted_text.append({
                    "text": cleaned_text,
                    "confidence": round(confidence, 2)
                })

    return extracted_text