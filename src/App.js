import React, { useReducer } from 'react';
import DigitButton from './DigitButton';
import './App.css'
import OperationButton from './OperationButton';

export const ACTION = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          CurrentOutput: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.CurrentOutput === "0") {
        return state
      }
      if (payload.digit === "." && state.CurrentOutput.includes(".")) {
        return { ...state }
      }
      if (payload.digit === "." && state.CurrentOutput == null){
        return {
          CurrentOutput: `${0}${payload.digit}`}
      }
      return {
        ...state,
        CurrentOutput: `${state.CurrentOutput || ""}${payload.digit}`,
      }
    case ACTION.CLEAR:
      return {}

    case ACTION.CHOOSE_OPERATION:
      if (state.CurrentOutput == null && state.PreviousOutput == null) {
        return state
      }
      if (state.CurrentOutput == null) {
        return {
          ...state,
          Operation: payload.Operation
        }
      }

      if (state.PreviousOutput == null) {
        return {
          ...state,
          PreviousOutput: state.CurrentOutput,
          Operation: payload.Operation,
          CurrentOutput: null
        }

      }
      return {
        ...state,
        PreviousOutput: evaluate(state),
        Operation: payload.Operation,
        CurrentOutput: null
      }

    case ACTION.EVALUATE:
      if (
        state.CurrentOutput == null || state.PreviousOutput == null || state.Operation == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        PreviousOutput: null,
        Operation: null,
        CurrentOutput: evaluate(state),
      }

    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          CurrentOutput: null
        }
      }
      if (state.CurrentOutput == null) return state
      if (state.CurrentOutput.length === 1) {
        return {
          ...state,
          CurrentOutput: null
        }
      }

      return {
        ...state,
        CurrentOutput: state.CurrentOutput.slice(0, -1)
      }
  }

  function evaluate({ CurrentOutput, PreviousOutput, Operation }) {
    const prev = parseFloat(PreviousOutput)
    const current = parseFloat(CurrentOutput)
    if (isNaN(prev) || isNaN(current)) {
      return ""
    }
    let computation = ""
    switch (Operation) {
      case "+":
        computation = prev + current
        break
      case "-":
        computation = prev - current
        break
      case "*":
        computation = prev * current
        break
      case "/":
        computation = prev / current
        break
    }

    return computation.toString()
  }

}

function App() {

  const [{ CurrentOutput, PreviousOutput, Operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="Calcuclator-grid">
      <div className='output'>
        <div className='Previous-output'>{PreviousOutput} {Operation}</div>
        <div className='Current-output'>{CurrentOutput}</div>
      </div>

      <button className='span-two' onClick={() => dispatch({ type: ACTION.CLEAR })}>Ac</button>
      <button className='single' onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>Del</button>
      <OperationButton Operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton Operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton Operation="-" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton Operation="+" dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({ type: ACTION.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
