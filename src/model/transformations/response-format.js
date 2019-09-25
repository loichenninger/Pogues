import * as ResponseFormatSimple from './response-format-simple';
import * as ResponseFormatSingle from './response-format-single';
import * as ResponseFormatMultiple from './response-format-multiple';
import * as ResponseFormatTable from './response-format-table';

import { QUESTION_TYPE_ENUM } from 'constants/pogues-constants';

const { SIMPLE, SINGLE_CHOICE, MULTIPLE_CHOICE, TABLE } = QUESTION_TYPE_ENUM;

export function remoteToState(type, responses, dimensions, codesListsStore) {
  let datatypeState = {};

  if (type === SIMPLE) {
    datatypeState = ResponseFormatSimple.remoteToState({ responses });
  } else if (type === SINGLE_CHOICE) {
    datatypeState = ResponseFormatSingle.remoteToState({ responses });
  } else if (type === MULTIPLE_CHOICE) {
    datatypeState = ResponseFormatMultiple.remoteToState({
      responses,
      dimensions,
    });
  } else if (type === TABLE) {
    datatypeState = ResponseFormatTable.remoteToState(
      { responses, dimensions },
      codesListsStore,
    );
  }

  return {
    type,
    [type]: datatypeState,
  };
}

export function stateToRemote(
  state,
  collectedVariables,
  collectedVariablesStore,
) {
  const { type, [type]: responseFormatState } = state;
  let dataTypeRemote;
  let remote = {};

  if (type === SIMPLE) {
    dataTypeRemote = ResponseFormatSimple.stateToRemote(
      responseFormatState,
      collectedVariables,
    );
    remote.Response = dataTypeRemote.Response;
  } else if (type === SINGLE_CHOICE) {
    dataTypeRemote = ResponseFormatSingle.stateToRemote(
      responseFormatState,
      collectedVariables,
    );
    remote.Response = dataTypeRemote.Response;
  } else if (type === MULTIPLE_CHOICE) {
    dataTypeRemote = ResponseFormatMultiple.stateToRemote(
      responseFormatState,
      collectedVariables,
      collectedVariablesStore,
    );
    remote = {
      ResponseStructure: {
        Dimension: dataTypeRemote.Dimension,
        Mapping: dataTypeRemote.Mapping,
      },
      Response: dataTypeRemote.Response,
    };
  } else {
    dataTypeRemote = ResponseFormatTable.stateToRemote(
      responseFormatState,
      collectedVariables,
      collectedVariablesStore,
    );
    remote = {
      ResponseStructure: {
        Dimension: dataTypeRemote.Dimension,
        Mapping: dataTypeRemote.Mapping,
      },
      Response: dataTypeRemote.Response,
    };
  }
  return remote;
}
