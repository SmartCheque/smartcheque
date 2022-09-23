import { useDrop } from 'react-dnd';

export default function DropHelper(props: {
  onDrop: any
  style?: any
  children: any
}) {

  const[{isOver}, drop] = useDrop({
    accept: "CARD",
    drop: (item : any, _monitor : any) => {
      props.onDrop(item.data)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  })

  const localStyle = () => {
    if (isOver){
      return {
        opacity : .5
      }
    }
  }

  /*
  function dragOver(e: any) {
    e.preventDefault();
  }


  function drop(e: any) {
    const droppedItem = e.dataTransfer.getData("drag-item");
    if (droppedItem) {
      props.onDrop(droppedItem);
    }

  }


  return (
    <div onDragOver={dragOver} onDrop={drop} style={props.style}>
      {props.children}
    </div>
  );

  */
  return (
    <div ref={drop} style={{...props.style, ...localStyle()}}>
      {props.children}
    </div>
  );
}
