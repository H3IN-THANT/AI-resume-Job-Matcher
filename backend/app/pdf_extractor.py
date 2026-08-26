import pymupdf


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from a PDF file.
    """

    pdf_document = pymupdf.open(
        stream=file_bytes,
        filetype="pdf"
    )

    text = ""

    for page in pdf_document:
        text += page.get_text()

    pdf_document.close()

    return text.strip()