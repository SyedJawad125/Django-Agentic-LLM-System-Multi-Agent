"""
RAG Agent - Retrieval-Augmented Generation
Retrieves relevant chunks from vector store
"""
from typing import Dict, Any, List, Optional
import logging
from django.conf import settings
from .base_agent import BaseAgent, AgentState, AgentResult

logger = logging.getLogger(__name__)


class RAGAgent(BaseAgent):
    """
    RAG Agent retrieves relevant information from vector store.
    
    Responsibilities:
    - Query ChromaDB vector store
    - Retrieve relevant document chunks
    - Perform semantic relevance checking
    - Handle document-specific queries
    """
    
    def __init__(
        self,
        llm_service=None,
        vector_store=None,
        embedding_service=None
    ):
        super().__init__(
            name="RAGAgent",
            description="Retrieves information from vector store",
            llm_service=llm_service
        )
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.top_k = settings.TOP_K_RESULTS
        self.relevance_threshold = settings.RELEVANCE_THRESHOLD
    
    async def execute(self, state: AgentState) -> AgentResult:
        """
        Execute RAG retrieval for the query.
        
        Args:
            state: Current agent state with query
            
        Returns:
            AgentResult with retrieved chunks
        """
        query = state.query
        context = state.context
        
        try:
            self.add_thought(state, f"Searching vector store for: '{query}'")
            
            # Check if vector store has documents
            doc_count = self._get_document_count()
            
            if doc_count == 0:
                self.add_observation(state, "Vector store is empty - no documents uploaded")
                return self.create_result(
                    success=False,
                    output="No documents have been uploaded yet. Please upload documents first.",
                    state=state,
                    confidence=0.0
                )
            
            self.add_observation(state, f"Vector store contains {doc_count} documents")
            
            # Get document_id filter if specified
            document_id = context.get("document_id")
            
            # Perform retrieval
            self.add_action(
                state,
                f"Retrieving top {self.top_k} chunks" + (f" from document {document_id}" if document_id else ""),
                "vector_search"
            )
            
            chunks = await self._retrieve_chunks(query, document_id, state)
            
            if not chunks:
                self.add_observation(state, "No relevant chunks found")
                return self.create_result(
                    success=False,
                    output="No relevant information found in the uploaded documents.",
                    state=state,
                    confidence=0.3
                )
            
            # Check semantic relevance
            relevance_check = await self._check_relevance(query, chunks, state)
            
            if not relevance_check["is_relevant"]:
                self.add_observation(
                    state,
                    f"Chunks not semantically relevant: {relevance_check['reason']}"
                )
                
                # Still return chunks but with low confidence
                return self.create_result(
                    success=True,
                    output=self._format_chunks(chunks),
                    state=state,
                    confidence=0.4
                )
            
            # Format retrieved chunks
            formatted_context = self._format_chunks(chunks)
            
            self.add_observation(
                state,
                f"Retrieved {len(chunks)} relevant chunks (relevance score: {relevance_check['score']:.2f})"
            )
            
            # Store chunks in metadata
            state.metadata["retrieved_chunks"] = chunks
            state.metadata["relevance_check"] = relevance_check
            
            return self.create_result(
                success=True,
                output=formatted_context,
                state=state,
                confidence=relevance_check["score"]
            )
            
        except Exception as e:
            self.add_error(state, f"RAG retrieval failed: {str(e)}")
            logger.error(f"[RAGAgent] Retrieval error: {e}", exc_info=True)
            return self.create_result(
                success=False,
                output="",
                state=state,
                error=str(e)
            )
    
    def _get_document_count(self) -> int:
        """Get number of documents in vector store"""
        try:
            if hasattr(self.vector_store, 'get_count'):
                return self.vector_store.get_count()
            elif hasattr(self.vector_store, 'collection'):
                return self.vector_store.collection.count()
            return 0
        except Exception as e:
            logger.error(f"[RAGAgent] Failed to get document count: {e}")
            return 0
    
    async def _retrieve_chunks(
        self,
        query: str,
        document_id: Optional[str],
        state: AgentState
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant chunks from vector store.
        
        Args:
            query: Search query
            document_id: Optional document ID filter
            state: Agent state
            
        Returns:
            List of retrieved chunks
        """
        try:
            # Generate query embedding
            query_embedding = self.embedding_service.embed_text(query)
            
            # Prepare filter
            filter_dict = None
            if document_id:
                filter_dict = {"document_id": document_id}
            
            # Search vector store
            results = self.vector_store.search(
                query_embedding=query_embedding,
                top_k=self.top_k,
                filter=filter_dict
            )
            
            # Format results
            chunks = []
            for result in results:
                chunks.append({
                    "content": result.get("content", result.get("document", "")),
                    "score": result.get("score", 0.0),
                    "metadata": result.get("metadata", {})
                })
            
            return chunks
            
        except Exception as e:
            logger.error(f"[RAGAgent] Chunk retrieval failed: {e}")
            return []
    
    async def _check_relevance(
        self,
        query: str,
        chunks: List[Dict[str, Any]],
        state: AgentState
    ) -> Dict[str, Any]:
        """
        Check semantic relevance of retrieved chunks.
        
        Args:
            query: Original query
            chunks: Retrieved chunks
            state: Agent state
            
        Returns:
            Relevance check result
        """
        self.add_action(state, "Checking semantic relevance", "relevance_checker")
        
        if not chunks:
            return {
                "is_relevant": False,
                "verdict": "NO_CHUNKS",
                "reason": "No chunks retrieved",
                "score": 0.0
            }
        
        # Get average similarity score
        avg_score = sum(chunk.get("score", 0.0) for chunk in chunks) / len(chunks)
        
        # Check if average score meets threshold
        is_relevant = avg_score >= self.relevance_threshold
        
        if not is_relevant:
            return {
                "is_relevant": False,
                "verdict": "NOT_RELEVANT",
                "reason": f"Average similarity score {avg_score:.2f} below threshold {self.relevance_threshold}",
                "score": avg_score
            }
        
        # Use LLM for deeper semantic check
        try:
            top_chunk = chunks[0]["content"][:500]  # Use first chunk
            
            prompt = f"""Does this context answer the question?

Question: {query}

Context: {top_chunk}

Answer ONLY 'YES' or 'NO' with a brief reason.
Format: YES/NO - reason"""

            response = await self.call_llm(prompt, temperature=0.1, max_tokens=50)
            response = response.strip().upper()
            
            is_llm_relevant = response.startswith("YES")
            
            return {
                "is_relevant": is_llm_relevant,
                "verdict": "RELEVANT" if is_llm_relevant else "NOT_RELEVANT",
                "reason": response,
                "score": avg_score
            }
            
        except Exception as e:
            logger.warning(f"[RAGAgent] LLM relevance check failed: {e}")
            # Fall back to score-based check
            return {
                "is_relevant": is_relevant,
                "verdict": "RELEVANT" if is_relevant else "NOT_RELEVANT",
                "reason": f"Score-based check: {avg_score:.2f}",
                "score": avg_score
            }
    
    def _format_chunks(self, chunks: List[Dict[str, Any]]) -> str:
        """
        Format retrieved chunks into context string.
        
        Args:
            chunks: Retrieved chunks
            
        Returns:
            Formatted context string
        """
        if not chunks:
            return "No context available"
        
        formatted = []
        
        for i, chunk in enumerate(chunks, 1):
            content = chunk.get("content", "")
            metadata = chunk.get("metadata", {})
            source = metadata.get("source", "Unknown")
            
            formatted.append(f"[Chunk {i} from {source}]\n{content}\n")
        
        return "\n".join(formatted)
    
    async def retrieve_by_document(
        self,
        query: str,
        document_id: str,
        state: Optional[AgentState] = None
    ) -> Dict[str, Any]:
        """
        Retrieve chunks from a specific document.
        
        Args:
            query: Search query
            document_id: Document ID
            state: Optional agent state
            
        Returns:
            Retrieval results
        """
        if state is None:
            state = AgentState(agent_name=self.name, query=query)
        
        state.context["document_id"] = document_id
        
        result = await self.execute(state)
        
        return {
            "success": result.success,
            "chunks": state.metadata.get("retrieved_chunks", []),
            "relevance": state.metadata.get("relevance_check", {}),
            "execution_steps": result.execution_steps
        }
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Return agent capabilities"""
        return {
            "name": self.name,
            "description": self.description,
            "capabilities": [
                "Vector similarity search",
                "Semantic relevance checking",
                "Document-specific retrieval",
                "Multi-chunk aggregation",
                "Metadata filtering"
            ],
            "output_format": "formatted_context_chunks",
            "requirements": [
                "Vector store initialized",
                "Embedding service available",
                "Documents uploaded"
            ]
        }