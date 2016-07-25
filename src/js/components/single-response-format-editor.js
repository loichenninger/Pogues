import React, { PropTypes } from 'react'
import CodeListSelector from './code-list-selector'
import VisualizationHintPicker from './visualization-hint-picker'

import {
  updateSingle, newCodeListSingle
} from '../actions/response-format'

import { connect } from 'react-redux'

function SingleResponseFormatEditor(
  { id, qrId, format: { codeListReference, visualizationHint },
  updateSingle, newCodeListSingle, locale }) {
  return (
    <div>
      <CodeListSelector
        id={codeListReference}
        select={codeListReference => updateSingle(id, { codeListReference })}
        create={() => newCodeListSingle(id, qrId)}
        locale={locale} />
      <VisualizationHintPicker visualizationHint={visualizationHint}
        locale={locale}
        select={visualizationHint => updateSingle(id, { visualizationHint})}/>
    </div>

  )
}

const mapStateToProps = state => ({
  qrId: state.appState.questionnaire
})

const mapDispatchToProps = {
  updateSingle,
  newCodeListSingle
}

SingleResponseFormatEditor.propTypes = {
  id: PropTypes.string.isRequired,
  /**
   * Id of the current questionnaire
   */
  qrId: PropTypes.string.isRequired,
  format: PropTypes.object.isRequired,
  locale: PropTypes.object.isRequired,
  updateSingle: PropTypes.func.isRequired,
  newCodeListSingle: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleResponseFormatEditor)
