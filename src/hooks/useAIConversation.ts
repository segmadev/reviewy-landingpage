import { useCallback } from 'react';
import { useBuilder } from '../context/BuilderContext';

/** Shares one persisted AI conversation across every step of the active CV. */
export function useAIConversation() {
  const { state, dispatch } = useBuilder();

  const rememberConversation = useCallback((conversationId?: string) => {
    const normalized = conversationId?.trim();
    if (!normalized || normalized === state.aiConversationId) return;
    dispatch({ type: 'SET_AI_CONVERSATION_ID', payload: normalized });
  }, [dispatch, state.aiConversationId]);

  return {
    conversationId: state.aiConversationId || undefined,
    rememberConversation,
  };
}
