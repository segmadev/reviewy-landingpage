import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../context/BuilderContext';
import { clearActiveCV } from '../services/cvLibrary';
import { clearBuilderDraftTracking } from './useAutoSave';

/** Starts a distinct blank CV while preserving every existing draft for Edit. */
export function useStartNewCV() {
  const navigate = useNavigate();
  const { dispatch } = useBuilder();

  return useCallback(() => {
    dispatch({ type: 'NEW_CV' });
    clearBuilderDraftTracking();
    clearActiveCV();
    navigate('/builder');
  }, [dispatch, navigate]);
}
