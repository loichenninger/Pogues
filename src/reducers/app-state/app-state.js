import activeComponentsById from 'reducers/app-state/active-components-by-id';
import activeCodeListsById from 'reducers/app-state/active-code-lists-by-id';
import activeCalculatedVariablesById from 'reducers/app-state/active-calculated-variables-by-id';
import collectedVariableByQuestion from 'reducers/app-state/collected-variable-by-question';
import activeExternalVariablesById from 'reducers/app-state/active-external-variables-by-id';
import invalidItemsByActiveQuestion from 'reducers/app-state/invalid-items-by-active-question';
import errorsByQuestionTab from 'reducers/app-state/errors-by-question-tab';
import { SET_ACTIVE_QUESTIONNAIRE, SET_SELECTED_COMPONENT, UPDATE_ACTIVE_QUESTIONNAIRE } from 'actions/app-state';
import { LOAD_COLLECTIONS_SUCCESS, LOAD_OPERATIONS_SUCCESS, LOAD_CAMPAIGNS_SUCCESS } from 'actions/questionnaire';
import { LOAD_USER_SUCCESS } from 'actions/user';

const actionHandlers = {};

const defaultState = {
  user: {},
  activeQuestionnaire: {},
  activeComponentsById: {},
  activeCodeListsById: {},
  activeCodesById: {},
  activeCalculatedVariablesById: {},
  activeExternalVariablesById: {},
  collectedVariableByQuestion: {},
  errorsByCode: {},
  selectedComponentId: '',
  errorsByQuestionTab: {},
};

export function loadUserSuccess(state, user) {
  return {
    ...state,
    user: user,
  };
}

export function setActiveQuestionnaire(state, questionnaire) {
  const { components, codeLists, ...activeQuestionnaire } = questionnaire;

  return {
    ...state,
    activeQuestionnaire,
  };
}

export function updateActiveQuestionnaire(state, updatedQuestionnaire) {
  return {
    ...state,
    activeQuestionnaire: {
      ...state.activeQuestionnaire,
      ...updatedQuestionnaire,
    },
  };
}

export function setSelectedComponentId(state, id) {
  return {
    ...state,
    selectedComponentId: id,
  };
}

export function setCollections(state, { update }) {
  return {
    ...state,
    collections: update,
  };
}

export function setOperations(state, { update }) {
  return {
    ...state,
    operations: update,
  };
}

export function setCampaigns(state, { update }) {
  return {
    ...state,
    campaigns: update,
  };
}

actionHandlers[LOAD_USER_SUCCESS] = loadUserSuccess;
actionHandlers[SET_ACTIVE_QUESTIONNAIRE] = setActiveQuestionnaire;
actionHandlers[UPDATE_ACTIVE_QUESTIONNAIRE] = updateActiveQuestionnaire;
actionHandlers[SET_SELECTED_COMPONENT] = setSelectedComponentId;

actionHandlers[LOAD_COLLECTIONS_SUCCESS] = setCollections;
actionHandlers[LOAD_OPERATIONS_SUCCESS] = setOperations;
actionHandlers[LOAD_CAMPAIGNS_SUCCESS] = setCampaigns;

// @TODO: Add the combine functionality to the generic createActionHandler method
export default function(state = defaultState, action) {
  if (!action) return state;
  const { type, payload } = action;
  const hndlr = actionHandlers[type];
  return {
    ...(hndlr ? hndlr(state, payload) : state),
    activeComponentsById: activeComponentsById(state.activeComponentsById, action),
    activeCodeListsById: activeCodeListsById(state.activeCodeListsById, action),
    activeCalculatedVariablesById: activeCalculatedVariablesById(state.activeCalculatedVariablesById, action),
    collectedVariableByQuestion: collectedVariableByQuestion(state.collectedVariableByQuestion, action),
    activeExternalVariablesById: activeExternalVariablesById(state.activeExternalVariablesById, action),
    invalidItemsByActiveQuestion: invalidItemsByActiveQuestion(state.invalidItemsByActiveQuestion, action),
    errorsByQuestionTab: errorsByQuestionTab(state.errorsByQuestionTab, action),
  };
}
