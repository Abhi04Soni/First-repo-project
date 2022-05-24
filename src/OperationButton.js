import React from 'react'
import { ACTION } from './App'

export default function OperationButton({ dispatch, Operation }) {
    return <button onClick={() => dispatch({
        type: ACTION.CHOOSE_OPERATION, payload: { Operation }
    })}>{Operation}
    </button>
}