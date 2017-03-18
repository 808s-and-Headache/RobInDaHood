import {
  ADD_INSTRUMENT, DELETE_INSTRUMENT, ASKING_INSTRUMENT, ASKING_INSTRUMENT_FAILED
} from '../actions'

const instrumentsReducer = (state = {
  //isAskingWatchlists: false,
  //error: "",
  instruments: {}
}, action) => {
  switch (action.type) {
    case ASKING_INSTRUMENT:
      return {
        ...state
      }
    case ASKING_INSTRUMENT_FAILED:
    console.log(action.error)
      return {
        ...state
      }
    case ADD_INSTRUMENT:
      let newInstruments = Object.assign({}, state.instruments);
      newInstruments[action.instrument.url] = action.instrument;
      return {
        instruments: newInstruments  
      }
    case DELETE_INSTRUMENT:
      return {
        ...state,
        //instruments: [],
      }
    default:
      return state
  }
}

export default instrumentsReducer
