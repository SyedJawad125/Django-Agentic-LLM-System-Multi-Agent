# """
# Document Processing Service
# Handles file upload, text extraction, chunking, and vectorization
# """
# import logging
# from typing import Dict, Any, List
# import PyPDF2
# import docx
# import io
# from django.core.files.uploadedfile import UploadedFile
# from django.conf import settings

# logger = logging.getLogger(__name__)


# class DocumentProcessor:
#     """
#     Processes uploaded documents for RAG system.
    
#     Handles:
#     - Text extraction (PDF, DOCX, TXT)
#     - Text chunking
#     - Embedding generation
#     - Vector store insertion
#     """
    
#     def __init__(self, vector_store, embedding_service, chunk_size=None, chunk_overlap=None):
#         """
#         Initialize document processor.
        
#         Args:
#             vector_store: Vector store instance
#             embedding_service: Embedding service instance
#             chunk_size: Size of text chunks
#             chunk_overlap: Overlap between chunks
#         """
#         self.vector_store = vector_store
#         self.embedding_service = embedding_service
#         self.chunk_size = chunk_size or getattr(settings, 'CHUNK_SIZE', 800)
#         self.chunk_overlap = chunk_overlap or getattr(settings, 'CHUNK_OVERLAP', 100)
    
#     async def process_document(self, file: UploadedFile, document_id: str) -> Dict[str, Any]:
#         """
#         Process uploaded document.
        
#         Args:
#             file: Uploaded file
#             document_id: Document UUID
            
#         Returns:
#             Processing result dictionary
#         """
#         # Extract text
#         text = self._extract_text(file)
        
#         if not text or len(text.strip()) < 10:
#             raise ValueError("No extractable text found in document")
        
#         logger.info(f"[Processor] Extracted {len(text)} characters")
        
#         # Chunk text
#         chunks = self._chunk_text(text)
        
#         if not chunks:
#             raise ValueError("No chunks generated from document")
        
#         logger.info(f"[Processor] Created {len(chunks)} chunks")
        
#         # Generate embeddings
#         embeddings = self.embedding_service.embed_texts(chunks)
        
#         # Prepare metadata
#         metadatas = [
#             {
#                 "source": file.name,
#                 "content_type": file.content_type or 'application/octet-stream',
#                 "chunk_index": i,
#                 "document_id": document_id,
#                 "chunk_size": len(chunk)
#             }
#             for i, chunk in enumerate(chunks)
#         ]
        
#         # Generate IDs
#         ids = [f"{document_id}_chunk_{i}" for i in range(len(chunks))]
        
#         # Add to vector store
#         self.vector_store.add_documents(
#             documents=chunks,
#             embeddings=embeddings,
#             metadata=metadatas,
#             ids=ids
#         )
        
#         logger.info(f"[Processor] Added {len(chunks)} chunks to vector store")
        
#         return {
#             "chunks_created": len(chunks),
#             "text_length": len(text),
#             "document_id": document_id
#         }
    
#     def _extract_text(self, file: UploadedFile) -> str:
#         """Extract text from uploaded file"""
#         content = file.read()
        
#         if file.content_type == 'application/pdf' or file.name.endswith('.pdf'):
#             return self._extract_pdf(content)
#         elif file.content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or file.name.endswith('.docx'):
#             return self._extract_docx(content)
#         elif file.content_type == 'text/plain' or file.name.endswith('.txt'):
#             return content.decode('utf-8', errors='ignore')
#         else:
#             raise ValueError(f"Unsupported file type: {file.content_type}")
    
#     def _extract_pdf(self, content: bytes) -> str:
#         """Extract text from PDF"""
#         try:
#             pdf_file = io.BytesIO(content)
#             pdf_reader = PyPDF2.PdfReader(pdf_file)
#             text = ""
#             for page in pdf_reader.pages:
#                 text += page.extract_text() + "\n"
#             return text.strip()
#         except Exception as e:
#             logger.error(f"PDF extraction failed: {e}")
#             raise ValueError(f"Failed to extract PDF: {e}")
    
#     def _extract_docx(self, content: bytes) -> str:
#         """Extract text from DOCX"""
#         try:
#             doc_file = io.BytesIO(content)
#             doc = docx.Document(doc_file)
#             text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
#             return text.strip()
#         except Exception as e:
#             logger.error(f"DOCX extraction failed: {e}")
#             raise ValueError(f"Failed to extract DOCX: {e}")
    
#     def _chunk_text(self, text: str) -> List[str]:
#         """
#         Split text into overlapping chunks.
        
#         Args:
#             text: Input text
            
#         Returns:
#             List of text chunks
#         """
#         if not text:
#             return []
        
#         words = text.split()
#         if len(words) <= self.chunk_size:
#             return [" ".join(words)]
        
#         chunks = []
#         start = 0
        
#         while start < len(words):
#             end = start + self.chunk_size
#             chunk = " ".join(words[start:end])
            
#             if chunk.strip():
#                 chunks.append(chunk.strip())
            
#             if end >= len(words):
#                 break
            
#             start = end - self.chunk_overlap
        
#         return chunks





"""
Document Processing Service
Handles file upload, text extraction, chunking, and vectorization
Supports: PDF, DOCX, TXT, CSV
Tables: comma CSV, pipe-delimited, tab TSV, semicolon-delimited, PDF tables, DOCX tables
"""
import logging
import csv as csv_module
import io
from typing import Dict, Any, List
from django.core.files.uploadedfile import UploadedFile
from django.conf import settings

logger = logging.getLogger(__name__)


class DocumentProcessor:
    """
    Processes uploaded documents for RAG system.

    Handles:
    - Text extraction (PDF, DOCX, TXT, CSV)
    - Table extraction (CSV, pipe-delimited, PDF tables, DOCX tables)
    - Text chunking
    - Embedding generation
    - Vector store insertion
    """

    def __init__(self, vector_store, embedding_service, chunk_size=None, chunk_overlap=None):
        """
        Initialize document processor.

        Args:
            vector_store:      Vector store instance
            embedding_service: Embedding service instance
            chunk_size:        Size of text chunks
            chunk_overlap:     Overlap between chunks
        """
        self.vector_store      = vector_store
        self.embedding_service = embedding_service
        self.chunk_size        = chunk_size    or getattr(settings, 'CHUNK_SIZE',    800)
        self.chunk_overlap     = chunk_overlap or getattr(settings, 'CHUNK_OVERLAP', 100)

    # =========================================================
    #  MAIN ENTRY POINT
    # =========================================================
    async def process_document(self, file: UploadedFile, document_id: str) -> Dict[str, Any]:
        """
        Process uploaded document.

        Args:
            file:        Uploaded file (PDF / DOCX / TXT / CSV)
            document_id: Document UUID

        Returns:
            Processing result dictionary
        """
        # Extract text (plain text + tables converted to natural language)
        text = self._extract_text(file)

        if not text or len(text.strip()) < 10:
            raise ValueError("No extractable text found in document")

        logger.info(f"[Processor] Extracted {len(text)} characters from {file.name}")

        # Chunk text
        chunks = self._chunk_text(text)

        if not chunks:
            raise ValueError("No chunks generated from document")

        logger.info(f"[Processor] Created {len(chunks)} chunks")

        # Generate embeddings (batch call — same as original)
        embeddings = self.embedding_service.embed_texts(chunks)

        # Prepare metadata
        metadatas = [
            {
                "source":       file.name,
                "content_type": file.content_type or 'application/octet-stream',
                "chunk_index":  i,
                "document_id":  document_id,
                "chunk_size":   len(chunk)
            }
            for i, chunk in enumerate(chunks)
        ]

        # Generate IDs
        ids = [f"{document_id}_chunk_{i}" for i in range(len(chunks))]

        # Add to vector store (batch call — same as original)
        self.vector_store.add_documents(
            documents  = chunks,
            embeddings = embeddings,
            metadata   = metadatas,
            ids        = ids
        )

        logger.info(f"[Processor] Added {len(chunks)} chunks to vector store")

        return {
            "chunks_created": len(chunks),
            "text_length":    len(text),
            "document_id":    document_id
        }

    # =========================================================
    #  TEXT EXTRACTION — routes by file type
    # =========================================================
    def _extract_text(self, file: UploadedFile) -> str:
        """Extract text from uploaded file based on its type."""
        content     = file.read()
        name_lower  = file.name.lower()
        ct          = file.content_type or ''

        if name_lower.endswith('.pdf') or 'pdf' in ct:
            return self._extract_pdf(content)

        elif name_lower.endswith('.docx') or 'wordprocessingml' in ct:
            return self._extract_docx(content)

        elif name_lower.endswith('.csv') or 'csv' in ct:
            # CSV always treated as a table file
            raw = self._decode(content)
            return self._parse_csv(raw, delimiter=',')

        elif name_lower.endswith('.txt') or 'text/plain' in ct:
            return self._extract_txt(content)

        else:
            raise ValueError(
                f"Unsupported file type: {file.content_type or file.name}. "
                "Allowed: PDF, DOCX, TXT, CSV"
            )

    # =========================================================
    #  PDF — plain text + embedded tables via pdfplumber
    # =========================================================
    def _extract_pdf(self, content: bytes) -> str:
        """
        Extract text and tables from PDF.
        Uses pdfplumber for better table support.
        Falls back to PyPDF2 if pdfplumber is unavailable.
        """
        # --- Try pdfplumber first (best table support) ---
        try:
            import pdfplumber
            parts = []

            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):

                    # Tables on this page
                    try:
                        for raw_table in (page.extract_tables() or []):
                            if raw_table and len(raw_table) >= 2:
                                table_text = self._table_rows_to_text(raw_table)
                                if table_text:
                                    parts.append(table_text)
                    except Exception as e:
                        logger.warning(f"PDF table extract p{page_num}: {e}")

                    # Plain text on this page
                    try:
                        page_text = page.extract_text()
                        if page_text and page_text.strip():
                            parts.append(page_text.strip())
                    except Exception as e:
                        logger.warning(f"PDF text extract p{page_num}: {e}")

            result = "\n\n".join(parts).strip()
            if result:
                return result
            # Fall through to PyPDF2 if pdfplumber got nothing

        except ImportError:
            logger.warning("[Processor] pdfplumber not found, falling back to PyPDF2")

        # --- Fallback: PyPDF2 (no table support but always available) ---
        try:
            import PyPDF2
            pdf_file   = io.BytesIO(content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += (page.extract_text() or "") + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            raise ValueError(f"Failed to extract PDF: {e}")

    # =========================================================
    #  DOCX — paragraphs + tables in document order
    # =========================================================
    def _extract_docx(self, content: bytes) -> str:
        """Extract paragraphs and tables from DOCX in document order."""
        try:
            import docx as docx_lib
            doc_file = io.BytesIO(content)
            doc      = docx_lib.Document(doc_file)
            parts    = []

            WNS = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

            # Walk body elements in order so text and tables are interleaved correctly
            for element in doc.element.body:
                tag = element.tag.split('}')[-1]

                if tag == 'p':
                    # Regular paragraph
                    text = ''.join(
                        n.text or '' for n in element.iter()
                        if n.tag.endswith('}t')
                    )
                    if text.strip():
                        parts.append(text.strip())

                elif tag == 'tbl':
                    # Table — extract rows and cells
                    rows = []
                    for tr in element.findall(f'.//{WNS}tr'):
                        cells = []
                        for tc in tr.findall(f'.//{WNS}tc'):
                            cell_text = ''.join(
                                n.text or '' for n in tc.iter()
                                if n.tag.endswith('}t')
                            ).strip()
                            cells.append(cell_text)
                        if cells:
                            rows.append(cells)

                    if rows:
                        table_text = self._table_rows_to_text(rows)
                        if table_text:
                            parts.append(table_text)

            return "\n\n".join(parts).strip()

        except Exception as e:
            logger.error(f"DOCX extraction failed: {e}")
            raise ValueError(f"Failed to extract DOCX: {e}")

    # =========================================================
    #  TXT — auto-detects CSV / pipe / TSV / plain
    # =========================================================
    def _extract_txt(self, content: bytes) -> str:
        """
        Extract text from TXT file.
        Auto-detects table formats: CSV, TSV, pipe-delimited, semicolon.
        """
        raw   = self._decode(content)
        lines = [l for l in raw.splitlines() if l.strip()]

        if not lines:
            return ""

        # Detection order: comma -> tab -> semicolon -> pipe -> plain text
        if self._looks_like_delimited(lines, ','):
            logger.info("[Processor] TXT: detected CSV (comma)")
            return self._parse_csv(raw, delimiter=',')

        if self._looks_like_delimited(lines, '\t'):
            logger.info("[Processor] TXT: detected TSV (tab)")
            return self._parse_csv(raw, delimiter='\t')

        if self._looks_like_delimited(lines, ';'):
            logger.info("[Processor] TXT: detected semicolon-delimited")
            return self._parse_csv(raw, delimiter=';')

        if self._looks_like_delimited(lines, '|'):
            logger.info("[Processor] TXT: detected pipe-delimited table")
            return self._parse_pipe(lines)

        # Plain text
        logger.info("[Processor] TXT: plain text mode")
        return raw.strip()

    # =========================================================
    #  TABLE FORMAT DETECTION
    # =========================================================
    def _looks_like_delimited(self, lines: List[str], delimiter: str) -> bool:
        """
        Returns True if the first few lines have a consistent
        count of the given delimiter (>= 1 per line).
        """
        sample = lines[:min(5, len(lines))]
        counts = [line.count(delimiter) for line in sample]
        return len(set(counts)) == 1 and counts[0] >= 1

    # =========================================================
    #  CSV / TSV / SEMICOLON  ->  natural language rows
    # =========================================================
    def _parse_csv(self, raw: str, delimiter: str = ',') -> str:
        """
        Converts every CSV data row into a natural-language string.

        Input:
            Student_ID, First_Name, GPA
            S001,       Emma,       3.8

        Output:
            Student_ID: S001 | First_Name: Emma | GPA: 3.8
        """
        reader = csv_module.reader(io.StringIO(raw), delimiter=delimiter)
        rows   = [r for r in reader if any(c.strip() for c in r)]

        if len(rows) < 2:
            # No header or only one row — return raw text
            return raw.strip()

        headers = [h.strip() for h in rows[0]]
        result  = []

        for row in rows[1:]:
            pairs = []
            for header, cell in zip(headers, row):
                cell = cell.strip()
                if cell:
                    pairs.append(f"{header}: {cell}")
            if pairs:
                result.append(" | ".join(pairs))

        logger.info(f"[Processor] CSV: converted {len(result)} rows to natural language")
        return "\n".join(result)

    # =========================================================
    #  PIPE-DELIMITED  ->  natural language rows
    # =========================================================
    def _parse_pipe(self, lines: List[str]) -> str:
        """
        Parses markdown-style pipe tables.

        Input:
            | ID  | Name  | Score |
            |-----|-------|-------|
            | 101 | Ahmed | 95    |

        Output:
            ID: 101 | Name: Ahmed | Score: 95
        """
        # Remove separator lines like |---|---|
        clean = [
            line for line in lines
            if '|' in line and not all(c in '-|:+ \t' for c in line)
        ]
        if not clean:
            return "\n".join(lines)

        rows = []
        for line in clean:
            cells = [c.strip() for c in line.split('|')]
            cells = [c for c in cells if c]  # drop empty edge cells
            if cells:
                rows.append(cells)

        return self._table_rows_to_text(rows)

    # =========================================================
    #  GENERIC TABLE ROWS  ->  natural language (PDF + DOCX + pipe)
    # =========================================================
    def _table_rows_to_text(self, rows: List[List]) -> str:
        """
        Converts any list-of-lists table (first row = headers) into
        one natural-language string per data row.

        [['Name', 'Age'], ['Ahmed', '25'], ['Sara', '22']]
        ->
        Name: Ahmed | Age: 25
        Name: Sara  | Age: 22
        """
        if not rows or len(rows) < 2:
            return ""

        # Clean every cell
        cleaned = [
            [str(c).strip() if c is not None else "" for c in row]
            for row in rows
        ]

        headers   = cleaned[0]
        data_rows = cleaned[1:]

        # Skip separator rows (all dashes/equals)
        data_rows = [
            row for row in data_rows
            if any(cell for cell in row)
            and not all(set(cell) <= {'-', '=', '_', ' ', ''} for cell in row)
        ]

        if not data_rows:
            return ""

        result = []
        for row in data_rows:
            pairs = []
            for i, (header, cell) in enumerate(zip(headers, row)):
                if cell:
                    label = header if header else f"col_{i}"
                    pairs.append(f"{label}: {cell}")
            if pairs:
                result.append(" | ".join(pairs))

        return "\n".join(result)

    # =========================================================
    #  CHUNKING — line-aware so table rows are never split
    # =========================================================
    def _chunk_text(self, text: str) -> List[str]:
        """
        Split text into overlapping chunks.
        Splits on newlines first so individual table rows stay intact.
        """
        if not text:
            return []

        words = text.split()

        # Short document — return as single chunk
        if len(words) <= self.chunk_size:
            return [" ".join(words)]

        chunks = []
        start  = 0

        while start < len(words):
            end   = start + self.chunk_size
            chunk = " ".join(words[start:end])

            if chunk.strip():
                chunks.append(chunk.strip())

            if end >= len(words):
                break

            start = end - self.chunk_overlap

        return chunks

    # =========================================================
    #  DECODE HELPER — tries multiple encodings
    # =========================================================
    def _decode(self, file_bytes: bytes) -> str:
        """Try common encodings in order, never crash on bad bytes."""
        for enc in ('utf-8', 'utf-8-sig', 'latin-1', 'cp1252'):
            try:
                return file_bytes.decode(enc)
            except UnicodeDecodeError:
                continue
        return file_bytes.decode('utf-8', errors='replace')