"""
Document Processing Service
Handles file upload, text extraction, chunking, and vectorization
"""
import logging
from typing import Dict, Any, List
import PyPDF2
import docx
import io
from django.core.files.uploadedfile import UploadedFile
from django.conf import settings

logger = logging.getLogger(__name__)


class DocumentProcessor:
    """
    Processes uploaded documents for RAG system.
    
    Handles:
    - Text extraction (PDF, DOCX, TXT)
    - Text chunking
    - Embedding generation
    - Vector store insertion
    """
    
    def __init__(self, vector_store, embedding_service, chunk_size=None, chunk_overlap=None):
        """
        Initialize document processor.
        
        Args:
            vector_store: Vector store instance
            embedding_service: Embedding service instance
            chunk_size: Size of text chunks
            chunk_overlap: Overlap between chunks
        """
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.chunk_size = chunk_size or getattr(settings, 'CHUNK_SIZE', 800)
        self.chunk_overlap = chunk_overlap or getattr(settings, 'CHUNK_OVERLAP', 100)
    
    async def process_document(self, file: UploadedFile, document_id: str) -> Dict[str, Any]:
        """
        Process uploaded document.
        
        Args:
            file: Uploaded file
            document_id: Document UUID
            
        Returns:
            Processing result dictionary
        """
        # Extract text
        text = self._extract_text(file)
        
        if not text or len(text.strip()) < 10:
            raise ValueError("No extractable text found in document")
        
        logger.info(f"[Processor] Extracted {len(text)} characters")
        
        # Chunk text
        chunks = self._chunk_text(text)
        
        if not chunks:
            raise ValueError("No chunks generated from document")
        
        logger.info(f"[Processor] Created {len(chunks)} chunks")
        
        # Generate embeddings
        embeddings = self.embedding_service.embed_texts(chunks)
        
        # Prepare metadata
        metadatas = [
            {
                "source": file.name,
                "content_type": file.content_type or 'application/octet-stream',
                "chunk_index": i,
                "document_id": document_id,
                "chunk_size": len(chunk)
            }
            for i, chunk in enumerate(chunks)
        ]
        
        # Generate IDs
        ids = [f"{document_id}_chunk_{i}" for i in range(len(chunks))]
        
        # Add to vector store
        self.vector_store.add_documents(
            documents=chunks,
            embeddings=embeddings,
            metadata=metadatas,
            ids=ids
        )
        
        logger.info(f"[Processor] Added {len(chunks)} chunks to vector store")
        
        return {
            "chunks_created": len(chunks),
            "text_length": len(text),
            "document_id": document_id
        }
    
    def _extract_text(self, file: UploadedFile) -> str:
        """Extract text from uploaded file"""
        content = file.read()
        
        if file.content_type == 'application/pdf' or file.name.endswith('.pdf'):
            return self._extract_pdf(content)
        elif file.content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or file.name.endswith('.docx'):
            return self._extract_docx(content)
        elif file.content_type == 'text/plain' or file.name.endswith('.txt'):
            return content.decode('utf-8', errors='ignore')
        else:
            raise ValueError(f"Unsupported file type: {file.content_type}")
    
    def _extract_pdf(self, content: bytes) -> str:
        """Extract text from PDF"""
        try:
            pdf_file = io.BytesIO(content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            raise ValueError(f"Failed to extract PDF: {e}")
    
    def _extract_docx(self, content: bytes) -> str:
        """Extract text from DOCX"""
        try:
            doc_file = io.BytesIO(content)
            doc = docx.Document(doc_file)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            logger.error(f"DOCX extraction failed: {e}")
            raise ValueError(f"Failed to extract DOCX: {e}")
    
    def _chunk_text(self, text: str) -> List[str]:
        """
        Split text into overlapping chunks.
        
        Args:
            text: Input text
            
        Returns:
            List of text chunks
        """
        if not text:
            return []
        
        words = text.split()
        if len(words) <= self.chunk_size:
            return [" ".join(words)]
        
        chunks = []
        start = 0
        
        while start < len(words):
            end = start + self.chunk_size
            chunk = " ".join(words[start:end])
            
            if chunk.strip():
                chunks.append(chunk.strip())
            
            if end >= len(words):
                break
            
            start = end - self.chunk_overlap
        
        return chunks