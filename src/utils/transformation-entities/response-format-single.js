import {
  UI_BEHAVIOUR,
  CODES_LIST_INPUT_ENUM,
  DATATYPE_NAME,
  DATATYPE_VIS_HINT,
  QUESTION_TYPE_ENUM,
} from 'constants/pogues-constants';
import CodesListTransformerFactory, { defaultCodesListForm } from './codes-list';
import Response from './response';

const { CHECKBOX } = DATATYPE_VIS_HINT;
const { NEW, REF, QUESTIONNAIRE } = CODES_LIST_INPUT_ENUM;
const { TEXT } = DATATYPE_NAME;
const { SINGLE_CHOICE } = QUESTION_TYPE_ENUM;

export const defaultSingleForm = {
  mandatory: false,
  hasSpecialCode: false,
  specialLabel: '',
  specialCode: '',
  specialUiBehaviour: UI_BEHAVIOUR.FIRST_INTENTION,
  specialFollowUpMessage: '',
  visHint: CHECKBOX,
  codesListId: '',
  type: NEW,
  [NEW]: { ...defaultCodesListForm },
  [REF]: {},
  [QUESTIONNAIRE]: {},
};

export const defaultSingleState = {
  mandatory: false,
  hasSpecialCode: false,
  specialLabel: '',
  specialCode: '',
  specialUiBehaviour: UI_BEHAVIOUR.FIRST_INTENTION,
  specialFollowUpMessage: '',
  visHint: CHECKBOX,
  codesListId: '',
};

function transformationFormToState(form, codesListsTransformers) {
  const {
    mandatory,
    visHint,
    hasSpecialCode,
    specialLabel,
    specialCode,
    specialUiBehaviour,
    specialFollowUpMessage,
    type,
    [type]: codesListForm,
  } = form;
  const codesListState = codesListsTransformers[SINGLE_CHOICE].formToState(codesListForm);

  return {
    mandatory,
    visHint,
    hasSpecialCode,
    specialLabel: hasSpecialCode ? specialLabel : '',
    specialCode: hasSpecialCode ? specialCode : '',
    specialUiBehaviour: hasSpecialCode ? specialUiBehaviour : UI_BEHAVIOUR.FIRST_INTENTION,
    specialFollowUpMessage: hasSpecialCode ? specialFollowUpMessage : '',
    codesListId: codesListState.id,
  };
}

function transformationModelToState(model) {
  const { visHint, mandatory, nonResponseModality, codesListId } = model;

  return {
    codesListId,
    mandatory,
    visHint,
    hasSpecialCode: !!nonResponseModality,
    specialLabel: nonResponseModality ? nonResponseModality.label : '',
    specialCode: nonResponseModality ? nonResponseModality.value : '',
    specialUiBehaviour:
      nonResponseModality && !nonResponseModality.firstIntentionDisplay
        ? UI_BEHAVIOUR.SECOND_INTENTION
        : UI_BEHAVIOUR.FIRST_INTENTION,
    specialFollowUpMessage: nonResponseModality ? nonResponseModality.invite : '',
  };
}

function transformationStateToForm(currentState, codesListsStore, codesListsTransformers) {
  const {
    codesListId,
    visHint,
    mandatory,
    hasSpecialCode,
    specialLabel,
    specialCode,
    specialUiBehaviour,
    specialFollowUpMessage,
  } = currentState;
  const codesListTransformer = CodesListTransformerFactory({ initialState: codesListsStore[codesListId] });

  codesListsTransformers[SINGLE_CHOICE] = codesListTransformer;

  return {
    ...defaultSingleForm,
    mandatory,
    visHint,
    codesListId,
    hasSpecialCode,
    specialLabel,
    specialCode,
    specialUiBehaviour,
    specialFollowUpMessage,
    [NEW]: codesListTransformer.stateToForm(),
  };
}

function transformationStateToModel(currentState) {
  const {
    mandatory,
    visHint,
    codesListId,
    hasSpecialCode,
    specialLabel,
    specialCode,
    specialUiBehaviour,
    specialFollowUpMessage,
  } = currentState;
  const responses = [];
  const model = {
    mandatory,
    codeListReference: codesListId,
    type: TEXT,
    datatype: {
      maxLength: 1,
      pattern: '',
      visHint,
    },
  };

  if (hasSpecialCode) {
    model.nonResponseModality = {
      value: specialCode,
      label: specialLabel,
      firstIntentionDisplay: specialUiBehaviour === UI_BEHAVIOUR.FIRST_INTENTION,
      invite: specialFollowUpMessage,
    };
  }

  responses.push(Response.stateToModel(model));

  return {
    responses,
  };
}

const SingleTransformerFactory = (conf = {}) => {
  const { initialState, codesListsStore, codesListsTransformers } = conf;

  let currentState = initialState || defaultSingleState;

  return {
    formToState: form => {
      currentState = transformationFormToState(form, codesListsTransformers);
      return currentState;
    },
    modelToState: model => {
      const {
        responses: [{ datatype: { visHint }, mandatory, nonResponseModality, codeListReference: codesListId }],
      } = model;
      currentState = transformationModelToState({ visHint, mandatory, nonResponseModality, codesListId });
      return currentState;
    },
    stateToForm: () => {
      return transformationStateToForm(currentState, codesListsStore, codesListsTransformers);
    },
    stateToModel: () => {
      return transformationStateToModel(currentState);
    },
  };
};

export default SingleTransformerFactory;
