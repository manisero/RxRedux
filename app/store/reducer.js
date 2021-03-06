import update from 'immutability-helper';
import { actions } from './actions'

let addInput = (state) => {
    let inputId = state.lastInputId + 1;

    let inputItem = {
        input: {
            value: ''
        },
        info: {
            inputLength: 0
        }
    };

    return update(state, {
        lastInputId: { $set: inputId },
        inputIds: { $push: [ inputId ] },
        inputs: { [inputId]: { $set: inputItem } }
    });
};

let updateInput = (inputId, updateCommand, state) => update(state, { inputs: { [inputId]: updateCommand } });

let updateGlobalInfo = state => {
    let totalLength = state.inputIds
                           .map(id => state.inputs[id].input.value.length)
                           .reduce((x, y) => x + y, 0);

    let averageLength = totalLength / state.inputIds.length;

    return update(state, {
        globalInfo: {
            totalLength: { $set: totalLength },
            averageLength: { $set: averageLength }
        }
    });
};

export default (state, action) => {
    switch (action.type) {

    case actions.addInput.type:
        return addInput(state);

    case actions.changeInput.type:
        return updateInput(action.data.inputId, { input: { value: { $set: action.data.value } } }, state);

    case actions.updateInputInfo.type:
        let inputLength = state.inputs[action.data.inputId].input.value.length;
        return updateInput(action.data.inputId, { info: { inputLength: { $set: inputLength } } }, state);
    
    case actions.updateGlobalInfo.type:
        return updateGlobalInfo(state);

    default:
        return state;
    }
};
