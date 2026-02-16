"""
URL Configuration for RAG API + Document Processor
"""
from django.urls import path
from apps.rag import views

app_name = 'rag'

urlpatterns = [
    # Query endpoints
    path('query/', views.query_rag, name='query'),
    
    # Document management
    path('upload/', views.upload_document, name='upload'),
    path('documents/', views.list_documents, name='documents-list'),
    path('documents/<uuid:document_id>/', views.get_document, name='document-detail'),
    path('documents/<uuid:document_id>/delete/', views.delete_document, name='document-delete'),
    path('documents/clear/', views.clear_all_documents, name='documents-clear'),
    
    # Session management
    path('sessions/', views.create_session, name='session-create'),
    path('sessions/<uuid:session_id>/', views.get_session, name='session-detail'),
    
    # Query history
    path('queries/', views.list_queries, name='queries-list'),
    path('queries/<uuid:query_id>/execution/', views.get_query_execution, name='query-execution'),
    
    # Health & monitoring
    path('health/', views.health_check, name='health'),
    path('stats/', views.get_stats, name='stats'),
    path('agents/status/', views.agent_status, name='agent-status'),
]