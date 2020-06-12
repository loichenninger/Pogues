import React from 'react';
import { Field, FormSection } from 'redux-form';
import PropTypes from 'prop-types';

import { defaultState } from '../../model/external-variable';

import Input from 'forms/controls/input';
import GenericOption from 'forms/controls/generic-option';
import Select from 'forms/controls/select';
import { ListWithInputPanel } from 'widgets/list-with-input-panel';
import { validateExternalVariableForm } from 'utils/validation/validate';

import Dictionary from 'utils/dictionary/dictionary';
import { TABS_PATHS, DEFAULT_FORM_NAME } from 'constants/pogues-constants';

import { DATATYPE_NAME} from 'constants/pogues-constants';

import ResponseFormatDatatypeNumeric from 'widgets/component-new-edit/components/response-format/simple/simple-numeric';
import ResponseFormatDatatypeText from 'widgets/component-new-edit/components/response-format/simple/simple-text';
import ResponseFormatDatatypeDate from 'widgets/component-new-edit/components/response-format/simple/simple-date';
import { SelectorView, View } from 'widgets/selector-view';
import { getQuestionnaireScope } from './utils-loops';

const { DATE, NUMERIC, TEXT, BOOLEAN } = DATATYPE_NAME;

const validateForm = (addErrors, validate) => (values, state) => {
  return validate(values, addErrors, state);
};

// Prop types and default props

export const propTypes = {
  formName: PropTypes.string,
  selectorPath: PropTypes.string,
  errors: PropTypes.array,
  addErrors: PropTypes.func.isRequired,
  componentsStore: PropTypes.object.isRequired,
};

export const defaultProps = {
  formName: DEFAULT_FORM_NAME,
  selectorPath: TABS_PATHS.EXTERNAL_VARIABLES,
  errors: [],
};

// Component

function ExternalVariables({ formName, selectorPath, errors, addErrors, componentsStore }) {
  const scopeOption = getQuestionnaireScope(componentsStore).map(element => {
    return (
      <GenericOption
        key={element.id}
        value={element.id}
      >
       {element.name}
      </GenericOption>
    )
  }); 
  return (
    <FormSection name={selectorPath}>
      <ListWithInputPanel
        formName={formName}
        selectorPath={selectorPath}
        name="externalVariables"
        errors={errors}
        validateForm={validateForm(addErrors, validateExternalVariableForm)}
        resetObject={defaultState}
        canDuplicate={false}
      >
        <Field
          name="label"
          type="text"
          component={Input}
          label={Dictionary.label}
          required
        />
        <Field
          name="name"
          type="text"
          component={Input}
          label={Dictionary.name}
          required
        />
        <SelectorView
          label={Dictionary.responseType}
          selectorPath={selectorPath}
          required={false}
        >
          <View key={TEXT} value={TEXT} label={Dictionary.TEXT}>
            <ResponseFormatDatatypeText required={false} />
          </View>
          <View key={DATE} value={DATE} label={Dictionary.DATE} >
            <ResponseFormatDatatypeDate />
            </View>
          <View key={NUMERIC} value={NUMERIC} label={Dictionary.NUMERIC}>
            <ResponseFormatDatatypeNumeric required={false} />
          </View>
          <View key={BOOLEAN} value={BOOLEAN} label={Dictionary.BOOLEAN} />
         
        </SelectorView>
        <Field
          name="scope"
          component={Select}
          label={Dictionary.Scope}
        >
          <GenericOption
            key=''
            value=''
          >
            {Dictionary.selectScope}
          </GenericOption>
            {scopeOption}
        </Field>
      </ListWithInputPanel>
    </FormSection>
  );
}

ExternalVariables.propTypes = propTypes;
ExternalVariables.defaultProps = defaultProps;

export default ExternalVariables;
