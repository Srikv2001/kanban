import './conversation.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, message} from 'antd';
import { Button, Flex } from 'antd';
import { useState } from 'react';
import UserAvatar from './UserAvatar';
import axios from "axios";

////////////////////////////////////////////////////////////

export default function ConversationHistory({ selectedUser, flag, history, user }) {

  const [quillText, setQuillText] = useState('');
  const [cc, setCC] = useState('');
  const [subject, setSubject] = useState('');
  const appendText = (html) => {
    setQuillText(html);
  }

  const emailArray=Object.values(selectedUser);
  emailArray.sort((a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime));

  function handleButtonClick() {
    const displayMessage = {
      "emailContent": quillText,
      "emailAddress": user.email,
      "dateAndTime": "01-12-2023"
    }
    setQuillText("");
    const message = { ...selectedUser };
    message.sent = displayMessage;
    history(message);
    const payload = {
      subject: subject,
      from: localStorage.getItem("mail"),
      to: [user.email],
      body: quillText,
      cclist: [cc]
    };
    setCC('');
    setSubject('');
    console.log(payload);
    sendMail(payload);

  }
  const sendMail = async (payload) => {
    const apiUrl = "http://172.235.10.116:7000/hiring/entryLevel/sendemail";


    try {
      const response = await axios.post(apiUrl, payload);
      console.log('Mail sent');
      message.success('Mail sent');
    } catch (error) {
      console.log('Mail sent Failure')
      message.error('unable to send mail')
    }
  }
""
  return (
    <>
      <div className="conversation-header">
        <div className='conversation-avatar'>
          {Object.keys(user).length > 0 && <UserAvatar username={user.username} />}
        </div>

        <h1 className="header"></h1>

        <Button type="primary"
          onClick={handleButtonClick}
          style={{ fontSize: '20px', height: '40px', padding: '0 20px' }}>
          send
        </Button>
      </div>
      <div className="conversation-history-container">

        {/* <Flex justify="end" style={{ marginBottom: '10px', marginRight: '20px' }}> Set justify="end" to move the button to the right */}

        {/* </Flex> */}
        <div className="email-list">
          <div className="spinner-container">
            {flag && <Spin style={{ transform: 'scale(4)' }} />}
            {/* // indicator={<LoadingOutlined style={{ fontSize: 70 }} spin />} */}
          </div>
          
          {/* {Object.keys(selectedUser).map((userId) => ( */}
          {emailArray.map((email, index) => (
            <div key={index} className="email-item">
              <h2 className="user-name">From: {email.emailAddress}</h2>
              <p className="date-time">Date and Time: {email.dateAndTime}</p>
              <div
                className="email-content"
                dangerouslySetInnerHTML={{ __html: email.emailContent }}
              />
            </div>
          ))}

        </div>
        <div  style={{ position: 'absolute', bottom: '45px', width: '80%' }}>
         
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            style={{width:'40%'  }}
            onChange={(e) => setSubject(e.target.value)}
          />
          <input
            type="text"
            placeholder="cc"
            value={cc}
            onChange={(e) => setCC(e.target.value)}
            style={{ width:'25%'}}
          />
          <input
            type="text"
            placeholder="bcc"
            value=""
            // onChange={(e) => setCC(e.target.value)}
            style={{ width:'25%'}}
          />
          <ReactQuill
            theme="snow"
            // style={{ position: 'fixed', bottom: "44px", width: '100%', zIndex: 9999, height: '200px' }}
            style={{ height: '200px', width:'100%'}}
            className="custom-quill-editor"
            placeholder="Write something here..."
            onChange={appendText}
            value={quillText}
          />
        </div>
      </div>
    </>
  );
}







