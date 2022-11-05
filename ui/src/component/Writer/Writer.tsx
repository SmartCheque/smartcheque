import React from 'react';
import './Writer.css';
import Save from '../SVGs/save';

const Writer = ({writeFn}:any) => {
    const [message, setMessage] = React.useState('TomoCafe|Espresso|5.0 USDC');

    const onSave = (e:any) => {
        e.preventDefault();
        writeFn(message);
        setMessage('');
    };

    return (
      <>
        <form onSubmit={onSave}>
            <div className="writer-container">
                <input type="text" placeholder="Enter Message..." value={message} onChange={(e)=>setMessage(e.target.value)}></input>
                <button className="btn" type="submit">
                    <Save/>
                    Save
                </button>
            </div>
        </form>
      </>
    );
};

export default Writer;
