import React from 'react'
import { BsDash, BsPlus } from "react-icons/bs"

const QuantityUpdater = ({disabled,quantity,onIncrease,onDecrease}) => {

    return (
        <section style={{ width: "150px" }}>
            <div className='input-group'>
                <button className='btn btn-outline-secondary' onClick={onDecrease} disabled={disabled}><BsDash /></button>
                <input type='number' name='quantity' value={quantity} readOnly disabled={disabled} className='form-control text-center'></input>
                <button className='btn btn-outline-secondary' onClick={onIncrease} disabled={disabled}><BsPlus /></button>
            </div>
        </section>
    )
}

export default QuantityUpdater
