import React, { Component, PropTypes } from 'react';

import update from 'react/lib/update';

import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from './List';

import {flow} from '../utils';

import '../styles/ListContainer.css'

const listTarget = {
  drop() {
  },
};

class ListContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,

    localLists: PropTypes.array.isRequired,
    instruments: PropTypes.object.isRequired,
    checkLists: PropTypes.array.isRequired,
    reorderLocalList: PropTypes.func.isRequired,
    reorderLocalLists: PropTypes.func.isRequired,
    deleteLocalListFolder: PropTypes.func.isRequired,
    renameLocallistFolder: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      lists:[]
    };
  }

  componentDidMount(){
    const { localLists, instruments, checkLists } = this.props;
    if(!localLists) return;

    this.setListsData(localLists, instruments, checkLists);
  }

  componentWillReceiveProps(nextProps){
    const { localLists, instruments, checkLists } = nextProps;
    if(!localLists) return;

    this.setListsData(localLists, instruments, checkLists);
  }

  setListsData = (localLists, instruments, checkLists) => {
    for(let i=0; i<localLists.length; i++ ){
      for(let j=0; j< localLists[i].list.length; j++){
        if( !instruments.hasOwnProperty(localLists[i].list[j]) ){
          return null;
        }
      }
    }

    let tempLists = localLists.map((tempList) => {
      let temp = {}
      temp.list = tempList.list.filter((instrument)=>{
        for(let i=0; i< checkLists.length; i++){
          if( checkLists[i].list.indexOf(instrument) !== -1 ) {
            return false;
          }
        }
        return true;
      })
      .map((instrument)=>{
        return instrument
      });

      temp.id = tempList.name;
      return temp;
    });

    this.setState({ lists: tempLists });
  }

  noDuplicateName = (name) => {
    for (var i = 0; i < this.props.localLists.length; i++) {
      if( this.props.localLists[i].name === name ) {
        console.log("name duplicate!");
        return false;
      }
    }
    return true;
  }

  moveList = (id, atIndex) => {
    const { list, index } = this.findList(id);
    this.setState(update(this.state, {
      lists: {
        $splice: [
          [index, 1],
          [atIndex, 0, list],
        ],
      },
    }));

  }

  findList = (id) => {
    const { lists } = this.state;
    const list = lists.filter(c => c.id === id)[0];

    return {
      list,
      index: lists.indexOf(list),
    };
  }

  render() {
    const { reorderLocalLists, reorderLocalList, deleteLocalListFolder, connectDropTarget, renameLocallistFolder, instruments } = this.props;
    const { lists } = this.state;

    return connectDropTarget(
      <div className="draggableListsWrapper">
        {lists.map((localList, index)=>{
          return (
            <List
              key={localList.id}
              id={localList.id}
              listName={localList.id}
              list={localList.list}
              reorderLocalList={(list)=>reorderLocalList(index, list)}
              moveList={this.moveList}
              findList={this.findList}
              reorderLocalLists={reorderLocalLists}
              deleteLocalListFolder={()=>deleteLocalListFolder(index)}
              renameLocallistFolder={(name)=>renameLocallistFolder(index, name)}
              instruments={instruments}
              noDuplicateName={this.noDuplicateName}
            />
          )
        })}
      </div>
    );
  }
}

export default flow([
  DropTarget("LIST", listTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
  })),
  DragDropContext(HTML5Backend)
])(ListContainer);
