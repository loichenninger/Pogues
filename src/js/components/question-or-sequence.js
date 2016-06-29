import React, { Component, PropTypes } from 'react'

import { COMPONENT_TYPE } from '../constants/pogues-constants'
import ComponentEditor from './component-editor'
import { DragSource, DropTarget } from 'react-dnd'
import QuestionOrSequenceHeader from './question-or-sequence-header'
const { QUESTION, SEQUENCE } = COMPONENT_TYPE

const QUESTION_OR_SEQUENCE = 'QUESTION_OR_SEQUENCE'
const BEFORE = 'avant'
const AFTER = 'après'
const ONTO = 'ONTO'
const NOWHERE = 'NOWHERE'
//TODO see how to use beginDrag, creating a closure to keep track of the dragged
//component might not be useful (at least, we could keep track of this in the
//state)

export function linkSourceAndTarget() {

  let idOfDraggedCmpnt
  let pathOfDraggedCmpnt
  let depthOfDraggedComponent

  const QuestionOrSequenceSource = {
    beginDrag({ id, path, depth }) {
      idOfDraggedCmpnt = id
      pathOfDraggedCmpnt = path
      depthOfDraggedComponent = depth
      return { id }
    }
  }

  const QuestionOrSequenceTarget = {
    drop: function (props) {
      const { qrId, id, path, moveComponent } = props

      const canDrop = !(path === '0.0' && (depthOfDraggedComponent > 1))
      if (canDrop) moveComponent(qrId, idOfDraggedCmpnt, id)
    }
  }

  return {
    QuestionOrSequenceSource,
    QuestionOrSequenceTarget,
    idOfDraggedCmpnt: () => idOfDraggedCmpnt,
    pathOfDraggedCmpnt: () => pathOfDraggedCmpnt,
    depthOfDraggedComponent: () => depthOfDraggedComponent
  }
}

const { QuestionOrSequenceSource, QuestionOrSequenceTarget, idOfDraggedCmpnt,
 pathOfDraggedCmpnt, depthOfDraggedComponent } = linkSourceAndTarget()


function collectForSource(connect, monitor) {
  return {
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function collectForTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    idOfDraggedCmpnt: idOfDraggedCmpnt(),
    pathOfDraggedCmpnt: pathOfDraggedCmpnt(),
    depthOfDraggedComponent: depthOfDraggedComponent()
  }
}

function QuestionOrSequence(props) {
  const {
    structure, id, active, label, depth, type, highlighted, children, path,
    removeAllowed, removeComponent, moveComponent, qrId,
    connectDragSource, connectDropTarget, connectDragPreview, isDragging,
    isOver, idOfDraggedCmpnt, pathOfDraggedCmpnt, depthOfDraggedComponent
    } = props

  const whereToDrop = (
    path === '0.0' && (depthOfDraggedComponent > 1) ? NOWHERE :
    pathOfDraggedCmpnt < path ? AFTER :
    pathOfDraggedCmpnt > path ? BEFORE :
    ONTO
  )

  const placeholder = <div className="placeholder">{whereToDrop} {label}</div>
  const afterPlaceholder = isOver && whereToDrop === AFTER && placeholder
  const beforePlaceholder= isOver && whereToDrop === BEFORE && placeholder

  if (active) return (
    <ComponentEditor structure={structure} id={id} qrId={qrId}/>)
  const  isSequence = type === SEQUENCE
  const labelElDrop = connectDropTarget(
    <div>
      { isOver && beforePlaceholder }
      <QuestionOrSequenceHeader {...props} />
      { isOver && afterPlaceholder }
    </div>)

  return (
    <div>
      { labelElDrop }
      <div className={isSequence ? 'sequence' : '' }>
        {!isDragging && children}
      </div>
    </div>
  )
}

QuestionOrSequence.propTypes = {
  depth: React.PropTypes.number.isRequired,
  path: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  qrId: PropTypes.string.isRequired,
  structure: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired, //id used by tools activator
  active: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  highlighted: PropTypes.bool.isRequired,
  createComponent: PropTypes.func.isRequired,
  toggleActiveComponent: PropTypes.func.isRequired,
  removeComponent: PropTypes.func.isRequired,
  moveComponent: PropTypes.func.isRequired,
  removeAllowed: PropTypes.bool.isRequired,
  pathOfDraggedCmpnt: PropTypes.string,
  depthOfDraggedComponent: PropTypes.number
  // moveComponentUp: PropTypes.func.isRequired,
  // moveComponentDown: PropTypes.func.isRequired,
}

const dropTargetForQuestionOrSequence = DropTarget(
  QUESTION_OR_SEQUENCE, QuestionOrSequenceTarget, collectForTarget)

const dragSourceForQuestionOrSequence = DragSource(
  QUESTION_OR_SEQUENCE, QuestionOrSequenceSource, collectForSource)

export default
  dropTargetForQuestionOrSequence(
    dragSourceForQuestionOrSequence(QuestionOrSequence))

