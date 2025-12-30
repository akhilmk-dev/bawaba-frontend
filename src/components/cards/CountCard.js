import React from 'react'
import { CiCalendar } from 'react-icons/ci';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'

const CountCard = ({title,count,path,icon}) => {
    const navigate = useNavigate();
  return (
    <div className='col-sm-6 col-md-4 col-xl-3'>
            <div className='p-3' style={{ backgroundColor: "white", borderRadius: "8px" }}>
              <div className='d-flex'>
                <div className='rounded-circle d-flex justify-content-center align-items-center' style={{ width:"55px",height:"55px",border: "1px solid rgb(223 223 223)" }}>
                  {icon}
                </div>
                <div className='ms-2'>
                  <h5>{title}</h5>
                  <h2>{count}</h2>
                </div>
              </div>
              <hr style={{ height: '1px', padding:0,border: 'none', backgroundColor: '#ccc' }} />
              <div className='d-flex justify-content-end'>
                <div className="d-flex align-items-center gap-2" style={{cursor:"pointer"}} onClick={()=>navigate(path)}>
                  <MdOutlineArrowOutward size={20} />
                  <span>View More</span>
                </div>
              </div>
            </div>
          </div>
  )
}

export default CountCard