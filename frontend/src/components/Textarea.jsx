import React, { useState } from 'react'
import axios from "axios"
import * as XLSX from 'xlsx'

const Textarea = () => {
    const [msg,setMsg] = useState("")
    const [status,setStatus] = useState(false)
    const [email,setEmail] = useState([])
    function submit() {
        setStatus(true)
        axios.post("http://localhost:3000/sendmail", {msg:msg,email:email}).then(function(data){
            if(data.data === true){
                alert("Mail sent successfuly")
                setStatus(false)
            }
            else{
                alert('Something Wrong')
            }
        })
    }
    function handlefile(event){
        const file = event.target.files[0]
        const reader =  new FileReader()
        reader.onload = function(event){
            const data = event.target.result
            const workbook = XLSX.read(data,{type:"binary"})
            const sheetname = workbook.SheetNames[0]
            const  worksheet = workbook.Sheets[sheetname]
            const emaillist = XLSX.utils.sheet_to_json(worksheet,{header:"A"})
            const totalmail = emaillist.map(function(item){return item.A})
            setEmail(totalmail)
        }
        reader.readAsBinaryString(file)
    }
    return (
        <>
            <div className=' flex flex-col items-center'>
                <textarea className='border p-2' style={{ width: "70%", height: "200px" }} placeholder='Enter the email text....'
                onChange={(e) => setMsg(e.target.value)} value={msg}></textarea>

                <div className='my-5 '>
                    <input type="file" className=' border border-dashed p-2' onChange={handlefile}/>
                    <p className='text-center mt-3'>Drag and Drop</p>
                </div>

                <p>Total Mails in the file : {email.length}</p>
                <button className='bg-black text-white py-3 px-6 rounded-xl my-5 hover:bg-white hover:text-black hover:border cursor-pointer' onClick={submit}>{status ? 'Sending...' : "Send"}</button>
            </div>
            
        </>

    )
}

export default Textarea