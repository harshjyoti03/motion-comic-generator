from paddleocr import PaddleOCR
import cv2

# Initialize OCR
ocr = PaddleOCR(
    use_angle_cls=True,
    lang='en'
)

def preprocess_image(image_path):

    image = cv2.imread(image_path)

    # Resize
    image = cv2.resize(
        image,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    # Grayscale
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    # Threshold
    processed = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2
    )

    return processed

def extract_text(image_path):

    processed = preprocess_image(image_path)

    result = ocr.ocr(processed, cls=True)

    extracted_text = []

    if result and result[0]:

        for line in result[0]:

            text = line[1][0]
            confidence = line[1][1]

            # Filter weak garbage
            if confidence > 0.50 and len(text.strip()) > 1:

                extracted_text.append({
                    "text": text,
                    "confidence": round(confidence, 2)
                })

    return extracted_text